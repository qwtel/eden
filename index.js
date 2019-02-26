'use strict';

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const {
  parseJSON, stringifyJSON,
  parseXML, stringifyXML,
  parseTOML, stringifyTOML,
  parseYAML, stringifyYAML,
  parseEDN, stringifyEDN,
} = require('./eden.js');

const app = express();
const upload = multer();

const log = process.env.DEBUG ? console.log.bind(console) : _ => _;

app.use(bodyParser.urlencoded({ extended: true }));

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
  next();
});

app.post('/', upload.any(), (req, res) => {
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

    'application/x-www-form-urlencoded': () => {
      const qs = require('qs');
      res.send(qs.stringify(req.body));
    },

    'default': () => {
      // log the request and respond with 406
      res.status(406).send('Not Acceptable');
    }
  });
});

module.exports.handler = serverless(app);

// async function hello(event, context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: 'Go Serverless v1.0! Your function executed successfully!',
//       input: event,
//     }),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// }
