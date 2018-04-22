import React, { Component, Fragment } from 'react';

import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';

const styles = () => ({
  htmlContainer: {
    background: 'white',
    align: 'right',
    borderLeft: '10px dashed #333'
  }

});

@observer
class SQL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'SELECT *\nFROM Employee;'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          </Fragment>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(SQL);
