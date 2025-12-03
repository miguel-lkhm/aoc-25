import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, '..', 'input.txt');
const data = readFileSync(filePath, 'utf8');

const lines = data.split("\n");

let totalJoltage = 0n;

for (const line of lines) {
    let digits = line;
    while (digits.length > 12) {
        const sortedDigitArray = reverseSortDigits(digits);
        const lowestDigit = sortedDigitArray[digits.length-1];
        // first occurrence of the lowest digit
        const indexOfLowestDigit = digits.indexOf(lowestDigit);
        let max = "0";
        let indexRemovedForMax;
        for (let index = 0; index <= indexOfLowestDigit; index++) {
            const removedDigit = removeChar(digits, index);
            if (isDigitStringLarger(max, removedDigit)){
                max = removedDigit;
                indexRemovedForMax = index;
            }
        }
        // at this point, `max` contains the highest number that can be achieved removing one digit
        digits = max;
    }
    // now the digits string is 12 long and is the highest that could be formed through selection (no permutation)
    const joltage = BigInt(digits);
    totalJoltage += joltage;
}

console.log(totalJoltage);


// checks whether or not string2 is larger than string1
function isDigitStringLarger(string1, string2){
    if (string1.length > string2.length){
        return false;
    }
    if (string2.length > string1.length){
        // assumption: no left zeroes
        return true;
    }
    return string2 > string1;
}

function reverseSortDigits(string){
    return string.split("").sort().reverse();
}

function removeChar(str, index) {
  return str.slice(0, index) + str.slice(index + 1);
}

