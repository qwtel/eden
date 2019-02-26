'use strict';

const { promisify } = require('util');

exports.stringifyJSON = function stringifyJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

exports.parseJSON = function parseJS(stream) {
    return JSON.parse(stream);
}

exports.parseTOML = function parseTOML(stream) {
    const toml = require('@iarna/toml');
    return toml.parse(stream);
}

exports.stringifyTOML = function stringifyTOML(obj) {
    const toml = require('@iarna/toml');
    return toml.stringify(obj);
}

exports.parseEDN = function parseEDN(stream) {
    const raw = stream.toString('utf8');
    const { read_edn } = require('./pprint/main.js').pprint.core;
    return read_edn(raw);
}

exports.stringifyEDN = function stringifyEDN(obj) {
    const { write_edn } = require('./pprint/main.js').pprint.core;
    return write_edn(obj);
}

exports.parseYAML = function parseYAML(stream) {
    const yaml = require('js-yaml');
    return yaml.safeLoad(stream);
}

exports.stringifyYAML = function stringifyYAML(obj) {
    const yaml = require('js-yaml');
    return yaml.safeDump(obj);
}

exports.parseXML = async function parseXML(stream) {
    const parseString = promisify(require('xml2js').parseString);
    return await parseString(stream, {
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

