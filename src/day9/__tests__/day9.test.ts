import {getPuzzleInput} from "./puzzle-input";
import {findGarbageCount, findScore, removeGarbageFromString} from "../day9";

test("<>, empty garbage.", () => {
    expect(removeGarbageFromString("<>")[0]).toBe("");
});

test("<random characters>, garbage containing random characters.", () => {
    expect(removeGarbageFromString("<random characters>")[0]).toBe("");
});

test("<<<<>, because the extra < are ignored.", () => {
    expect(removeGarbageFromString("<<<<>")[0]).toBe("");
});

test("<{!>}>, because the first > is canceled.", () => {
    expect(removeGarbageFromString("<{!>}>")[0]).toBe("");
});

test("<!!>, because the second ! is canceled, allowing the > to terminate the garbage.", () => {
    expect(removeGarbageFromString("<!!>")[0]).toBe("");
});

test("<!!!>>, because the second ! and the first > are canceled.", () => {
    expect(removeGarbageFromString("<!!!>>")[0]).toBe("");
});

test('<{o"i!a,<{i<a>, which ends at the first >.', () => {
    expect(removeGarbageFromString("<{o\"i!a,<{i<a>")[0]).toBe("");
});

test(" expect {<a>,<a>,<a>,<a>} to be {}", () => {
    expect(removeGarbageFromString("{<a>,<a>,<a>,<a>}")[0]).toBe("{,,,}");
});

test("{}, score of 1.", () => {
    expect(findScore("{}")).toBe(1);
});

test("{{{}}}, score of 1 + 2 + 3 = 6.", () => {
    expect(findScore("{{{}}}")).toBe(6);
});

test("{{},{}}, score of 1 + 2 + 2 = 5.", () => {
    expect(findScore("{{},{}}")).toBe(5);
});

test("{{{},{},{{}}}}, score of 1 + 2 + 3 + 3 + 3 + 4 = 16.", () => {
    expect(findScore("{{{},{},{{}}}}")).toBe(16)
});

test("{<a>,<a>,<a>,<a>}, score of 1.", () => {
    expect(findScore("{<a>,<a>,<a>,<a>}")).toBe(1);
});

test("{{<ab>},{<ab>},{<ab>},{<ab>}}, score of 1 + 2 + 2 + 2 + 2 = 9.", () => {
    expect(findScore("{{<ab>},{<ab>},{<ab>},{<ab>}}")).toBe(9);
});

test("{{<!!>},{<!!>},{<!!>},{<!!>}}, score of 1 + 2 + 2 + 2 + 2 = 9.", () => {
    expect(findScore("{{<!!>},{<!!>},{<!!>},{<!!>}}")).toBe(9);
});

test("{{<a!>},{<a!>},{<a!>},{<ab>}}, score of 1 + 2 = 3.", () => {
    expect(findScore("{{<a!>},{<a!>},{<a!>},{<ab>}}")).toBe(3);
});

test("<>, 0 characters.", () => {
    expect(findGarbageCount("<>")).toBe(0);
});

test("<random characters>, 17 characters.", () => {
    expect(findGarbageCount("<random characters>")).toBe(17);
});

test("<<<<>, 3 characters.", () => {
    expect(findGarbageCount("<<<<>")).toBe(3);
});

test("<{!>}>, 2 characters.", () => {
    expect(findGarbageCount("<{!>}>")).toBe(2);
});

test("<!!>, 0 characters.", () => {
    expect(findGarbageCount("<!!>")).toBe(0);
});

test("<!!!>>, 0 characters.", () => {
    expect(findGarbageCount("<!!!>>")).toBe(0);
});

test('<{o"i!a,<{i<a>, 10 characters.', () => {
    expect(findGarbageCount('<{o"i!a,<{i<a>')).toBe(10);
});

console.log("Answer 1: ", findScore(getPuzzleInput()));
console.log("Answer 2: ", findGarbageCount(getPuzzleInput()));