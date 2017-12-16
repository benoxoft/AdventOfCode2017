
export function* generatorA(initialValue: number, part1: boolean=true) {
    const factor = 16807;
    let value = initialValue;
    while(true) {
        value *= factor;
        value = value % 2147483647;
        if(value % 4 === 0 || part1) {
            yield value;
        }
    }

}

export function* generatorB(initialValue: number, part1: boolean=true) {
    const factor = 48271;
    let value = initialValue;
    while(true) {
        value *= factor;
        value = value % 2147483647;
        if(value % 8 === 0 || part1) {
            yield value;
        }
    }
}

export function compare(valueA: number, valueB: number): boolean {
    let binA = valueA.toString(2);
    binA = binA.substring(binA.length - 16);
    let binB = valueB.toString(2);
    binB = binB.substring(binB.length - 16);
    return binA === binB
}

export function judge(genA: IterableIterator<number>, genB: IterableIterator<number>) {
    let count = 0;
    for(let i=0;i<5*1000*1000;i++) {
        if(compare(genA.next().value, genB.next().value)) {
            count++;
        }
    }
    return count;
}
