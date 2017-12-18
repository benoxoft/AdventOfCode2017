import {part1, part2, SpinLock} from "../day17";

const PUZZLE_INPUT = 344;

/*
(0)
0 (1)
0 (2) 1
0  2 (3) 1
0  2 (4) 3  1
0 (5) 2  4  3  1
0  5  2  4  3 (6) 1
0  5 (7) 2  4  3  6  1
0  5  7  2  4  3 (8) 6  1
0 (9) 5  7  2  4  3  8  6  1
*/

test("SpinLock", () => {

    const s = new SpinLock(3);
    s.spin();
    expect(s.position).toBe(1);
    expect(s.processOrderedBuffer()).toEqual([0, 1]);
    s.spin();
    expect(s.position).toBe(1);
    expect(s.processOrderedBuffer()).toEqual([0, 2, 1]);
    s.spin();
    expect(s.position).toBe(2);
    expect(s.processOrderedBuffer()).toEqual([0, 2, 3, 1]);
    s.spin();
    expect(s.position).toBe(2);
    expect(s.processOrderedBuffer()).toEqual([0, 2, 4, 3, 1]);
    s.spin();
    expect(s.position).toBe(1);
    expect(s.processOrderedBuffer()).toEqual([0, 5, 2, 4, 3, 1]);
    s.spin();
    expect(s.position).toBe(5);
    expect(s.processOrderedBuffer()).toEqual([0, 5, 2, 4, 3, 6, 1]);
});

test("part 1", () => {
   expect(part1(3)).toBe(638);
});

//console.log("Answer 1: ", part1(PUZZLE_INPUT));
//console.log("Answer 2: ", part2(PUZZLE_INPUT));