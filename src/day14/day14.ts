import {createNumberList, part2} from "../day10/day10";

function hex2bin(hex: string){
    return ("0000" + (parseInt(hex, 16)).toString(2)).substr(-4);
}

function convertHashToBinKnot(input: string): string {
    const hex = part2(createNumberList(), input);
    let binstr = "";
    for(const c of hex) {
        binstr += hex2bin(c);
    }
    return binstr;
}

function part1(input: string) {
    let count = 0;
    for(let i=0;i<128;i++) {
        for(const c of convertHashToBinKnot(input + "-" + i.toString())) {
            if(c === "1") {
                count++;
            }
        }
    }
    return count;
}

class Square {
    public readonly squares = new Array<Square>();
    public readonly x: number;
    public readonly y: number;
    public readonly used: boolean;
    private counted: boolean = false;

    public constructor(x, y, used) {
        this.x = x;
        this.y = y;
        this.used = used;
    }

    public linkTo(s: Square) {
        if(s === undefined) {
            return;
        }
        if(s.used && this.used) {
            this.squares.push(s);
            s.squares.push(this);
        }
    }

    public consumeRegion(): boolean {
        if(!this.used || this.counted) {
            return false;
        }
        this.counted = true;
        for(const sq of this.squares) {
            sq.consumeRegion();
        }
        return true;
    }
}

function part2day14(input: string) {
    const grid = new Array<Array<Square>>();
    for(let i=0; i<128; i++) {
        const rawline = convertHashToBinKnot(input + "-" + i.toString());
        grid.push(new Array<Square>());
        for(let j=0; j<128; j++) {
            const newsquare = new Square(i, j, rawline[j] === "1");
            grid[i][j] = newsquare;
            if(j > 0) {
                newsquare.linkTo(grid[i][j-1]);
            }
            if(j < 127) {
                newsquare.linkTo(grid[i][j+1]);
            }
            if(i > 0) {
                newsquare.linkTo(grid[i-1][j]);
            }
        }
    }
    let count = 0;
    for(const line of grid) {
        for(const sq of line) {
            if(sq.consumeRegion()) {
                count ++;
            }
        }
    }
    return count;
}

console.log("Answer 1: ", part1("nbysizxe"));
console.log("Answer 2: ", part2day14("nbysizxe"));
