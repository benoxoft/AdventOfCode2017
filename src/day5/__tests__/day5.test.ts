/*
(0) 3  0  1  -3  - before we have taken any steps.
(1) 3  0  1  -3  - jump with offset 0 (that is, don't jump at all). Fortunately, the instruction is then incremented to 1.
 2 (3) 0  1  -3  - step forward because of the instruction we just modified. The first instruction is incremented again, now to 2.
 2  4  0  1 (-3) - jump all the way to the end; leave a 4 behind.
 2 (4) 0  1  -2  - go back to where we just were; increment -3 to -2.
 2  5  0  1  -2  - jump 4 steps forward, escaping the maze.
 */
import {getPuzzleInput} from "./puzzle-input";
import {findSteps, findSteps2, parseInput} from "../day5";

const EXAMPLE_PUZZLE = `0
3
0
1
-3`;

test("In this example, the exit is reached in 5 steps.", () => {
    expect(findSteps(parseInput(EXAMPLE_PUZZLE))).toBe(5);
});

test("In this example, the exit is reached in 10 steps.", () => {
    expect(findSteps2(parseInput(EXAMPLE_PUZZLE))).toBe(10);
});

console.log("Answer: ", findSteps2(parseInput(getPuzzleInput())))