import React, { Component } from 'react';

import Email from './Email.jsx';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import challengeData from '../challenges.json';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  container: {
    height: '100%',
    transition: 'opacity 500ms ease-in-out'
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Home extends Component {
  @observable level = 0;

  render() {
    const { emails } = challengeData;

    let currentEmail;
    if (this.level < emails.length) currentEmail = challengeData[this.level];

    const emailData = JSON.parse(`${currentEmail}.json`);

    const { classes } = this.props;
    const initialOpacity = this.props.fromLogin ? 0 : 1;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div
            className={classes.container}
            style={{ opacity: initialOpacity, ...transitionStyles[state] }}
          >
            <Email
              address={emailData.email}
              subject={emailData.dubject}
              content="Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica"
              profilePicture="/images/in.jpg"
              challengePath="/login"
            />
          </div>
        )}
      </Transition>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string.isRequired
  }).isRequired,
  fromLogin: PropTypes.bool.isRequired
};

export default withStyles(styles)(Home);
