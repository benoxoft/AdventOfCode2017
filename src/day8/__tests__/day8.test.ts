import {findLargestRegister, Instruction, parseInput, Register} from "../day8";
import {getPuzzleInput} from "./puzzle-input";

const EXAMPLE: string = `b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`;

test("the largest value in any register is 1.", () => {
   expect(findLargestRegister(EXAMPLE)).toEqual([1, 10]);
});

test("line is parsed correctly", () => {
    const insts = parseInput("a inc 1 if b < 5");
    expect(insts.length).toBe(1);
    const inst = insts[0];
    expect(inst.affectedVariable).toBe("a");
    expect(inst.action).toBe("inc");
    expect(inst.amount).toBe(1);
    expect(inst.leftvar).toBe("b");
    expect(inst.rightvar).toBe("5");
    expect(inst.operation).toBe("<");
    const register: Register = {};
    expect(inst.evalCondition(register)).toBe(true);
    inst.modifyRegister(register);
    expect(register["a"]).toBe(1);
    register["b"] = 10;
    expect(inst.evalCondition(register)).toBe(false);
    inst.modifyRegister(register);
    expect(register["a"]).toBe(1);
});

console.log("Answer: ", findLargestRegister(getPuzzleInput()));