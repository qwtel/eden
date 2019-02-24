'use strict';

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const upload = multer();

const log = process.env.DEBUG ? console.log.bind(console) : _ => _;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(yamlParser);
app.use(tomlParser);
app.use(ednParser);

app.post('/', upload.any(), (req, res) => {
  log(req.body);
  res.format({
    'application/json': () => {
      log(req.files);
      res.send(req.body);
    },

    'application/yaml': () => {
      const yaml = require('js-yaml');
      res.send(yaml.safeDump(req.body));
    },

    'application/toml': () => {
      const toml = require('@iarna/toml');
      res.send(toml.stringify(req.body));
    },

    'application/edn': () => {
      const edn = require('jsedn');
      res.send(edn.encode(req.body));
    },

    'application/x-www-form-urlencoded': () => {
      const qs = require('qs');
      res.send(qs.stringify(req.body));
    },

    'default': () =>  {
      // log the request and respond with 406
      res.status(406).send('Not Acceptable');
    }
  });
});

function tomlParser(req, _, next) {
  if (req.is('application/toml')) {
    const toml = require('@iarna/toml');
    req.body = toml.parse(req.body);
  }
  next();
}

function ednParser(req, _, next) {
  if (req.is('application/edn')) {
      const edn = require('jsedn');
      const raw = req.body.toString('utf8'); // detect format!?
      req.body = edn.toJS(edn.parse(raw));
  }
  next();
}

function yamlParser(req, _, next) {
  if (req.is('application/yaml')) {
      const yaml = require('js-yaml');
      req.body = yaml.safeLoad(req.body);
  }
  next();
}

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
