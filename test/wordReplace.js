'use strict';

const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const fs = require('fs');
const path = require('path');
const wordReplace = require('../lib/wordReplace');

// Declare internals

const internals = {
    fixtures: {
        amazonHomepage: path.resolve(__dirname, 'fixtures', 'amazonHomepage.txt'),
        compressionArticle: path.resolve(__dirname, 'fixtures', 'compressionArticle.txt')
    }
}


// Test shortcuts

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;


describe('Word Replace', () => {

    it('shortens text', (done) => {

        const originalData = fs.readFileSync(internals.fixtures.compressionArticle).toString();

        const result = wordReplace.compress(Hoek.clone(originalData));
        expect(result.compressed).to.exist();
        expect(result.map).to.exist();

        expect(result.compressed.length).to.be.below(originalData.length);
        done();
    });

    it('decompresses text to original form with no lost data', (done) => {

        const originalData = fs.readFileSync(internals.fixtures.compressionArticle).toString();

        const compressed = wordReplace.compress(Hoek.clone(originalData));
        expect(compressed.compressed.length).to.be.below(originalData.length);
        const decompressed = wordReplace.decompress(compressed.compressed, compressed.map);

        expect(originalData.length).to.equal(decompressed.length);
        expect(originalData).to.equal(decompressed);
        done();
    });
});