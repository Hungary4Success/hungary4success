import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';

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
  htmlEditor: {
    overflow: 'auto'
  },
  htmlContainer: {
    width: '50%',
    background: 'white',
    align: 'right',
    overflow: 'auto',
    border: 'solid 1px'
  }
});

@observer
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.content
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.componentDidMount);
    const width = document.getElementById('htmlPreview').offsetWidth - 15;
    const height = document.getElementById('editorCode').offsetHeight - 2;

    document.getElementById('editorCode').setAttribute('style', `resize: none; width:${width}px;`);
    document.getElementById('htmlPreview').setAttribute('style', `height:${height}px;`);
    document.getElementById('htmlPreview').innerHTML = this.state.value;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    document.getElementById('htmlPreview').innerHTML = event.target.value;
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
                <label htmlFor="editorCode">
                  <span>Your code:</span>
                  <br />
                  <textarea
                    value={this.state.value}
                    onChange={this.handleChange}
                    id="editorCode"
                    rows="30"
                    className={classes.htmlEditor}
                  />
                  <br />
                </label>

              </form>
            </div>
            <div id="htmlDiv">
              <span>Your webpage:</span>
              <div className={this.props.classes.htmlContainer} id="htmlPreview" />
            </div>
          </Fragment>
        </CardContent>
      </Card>
    );
  }
}

Editor.propTypes = {
  classes: PropTypes.shape({
    htmlContainer: PropTypes.string.isRequired
  }).isRequired,
  content: PropTypes.string.isRequired
};

export default withStyles(styles)(Editor);
