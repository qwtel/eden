'use strict';

const serverless = require('serverless-http');
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

const app = express();

const log = process.env.DEBUG ? console.log.bind(console) : _ => _;

app.use(async (req, _, next) => {
  if (req.is('application/json')) {
    req.body = parseJSON(req.body);
  }
  else if (req.is('application/toml')) {
    req.body = parseTOML(req.body);
  }
  else if (req.is('application/edn')) {
    req.body = parseEDN(req.body);
  }
  else if (req.is('application/yaml')) {
    req.body = parseYAML(req.body);
  }
  else if (req.is('application/xml')) {
    req.body = await parseXML(req.body);
  }
  else if (req.is('text/csv')) {
    req.body = await parseCSV(req.body);
  }
  else if (req.is('application/x-www-form-urlencoded')) {
    req.body = parseURL(req.body);
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

module.exports.handler = serverless(app);
