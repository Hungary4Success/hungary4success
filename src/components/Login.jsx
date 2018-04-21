import Card, { CardActions, CardContent } from 'material-ui/Card';
import React, { Component } from 'react';

import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Transition from 'react-transition-group/Transition';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  card: {
    position: 'relative',
    top: '30%',
    maxWidth: 375,
    margin: 'auto',
    borderRadius: '15px',

    opacity: '0.7',
    transition: 'opacity 500ms ease-in-out'

  },
  title: {
    fontSize: '20px',
    margin: '7px 0 15px 0'
  },
  button: {
    marginLeft: 'auto'
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 0.7 }
};

class Login extends Component {
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.handleLogin();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <Card className={classes.card} style={{ ...transitionStyles[state] }}>
            <CardContent>
              <Typography type="title" className={classes.title}>
                Choose a name and enter password
              </Typography>
              <TextField
                id="username"
                label="Name"
                margin="dense"
                autoFocus
                onKeyPress={event => this.handleKeyPress(event)}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                margin="dense"
                autoComplete="current-password"
                error={this.props.loginError}
                onKeyPress={event => this.handleKeyPress(event)}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="raised"
                color="primary"
                className={classes.button}
                onClick={() => this.props.handleLogin()}
              >
                Login
              </Button>
            </CardActions>
          </Card>
          )}
      </Transition>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired,
  handleLogin: PropTypes.func.isRequired,
  loginError: PropTypes.bool.isRequired
};

export default withStyles(styles)(Login);
