import Card, { CardActions, CardContent } from 'material-ui/Card';
import { Query, graphql } from 'react-apollo';
import React, { Component } from 'react';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import gql from 'graphql-tag';
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
    return (
      <Query query={ChallengeQuery} variables={{ level: this.props.level }}>
        {({ loading, data }) => {
          if (loading) {
            return <CircularProgress />;
          }

          const { challenge } = data;
          const content = challenge.content.replace(/-name-/g, this.props.username)
            .replace(/\n/g, '<br />');
          const link = (this.props.level == 0) ? '/' : '/challanges';

          const { classes } = this.props;
          return (
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <div className={classes.details}>
                  <img
                    src={`images/${challenge.profilePicture}`}
                    alt="profile"
                    className={classes.profilePicture}
                  />
                  <div>
                    <Typography gutterBottom variant="headline" component="h1">
                      {challenge.name}
                    </Typography>
                    <Typography variant="subheading" component="h2">
                      <b>From:</b> {challenge.email}
                    </Typography>
                    <Typography variant="subheading" component="h2">
                      <b>Subject:</b> {challenge.subject}
                    </Typography>
                  </div>
                </div>
                <Typography paragraph component="p" dangerouslySetInnerHTML={{ __html: content }} />
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Link to={link} className={classes.link}>
                  <Button size="small" color="primary">
                    Next
                  </Button>
                </Link>
              </CardActions>
            </Card>
          );
        }}
      </Query>
    );
  }
}

Email.propTypes = {
  username: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }).isRequired
};

const ChallengeQuery = gql`
  query ChallengeQuery($level: Int!) {
    challenge(level: $level) {
      name,
      email,
      subject,
      profilePicture,
      content
    }
  }
`;

export default graphql(ChallengeQuery)(withStyles(styles)(Email));
