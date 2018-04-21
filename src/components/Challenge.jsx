import React, { Component } from 'react';

import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Challenge extends Component {
  render() {
    return (
      <Transition appear in timeout={0}>
        {state => (
          <div style={{ opacity: 0, ...transitionStyles[state] }}>
            Challenge {this.props.level}
            <Button
              variant="raised"
              color="primary"
              onClick={this.props.challengeSolved}
            >
              <Link to="/" styles={{ textDecoration: 'none' }}>
                Done
              </Link>
            </Button>
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
