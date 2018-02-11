'use strict';

const internals = {};

internals.asciiMap = () => {

    const asciiMap = {};
    for (let i = 32; i <= 126; ++i) {
        const code = String.fromCharCode(i);
        asciiMap[code] = true;
    }
    return asciiMap
};


exports.compress = (data) => {

    const asciiMap = internals.asciiMap();
    for (let i = 0; i < data.length; ++i) {
        const char = data[i];
        if (asciiMap[char]) {
            delete asciiMap[char]
        }
    };


    const split = data.split(' ');
    const wordMap = {};
    for (let i = 0; i < split.length; ++i) {

        const word = split[i];
        if (word.length < 3) {
            continue;
        }
        wordMap[word] ? ++wordMap[word] : wordMap[word] = 1;
    }

    const wordArray = [];
    Object.keys(wordMap).forEach((w) => {

        const count = wordMap[w];
        const length = w.length;

        wordArray.push({
            word: w,
            val: count * length
        });
    })

    const sorted = wordArray.sort((a, b) => a.val < b.val ? 1 : -1);
    const asciiArray = Array.from(Object.keys(asciiMap));

    const substitutionMap = {};
    const decodeKeyMap = {};
    for (let i = 0; i < Object.keys(asciiMap).length; ++i) {

        const sortedWord = sorted[i].word;
        substitutionMap[sortedWord] = asciiArray[i];
        decodeKeyMap[asciiArray[i]] = sortedWord;
    }

    let compressed = '';
    for (let i = 0; i < split.length; ++i) {

        const word = split[i];
        if (substitutionMap[word]) {
            compressed += substitutionMap[word];
        }
        else {
            compressed += word;
        }
        compressed += " ";
    }
    compressed = compressed.slice(0, -1);

    return {
        compressed: compressed,
        map: decodeKeyMap
    }
}

exports.decompress = (compressed, map) => {

    let decoded = '';
    for (let i = 0; i < compressed.length; ++i) {
        const char = compressed[i];
        if (map[char]) {
            decoded += map[char];
        }
        else {
            decoded += char;
        }
    }
    return decoded;
};
