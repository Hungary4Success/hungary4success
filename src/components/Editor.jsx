import React, { Component, Fragment } from 'react';

import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { Frame } from 'react-iframe-component';

const styles = () => ({
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

@observer
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '<!DOCTYPE html>\n<html>\n  <body>\n\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n\n  </body>\n</html>'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    document.getElementById('htmlPreview').innerHTML = this.state.value;
  }

  render() {
    return (
      <div>
        <Fragment>
          <div style={{ float: 'left', display: 'inline' }}>
            <form>
              <label>
          Editor:<br />
                <textarea value={this.state.value} onChange={this.handleChange} name="editor" id="editorCode" rows="120" cols="80" />
                <br />
              </label>
              <input type="submit" value="Check" />
            </form>
          </div>
        </Fragment>
        <Frame>
          <div id="htmlPreview" />
        </Frame>
        <Fragment />
      </div>
    );
  }
}

export default withStyles(styles)(Editor);
