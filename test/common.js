'use strict';

const Path = require('path');

module.exports = {
    fixtures: {
        amazonHomepage: Path.resolve(__dirname, 'fixtures', 'amazonHomepage.txt'),
        compressionArticle: Path.resolve(__dirname, 'fixtures', 'compressionArticle.txt'),
        lorem: Path.resolve(__dirname, 'fixtures', 'lorem.txt')
    },
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
