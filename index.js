'use strict';

const server = process.env._HANDLER 
  ? require('serverless-http')
  : app => require('http').createServer(app).listen(process.env.PORT || 3000);

const express = require('express');

const {
  parseJSON, stringifyJSON,
  parseXML, stringifyXML,
  parseTOML, stringifyTOML,
  parseYAML, stringifyYAML,
  parseEDN, stringifyEDN,
  parseCSV, stringifyCSV,
  parseURL, stringifyURL,
} = require('./eden.js');

const { readStream } = require('./common');

const app = express();

app.use(async (req, _, next) => {
  const body = await readStream(req);

  if (req.is('application/json')) {
    req.body = parseJSON(body);
  }
  else if (req.is('application/toml')) {
    req.body = parseTOML(body);
  }
  else if (req.is('application/edn')) {
    req.body = parseEDN(body);
  }
  else if (req.is('application/yaml')) {
    req.body = parseYAML(body);
  }
  else if (req.is('application/xml')) {
    req.body = await parseXML(body);
  }
  else if (req.is('text/csv')) {
    req.body = await parseCSV(body);
  }
  else if (req.is('application/x-www-form-urlencoded')) {
    req.body = parseURL(body);
  }

  next();
});

app.post('/', (req, res) => {
  res.format({
    'application/json': () => {
      res.send(stringifyJSON(req.body));
    },

    'application/xml': () => {
      res.send(stringifyXML(req.body));
    },

    'application/yaml': () => {
      res.send(stringifyYAML(req.body));
    },

    'application/toml': () => {
      res.send(stringifyTOML(req.body));
    },

    'application/edn': () => {
      res.send(stringifyEDN(req.body));
    },

    'text/csv': () => {
      res.send(stringifyCSV(req.body));
    },

    'application/x-www-form-urlencoded': () => {
      res.send(stringifyURL(req.body));
    },

    'default': () => {
      // log the request and respond with 406
      res.status(406).send('Not Acceptable');
    },
  });
});

module.exports.handler = server(app);
