
/*
se + sw = s
ne + nw = n
sw + n = nw
n + se = ne
ne + s = se
s + nw = sw

n + s = 0
nw + se = 0
ne + sw = 0


 */

enum Direction {
    s = 0,
    sw,
    se,
    n,
    ne,
    nw
}

const directionParser = {
    s: Direction.s,
    sw: Direction.sw,
    se: Direction.se,
    n: Direction.n,
    ne: Direction.ne,
    nw: Direction.nw,
}

function parseInput(input: string): Direction[] {
    const retval = new Array<Direction>();
    for(const s of input.split(",")) {
        retval.push(directionParser[s]);
    }
    return retval;
}

function reduceOpposites(input: Direction[], dir1: Direction, dir2: Direction): Direction[] {
    let count1 = 0;
    let count2 = 0;
    for(const dir of input) {
        if(dir === dir1) {
            count1++;
        }  else if(dir === dir2) {
            count2++;
        }
    }
    let deletables1 = Math.min(count2, count1);
    let deletables2 = deletables1;
    const retval = new Array<Direction>();
    for(let i=0;i<input.length;i++) {
        if(input[i] === dir1 && deletables1 > 0) {
            deletables1--;
        } else if(input[i] === dir2 && deletables2 > 0) {
            deletables2--;
        } else {
            retval.push(input[i]);
        }
    }
    return retval;
}

function reduceNS(input: Direction[]): Direction[] {
    return reduceOpposites(input, Direction.n, Direction.s);
}

function reduceNWSE(input: Direction[]): Direction[] {
    return reduceOpposites(input, Direction.nw, Direction.se);
}

function reduceNESW(input: Direction[]): Direction[] {
    return reduceOpposites(input, Direction.ne, Direction.sw);
}

function transformSimilars(input: Direction[], dir1: Direction, dir2: Direction, result: Direction): Direction[] {
    let count1 = 0;
    let count2 = 0;
    for(const dir of input) {
        if(dir === dir1) {
            count1++;
        }  else if(dir === dir2) {
            count2++;
        }
    }
    let deletables1 = Math.min(count2, count1);
    let deletables2 = deletables1;
    const retval = new Array<Direction>();
    for(let i=0;i<input.length;i++) {
        if(input[i] === dir1 && deletables1 > 0) {
            deletables1--;
        } else if(input[i] === dir2 && deletables2 > 0) {
            deletables2--;
            retval.push(result);
        } else {
            retval.push(input[i]);
        }
    }
    return retval;
}

function transformSESW(input: Direction[]): Direction[] {
    return transformSimilars(input, Direction.se, Direction.sw, Direction.s);
}
function transformNENW(input: Direction[]): Direction[] {
    return transformSimilars(input, Direction.ne, Direction.nw, Direction.n);
}
function transformSWN(input: Direction[]): Direction[] {
    return transformSimilars(input, Direction.sw, Direction.n, Direction.nw);
}
function transformNSE(input: Direction[]): Direction[] {
    return transformSimilars(input, Direction.n, Direction.se, Direction.ne);
}
function transformNES(input: Direction[]): Direction[] {
    return transformSimilars(input, Direction.ne, Direction.s, Direction.se);
}
function transformSNW(input: Direction[]): Direction[] {
    return transformSimilars(input, Direction.s, Direction.nw, Direction.sw);
}

export function innerReducePath(paths: Direction[]): number {
    let length = 0;
    while(length !== paths.length) {
        length = paths.length;

        paths = reduceNESW(paths);
        paths = reduceNS(paths);
        paths = reduceNWSE(paths);
        paths = transformNENW(paths);
        paths = transformNES(paths);
        paths = transformNSE(paths);
        paths = transformSESW(paths);
        paths = transformSNW(paths);
        paths = transformSWN(paths);
    }

    return paths.length;
}
export function reducePath(input: string): number {
    let paths = parseInput(input);
    return innerReducePath(paths);
}

export function farthestAway(input: string): number {
    let parsed: Direction[] = parseInput(input);
    let longestDistance = 0;
    for(let i=2;i<parsed.length;i++) {
        const slice: Direction[] = parsed.slice(0, i);
        const distance = innerReducePath(slice);
        if(distance > longestDistance) {
            longestDistance = distance;
        }
    }
    return longestDistance;
}
