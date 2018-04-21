import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/routes.jsx';

window.addEventListener('load', () => {
  ReactDOM.render(
    <BrowserRouter>
      <Routes />
    </BrowserRouter>,
    document.getElementById('root')
  );
});
