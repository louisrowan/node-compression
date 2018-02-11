'use strict';

const internals = {};

internals.createCharacterMap = (data) => {

    const characterMap = {};
    for (let i = 0; i < data.length; ++i) {

        const char = data[i];
        characterMap[char] ? ++characterMap[char] : characterMap[char] = 1;
    }

    return characterMap;
};


internals.transformMap = (map) => {

    const characterArray = [];
    Object.keys(map).forEach((k) => {

        characterArray.push({ value: map[k], char: k });
    });

    return characterArray;
};


internals.createTree = (transformedMap) => {

    while (transformedMap.length > 1) {

        internals.findLowestTwo(transformedMap);
    }

    return transformedMap[0];
};


internals.findLowestTwo = (arr) => {

    let lowest_a = {};
    let lowest_b = {};

    arr.forEach((obj) => {

        const value = obj.value;

        if (value < lowest_a.value || !lowest_a.value) {
            lowest_b = lowest_a;
            lowest_a = obj;
        }
        else if ( value < lowest_b.value || !lowest_b.value) {
            lowest_b = obj;
        }
    });

    const lowest_a_index = arr.findIndex((f) => f.char === lowest_a.char);
    arr.splice(lowest_a_index, 1);
    const lowest_b_index = arr.findIndex((f) => f.char === lowest_b.char);
    arr.splice(lowest_b_index, 1);
    arr.push({
        value: lowest_a.value + lowest_b.value,
        char: lowest_a.char + lowest_b.char,
        children: {
            '0': {
                value: lowest_a.value,
                char: lowest_a.char,
                children: lowest_a.children
            },
            '1': {
                value: lowest_b.value,
                char: lowest_b.char,
                children: lowest_b.children
            }
        }
    });
};


internals.createEncodedMap = (characterMap, tree) => {

    const encodedMap = {};

    Object.keys(characterMap).forEach((char) => {

        encodedMap[char] = internals.getCode(tree, char);
    });

    return encodedMap;
};


internals.getCode = (tree, char, path = '') => {

    if (tree.char === char) {
        return path;
    }

    Object.keys(tree.children).forEach((binary) => {

        const child = tree.children[binary];

        if (child.char.includes(char)) {
            path += binary;
            path = internals.getCode(child, char, path);
        }
    });

    return path;
};


exports.compress = (data) => {

    const characterMap = internals.createCharacterMap(data);
    const transformedMap = internals.transformMap(characterMap);
    const tree = internals.createTree(transformedMap);
    const encodedMap = internals.createEncodedMap(characterMap, tree);

    let compressed = '';
    for (let i = 0; i < data.length; ++i) {

        const char = data[i];
        compressed += encodedMap[char];
    };

    const reverseEncodedMap = {};
    Object.keys(encodedMap).forEach((k) => {

        const binary = encodedMap[k];
        reverseEncodedMap[binary] = k;
    });

    return {
        compressed: compressed, // eslint-disable-line
        map: reverseEncodedMap
    };
};


internals.binaryToAscii = (binary) => {

    const ascii = parseInt(binary, 2).toString(10);
    return String.fromCharCode(ascii);
};


exports.decompress = (compressed, map) => {

    let decompressed = '';
    let currentChar = '';
    for (let i = 0; i < compressed.length; ++i) {

        const char = compressed[i];
        currentChar += char;
        if (map[currentChar]) {
            decompressed += map[currentChar];
            currentChar = '';
        }
    };

    return decompressed;
};
