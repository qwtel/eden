#!/usr/bin/env node --no-warnings

const minimist = require('minimist');
const { extname } = require('path');
const { readFile } = require('fs').promises;

const eden = require('./eden.js');
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

    const parse = eden.parsers[source.toLowerCase()];
    const stringify = eden.stringifiers[target.toLowerCase()];

    const result = stringify(await parse(content));

    process.stdout.write(result);
    process.exit(0);
})();