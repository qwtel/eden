module.exports = {
    readStream(stream, encoding = 'utf8') {
        let input = Buffer.alloc(0);
        return new Promise(resolve => stream
            .on('data', data => (input = Buffer.concat([input, data])))
            .on('end', () => resolve(input))
        );
    },

    fromEntries(entries) {
        let obj = Object.create(null);
        for (let [k, v] of entries) obj[k] = v;
        return obj;
    },

    hurl(url, params = {}) {
        const u = new URL(url);
        for (const [k, v] of Object.entries(params)) u.searchParams.append(k, v);
        return u;
    },
};