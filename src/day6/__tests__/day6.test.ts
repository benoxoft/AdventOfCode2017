import {findLoop} from "../day6";

const PUZZLE_INPUT: number[] = [14, 0, 15, 12, 11, 11, 3, 5, 1, 6, 8, 4, 9, 1, 8, 4];

test("The banks start with 0, 2, 7, and 0 blocks", () => {
   expect(findLoop([0, 2, 7, 0])[1]).toBe(5);
});

let [manager, answer] = findLoop(PUZZLE_INPUT);
console.log("Answer1: ", answer);
[manager, answer] = findLoop(manager.exportData());
console.log("Answer1: ", answer);
