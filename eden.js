'use strict';

const { promisify } = require('util');

function stringifyJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

function parseJSON(buffer) {
  return JSON.parse(buffer);
}

function parseTOML(buffer) {
  const toml = require('@iarna/toml');
  return toml.parse(buffer);
}

function stringifyTOML(obj) {
  const toml = require('@iarna/toml');
  return toml.stringify(obj);
}

function parseEDN(buffer) {
  const raw = buffer.toString('utf8');
  const { read_edn } = require('./pprint/main.js').pprint.core;
  return read_edn(raw);
}

function stringifyEDN(obj) {
  const { write_edn } = require('./pprint/main.js').pprint.core;
  return write_edn(obj);
}

function parseYAML(buffer) {
  const yaml = require('js-yaml');
  return yaml.safeLoad(buffer);
}

function stringifyYAML(obj) {
  const yaml = require('js-yaml');
  return yaml.safeDump(obj);
}

async function parseXML(buffer) {
  const parseString = promisify(require('xml2js').parseString);
  return await parseString(buffer, {
    explicitRoot: false,
    explicitArray: false,
    ignoreAttrs: true,
  });
}

function stringifyXML(obj) {
  const { Builder } = require('xml2js');
  const builder = new Builder();
  return builder.buildObject(obj);
}

async function parseCSV(buffer) {
  const neatCSV = require('neat-csv');
  return (await neatCSV(buffer, {
    mapHeaders: ({ header }) => header.trim().toLowerCase(),
    mapValues: ({ value }) => isNaN(value) ? value : Number(value),
  })).map(row => ({ ...row }));
}

function stringifyCSV(obj) {
  const json2csv = require('json2csv').parse;
  return json2csv(obj, {
    flatten: true,
    // quote: '',
  });
}

function parseURL(buffer) {
  const qs = require('qs');
  return qs.parse(buffer);
}

function stringifyURL(obj) {
  const qs = require('qs');
  return qs.stringify(obj);
}

module.exports = {
  parseJSON, stringifyJSON,
  parseXML, stringifyXML,
  parseTOML, stringifyTOML,
  parseYAML, stringifyYAML,
  parseEDN, stringifyEDN,
  parseCSV, stringifyCSV,
  parseURL, stringifyURL,
};

module.exports.parsers = {
  yaml: parseYAML,
  yml: parseYAML,
  edn: parseEDN,
  toml: parseTOML,
  csv: parseCSV,
  xml: parseXML,
  json: parseJSON,
  js: parseJSON,
  url: parseURL,
};

module.exports.stringifiers = {
  yaml: stringifyYAML,
  yml: stringifyYAML,
  edn: stringifyEDN,
  toml: stringifyTOML,
  csv: stringifyCSV,
  xml: stringifyXML,
  json: stringifyJSON,
  js: stringifyJSON,
  url: stringifyURL,
};