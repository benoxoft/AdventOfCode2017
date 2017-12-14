
class Program {

    public readonly id: number;
    private pipedPrograms: Program[] = new Array<Program>();

    constructor(id: number) {
        this.id = id;
    }

    public pipeTo(prog: Program) {
        if(this.id === prog.id) {
            return;
        }
        if(!this.pipedPrograms.find((element) => element === prog)) {
            this.pipedPrograms.push(prog);
        }
        if(!prog.pipedPrograms.find((element) => element === this)) {
            prog.pipedPrograms.push(this);
        }
    }

    public pipeTravel(programList: Program[]): Program[] {
        if(programList.find((element) => element.id === this.id)) {
            return programList;
        }
        programList.push(this);
        if(this.id === 0) {
            return programList;
        }
        for(const prog of this.pipedPrograms) {
            programList.concat(prog.pipeTravel(programList));
        }
        return programList;
    }
}

function parseInput(input: string): Program[] {
    const retval = new Array<Program>();

    const lines = input.split("\n");
    for(const line of lines) {
        const [mainProgStr, progsStr] = line.split(" <-> ");
        let mainProg = retval.find((element) => element.id === +mainProgStr);
        if(!mainProg) {
            mainProg = new Program(+mainProgStr);
            retval.push(mainProg);
        }
        const otherProgsStr = progsStr.split(", ");
        for(const progStr of otherProgsStr) {
            let pipedProg = retval.find((element) => element.id === +progStr);
            if(!pipedProg) {
                pipedProg = new Program(+progStr);
                retval.push(pipedProg);
            }
            mainProg.pipeTo(pipedProg);
        }
    }
    return retval;
}

export function findGroup0Programs(input: string) {
    const programsOfGroup0 = new Array<Program>();

    const programs = parseInput(input);
    for(const program of programs) {
        const list = program.pipeTravel(new Array<Program>());
        if(list.find((element) => element.id === 0)) {
            programsOfGroup0.push(program);
        }
    }
    return programsOfGroup0.length;
}

function hasMatch(list1: Program[], list2: Program[]): boolean {
    for(const prog1 of list1) {
        for(const prog2 of list2) {
            if(prog1.id === prog2.id) {
                return true;
            }
        }
    }
    return false;
}

function mergeList(baseList, otherList) {
    for(const prog of otherList) {
        if(!baseList.find(element => element.id === prog.id)) {
            baseList.push(prog);
        }
    }
}

export function findAllGroups(input: string) {
    const programs = parseInput(input);
    const groups = new Array<Array<Program>>();

    for(const program of programs) {
        let isInAGroup: boolean = false;
        for(const group of groups) {
            if(group.find((element) => element.id === program.id)) {
                isInAGroup = true;
                break;
            }
        }
        if(isInAGroup) {
            continue;
        } else {
            const list = program.pipeTravel(new Array<Program>());
            let mergedIntoGroup = false;
            for(let group of groups) {
                if(hasMatch(group, list)) {
                    mergeList(group, list);
                    mergedIntoGroup = true;
                }
            }
            if(!mergedIntoGroup) {
                groups.push(list);
            }
        }
    }
    console.log(groups);
    return groups.length;
}
