
export const validatePassphrase = (input: string): boolean => {
    const words: string[] = input.split(" ");
    for(const word of words) {
        if(words.filter(value => word === value).length > 1) {
            return false;
        }
    }
    return true;
};

export const preparePassphrase(input: string): string => {
    const words: string[] = input.split(" ");
    for(const wordIdx in words) {
        words[wordIdx] = words[wordIdx].split("").sort().join("");
    }
    return words.join(" ");
};

export const validatePassphrase2 = (input: string): boolean => {
    return validatePassphrase(preparePassphrase(input));
};

export const validatePassphrases = (input: string): number => {
    const phrases = input.split("\n");
    let count = 0;
    for(const phrase of phrases) {
        if(validatePassphrase(phrase)) {
            count++;
        }
    }
    return count;
};

export const validatePassphrases2 = (input: string): number => {
    const phrases = input.split("\n");
    let count = 0;
    for(const phrase of phrases) {
        if(validatePassphrase2(phrase)) {
            count++;
        }
    }
    return count;
};
