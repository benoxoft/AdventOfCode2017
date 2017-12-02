
export const parseInputString = (input: string): Array<Array<number>> => {
    const lines = input.split("\n");
    let data: Array<Array<number>> = [];

    for(const line of lines) {
        const tokens = line.replace(/\t+/g, " ").split(" ");
        let numbers: Array<number> = new Array();
        for(const n of tokens) {
            numbers.push(+n);
        }
        data.push(numbers);
    };
    return data;
};

const calculateRowChecksum = (input: Array<number>): number => {
    let smallest = Number.MAX_SAFE_INTEGER;
    let largest = 0;
    for(const n of input) {
        if(n < smallest) {
            smallest = n;
        }
        if(n > largest) {
            largest = n;
        }
    }
    return largest - smallest;
};

export const calculateChecksum = (input: Array<Array<number>>): number => {
    let checksum: number = 0;
    for(const line of input) {
        checksum += calculateRowChecksum(line);
    }
    return checksum;
};

export const findEvenlyDivisibleValues = (input: Array<number>): [number, number] => {
    for(const i of input) {
        for(const j of input) {
            if(i !== j && (i % j) === 0) {
                return [i, j];
            }
        }
    }
};

export const calculateChecksumPart2 = (input: Array<Array<number>>): number => {
    let checksum: number = 0;
    for(const line of input) {
        const [n1, n2] = findEvenlyDivisibleValues(line);
        checksum += n1 / n2;
    }
    return checksum;
};
