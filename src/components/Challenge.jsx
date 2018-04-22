import Card, { CardActions, CardContent } from 'material-ui/Card';
import { Query, compose, graphql } from 'react-apollo';
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

import Button from 'material-ui/Button';
import Editor from './Editor.jsx';
import PropTypes from 'prop-types';
import SQL from './SQL.jsx';
import Tooltip from 'material-ui/Tooltip';
import Transition from 'react-transition-group/Transition';
import Typography from 'material-ui/Typography';
import gql from 'graphql-tag';
import { observable } from 'mobx';
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
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px 5px 20px'
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Challenge extends Component {
  @observable isError = false;

  validateSolution = (history) => {
    const code = document.getElementById('editorCode').value;
    const previewField = document.getElementById('htmlPreview');

    if (!previewField) {
      this.props.executeSqlMutate({
        variables: { query: code }
      }).then(({ data }) => {
        this.challengeSolved(validate[this.props.level](data.executeSql), history);
      });

      return;
    }

    const html = previewField.getAttribute('srcdoc');
    this.challengeSolved(validate[this.props.level](code, html), history);
  }

  challengeSolved = (validationResult, history) => {
    if (validationResult) {
      this.props.challengeSolved();
      history.push('/');
    } else {
      this.isError = true;
    }
  }

  render() {
    if (this.props.level === 0) {
      this.props.challengeSolved();
      return <Redirect to="/" />;
    }

    const { classes } = this.props;
    const { isError } = this;

    return (
      <Query query={ChallengeCodeQuery} variables={{ level: this.props.level }}>
        {({ loading, data }) => {
          if (loading) return <div />;

          const { challengeCode } = data;
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
                      <Tooltip id="tooltip-left-end" title={challengeCode.hint} placement="left-end">
                        <Button
                          size="small"
                          color="primary"
                          style={{
                            float: 'right', bottom: 35, cursor: 'default', color: '#3f51b5'
                          }}
                        >
                        Hint
                        </Button>
                      </Tooltip>
                      <br />
                      {
                        challengeCode.type === 'database'
                          ? <SQL content={challengeCode.code} />
                          : <Editor content={challengeCode.code} />
                      }
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <Typography
                        gutterBottom
                        variant="caption"
                        component="h1"
                        style={{
                          color: 'red',
                          opacity: isError ? 1 : 0,
                          transition: 'opacity 250ms ease-in-out'
                        }}
                      >
                        Sorry, your answer was wrong.
                      </Typography>
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
    challengeCode(level: $level) {
      code, hint, type
    }
  }
`;

const ExecuteSqlMutation = gql`
  mutation ExecuteSqlMutation($query: String!) {
    executeSql(query: $query)
  }
`;

Challenge.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired
  }).isRequired,
  level: PropTypes.number.isRequired,
  challengeSolved: PropTypes.func.isRequired,
  executeSqlMutate: PropTypes.func.isRequired
};

export default compose(
  graphql(ChallengeCodeQuery),
  graphql(ExecuteSqlMutation, {
    name: 'executeSqlMutate'
  }),
  withStyles(styles)
)(Challenge);
