import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';

import Challenge from './Challenge.jsx';
import Editor from './Editor.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import PropTypes from 'prop-types';
import SQL from './SQL.jsx';
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
    filter: 'blur(10px)',
    transition: 'opacity 500ms ease-in-out',
    zIndex: '-1'
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
      if (data.user) {
        this.loginError = false;
      } else {
        this.loginError = true;
      }
    });
  }

  handleLogout = () => {
    this.props.logoutMutate();
  }

  handleChallengeSolved = () => {
    this.props.increaseLevelMutate();
  }

  render() {
    const { loginError } = this;
    const { pathname } = this.props.location;
    const { user } = this.props.data;

    const isLoggedIn = user !== null;

    if (!isLoggedIn && pathname !== '/login') {
      return <Redirect to="/login" push />;
    }

    if (isLoggedIn === true && pathname === '/login') {
      return <Redirect to="/" push />;
    }

    if (this.showLetter === true && pathname !== '/') {
      console.log('bbb');
      return <Redirect to="/" />;
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
            path="/challenge"
            render={defaultProps => (<Challenge
              level={user.level}
              challengeSolved={() => this.handleChallengeSolved()}
              {...defaultProps}
            />)}
          />
          <Route
            path="/sql"
            render={defaultProps => (<SQL
              content="SELECT * FROM Employee;"
              handleLogout={() => this.handleLogout()}
              fromLogin={this.fromLogin}
              {...defaultProps}
            />)}
          />
          <Route
            path="/editor"
            render={defaultProps => (<Editor
              handleLogout={() => this.handleLogout()}
              fromLogin={this.fromLogin}
              {...defaultProps}
            />)}
          />
          <Route
            path="/"
            render={defaultProps => (<Home
              user={user}
              handleLogout={() => this.handleLogout()}
              {...defaultProps}
            />)}
          />
        </Switch>
      </Fragment>
    );
  }
}

const UserQuery = gql`
  query UserQuery {
    user {
      name,
      level
    }
  }
`;

const LoginMutation = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const LogoutMutation = gql`
  mutation LogoutMutation {
    logout
  }
`;

const IncreaseLevelMutation = gql`
  mutation IncreaseLevel {
    increaseLevel
  }
`;

const loginMutationOptions = {
  refetchQueries: ['UserQuery']
};

App.propTypes = {
  classes: PropTypes.shape({
    background: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired
    })
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  loginMutate: PropTypes.func.isRequired,
  logoutMutate: PropTypes.func.isRequired,
  increaseLevelMutate: PropTypes.func.isRequired
};

export default compose(
  graphql(UserQuery),
  graphql(LoginMutation, {
    name: 'loginMutate',
    options: loginMutationOptions
  }),
  graphql(LogoutMutation, {
    name: 'logoutMutate',
    options: loginMutationOptions
  }),
  graphql(IncreaseLevelMutation, {
    name: 'increaseLevelMutate',
    options: { refetchQueries: ['UserQuery'] }
  }),
  withRouter,
  withStyles(styles)
)(App);
