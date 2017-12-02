
const sumOfNumbers = (s: string): number => {
    let sum: number = 0;
    for(let i=0; i<s.length; i++) {
        const currentChar = +s[i];
        let nextChar: number = 0;
        if(i+1 == s.length) {
            nextChar = +s[0];
        } else {
            nextChar = +s[i+1];
        }
        if(currentChar == nextChar) {
            sum += currentChar;
        }
    }
    return sum;
};

export = sumOfNumbers;