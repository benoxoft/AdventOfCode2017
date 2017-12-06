
class MemoryBank {
    private memory: number = 0;

    constructor(memory: number) {
        this.memory = memory;
    }

    public readBlocksSize(): number {
        return this.memory;
    }

    public getBlocks(): number {
        const mem = this.memory;
        this.memory = 0;
        return mem;
    }

    public addBlock() {
        this.memory++;
    }

    public clone(): MemoryBank {
        return new MemoryBank(this.memory);
    }
}

class BankManager {

    private readonly banks: Array<MemoryBank>;

    constructor(input: number[]) {
        this.banks = this.createMemoryBanks(input);
    }

    private createMemoryBanks(input: number[]) {
        const retval = new Array<MemoryBank>();
        for(const n of input) {
            retval.push(new MemoryBank(n));
        }
        return retval;
    }

    public exportData(): number[] {
        const retval = new Array<number>();
        for(const bank of this.banks) {
            retval.push(bank.readBlocksSize());
        }
        return retval;
    }

    public clone(): BankManager {
        return new BankManager(this.exportData());
    }

    public compare(manager: BankManager): boolean {
        for(let i=0;i<this.banks.length;i++) {
            if(this.banks[i].readBlocksSize() != manager.banks[i].readBlocksSize())
                return false;
        }
        return true;
    }

    public redistributeHighestBank() {
        let highestBank = this.banks[0];
        let position = 0;
        for(let i=0;i<this.banks.length;i++) {
            const bank = this.banks[i];
            if(bank.readBlocksSize() > highestBank.readBlocksSize()) {
                highestBank = bank;
                position = i;
            }
        }
        let blocks = highestBank.getBlocks();
        while(blocks > 0) {
            position++;
            if(position === this.banks.length)
                position = 0;
            this.banks[position].addBlock();
            blocks--;
        }
    }
}

export function findLoop(input: number[]): [BankManager, number] {
    let manager = new BankManager(input);
    const snapshots = new Array<BankManager>();
    snapshots.push(manager.clone());
    let steps = 0;
    while(steps<1000000) {
        manager.redistributeHighestBank();
        steps++;
        for(const ss of snapshots) {
            if(ss.compare(manager)) {
                return [manager, steps];
            }
        }
        snapshots.push(manager.clone());
    }
    return [undefined, -1];
}
