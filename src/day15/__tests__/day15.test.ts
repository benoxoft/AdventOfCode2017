// Generator A starts with 618
// Generator B starts with 814

import {compare, generatorA, generatorB, judge} from "../day15";

test("generator A with value 65", () => {
    const gen = generatorA(65);
    expect(gen.next().value).toBe(1092455);
    expect(gen.next().value).toBe(1181022009);
    expect(gen.next().value).toBe(245556042);
    expect(gen.next().value).toBe(1744312007);
    expect(gen.next().value).toBe(1352636452);
});

test("generator B with value 8921", () => {
   const gen = generatorB(8921);
    expect(gen.next().value).toBe(430625591);
    expect(gen.next().value).toBe(1233683848);
    expect(gen.next().value).toBe(1431495498);
    expect(gen.next().value).toBe(137874439);
    expect(gen.next().value).toBe(285222916);
});

test("binary comparison", () => {
    const genA = generatorA(65);
    const genB = generatorB(8921);
    expect(compare(genA.next().value, genB.next().value)).toBeFalsy();
    expect(compare(genA.next().value, genB.next().value)).toBeFalsy();
    expect(compare(genA.next().value, genB.next().value)).toBeTruthy();
    expect(compare(genA.next().value, genB.next().value)).toBeFalsy();
    expect(compare(genA.next().value, genB.next().value)).toBeFalsy();
});

//console.log("Answer 1: ", judge(generatorA(618), generatorB(814)));
console.log("Answer 2: ", judge(generatorA(618, false), generatorB(814, false)));
