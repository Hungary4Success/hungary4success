import React, { Component } from 'react';

import Email from './Email.jsx';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
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
    const { classes } = this.props;
    const initialOpacity = this.props.fromLogin ? 0 : 1;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div
            className={classes.container}
            style={{ opacity: initialOpacity, ...transitionStyles[state] }}
          >
            <Email level={this.level} />
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
