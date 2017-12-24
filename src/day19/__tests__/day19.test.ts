import {getPuzzleInput} from "./puzzle-input";
import {parseMap, DashRoute, PipeRoute, PlusRoute, BlankRoute, Direction, followRoute} from "../day19";

const EXAMPLE = `     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ `;

it("should return a correct map", () => {
    const routes = parseMap("-|+ ");
    expect(routes[0][0].getRightRoute()).toEqual(routes[0][1]);
    expect(routes[0][1].getRightRoute()).toEqual(routes[0][2]);
    expect(routes[0][1].getLeftRoute()).toEqual(routes[0][0]);

    expect(routes[0][0]).toBeInstanceOf(DashRoute);
    expect(routes[0][1]).toBeInstanceOf(PipeRoute);
    expect(routes[0][2]).toBeInstanceOf(PlusRoute);
    expect(routes[0][3]).toBeInstanceOf(BlankRoute);
});

it("should follow the horizontal route", () => {
    const routes = parseMap("---|-");
    expect(routes[0][0].getRightRoute()).toEqual(routes[0][1]);
    expect(routes[0][1].getRightRoute()).toEqual(routes[0][2]);
    expect(routes[0][1].getLeftRoute()).toEqual(routes[0][0]);

    expect(routes[0][0].travel(Direction.right, null)).toEqual([routes[0][1], Direction.right]);
    expect(routes[0][1].travel(Direction.right, null)).toEqual([routes[0][2], Direction.right]);
    expect(routes[0][2].travel(Direction.right, null)).toEqual([routes[0][4], Direction.right]);
    expect(routes[0][4].travel(Direction.right, null)).toEqual([undefined, Direction.right]);

    expect(routes[0][4].travel(Direction.left, null)).toEqual([routes[0][2], Direction.left]);
    expect(routes[0][2].travel(Direction.left, null)).toEqual([routes[0][1], Direction.left]);
    expect(routes[0][1].travel(Direction.left, null)).toEqual([routes[0][0], Direction.left]);


});

it("should follow the vertical route", () => {
    const routes = parseMap(`|
|
|
-
|`);
    expect(routes[0][0].getBottomRoute()).toBe(routes[1][0]);
    expect(routes[1][0].getBottomRoute()).toBe(routes[2][0]);
    expect(routes[1][0].getTopRoute()).toBe(routes[0][0]);
    expect(routes[2][0].getBottomRoute()).toBe(routes[3][0]);
    expect(routes[3][0].getTopRoute()).toBe(routes[2][0]);
    expect(routes[4][0].getBottomRoute()).toBe(undefined);

    expect(routes[0][0].travel(Direction.bottom, null)).toEqual([routes[1][0], Direction.bottom]);
    expect(routes[1][0].travel(Direction.bottom, null)).toEqual([routes[2][0], Direction.bottom]);
    expect(routes[2][0].travel(Direction.bottom, null)).toEqual([routes[4][0], Direction.bottom]);

    expect(routes[4][0].travel(Direction.top, null)).toEqual([routes[2][0], Direction.top]);
    expect(routes[2][0].travel(Direction.top, null)).toEqual([routes[1][0], Direction.top]);
    expect(routes[1][0].travel(Direction.top, null)).toEqual([routes[0][0], Direction.top]);

});

it("should turn accordingly", () => {
    const asciimap =
`|   
|   
+--+
   |`
   const routes = parseMap(asciimap);

    expect(routes[1][0].travel(Direction.bottom, null)).toEqual([routes[2][0], Direction.bottom]);
    expect(routes[2][0]).toBeInstanceOf(PlusRoute);
    expect(routes[2][1]).toBeInstanceOf(DashRoute);
    expect(routes[2][0].travel(Direction.bottom, null)).toEqual([routes[2][1], Direction.right]);
    expect(routes[2][0].travel(Direction.left, null)).toEqual([routes[1][0], Direction.top]);
    expect(routes[2][3].travel(Direction.right, null)).toEqual([routes[3][3], Direction.bottom]);
    expect(routes[2][3].travel(Direction.top, null)).toEqual([routes[2][2], Direction.left]);
});

it("should consider letters when traveling horizontally", () => {
    const routes = parseMap("--A--B-C-");
    const letterAggregator = new Array<string>();
    expect(routes[0][1].travel(Direction.right, letterAggregator)).toEqual([routes[0][3], Direction.right]);
    expect(letterAggregator.join("")).toBe("A");
    expect(routes[0][4].travel(Direction.right, letterAggregator)).toEqual([routes[0][6], Direction.right]);
    expect(letterAggregator.join("")).toBe("AB");
    expect(routes[0][8].travel(Direction.left, letterAggregator)).toEqual([routes[0][6], Direction.left]);
    expect(letterAggregator.join("")).toBe("ABC");
});

it("should consider letters when traveling vertically", () => {
    const asciiroute = `|
|
A
|
|
B
|
C
|`;
    const routes = parseMap(asciiroute);
    const letterAggregator = new Array<string>();
    expect(routes[1][0].travel(Direction.bottom, letterAggregator)).toEqual([routes[3][0], Direction.bottom]);
    expect(letterAggregator.join("")).toBe("A");
    expect(routes[4][0].travel(Direction.bottom, letterAggregator)).toEqual([routes[6][0], Direction.bottom]);
    expect(letterAggregator.join("")).toBe("AB");
    expect(routes[8][0].travel(Direction.top, letterAggregator)).toEqual([routes[6][0], Direction.top]);
    expect(letterAggregator.join("")).toBe("ABC");

});

it("should skip dash and find letter", () => {
    const asciiroute = `|
-
A
-
|
C
|`;
    const routes = parseMap(asciiroute);
    const letterAggregator = new Array<string>();
    expect(routes[0][0].travel(Direction.bottom, letterAggregator)).toEqual([routes[4][0], Direction.bottom]);
    expect(letterAggregator.join("")).toBe("A");
    expect(routes[4][0].travel(Direction.top, letterAggregator)).toEqual([routes[0][0], Direction.top]);
    expect(letterAggregator.join("")).toBe("AA");
});

it("should be able to solve the example", () => {
    const routes = parseMap(EXAMPLE);
    expect(followRoute(routes)).toEqual(["ABCDEF", 38]);
});

const routes = parseMap(getPuzzleInput());
console.log("Answer 1: ", followRoute(routes));
