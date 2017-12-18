
export class SpinLock {

    public position = 0;
    private steps: number;
    private spinCount = 0;

    public constructor(steps: number) {
        this.steps = steps;
    }

    public spin() {
        this.spinCount++;
        for(let i=0; i<this.steps;i++) {
            this.position++;
            if(this.position >= this.spinCount) {
                this.position = 0;
            }
        }
        this.position++;
    }

    public processOrderedBuffer(): number[] {
        const buf = new Array<number>(this.spinCount+1);
        buf.fill(0);
        let position = this.position;
        let spinCount = this.spinCount;
        let steps = this.steps;
        while(spinCount > 0) {
            if(steps === this.steps && buf[position] === 0) {
                if(spinCount % 100000 === 0) {
                    console.log("Processing spinCount", spinCount);
                }

                //console.log("stepping down", steps, spinCount, position, buf);
                buf[position] = spinCount;

                spinCount--;
                steps = 0;
            } else if(buf[position] !== 0) {
                //console.log("spot taken", position, buf)
                position--;
            } else if(buf[position] === 0){
                //console.log("free spot", position, steps, buf)
                position--;
                steps++;
            } else {
                throw new Error("Shouldn't go there");
            }
            if(position < 0) {
                position = buf.length - 1;
            }

        }
        return buf;
    }
}

export function spin(steps: number, rounds: number): number[] {
    const s = new SpinLock(steps);
    for(let i=0; i< rounds; i++) {
        if(i % 100000 === 0) {
            console.log("Round: ", i);
        }
        s.spin();
    }
    return s.processOrderedBuffer();
}

export function part1(steps: number) {
    const data = spin(steps, 2017);
    const pos = data.indexOf(2017);
    return data[pos+1];
}

export function part2(steps: number) {
    const data = spin(steps, 50000000);
    const pos = data.indexOf(0);
    return data[pos+1];
}

console.log("Answer 2: ", part2(344));