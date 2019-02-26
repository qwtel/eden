'use strict';

const serverless = require('serverless-http');
const express = require('express');

const {
  parseJSON, stringifyJSON,
  parseXML, stringifyXML,
  parseTOML, stringifyTOML,
  parseYAML, stringifyYAML,
  parseEDN, stringifyEDN,
} = require('./eden.js');

const app = express();

const log = process.env.DEBUG ? console.log.bind(console) : _ => _;

app.use(async (req, _, next) => {
  if (req.is('application/json')) {
    req.body = await parseJSON(req.body);
  }
  else if (req.is('application/toml')) {
    req.body = await parseTOML(req.body);
  }
  else if (req.is('application/edn')) {
    req.body = await parseEDN(req.body);
  }
  else if (req.is('application/yaml')) {
    req.body = await parseYAML(req.body);
  }
  else if (req.is('application/xml')) {
    req.body = await parseXML(req.body);
  }
  else if (req.is('application/x-www-form-urlencoded')) {
    const qs = require('qs');
    req.body = qs.parse(req.body);
  }

  next();
});

app.post('/', (req, res) => {
  res.format({
    'application/json': () => {
      res.send(stringifyJSON(req.body));
    },

    'application/xml': () => {
      console.log('hello');
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

    'application/x-www-form-urlencoded': () => {
      const qs = require('qs');
      res.send(qs.stringify(req.body));
    },

    'default': () => {
      // log the request and respond with 406
      res.status(406).send('Not Acceptable');
    },
  });
});

module.exports.handler = serverless(app);
