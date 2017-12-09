export interface Register {
    [key: string]: number;
}

export class Instruction {

    public readonly affectedVariable: string;
    public readonly action: string;
    public readonly amount: number;
    public readonly leftvar: string;
    public readonly operation: string;
    public readonly rightvar: string;

    constructor(affectedVariable, action, amount, leftvar, operation, rightvar) {
        this.affectedVariable = affectedVariable;
        this.action = action;
        this.amount = amount;
        this.leftvar = leftvar;
        this.operation = operation;
        this.rightvar = rightvar;

    }

    modifyRegister(register: Register) {
        if(register[this.affectedVariable] === undefined) {
            register[this.affectedVariable] = 0;
        }
        const value = register[this.affectedVariable];
        if(this.evalCondition(register)) {
            if(this.action === "inc") {
                register[this.affectedVariable] += this.amount;
            } else if(this.action === "dec") {
                register[this.affectedVariable] -= this.amount;
            } else {
                throw new Error("Unknown action " + this.action);
            }
        }
    }

    public evalCondition(register: Register): boolean {
        let leftvar: number;
        let rightvar: number;
        if(isNaN(+this.leftvar)) {
            leftvar = register[this.leftvar];
            if(leftvar === undefined) {
                register[this.leftvar] = 0;
                leftvar = 0;
            }
        } else {
            leftvar = +this.leftvar;
        }
        if(isNaN(+this.rightvar)) {
            rightvar = register[this.rightvar];
            if(rightvar === undefined) {
                register[this.rightvar] = 0;
                rightvar = 0;
            }
        } else {
            rightvar = +this.rightvar;
        }
        //console.log("leftvar:", leftvar);
        //console.log("rightvar:", rightvar);
        if(this.operation === "<") {
            return leftvar < rightvar;
        } else if(this.operation === ">") {
            return leftvar > rightvar;
        } else if(this.operation === "<=") {
            return leftvar <= rightvar;
        } else if(this.operation === ">=") {
            return leftvar >= rightvar;
        } else if(this.operation === "==") {
            return leftvar === rightvar;
        } else if(this.operation === "!=") {
            return leftvar !== rightvar;
        } else {
            throw new Error("Unknown operation " + this.operation);
        }
    }
}
export function parseInput(input: string): Instruction[] {
    const retval = new Array<Instruction>();
    const lines = input.split("\n");
    for(const line of lines) {
        const [variable, action, amount, ifcmd, leftvar, operation, rightvar] = line.split(" ");
        const x = new Instruction(variable, action, +amount, leftvar, operation, rightvar);
        retval.push(x);
    }
    return retval;
}

export function findLargestRegister(input: string) {
    const instructions = parseInput(input);
    const register: Register = {};
    let largestValueEver = -1;
    for(const inst of instructions) {
        inst.modifyRegister(register);
        for(const val of Object.values(register)) {
            if(val > largestValueEver) {
                largestValueEver = val;
            }
        }
    }
    let largestValue = -1;
    for(const val of Object.values(register)) {
        if(val > largestValue) {
            largestValue = val;
        }
    }
    return [largestValue, largestValueEver];
}
