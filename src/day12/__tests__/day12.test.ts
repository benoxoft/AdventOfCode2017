import {getPuzzleInput} from "./puzzle-input";
import {findAllGroups, findGroup0Programs} from "../day12";

const EXAMPLE = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`;

test("Example", () => {
    expect(findGroup0Programs(EXAMPLE)).toBe(6);
    expect(findAllGroups(EXAMPLE)).toBe(2);
});

console.log("Answer 1: ", findGroup0Programs(getPuzzleInput()))
console.log("Answer 2: ", findAllGroups(getPuzzleInput()));