'use strict';

const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Fs = require('fs');
const WordReplace = require('../lib/wordReplace');
const Huffman = require('../lib/huffman');
const Common = require('./common');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;


describe('Integration', () => {

    it('compresses with word replace and then huffman', (done) => {

        Object.keys(Common.fixtures).forEach((k) => {

            const fixture = Common.fixtures[k];

            const originalData = Fs.readFileSync(fixture).toString();

            // wordReplace
            const wordReplaceResult = WordReplace.compress(Hoek.clone(originalData));
            const wordReplaceCompressed = wordReplaceResult.compressed;
            const wordReplaceMap = wordReplaceResult.map;

            const originalInBinary = Common.toBinary(originalData);
            const wordReplaceCompressedInBinary = Common.toBinary(wordReplaceCompressed);

            const bitDifferenceWordReplace = originalInBinary.length - wordReplaceCompressedInBinary.length;
            expect(bitDifferenceWordReplace).to.be.above(0);

            // huffman
            const HuffmanResult = Huffman.compress(Hoek.clone(wordReplaceCompressed));
            const HuffmanCompressed = HuffmanResult.compressed;
            const HuffmanMap = HuffmanResult.map;

            const bitDifferenceHuffman = wordReplaceCompressedInBinary.length - HuffmanCompressed.length;
            expect(bitDifferenceHuffman).to.be.above(0);

            // decompress
            const decompressedAfterHuffman = Huffman.decompress(HuffmanCompressed, HuffmanMap);
            const final = WordReplace.decompress(decompressedAfterHuffman, wordReplaceMap);

            expect(final.length).to.equal(originalData.length);
            expect(final).to.equal(originalData);

            console.log('');
            console.log('fixture:', fixture);
            console.log('original in bits:', originalInBinary.length);
            console.log('after wordReplace:', wordReplaceCompressedInBinary.length);
            console.log('after huffman:', HuffmanCompressed.length);
            console.log('and after decompression', Common.toBinary(final).length);
            const totalDecrease = originalInBinary.length - HuffmanCompressed.length;
            const percChange = Math.round(100 * (totalDecrease / originalInBinary.length));
            console.log('total compression:', totalDecrease, 'bits, a decrease of ', percChange + '%');
        });

        done();
    });
});
