'use strict';

const { promisify } = require('util');

exports.stringifyJSON = function stringifyJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

exports.parseJSON = function parseJSON(buffer) {
  return JSON.parse(buffer);
}

exports.parseTOML = function parseTOML(buffer) {
  const toml = require('@iarna/toml');
  return toml.parse(buffer);
}

exports.stringifyTOML = function stringifyTOML(obj) {
  const toml = require('@iarna/toml');
  return toml.stringify(obj);
}

exports.parseEDN = function parseEDN(buffer) {
  const raw = buffer.toString('utf8');
  const { read_edn } = require('./pprint/main.js').pprint.core;
  return read_edn(raw);
}

exports.stringifyEDN = function stringifyEDN(obj) {
  const { write_edn } = require('./pprint/main.js').pprint.core;
  return write_edn(obj);
}

exports.parseYAML = function parseYAML(buffer) {
  const yaml = require('js-yaml');
  return yaml.safeLoad(buffer);
}

exports.stringifyYAML = function stringifyYAML(obj) {
  const yaml = require('js-yaml');
  return yaml.safeDump(obj);
}

exports.parseXML = async function parseXML(buffer) {
  const parseString = promisify(require('xml2js').parseString);
  return await parseString(buffer, {
    explicitRoot: false,
    explicitArray: false,
    ignoreAttrs: true,
  });
}

exports.stringifyXML = function stringifyXML(obj) {
  const { Builder } = require('xml2js');
  const builder = new Builder();
  return builder.buildObject(obj);
}

exports.parseCSV = async function parseCSV(buffer) {
  const neatCSV = require('neat-csv');
  return (await neatCSV(buffer, {
    mapHeaders: ({ header }) => header.trim().toLowerCase(),
    mapValues: ({ value }) => isNaN(value) ? value : Number(value),
  })).map(row => ({ ...row }));
}

exports.stringifyCSV = function stringifyCSV(obj) {
  const json2csv = require('json2csv').parse;
  return json2csv(obj, {
    flatten: true,
    // quote: '',
  });
}

exports.parseURL = function parseURL(buffer) {
  const qs = require('qs');
  return qs.parse(buffer);
}

exports.stringifyURL = function stringifyURL(obj) {
  const qs = require('qs');
  return qs.stringify(obj);
}
