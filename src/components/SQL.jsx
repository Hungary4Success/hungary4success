import Card, { CardContent } from 'material-ui/Card';
import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  card: {
    position: 'relative',
    top: '10%',
    margin: 'auto',
    borderRadius: '15px',
    maxWidth: '95%',
    opacity: '1',
    transition: 'opacity 500ms ease-in-out'

  },
  title: {
    fontSize: '20px',
    margin: '7px 0 15px 0'
  },
  button: {
    marginLeft: 'auto'
  },
  htmlEditor: {
    position: 'relative',
    overflow: 'auto',
    width: '500px'
  }
});

@observer
class SQL extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.content
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Fragment>
            <div>
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="editorCode">
                  <span>Your code:</span>
                  <br />
                  <textarea
                    value={this.state.value}
                    id="editorCode"
                    rows="30"
                    className={classes.htmlEditor}
                    style={{ marginTop: 10 }}
                  />
                  <br />
                </label>
              </form>
            </div>
          </Fragment>
        </CardContent>
      </Card>
    );
  }
}

SQL.propTypes = {
  classes: PropTypes.shape({
    htmlEditor: PropTypes.string.isRequired
  }).isRequired,
  content: PropTypes.string.isRequired
};

export default withStyles(styles)(SQL);
