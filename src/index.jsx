import { ApolloProvider } from 'react-apollo';
import App from './components/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
import apolloClient from './apollo_client.js';
import { hydrate } from 'react-dom';
import theme from './theme.js';

window.addEventListener('load', () => {
  const inMemoryCache = new InMemoryCache().restore(window.__APOLLO_STATE__ || {});
  const client = apolloClient(false, undefined, inMemoryCache);

  hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  );
});
