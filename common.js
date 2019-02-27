module.exports = {
    readStream(stream, encoding = 'utf8') {
        let input = Buffer.alloc(0);
        return new Promise(resolve => stream
            .on('data', data => (input = Buffer.concat([input, data])))
            .on('end', () => resolve(input.toString(encoding)))
        );
    },

    fromEntries(entries) {
        let obj = Object.create(null);
        for (let [k,v] of entries) obj[k] = v;
        return obj;
    },
};