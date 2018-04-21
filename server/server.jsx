import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { JssProvider, SheetsRegistry } from 'react-jss';

import App from '../src/components/App.jsx';
import { InMemoryCache } from '../node_modules/apollo-cache-inmemory/lib/inMemoryCache';
import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import apolloClient from '../src/apollo_client.js';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { create } from 'jss';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import express from 'express';
import favicon from 'serve-favicon';
import fetch from 'node-fetch';
import fs from 'fs';
import graphQLSchema from './graphql';
import graphqlHTTP from 'express-graphql';
import http from 'http';
import https from 'https';
import jssPreset from 'jss-preset-default';
import muiTheme from '../src/theme.js';
import path from 'path';
import session from 'express-session';

const morgan = require('morgan');

global.fetch = fetch;
global.goingOutUsernames = [];

// HTTP Webserver
const unsecureApp = express();

unsecureApp.get('*', (req, res) => {
  res.redirect(`https://localhost${req.originalUrl}`);
});

//  HTTPS Webserver
const app = express();
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(compression());

app.use(favicon(path.join(__dirname, 'www', 'images', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'www'), { index: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: '98414c22d7e2cf27b3317ca7e19df38e9eb221bd',
  resave: true,
  saveUninitialized: false
}));

app.use(
  '/api',
  (req, res, next) => {
    console.log(`GraphQL API request: ${req.body.operationName}`);
    next();
  },
  graphqlHTTP(req => ({
    schema: graphQLSchema,
    rootValue: { session: req.session },
    graphiql: true
  })),
);

app.get('*', (req, res) => {
  console.log();

  const headers = Object.assign({}, req.headers, {
    accept: 'application/json'
  });
  const client = apolloClient(true, headers, new InMemoryCache());

  const sheetsRegistry = new SheetsRegistry();
  const jss = create(jssPreset());
  jss.options.createGenerateClassName = createGenerateClassName;

  const context = {};
  const reactApp = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider theme={muiTheme} sheetsManager={new Map()}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </ApolloProvider>
  );

  renderPage(reactApp, client, sheetsRegistry).then((html) => {
    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      });
      res.send();
    } else {
      res.send(html);
    }
  }).catch((err) => { console.log(err); });
});

function renderPage(reactApp, client, sheetsRegistry) {
  return renderToStringWithData(reactApp).then((content) => {
    const css = sheetsRegistry.toString();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width">
          <title>RUOut</title>

          <script>window.__APOLLO_STATE__ = ${JSON.stringify(client.extract())};</script>

          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
          <link rel="stylesheet" type="text/css" href="styles.css">
        </head>
        <body>
          <div id="root">${content}</div>
          <style id="jss-server-side">${css}</style>
          <script src="bundle.js"></script>
        </body>
      </html>
    `;
  });
}

const options = {
  key: fs.readFileSync(path.join(__dirname, 'server/ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'server/ssl/cert.crt')),
  passphrase: 'iManT'
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = process.env.PORT || 443;
if (process.env.NODE_ENV === 'production') {
  http.createServer(app).listen(port);
} else {
  http.createServer(unsecureApp).listen(8080);
  https.createServer(options, app).listen(443);
}

console.log(`Server is started on port ${port}.`);
