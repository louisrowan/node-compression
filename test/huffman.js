'use strict';

const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Fs = require('fs');
const Huffman = require('../lib/huffman');
const Common = require('./common');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;


describe('Huffman', () => {

    it('shortens text', (done) => {

        const originalData = Fs.readFileSync(Common.fixtures.lorem).toString();

        const result = Huffman.compress(Hoek.clone(originalData));
        expect(result.compressed).to.exist();
        expect(result.map).to.exist();

        const originalInBinary = Common.toBinary(originalData);
        const bitDifference = originalInBinary.length - result.compressed.length;
        expect(bitDifference).to.be.above(0);

        done();
    });

    it('decompresses text to original form with no lost data', (done) => {

        const originalData = Fs.readFileSync(Common.fixtures.lorem).toString();
        const { compressed, map } = Huffman.compress(Hoek.clone(originalData));

        const originalInBinary = Common.toBinary(originalData);
        const bitDifference = originalInBinary.length - compressed.length;
        expect(bitDifference).to.be.above(0);

        const decompressed = Huffman.decompress(compressed, map);
        expect(originalData.length).to.equal(decompressed.length);
        expect(originalData).to.equal(decompressed);

        done();
    });
});
