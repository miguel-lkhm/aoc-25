import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, '..', 'input.txt');
const data = readFileSync(filePath, 'utf8');

const lines = data.split("\n");

let totalJoltage = 0;

for (const line of lines) {
    const sortedDigitArray = line.split("").sort().reverse();
    const highestDigit = sortedDigitArray[0];
    const indexOfHighestDigit = line.indexOf(highestDigit);
    // if the highest digit is at the last place, then the highest pair is necessarily the second highest followed by the highest
    if (indexOfHighestDigit === line.length - 1) {
        const joltage = Number(sortedDigitArray[1] + sortedDigitArray[0]);
        totalJoltage += joltage;
        continue;
    }
    // if not, the highest digit splits the line in 2, with a non-empty right part
    const rightSubString = line.substring(indexOfHighestDigit+1);
    const sortedRightSubstringArray = rightSubString.split("").sort().reverse();
    const highestDigitRightOfHighest = sortedRightSubstringArray[0];
    const joltage = Number(highestDigit+highestDigitRightOfHighest);
    totalJoltage += joltage;
}

console.log(totalJoltage);

