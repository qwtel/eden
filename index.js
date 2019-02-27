'use strict';

const server = process.env._HANDLER
  ? require('serverless-http')
  : app => require('http').createServer(app).listen(process.env.PORT || 3000);

const express = require('express');

const { parsers, stringifiers } = require('./eden.js');
const { readStream } = require('./common');

const app = express();

const format2MIMEType = {
  yaml: 'application/yaml',
  yml: 'application/yaml',
  edn: 'application/edn',
  toml: 'application/toml',
  csv: 'text/csv',
  xml: 'application/xml',
  json: 'application/json',
  js: 'application/json',
  url: 'application/x-www-form-urlencoded',
};

const mimeType2Format = new Map(Object.entries({
  'application/yaml': 'yaml',
  'application/edn': 'edn',
  'application/toml': 'toml',
  'text/csv': 'csv',
  'application/xml': 'xml',
  'application/json': 'json',
  'application/x-www-form-urlencoded': 'url',
}));

app.use(async (req, _, next) => {
  const body = await readStream(req);

  const source = (req.query.parse || req.query.p || req.query.from || req.query.f || '').toLowerCase();

  if (source) {
    if (!parsers[source]) throw Error('not supported');
    req.body = await parsers[source](body);
  } else {
    for (const [mimeType, format] of mimeType2Format) {
      if (req.is(mimeType)) {
        req.body = await parsers[format](body);
      }
    }
  }

  next();
});

app.post('/', (req, res) => {
  const target = (req.query.stringify || req.query.s || req.query.to || req.query.t || '').toLowerCase();

  if (target) {
    if (!stringifiers[target]) throw Error('not supported');
    res.set('content-type', format2MIMEType[target]);
    res.send(stringifiers[target](req.body));
  } else {
    const formatMap = {
      'default': () => {
        // log the request and respond with 406
        res.status(406).send('Not Acceptable');
      },
    };
    for (const [mimeType, format] of mimeType2Format) {
      formatMap[mimeType] = () => {
        res.send(stringifiers[format](req.body));
      };
    }
    res.format(formatMap);
  }
});

module.exports.handler = server(app);
