"use strict";
/*
    if(currentPostion + length >= numberList.length) {
        const beginning = numberList.slice(currentPostion);
        const end = numberList.slice(0, length - beginning.length);
        let newarray: number[];
        if(numberList.length > length) {
            newarray = end.concat(beginning);
        } else {
            newarray = beginning.concat(end);
        }

        console.log("beginning: ", beginning, "end: ", end, "newarray: ", newarray);
        newarray.reverse();
        if(numberList.length > length) {
            for(let i=0;i<beginning.length;i++) {
                numberList[i] = newarray[i];
            }
            for(let i=0;i<end.length;i++) {
                const pos = numberList.length - end.length + i;
                numberList[pos] = newarray[beginning.length + i];
            }

        } else {
            for(let i=0;i<end.length;i++) {
                numberList[i] = newarray[i];
            }
            for(let i=0;i<beginning.length;i++) {
                const pos = numberList.length - beginning.length + i;
                numberList[pos] = newarray[end.length + i];
            }
        }
    } else {
        const section = numberList.slice(currentPostion, currentPostion + length);
        section.reverse();
        for(let i=0;i<section.length;i++) {
            numberList[currentPostion + i] = section[i];
        }
    }

 */
exports.__esModule = true;
function createNumberList(total) {
    if (total === void 0) { total = 256; }
    var numberList = new Array();
    for (var i = 0; i < total; i++) {
        numberList.push(i);
    }
    return numberList;
}
exports.createNumberList = createNumberList;
function tieKnot(numberList, currentPostion, length) {
    var section = new Array();
    for (var i = 0; i < length; i++) {
        if (currentPostion + i < numberList.length) {
            section.push(numberList[currentPostion + i]);
        }
        else {
            section.push(numberList[currentPostion + i - numberList.length]);
        }
    }
    section.reverse();
    //console.log(section);
    for (var i = 0; i < length; i++) {
        if (currentPostion + i < numberList.length) {
            numberList[currentPostion + i] = section[i];
        }
        else {
            numberList[currentPostion + i - numberList.length] = section[i];
        }
    }
    return numberList;
}
exports.tieKnot = tieKnot;
function convertToAscii(input) {
    var retval = new Array();
    for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var c = input_1[_i];
        retval.push(c.charCodeAt(0));
    }
    return retval;
}
exports.convertToAscii = convertToAscii;
function convertToDenseHash(numberList) {
    var denseHash = new Array();
    for (var i = 0; i < 16; i++) {
        var dh = numberList[16 * i];
        for (var j = 1; j < 16; j++) {
            dh ^= numberList[16 * i + j];
        }
        denseHash.push(dh);
    }
    return denseHash;
}
exports.convertToDenseHash = convertToDenseHash;
function convertToHexaString(numberList) {
    console.log(numberList);
    var retval = "";
    for (var _i = 0, numberList_1 = numberList; _i < numberList_1.length; _i++) {
        var c = numberList_1[_i];
        var hexc = (+c).toString(16);
        if (hexc.length === 1) {
            hexc = "0" + hexc;
        }
        retval += hexc;
    }
    return retval;
}
exports.convertToHexaString = convertToHexaString;
function part2(numberList, input) {
    var lengths = convertToAscii(input).concat([17, 31, 73, 47, 23]);
    var currentPosition = 0;
    var skipSize = 0;
    for (var j = 0; j < 64; j++) {
        for (var i = 0; i < lengths.length; i++) {
            numberList = tieKnot(numberList, currentPosition, lengths[i]);
            currentPosition += lengths[i] + skipSize;
            while (currentPosition > numberList.length) {
                currentPosition -= numberList.length;
            }
            skipSize++;
        }
    }
    return convertToHexaString(convertToDenseHash(numberList));
}
exports.part2 = part2;
function part1(numberList, lengths) {
    var currentPosition = 0;
    var skipSize = 0;
    for (var i = 0; i < lengths.length; i++) {
        numberList = tieKnot(numberList, currentPosition, lengths[i]);
        currentPosition += lengths[i] + skipSize;
        while (currentPosition > numberList.length) {
            currentPosition -= numberList.length;
        }
        skipSize++;
    }
    return [numberList[0], numberList[1]];
}
exports.part1 = part1;
