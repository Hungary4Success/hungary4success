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
  container: {
    height: '100%',
    transition: 'opacity 500ms ease-in-out'
  },
  card: {
    position: 'relative',
    top: '10px',
    width: '95%',
    margin: 'auto',

    borderRadius: '5',
    maxWidth: '95%'
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
    console.log('render');
    const { classes } = this.props;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div
            className={classes.container}
            style={{ opacity: 0, ...transitionStyles[state] }}
          >
            <br />
            <br />
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="headline" component="h1">
                  Challenge {this.props.level}
                </Typography>
                <Editor content="HELLO" />
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button size="small" color="primary" onClick={this.props.challengeSolved}>
                    Check
                  </Button>
                </Link>
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
