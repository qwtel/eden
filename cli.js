#!/usr/bin/env node --no-warnings

const minimist = require('minimist');
const { extname } = require('path');
const { readFile } = require('fs').promises;

const cv = require('./eden.js');
const { readStream } = require('./common.js');

const argv = minimist(process.argv.slice(2), {
    alias: {
        p: 'parse',
        s: 'stringify',
        f: 'parse',
        t: 'stringify',
        from: 'parse',
        to: 'stringify',
    },
});

const ext2Format = {
    '.yml': 'YAML',
    '.edn': 'EDN',
    '.toml': 'TOML',
    '.csv': 'CSV',
    '.xml': 'XML',
    '.json': 'JSON',
};

const format2F = {
    YAML: [cv.parseYAML, cv.stringifyYAML],
    YML: [cv.parseYAML, cv.stringifyYAML],
    EDN: [cv.parseEDN, cv.stringifyEDN],
    TOML: [cv.parseTOML, cv.stringifyTOML],
    CSV: [cv.parseCSV, cv.stringifyCSV],
    XML: [cv.parseXML, cv.stringifyXML],
    JSON: [cv.parseJSON, cv.stringifyJSON],
    JS: [cv.parseJSON, cv.stringifyJSON],
    URL: [cv.parseURL, cv.stringifyURL],
};

(async () => {
    const [file] = argv._;

    let content, source, target;
    if (!file) {
        content = await readStream(process.stdin);
        source = argv.parse;
        target = argv.stringify;
    } else {
        content = await readFile(file, 'utf8');
        source = argv.parse || ext2Format[extname(file)];
        target = argv.stringify;
    }

    const [parse] = format2F[source.toUpperCase()];
    const [, stringify] = format2F[target.toUpperCase()];

    const result = stringify(await parse(content));

    process.stdout.write(result);
    process.exit(0);
})();