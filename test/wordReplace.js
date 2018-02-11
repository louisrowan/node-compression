'use strict';

const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Fs = require('fs');
const WordReplace = require('../lib/wordReplace');
const Common = require('./common');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;


describe('Word Replace', () => {

    it('shortens text', (done) => {

        const originalData = Fs.readFileSync(Common.fixtures.compressionArticle).toString();

        const result = WordReplace.compress(Hoek.clone(originalData));
        expect(result.compressed).to.exist();
        expect(result.map).to.exist();

        const bitDifference = originalData.length - result.compressed.length;
        expect(bitDifference).to.be.above(0);

        done();
    });

    it('decompresses text to original form with no lost data', (done) => {

        const originalData = Fs.readFileSync(Common.fixtures.compressionArticle).toString();

        const { compressed, map } = WordReplace.compress(Hoek.clone(originalData));
        const bitDifference = originalData.length - compressed.length;
        expect(bitDifference).to.be.above(0);

        const decompressed = WordReplace.decompress(compressed, map);

        expect(originalData.length).to.equal(decompressed.length);
        expect(originalData).to.equal(decompressed);

        done();
    });
});
