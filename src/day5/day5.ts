"use strict";

export function parseInput(input: string): number[] {
    const numbers = input.split("\n");
    const retval = new Array<number>();
    for(const n of numbers) {
        retval.push(+n);
    }
    return retval;
}

export function findSteps(input: number[]) {
    let cursor = 0;
    let steps = 0;
    while(cursor >= 0 && cursor < input.length) {
        steps++;
        const nextCursor = cursor + input[cursor];
        input[cursor]++;
        cursor = nextCursor;
    }
    return steps;
}

export function findSteps2(input: number[]) {
    let cursor = 0;
    let steps = 0;
    while(cursor >= 0 && cursor < input.length) {
        steps++;
        const nextCursor = cursor + input[cursor];
        if(input[cursor] >= 3) {
            input[cursor]--;
        } else {
            input[cursor]++;
        }
        cursor = nextCursor;
    }
    return steps;
}
