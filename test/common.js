'use strict';

const Path = require('path');

module.exports = {
    fixtures: {
        amazonHomepage: Path.resolve(__dirname, 'fixtures', 'amazonHomepage.txt'),
        compressionArticle: Path.resolve(__dirname, 'fixtures', 'compressionArticle.txt'),
        lorem: Path.resolve(__dirname, 'fixtures', 'lorem.txt')
    }
};
