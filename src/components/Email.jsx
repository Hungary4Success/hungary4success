import Card, { CardActions, CardContent } from 'material-ui/Card';
import React, { Component } from 'react';

import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
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
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <div className={classes.details}>
            <img src={this.props.profilePicture} alt="profile" className={classes.profilePicture} />
            <div>
              <Typography gutterBottom variant="headline" component="h1">
                New Email
              </Typography>
              <Typography variant="subheading" component="h2">
                From: {this.props.address}
              </Typography>
              <Typography variant="subheading" component="h2">
                Subject: {this.props.subject}
              </Typography>
            </div>
          </div>
          <Typography paragraph component="p">
            {this.props.content}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button size="small" color="primary">
            <Link to={this.props.challengePath} className={classes.link}>
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
  address: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
  challengePath: PropTypes.string.isRequired
};

export default withStyles(styles)(Email);
