import {convertToAscii, convertToDenseHash, createNumberList, part1, part2} from "../day10";

const PUZZLE_INPUT = [183,0,31,146,254,240,223,150,2,206,161,1,255,232,199,88];
const PUZZLE_STRING = "183,0,31,146,254,240,223,150,2,206,161,1,255,232,199,88";

test("Example", () => {
   expect(createNumberList().length).toBe(256);
   expect(part1([0,1,2,3,4], [3,4,1,5])).toEqual([3, 4]);
});

test("convertToAscii", () => {
   expect(convertToAscii("1,2,3")).toEqual([49,44,50,44,51]);
});

test("convertToDenseHash", () => {
   expect(convertToDenseHash([65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22])[0]).toBe(64);
});

test("AoC 2017 becomes 33efeb34ea91902bb2f59c9920caa6cd.", () => {
    expect(part2(createNumberList(), "AoC 2017")).toBe("33efeb34ea91902bb2f59c9920caa6cd");
});

test("1,2,3 becomes 3efbe78a8d82f29979031a4aa0b16a9d.", () => {
    expect(part2(createNumberList(), "1,2,3")).toBe("3efbe78a8d82f29979031a4aa0b16a9d");
});

const [i, j] = part1(createNumberList(), PUZZLE_INPUT);

console.log("Answer 1", i*j);
console.log("Answer 2: ", part2(createNumberList(), PUZZLE_STRING));