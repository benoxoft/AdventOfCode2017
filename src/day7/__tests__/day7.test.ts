import {getPuzzleInput} from "./puzzle-input";
import {balanceTower, findBaseProgram, parseInputString} from "../day7";

const EXAMPLE: string = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`;

test("Example", () => {
    expect(findBaseProgram(EXAMPLE).programName).toBe('tknk');
});

test("parseInputString", () => {
   console.log(parseInputString(EXAMPLE));
});

test("Balanced example", () => {
   expect(balanceTower(EXAMPLE)).toBe(60);
});

//console.log("Answer 1: ", findBaseProgram(getPuzzleInput()));
console.log("Answer 2: ", balanceTower(getPuzzleInput()));