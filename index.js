'use strict';

const { promisify } = require('util');

// const server = process.env._HANDLER
//   ? require('serverless-http')
//   : app => require('http').createServer(app).listen(process.env.PORT || 3000);
const server = require('serverless-http');
const express = require('express');
const request = promisify(require('request'));

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

app.use((req, _, next) => {
  // TODO: Would be nice to have a yargs/minimist type library for query parameters
  const source = (req.query.parse || req.query.p || req.query.from || req.query.f || '').toLowerCase();

  if (source) {
    req.edenFormat = source;
  } else {
    for (const [mimeType, format] of mimeType2Format) {
      if (req.is(mimeType)) {
        req.edenFormat = format;
        break;
      }
    }
  }

  next();
});

app.use((req, res, next) => {
  // TODO: Would be nice to have a yargs/minimist type library for query parameters
  const target = (req.query.stringify || req.query.s || req.query.to || req.query.t || '').toLowerCase();

  if (target) {
    res.set('content-type', format2MIMEType[target]);
    res.edenFormat = target;
  } else {
    const formatMap = {
      'default': () => res.status(406).send('Not Acceptable'),
    };
    for (const [mimeType, format] of mimeType2Format) {
      formatMap[mimeType] = () => (res.edenFormat = format);
    }
    res.format(formatMap);
  }

  next();
});

app.post('/', async (req, res) => {
  // const body = await readStream(req);
  const obj = await parsers[req.edenFormat](req.body);
  const str = await stringifiers[res.edenFormat](obj);
  res.send(str);
});

app.all('/fetch', async (req, res) => {
  const {
    method,
    query: { url },
    // Remove problematic headers;
    // FIXME: handling headers is too damn hard...
    // headers: { 
    //   host, 
    //   connection, 
    //   'accept-encoding': _, 
    //   ...headers 
    // },
  } = req;

  let body = null;
  if (req.body) {
    // TODO: allow separate format for body e.g. TOML -> JSON -> EDN
    const obj = await parsers[res.edenFormat](req.body);
    body = await stringifiers[req.edenFormat](obj);
    headers['content-type'] = format2MIMEType[req.edenFormat];
  }

  console.log(body);

  const response = await request({ url, method, /* headers, */ body });

  const { 
    // Remove unwanted headers
    // FIXME: handling headers is too damn hard...
    // headers: { 
    //   'content-type': __,
    //   'content-length': ___,
    //   'transfer-encoding': ____, 
    //   ...headers2 
    // }, 
    body: body2, 
  } = response;

  const obj2 = await parsers[req.edenFormat](body2);
  const str2 = await stringifiers[res.edenFormat](obj2);
  // res.set(headers2);
  res.send(str2);
});

module.exports.handler = server(app);
