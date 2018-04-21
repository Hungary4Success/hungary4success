import React, { Component, Fragment } from 'react';

import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
// import { ScrollbarWrapper } from 'react-scrollbars';

const styles = () => ({
  card: {
    position: 'relative',
    top: '5%',
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
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Fragment>
            <div style={{ float: 'left', display: 'inline' }}>
              <form onSubmit={this.handleSubmit}>
                <label>
                Your code:<br /><br />
                  <textarea value={this.state.value} onChange={this.handleChange} name="editor" id="editorCode" rows="30" cols="80" />
                  <br />
                </label>
                <input type="submit" value="Check" />
              </form>
            </div>
          </Fragment>
          <Fragment>
            <div style={{ minWidth: '10px' }} />
          </Fragment>
          <Fragment>
            <span>Your webpage</span>
            <div>
              <div className={classes.htmlContainer} id="htmlPreview" />
            </div>
          </Fragment>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Editor);
