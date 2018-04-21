import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { computed, observable } from 'mobx';

import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import Typography from 'material-ui/Typography';
import gql from 'graphql-tag';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  background: {
    width: '100%',
    height: '100%',

    backgroundImage: 'url("images/in.jpg")',
    backgroundPosition: '35%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'fixed',
    filter: 'blur(10px)',

    transition: 'opacity 500ms ease-in-out'
  },
  container: {
    height: '100%',
    transition: 'opacity 500ms ease-in-out'
  },
  content: {
    position: 'relative',
    top: '30%',
    margin: '0 10%',
    textAlign: 'center'
  },
  status: {
    fontSize: '200%',
    color: 'white',
    textAlign: 'center'
  },
  button: {
    marginTop: '50px'
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Home extends Component {
  componentWillMount() {
    this.goingOutUsernames = this.props.data.whoIsGoingOut;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading && this.props.data.loading) {
      this.goingOutUsernames = nextProps.data.whoIsGoingOut;
    }
  }

  @computed get amIGoingOut() {
    return this.goingOutUsernames.includes(this.props.username);
  }
  set amIGoingOut(value) {
    if (value === true && !this.goingOutUsernames.includes(this.props.username)) {
      this.goingOutUsernames.push(this.props.username);
    }
  }

  @observable goingOutUsernames = [];

  handleStatusSet = () => {
    if (this.goingOutUsernames.length > 0) {
      this.props.cameBackMutate().then(({ data }) => {
        this.goingOutUsernames = data.cameBack;
      });
    } else {
      this.props.goingOutMutate().then(({ data }) => {
        this.goingOutUsernames = data.goingOut;
      });
    }
  }

  processUsername = (username) => {
    let name = username;
    if (username === this.props.username) name = 'you';
    name = name.charAt(0).toUpperCase() + name.slice(1);

    return name;
  }

  render() {
    if (this.props.data.loading) return (<div />);

    const { amIGoingOut, goingOutUsernames } = this;
    const goingOutCount = goingOutUsernames.length;
    const isAnyoneGoingOut = goingOutCount > 0;

    // Generate a string from the list of names of people going out.
    let goingOutString = 'No one';
    if (goingOutCount > 1) {
      goingOutString = goingOutUsernames.reduce((previousValue, currentValue, currentIndex) => {
        const currentName = this.processUsername(currentValue);

        if (currentIndex === goingOutCount - 1) {
          return `${previousValue} and ${currentName}`;
        }

        return `${previousValue}, ${currentName}`;
      });
    } else if (isAnyoneGoingOut) {
      goingOutString = this.processUsername(goingOutUsernames[0]);
    }
    goingOutString += goingOutCount > 1 || goingOutString === 'You' ? ' are ' : ' is ';

    const { classes } = this.props;
    const initialOpacity = this.props.fromLogin ? 0 : 1;
    const inOpacity = isAnyoneGoingOut ? 0 : 1;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div
            className={classes.container}
            style={{ opacity: initialOpacity, ...transitionStyles[state] }}
          >
            <div className={classes.background} style={{ opacity: inOpacity }} />
            <div className={classes.content}>
              <Typography type="headline" className={classes.status}>
                {goingOutString} going out tonight.
              </Typography>
              <Button
                variant="raised"
                className={classes.button}
                onClick={() => this.handleStatusSet()}
              >
                {amIGoingOut ? 'I came back' : 'I\'m going out!'}
              </Button>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

const whoIsGoingOutQuery = gql`
  query whoIsGoingOutQuery {
    whoIsGoingOut
  }
`;

const goingOutMutation = gql`
  mutation goingOutMutation {
    goingOut
  }
`;

const cameBackMutation = gql`
  mutation cameBackMutation {
    cameBack
  }
`;

Home.propTypes = {
  username: PropTypes.string.isRequired,
  fromLogin: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    whoIsGoingOut: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  goingOutMutate: PropTypes.func.isRequired,
  cameBackMutate: PropTypes.func.isRequired
};

export default compose(
  graphql(whoIsGoingOutQuery),
  graphql(goingOutMutation, { name: 'goingOutMutate' }),
  graphql(cameBackMutation, { name: 'cameBackMutate' }),
  withStyles(styles)
)(Home);
