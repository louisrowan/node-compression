'use strict';

class Huffman {

    constructor (str) {

        this.data = str;
        this.characterMap = this.createCharacterMap();
        this.huffmanTree = this.createTree();
        this.encodedMap = this.createEncodedMap(this.characterMap);
    }

    createCharacterMap () {

        const characterMap = {};
        for (let i = 0; i < this.data.length; ++i) {

            const char = this.data[i];
            characterMap[char] ? ++characterMap[char] : characterMap[char] = 1;
        }
        return characterMap;
    }

    transformMap (map) {

        const returnArr = [];
        Object.keys(map).forEach((k) => {

            returnArr.push({ value: map[k], char: k })
        })
        return returnArr;
    }

    createTree () {

        const transformedMap = this.transformMap(this.characterMap);
        while (transformedMap.length > 1) {

            this.findLowestTwo(transformedMap);
        }

        return transformedMap[0];
    }

    createEncodedMap (characterMap) {

        const encodedMap = {};

        Object.keys(characterMap).forEach((char) => {

            encodedMap[char] = this.getCode(this.huffmanTree, char);
        })
        return encodedMap;
    }

    findLowestTwo (arr) {

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
        })
    }

    getCode (tree, char, path = '') {

        if (tree.char === char) {
            return path;
        }
        else {
            Object.keys(tree.children).forEach((binary) => {

                const child = tree.children[binary];

                if (child.char.includes(char)) {
                    path += binary;
                    path = this.getCode(child, char, path);
                }
            })
        }
        return path;
    }

    encode () {

        let encodedStr = '';
        for (let i = 0; i < this.data.length; ++i) {

            const char = this.data[i];
            encodedStr += this.encodedMap[char];
        };
        return encodedStr;
    }

    decode (encoded) {

        const reverseEncodedMap = {};
        Object.keys(this.encodedMap).forEach((k) => {

            const binary = this.encodedMap[k];
            reverseEncodedMap[binary] = k;
        });

        let decodedStr = '';
        let currentChar = '';
        for (let i = 0; i < encoded.length; ++i) {

            const char = encoded[i];
            currentChar += char;
            if (reverseEncodedMap[currentChar]) {
                decodedStr += reverseEncodedMap[currentChar];
                currentChar = '';
            }
        };
        return decodedStr;
    }
}


const fs = require('fs');

const data = fs.readFileSync('./text.txt').toString();


const t = new Huffman(data);
const encoded = t.encode();


const toBinary = (char) => {

    const code = char.charCodeAt(0);
    const ret = code.toString(2).padStart(7, '0')
    return ret;
}

let originalInBinary = '';
for (let i = 0; i < data.length; ++i) {

    const char = data[i];
    originalInBinary += toBinary(char);
}




// console.log('encoded:', encodedStr);
// console.log('decoded:', decodedStr);
// console.log('');
console.log('encoded length', encoded.length);
console.log('original length with no encoding', originalInBinary.length);




const binaryToAscii = (binary) => {

    const ascii = parseInt(binary, 2).toString(10);
    const ret = String.fromCharCode(ascii)
    return ret;
}

let backToOriginal = '';
for (let i = 0; i < originalInBinary.length; i += 7) {
    const byte = originalInBinary.substring(i, i + 7);
    backToOriginal += binaryToAscii(byte);
}

// console.log(backToOriginal);

