import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';

import Home from './Home.jsx';
import Login from './Login.jsx';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  background: {
    backgroundImage: 'url("images/background1.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'fixed',
    width: '100%',
    height: '100%',
    transition: 'opacity 500ms ease-in-out'
  }
});

@observer
class App extends Component {
  componentDidMount = () => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.location.pathname === '/login' && nextProps.location.pathname === '/') {
      this.fromLogin = true;
    }
  }

  @observable loginError = false;
  fromLogin = false;

  handleLogin = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    this.props.loginMutate({
      variables: { username, password }
    }).then(({ data }) => {
      if (data.loginUser === true) {
        this.loginError = false;
      } else {
        this.loginError = true;
      }
    });
  }

  handleLogout = () => {
    this.props.logoutMutate();
  }

  render() {
    const { loginError } = this;
    const { pathname } = this.props.location;
    const username = this.props.data.getUsername;

    const isLoggedIn = username !== null;

    if (!isLoggedIn && pathname !== '/login') {
      return <Redirect to="/login" push />;
    }

    if (isLoggedIn === true && pathname === '/login') {
      return <Redirect to="/" push />;
    }

    return (
      <Fragment>
        <div className={this.props.classes.background} />
        <Switch>
          <Route
            path="/login"
            render={defaultProps => (<Login
              handleLogin={() => this.handleLogin()}
              loginError={loginError}
              {...defaultProps}
            />)}
          />
          <Route
            path="/"
            render={defaultProps => (<Home
              handleLogout={() => this.handleLogout()}
              username={username}
              fromLogin={this.fromLogin}
              {...defaultProps}
            />)}
          />
        </Switch>
      </Fragment>
    );
  }
}

const getUsernameQuery = gql`
  query getUsernameQuery {
    getUsername
  }
`;

const LoginUserMutation = gql`
  mutation LoginUserMutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password)
  }
`;

const LogoutUserMutation = gql`
  mutation LogoutUserMutation {
    logoutUser
  }
`;

const loginMutationOptions = {
  refetchQueries: ['getUsernameQuery', 'FetchStatusQuery']
};

App.propTypes = {
  classes: PropTypes.shape({
    background: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    getUsername: PropTypes.string
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  loginMutate: PropTypes.func.isRequired,
  logoutMutate: PropTypes.func.isRequired
};

export default compose(
  graphql(getUsernameQuery),
  graphql(LoginUserMutation, {
    name: 'loginMutate',
    options: loginMutationOptions
  }),
  graphql(LogoutUserMutation, {
    name: 'logoutMutate',
    options: loginMutationOptions
  }),
  withRouter,
  withStyles(styles)
)(App);
