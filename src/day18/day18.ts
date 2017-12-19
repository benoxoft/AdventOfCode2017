import {isNumeric} from "tslint";

enum Status {
    running = 0,
    pending = 1,
    finished = 2
};

class Duet {

    private readonly register = new Array<string>();
    private currentPosition = 0;
    private lastFreqPlayed = 0;
    private readonly instructions = new Array<Function>();
    private recoveryValue = 0;
    public readonly queue = new Array<number>();
    public otherDuet;
    private sendCounter = 0;

    private pending = false;
    private pendingRegister = "";

    public constructor(instructions: Function[], programId=-1) {
        this.instructions = instructions;
        if(programId !== -1) {
            this.register["p"] = programId;
        }
    }

    public linkDuet(duet: Duet) {
        if(duet === undefined) {
            throw new Error("duet is undefined?");
        }
        this.otherDuet = duet;
    }

    public playSound(frequency: number) {
        this.lastFreqPlayed = frequency;
    }

    public send(value: number) {
        this.otherDuet.queue.unshift(value);
        this.sendCounter++;
    }

    public receive(register: string) {
        if(this.queue.length > 0) {
            const val = this.queue.pop();
            this.register[register] = val;
        } else {
            this.pending = true;
            this.pendingRegister = register;
        }
    }

    public getRegisterValue(key: string): number {
        const value = this.register[key];
        if(value === undefined) {
            return 0;
        } else {
            return value;
        }
    }

    public setRegisterValue(key: string, value: number) {
        this.register[key] = value;
    }

    public getLastFrequecyPlayed(): number {
        return this.lastFreqPlayed;
    }

    public getSendCounterValue(): number {
        return this.sendCounter;
    }

    public jump(value: number) {
        this.currentPosition += (value - 1);
    }

    public recover() {
        this.recoveryValue = this.lastFreqPlayed;
    }

    public runNextInstruction(): number {
        const inst = this.instructions[this.currentPosition];
        inst(this);
        this.currentPosition++;
        return this.recoveryValue;
    }

    public runNextInstructionPart2(): Status {
        if(this.currentPosition >= this.instructions.length || this.currentPosition < 0) {
            return Status.finished;
        }
        if(this.pending && this.queue.length === 0) {
            return Status.pending;
        } else if(this.pending) {
            this.pending = false;
            this.receive(this.pendingRegister);
        }
        const inst = this.instructions[this.currentPosition];
        inst(this);
        this.currentPosition++;
        if(this.pending) {
            return Status.pending;
        } else {
            return Status.running;
        }
    }
};

function convertValueToNumber(value: string, duet: Duet): number {
    let val = 0;
    if(isNaN(+value)) {
        val = duet.getRegisterValue(value);
    } else {
        val = +value;
    }
    return val;
}

// snd X plays a sound with a frequency equal to the value of X.
function snd(frequency: string, duet: Duet) {
    //console.log("snd", frequency);
    const val = convertValueToNumber(frequency, duet);
    duet.playSound(val);
}

// snd X sends the value of X to the other program. These values wait in a queue until that program is ready to receive them. Each program has its own message queue, so a program can never receive a message it sent.
function snd2(value: string, duet: Duet) {
    const val = convertValueToNumber(value, duet);
    duet.send(val);
}

// set X Y sets register X to the value of Y.
function set(key: string, value: string, duet: Duet) {
    //console.log("set", key, value);
    const val = convertValueToNumber(value, duet);
    duet.setRegisterValue(key, val);
}

// add X Y increases register X by the value of Y.
function add(key: string, value: string, duet: Duet) {
    //console.log("add", key, value);
    const val = convertValueToNumber(value, duet);
    const regval = duet.getRegisterValue(key);
    duet.setRegisterValue(key, regval + val);
}

// mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
function mul(key: string, value: string, duet: Duet) {
    //console.log("mul", key, value);
    const val = convertValueToNumber(value, duet);
    const regval = duet.getRegisterValue(key);
    duet.setRegisterValue(key, regval * val);
}

// mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
function mod(key: string, value: string, duet: Duet) {
    //console.log("mod", key, value);
    const val = convertValueToNumber(value, duet);
    const regval = duet.getRegisterValue(key);
    duet.setRegisterValue(key, regval % val);
}

// rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
function rcv(value: string, duet: Duet) {
    //console.log("rcv", value);
    const val = convertValueToNumber(value, duet);
    if(val !== 0) {
        duet.recover();
    }
}

// rcv X receives the next value and stores it in register X. If no values are in the queue, the program waits for a value to be sent to it. Programs do not continue to the next instruction until they have received a value. Values are received in the order they are sent.
function rcv2(register: string, duet: Duet) {
    duet.receive(register);
}

// jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
function jgz(jumpValue: string, offset: string, duet: Duet) {
    //console.log("jgz", jumpValue, offset);
    const val = convertValueToNumber(jumpValue, duet);
    if(val > 0) {
        const offsetVal = convertValueToNumber(offset, duet);
        duet.jump(offsetVal);
    }
}

function parseCommand(cmd: string) {
    const tokens = cmd.split(" ");
    if(tokens[0] === "snd") {
        return duet => snd(tokens[1], duet);
    } else if(tokens[0] === "set") {
        return duet => set(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "add") {
        return duet => add(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "mul") {
        return duet => mul(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "mod") {
        return duet => mod(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "rcv") {
        return duet => rcv(tokens[1], duet);
    } else if(tokens[0] === "jgz") {
        return duet => jgz(tokens[1], tokens[2], duet);
    } else {
        throw new Error("Unknown command: " + cmd);
    }
}

function parseCommandPart2(cmd: string): Function {
    const tokens = cmd.split(" ");
    if(tokens[0] === "snd") {
        return duet => snd2(tokens[1], duet);
    } else if(tokens[0] === "set") {
        return duet => set(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "add") {
        return duet => add(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "mul") {
        return duet => mul(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "mod") {
        return duet => mod(tokens[1], tokens[2], duet);
    } else if(tokens[0] === "rcv") {
        return duet => rcv2(tokens[1], duet);
    } else if(tokens[0] === "jgz") {
        return duet => jgz(tokens[1], tokens[2], duet);
    } else {
        throw new Error("Unknown command: " + cmd);
    }
}

export function playPart1(input: string) {
    const cmdStrings = input.split("\n");
    const commands = new Array<Function>();
    for(const cmdString of cmdStrings) {
        commands.push(parseCommand(cmdString));
    }

    const d = new Duet(commands);
    let value = 0;
    let count = 0;
    while(value === 0 && count < 10000) {
        value = d.runNextInstruction();
        count++;
    }
    return value;
}

export function playPart2(input: string) {
    const cmdStrings = input.split("\n");
    const commands = new Array<Function>();
    for(const cmdString of cmdStrings) {
        commands.push(parseCommandPart2(cmdString));
    }

    const d1 = new Duet(commands, 0)
    const d2 = new Duet(commands, 1);
    d1.linkDuet(d2);
    d2.linkDuet(d1);

    let status1 = Status.running;
    let status2 = Status.running;
    let deadlocked = false;
    while(status1 !== Status.finished || status2 !== Status.finished) {
        status1 = d1.runNextInstructionPart2();
        status2 = d2.runNextInstructionPart2();
        if(status1 === Status.pending && status2 === Status.pending) {
            if(!deadlocked)
                deadlocked = true;
            else {
                console.log("SEND COUNTER: ", d2.getSendCounterValue())
                throw new Error("DEADLOCKED");
            }
        } else {
            deadlocked = false;
        }
    }
    return d2.getSendCounterValue();
}