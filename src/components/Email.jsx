import Card, { CardActions, CardContent } from 'material-ui/Card';
import React, { Component } from 'react';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  card: {
    display: 'flex',
    flexDirection: 'column',

    position: 'relative',
    top: '18%',
    width: '75%',
    height: '62%',
    margin: '0 auto',

    borderRadius: 5,
    maxWidth: 1000,
    maxHeight: 750,
    padding: 13
  },
  content: {
    flexGrow: 1
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    marginTop: 5,
    marginRight: 25
  },
  details: {
    display: 'flex',
    marginBottom: 25
  },
  cardActions: {
    display: 'block',
    textAlign: 'right'
  },
  link: {
    textDecoration: 'none',
    color: '#3f51b5'
  }
});

@observer
class Email extends Component {
  @observable goingOutUsernames = [];

  render() {
    if (this.props.data.loading === true) {
      return <CircularProgress />;
    }

    const challengeData = this.props.data.getChallenge;

    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <div className={classes.details}>
            <img
              src={`images/${challengeData.profilePicture}`}
              alt="profile"
              className={classes.profilePicture}
            />
            <div>
              <Typography gutterBottom variant="headline" component="h1">
                {challengeData.name}
              </Typography>
              <Typography variant="subheading" component="h2">
                <b>From:</b> {challengeData.email}
              </Typography>
              <Typography variant="subheading" component="h2">
                <b>Subject:</b> {challengeData.subject}
              </Typography>
            </div>
          </div>
          <Typography paragraph component="p">
            {challengeData.content}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button size="small" color="primary">
            <Link to={`/challenge/${this.props.level}`} className={classes.link}>
              Accept job
            </Link>
          </Button>
        </CardActions>
      </Card>
    );
  }
}

Email.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    getChallenge: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      profilePicture: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    })
  }).isRequired
};

const getChallengesQuery = gql`
  query getChallengesQuery($level: Int!) {
    getChallenge(level: $level) {
      name,
      email,
      subject,
      profilePicture,
      content
    }
  }
`;

export default graphql(getChallengesQuery)(withStyles(styles)(Email));
