
const sumOfNumbers = (s: string): number => {
    let sum: number = 0;
    const steps: number = s.length / 2;

    for(let i=0; i<s.length; i++) {
        const currentChar = +s[i];
        let nextChar: number = 0;
        if(i+steps >= s.length) {
            const newidx: number = i - s.length + steps;
            nextChar = +s[newidx];
        } else {
            nextChar = +s[i+steps];
        }
        if(currentChar == nextChar) {
            sum += currentChar;
        }
    }
    return sum;
};

export = sumOfNumbers;
