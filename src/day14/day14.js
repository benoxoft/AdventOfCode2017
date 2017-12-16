"use strict";
exports.__esModule = true;
var day10_1 = require("../day10/day10");
function hex2bin(hex) {
    return ("0000" + (parseInt(hex, 16)).toString(2)).substr(-4);
}
function convertHashToBinKnot(input) {
    var hex = day10_1.part2(day10_1.createNumberList(), input);
    var binstr = "";
    for (var _i = 0, hex_1 = hex; _i < hex_1.length; _i++) {
        var c = hex_1[_i];
        binstr += hex2bin(c);
    }
    return binstr;
}
function part1(input) {
    var count = 0;
    for (var i = 0; i < 128; i++) {
        for (var _i = 0, _a = convertHashToBinKnot(input + "-" + i.toString()); _i < _a.length; _i++) {
            var c = _a[_i];
            if (c === "1") {
                count++;
            }
        }
    }
    return count;
}
var Square = /** @class */ (function () {
    function Square(x, y, used) {
        this.squares = new Array();
        this.counted = false;
        this.x = x;
        this.y = y;
        this.used = used;
    }
    Square.prototype.linkTo = function (s) {
        if (s === undefined) {
            return;
        }
        if (s.used && this.used) {
            this.squares.push(s);
            s.squares.push(this);
        }
    };
    Square.prototype.consumeRegion = function () {
        if (!this.used || this.counted) {
            return false;
        }
        this.counted = true;
        for (var _i = 0, _a = this.squares; _i < _a.length; _i++) {
            var sq = _a[_i];
            sq.consumeRegion();
        }
        return true;
    };
    return Square;
}());
function part2day14(input) {
    var grid = new Array();
    for (var i = 0; i < 128; i++) {
        var rawline = convertHashToBinKnot(input + "-" + i.toString());
        grid.push(new Array());
        for (var j = 0; j < 128; j++) {
            var newsquare = new Square(i, j, rawline[j] === "1");
            grid[i][j] = newsquare;
            if (j > 0) {
                newsquare.linkTo(grid[i][j - 1]);
            }
            if (j < 127) {
                newsquare.linkTo(grid[i][j + 1]);
            }
            if (i > 0) {
                newsquare.linkTo(grid[i - 1][j]);
            }
        }
    }
    var count = 0;
    for (var _i = 0, grid_1 = grid; _i < grid_1.length; _i++) {
        var line = grid_1[_i];
        for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
            var sq = line_1[_a];
            if (sq.consumeRegion()) {
                count++;
            }
        }
    }
    return count;
}
console.log("Answer 1: ", part1("nbysizxe"));
console.log("Answer 2: ", part2day14("nbysizxe"));
