import {findSeverity, Layer, passThroughtFirewall} from "../day13";

const PUZZLE_INPUT = `0: 5
1: 2
2: 3
4: 4
6: 6
8: 4
10: 8
12: 6
14: 6
16: 14
18: 6
20: 8
22: 8
24: 10
26: 8
28: 8
30: 10
32: 8
34: 12
36: 9
38: 20
40: 12
42: 12
44: 12
46: 12
48: 12
50: 12
52: 12
54: 12
56: 14
58: 14
60: 14
62: 20
64: 14
66: 14
70: 14
72: 14
74: 14
76: 14
78: 14
80: 12
90: 30
92: 17
94: 18`;

test("The scanner should move around the layer", () => {
    const l = new Layer(0, 4);
    expect(l.scannerOnTop()).toBeTruthy();
    l.moveScanner();
    expect(l.scannerOnTop()).toBeFalsy();
    l.moveScanner();
    expect(l.scannerOnTop()).toBeFalsy();
    l.moveScanner();
    expect(l.scannerOnTop()).toBeFalsy();
    l.moveScanner();
    expect(l.scannerOnTop()).toBeFalsy();
    l.moveScanner();
    expect(l.scannerOnTop()).toBeFalsy();
    l.moveScanner();
    expect(l.scannerOnTop()).toBeTruthy();
});

test("Example", () => {

    const example = `0: 3
1: 2
4: 4
6: 4`;

    expect(findSeverity(example)).toBe(24);
    expect(passThroughtFirewall(example)).toBe(10);
});

//console.log("Answer 1: ", findSeverity(PUZZLE_INPUT));
console.log("Answer 2: ", passThroughtFirewall(PUZZLE_INPUT));