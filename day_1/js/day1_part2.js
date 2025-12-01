import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const filePath = join(__dirname, '..', 'input.txt');


const data = readFileSync(filePath, 'utf8');

const stringListOfNumbers = data.replaceAll("R", "+").replaceAll("L", "-");

const numberArray = stringListOfNumbers.split("\n").map(line => BigInt(line));

let dialNumber = 50n;
let numberOfTimesDialPassedZero = 0n;
let numberOfTimesDialGotZero = 0n;

let previousNumber = 50n;

for(const number of numberArray){
    previousNumber = dialNumber
    dialNumber += number;

    const timesPassedZero = countTimesPassedZero(previousNumber, dialNumber);

    if (dialNumber % 100n === 0n && timesPassedZero <= 0) {
        numberOfTimesDialGotZero++;

        // if it ended at zero moving in the positive direction (timesPassedZero > 0), it was already counted by countTimesPassedZero()
        // so we need to discount it
    }

    numberOfTimesDialPassedZero += absBigInt(timesPassedZero);
}

console.log(numberOfTimesDialPassedZero+numberOfTimesDialGotZero);

function countTimesPassedZero(previousNumber, currentNumber){
    const prev = floorDiv(previousNumber, 100n);
    const curr = floorDiv(currentNumber, 100n);
    const diff = curr - prev;
    return diff;
}

function absBigInt(n) {
  return n < 0n ? -n : n;
}

function floorDiv(a, b) {
    if (b === 0n) throw new Error("division by zero");
    const q = a / b;
    // If a and b have opposite signs and a is not divisible by b, subtract 1
    if ((a ^ b) < 0n && a % b !== 0n) return q - 1n;
    return q;
}