import Card, { CardActions, CardContent } from 'material-ui/Card';
import React, { Component } from 'react';

import Button from 'material-ui/Button';
import Editor from './Editor.jsx';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import Typography from 'material-ui/Typography';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  card: {
    display: 'flex',
    flexDirection: 'column',

    position: 'absolute',
    top: '18%',
    width: '75%',
    margin: '0 auto',

    borderRadius: 5,
    maxWidth: 1000,
    maxHeight: 750,
    padding: 13
  },
  link: {
    textDecoration: 'none'
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Challenge extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div style={{ opacity: 0, ...transitionStyles[state] }}>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="headline" component="h1">
                  Challange {this.props.level}
                </Typography>
                <Editor />
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" onClick={this.props.challengeSolved}>
                  <Link to="/" styles={{ textDecoration: 'none' }}>
                Check
                  </Link>
                </Button>
              </CardActions>
            </Card>
          </div>
        )}
      </Transition>
    );
  }
}

Challenge.propTypes = {
  level: PropTypes.number.isRequired,
  challengeSolved: PropTypes.func.isRequired
};

export default withStyles(styles)(Challenge);
