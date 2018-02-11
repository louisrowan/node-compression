'use strict';

const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Fs = require('fs');
const Huffman = require('../lib/huffman');
const Common = require('./common');

// Declare internals

const internals = {
    toBinary: (data) => {

        const toBinary = (char) => {

            const code = char.charCodeAt(0);
            const ret = code.toString(2).padStart(7, '0');
            return ret;
        };

        let originalInBinary = '';
        for (let i = 0; i < data.length; ++i) {

            const char = data[i];
            originalInBinary += toBinary(char);
        }
        return originalInBinary;
    },
    toAscii: (originalInBinary) => {

        const binaryToAscii = (bi) => {

            const ascii = parseInt(bi, 2).toString(10);
            const ret = String.fromCharCode(ascii);
            return ret;
        };

        let asAscii = '';
        for (let i = 0; i < originalInBinary.length; i += 7) {
            const byte = originalInBinary.substring(i, i + 7);
            asAscii += binaryToAscii(byte);
        }
        return asAscii;
    }
};

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

        const originalInBinary = internals.toBinary(originalData);
        const bitDifference = originalInBinary.length - result.compressed.length;
        expect(bitDifference).to.be.above(0);

        done();
    });

    it('decompresses text to original form with no lost data', (done) => {

        const originalData = Fs.readFileSync(Common.fixtures.lorem).toString();
        const { compressed, map } = Huffman.compress(Hoek.clone(originalData));

        const originalInBinary = internals.toBinary(originalData);
        const bitDifference = originalInBinary.length - compressed.length;
        expect(bitDifference).to.be.above(0);

        const decompressed = Huffman.decompress(compressed, map);
        expect(originalData.length).to.equal(decompressed.length);
        expect(originalData).to.equal(decompressed);

        done();
    });
});
