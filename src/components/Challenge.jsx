import Card, { CardActions, CardContent } from 'material-ui/Card';
import { Query, graphql } from 'react-apollo';
import React, { Component } from 'react';

import Button from 'material-ui/Button';
import Editor from './Editor.jsx';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Transition from 'react-transition-group/Transition';
import Typography from 'material-ui/Typography';
import gql from 'graphql-tag';
import { observer } from 'mobx-react';
import validate from '../validate';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  container: {
    height: '100%',
    display: 'flex',
    transition: 'opacity 500ms ease-in-out'
  },
  card: {
    position: 'relative',
    width: '95%',
    margin: 'auto',

    borderRadius: 5,
    maxWidth: 1500
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Challenge extends Component {
  validateSolution = (history) => {
    const code = document.getElementById('editorCode').value;

    if (validate[this.props.level](code)) {
      this.props.challengeSolved();
      history.push('/');
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Query query={ChallengeCodeQuery} variables={{ level: this.props.level }}>
        {({ loading, data }) => {
          if (loading) return <div />;

          return (
            <Transition appear in timeout={0}>
              {state => (
                <div
                  className={classes.container}
                  style={{ opacity: 0, ...transitionStyles[state] }}
                >
                  <Card className={classes.card}>
                    <CardContent className={classes.content}>
                      <Typography gutterBottom variant="headline" component="h1">
                      Challenge {this.props.level}
                      </Typography>
                      <br />
                      <Editor content={data.challengeCode} />
                    </CardContent>
                    <CardActions className={classes.cardActions} style={{ float: 'right' }}>
                      <Route render={({ history }) => (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.validateSolution(history)}
                        >
                          Check
                        </Button>
                      )}
                      />
                    </CardActions>
                  </Card>
                </div>
              )}
            </Transition>
          );
      }}
      </Query>
    );
  }
}

const ChallengeCodeQuery = gql`
  query ChallengeCodeQuery($level: Int!) {
    challengeCode(level: $level)
  }
`;

Challenge.propTypes = {
  level: PropTypes.number.isRequired,
  challengeSolved: PropTypes.func.isRequired
};

export default graphql(ChallengeCodeQuery)(withStyles(styles)(Challenge));
