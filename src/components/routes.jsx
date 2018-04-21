import React, { Component } from 'react';

import Home from './Home.jsx';
import { Route } from 'react-router-dom';

export default () => (
  <Route path="/" component={Home} />
);
