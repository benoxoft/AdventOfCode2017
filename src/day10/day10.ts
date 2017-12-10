
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

export function createNumberList():number[] {
    let numberList = new Array<number>();
    for(let i=0;i<256;i++) {
        numberList.push(i);
    }
    return numberList;
}

export function tieKnot(numberList: number[], currentPostion: number, length: number): number[] {
    let section = new Array<number>();
    for(let i=0;i<length;i++) {
        if(currentPostion + i < numberList.length) {
            section.push(numberList[currentPostion+i]);
        } else {
            section.push(numberList[currentPostion+i-numberList.length]);
        }

    }
    section.reverse();
    //console.log(section);
    for(let i=0;i<length;i++) {
        if(currentPostion + i < numberList.length) {
            numberList[currentPostion+i] = section[i];
        } else {
            numberList[currentPostion+i-numberList.length] = section[i];
        }
    }
    return numberList;
}

export function convertToAscii(input: string): number[] {
    const retval = new Array<number>();
    for(const c of input) {
        retval.push(c.charCodeAt(0));
    }
    return retval;
}

export function convertToDenseHash(numberList: number[]) {
    const denseHash = new Array<number>();
    for(let i=0;i<16;i++) {
        let dh = numberList[16*i];
        for(let j=1;j<16;j++) {
            dh ^= numberList[16*i+j];
        }
        denseHash.push(dh);
    }
    return denseHash;
}

export function convertToHexaString(numberList: number[]): string {
    console.log(numberList);
    let retval = "";
    for(const c of numberList) {
        let hexc = (+c).toString(16);
        if(hexc.length === 1) {
            hexc = "0" + hexc;
        }
        retval += hexc;
    }
    return retval;
}

export function part2(numberList:number[], input: string) {
    const lengths = convertToAscii(input).concat([17, 31, 73, 47, 23]);
    let currentPosition = 0;
    let skipSize = 0;
    for(let j=0;j<64;j++) {
        for(let i=0;i<lengths.length;i++) {
            numberList = tieKnot(numberList, currentPosition, lengths[i]);
            currentPosition += lengths[i] + skipSize;
            while(currentPosition > numberList.length) {
                currentPosition -= numberList.length;
            }
            skipSize++;
        }
    }
    return convertToHexaString(convertToDenseHash(numberList));
}

export function part1(numberList: number[], lengths: number[]) {
    let currentPosition = 0;
    let skipSize = 0;
    for(let i=0;i<lengths.length;i++) {
        numberList = tieKnot(numberList, currentPosition, lengths[i]);
        currentPosition += lengths[i] + skipSize;
        while(currentPosition > numberList.length) {
            currentPosition -= numberList.length;
        }
        skipSize++;
    }
    return [numberList[0], numberList[1]];
}
