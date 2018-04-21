import React, { Component } from 'react';

import sendQuery from '../graphql.js';

export default class Home extends Component {
  render() {
    return (
      <div className="verticalCenter">
        <div className="container loginDiv">
          <h1 className="title">Better Arcade</h1>
          <form onSubmit={(event) => { event.preventDefault(); }}>
            <h4>Please log in with your</h4>
            <h4>University of Manchester account</h4>
          </form>
        </div>
      </div>
    );
  }
}
