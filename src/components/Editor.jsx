import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  htmlContainer: {
    background: 'white',
    align: 'right',
    borderLeft: '10px dashed #333'
  }
});

@observer
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '<!DOCTYPE html>\n<html>\n  <body>\n\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n\n  </body>\n</html>'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    document.getElementById('htmlPreview').innerHTML = this.state.value;
  }

  handleSubmit(event) {
    document.getElementById('htmlPreview').innerHTML = this.state.value;
    event.preventDefault();
  }

  render() {
    return (
      <Fragment>
        <div style={{ float: 'left', display: 'inline' }}>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="editorCode">
                Your code:
              <br />
              <br />
              <textarea
                value={this.state.value}
                onChange={this.handleChange}
                name="editor"
                id="editorCode"
                rows="120"
                cols="80"
              />
              <br />
            </label>
            <input type="submit" value="Check" />
          </form>
        </div>
        <div style={{ minWidth: '10px' }} />
        <div >
          <span>Your webpage</span>
          <div className={this.props.classes.htmlContainer} id="htmlPreview" />
        </div>
      </Fragment>
    );
  }
}

Editor.propTypes = {
  classes: PropTypes.shape({
    htmlContainer: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(Editor);
