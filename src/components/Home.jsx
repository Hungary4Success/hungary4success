import React, { Component } from 'react';

import Email from './Email.jsx';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
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
  render() {
    const { classes, user } = this.props;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div
            className={classes.container}
            style={{ opacity: 0, ...transitionStyles[state] }}
          >
            <Email level={user.level} username={user.name} />
          </div>
        )}
      </Transition>
    );
  }
}

Home.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired
  }).isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(Home);
