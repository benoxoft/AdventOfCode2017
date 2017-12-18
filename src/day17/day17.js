"use strict";
exports.__esModule = true;
var SpinLock = /** @class */ (function () {
    function SpinLock(steps) {
        this.position = 0;
        this.spinCount = 0;
        this.steps = steps;
    }
    SpinLock.prototype.spin = function () {
        this.spinCount++;
        for (var i = 0; i < this.steps; i++) {
            this.position++;
            if (this.position >= this.spinCount) {
                this.position = 0;
            }
        }
        this.position++;
    };
    SpinLock.prototype.processOrderedBuffer = function () {
        var buf = new Array(this.spinCount + 1);
        buf.fill(0);
        var position = this.position;
        var spinCount = this.spinCount;
        var steps = this.steps;
        while (spinCount > 0) {
            if (steps === this.steps && buf[position] === 0) {
                if (spinCount % 100000 === 0) {
                    console.log("Processing spinCount", spinCount);
                }
                //console.log("stepping down", steps, spinCount, position, buf);
                buf[position] = spinCount;
                spinCount--;
                steps = 0;
            }
            else if (buf[position] !== 0) {
                //console.log("spot taken", position, buf)
                position--;
            }
            else if (buf[position] === 0) {
                //console.log("free spot", position, steps, buf)
                position--;
                steps++;
            }
            else {
                throw new Error("Shouldn't go there");
            }
            if (position < 0) {
                position = buf.length - 1;
            }
        }
        return buf;
    };
    return SpinLock;
}());
exports.SpinLock = SpinLock;
function spin(steps, rounds) {
    var s = new SpinLock(steps);
    for (var i = 0; i < rounds; i++) {
        if (i % 100000 === 0) {
            console.log("Round: ", i);
        }
        s.spin();
    }
    return s.processOrderedBuffer();
}
exports.spin = spin;
function part1(steps) {
    var data = spin(steps, 2017);
    var pos = data.indexOf(2017);
    return data[pos + 1];
}
exports.part1 = part1;
function part2(steps) {
    var data = spin(steps, 50000000);
    var pos = data.indexOf(0);
    return data[pos + 1];
}
exports.part2 = part2;
console.log("Answer 2: ", part2(344));
