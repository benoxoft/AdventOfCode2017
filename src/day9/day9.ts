
function findGarbageString(startIndex: number, input: string): [string, number] {
    let count = 0;
    for(let i=startIndex+1;i<input.length;i++) {
        const c = input[i];
        if(c === "!") {
            i++;
            continue;
        } else if(c === ">") {
            return [input.substring(startIndex, i+1), count];
        }
        count++;
    }
}

export function removeGarbageFromString(input: string): [string, number] {
    let garbageCount = 0;
    for(let i=0;i<input.length;i++) {
        const c = input[i];
        if(c === "!") {
            i++;
            continue;
        } else if(c === "<") {
            const [garbage, count] = findGarbageString(i, input);
            garbageCount += count;
            input = input.replace(garbage, "");
        }
    }
    return [input, garbageCount];
}

export function findScore(input: string): number {
    const [cleanString, garbageCount] = removeGarbageFromString(input);
    let level = 0;
    let count = 0;
    for(const c of cleanString) {
        if(c === "{") {
            level++;
        } else if(c === "}") {
            count += level;
            level--;
        }
    }
    return count;
}

export function findGarbageCount(input: string): number {
    const [cleanString, garbageCount] = removeGarbageFromString(input);
    return garbageCount;
}