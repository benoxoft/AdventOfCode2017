import {findStepAfterValue} from "../day3";

const PUZZLE_INPUT = 312051;

test("Data match example", () => {
    expect(findStepAfterValue(2)).toBe(4);
    expect(findStepAfterValue(11)).toBe(23);
    expect(findStepAfterValue(54)).toBe(57);
    expect(findStepAfterValue(122)).toBe(133);
    expect(findStepAfterValue(147)).toBe(304);
    expect(findStepAfterValue(362)).toBe(747);
    expect(findStepAfterValue(880)).toBe(931);
});

console.log("Answer: ", findStepAfterValue(PUZZLE_INPUT));
