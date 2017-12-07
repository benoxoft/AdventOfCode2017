import Err = ts.server.Msg.Err;

class Program {
    public readonly programName: string;
    public weirdNumber: number;
    private parent: Program = null;

    public readonly linkedPrograms = new Array<Program>();

    constructor(programName: string, weirdNumber: number=0) {
        this.programName = programName;
        this.weirdNumber = weirdNumber;
    }

    public toString(): string {
        return this.programName;
    }

    public linkTo(p: Program) {
        this.linkedPrograms.push(p);
        p.parent = this;
    }

    public hasParent(): boolean {
        return this.parent !== null;
    }

    public childrenBalanced(): boolean {
        for(let i=0; i<this.linkedPrograms.length-1; i++) {
            if(this.linkedPrograms[i].calculateWeight() !== this.linkedPrograms[i+1].calculateWeight()) {
                return false;
            }
        }
        return true;
    }

    public calculateWeight(): number {
        let weight = this.weirdNumber;
        if(weight === 0) {
            throw Error("Weight cannot be 0 " + this.programName);
        }
        for(const p of this.linkedPrograms) {
            weight += p.calculateWeight();
        }
        return weight;
    }
}

export function parseInputString(input: string): Program[] {
    const retval = new Array<Program>();
    const lines = input.split("\n");
    for(const line of lines) {
        const tokens = line.split(" -> ");
        const baseProgramString = tokens[0];
        const [baseProgramName, weirdNumberString] = baseProgramString.split(" ");
        const weirdNumber = weirdNumberString.replace("(", "").replace(")", "");
        let baseProgram = retval.find((element) => element.programName === baseProgramName);
        if(baseProgram === undefined) {
            baseProgram = new Program(baseProgramName, +weirdNumber)
        } else {
            baseProgram.weirdNumber = +weirdNumber;
        }
        retval.push(baseProgram);
        if(tokens.length === 1) {
            continue;
        }
        const linkedProgramStrings = tokens[1].split(", ");
        for(const lps of linkedProgramStrings) {
            let lp = retval.find((element) => element.programName === lps);
            if(lp === undefined) {
                lp = new Program(lps);
            }
            baseProgram.linkTo(lp);
            retval.push(lp);
        }
    }
    return retval;
}

export function findBaseProgram(input: string): Program {
    const programs: Program[] = parseInputString(input);
    for(const program of programs) {
        if(!program.hasParent()) {
            return program;
        }
    }
    throw new Error("Couldn't find program");
}

function innerBalanceTower(baseProgram: Program) {
    for(let i=0; i<baseProgram.linkedPrograms.length; i++) {
        console.log("watching", baseProgram.linkedPrograms[i].calculateWeight(), baseProgram.linkedPrograms[i+1].calculateWeight());
        if(baseProgram.linkedPrograms[i].calculateWeight() !== baseProgram.linkedPrograms[i+1].calculateWeight()) {
            console.log("Found the difference");
            let prog1Different, prog2Same, prog3;
            if(i-1 < 0) {
                prog3 = baseProgram.linkedPrograms[i+2];
            } else {
                prog3 = baseProgram.linkedPrograms[i-1];
            }
            if(baseProgram.linkedPrograms[i].calculateWeight() === prog3.calculateWeight()) {
                prog1Different = baseProgram.linkedPrograms[i+1];
                prog2Same = baseProgram.linkedPrograms[i];
            } else {
                prog1Different = baseProgram.linkedPrograms[i];
                prog2Same = baseProgram.linkedPrograms[i+1];
            }
            if(prog1Different.childrenBalanced()) {
                const diff = prog1Different.calculateWeight() - prog2Same.calculateWeight();
                return prog1Different.weirdNumber - diff;
            } else {
                return innerBalanceTower(prog1Different);
            }
        }
    }
    throw new Error("Could not balance tower");
}

export function balanceTower(input: string): number {
    const baseProgram = findBaseProgram(input);
    return innerBalanceTower(baseProgram);
}
