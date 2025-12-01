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
let numberOfTimesDialGotZero = 0;

for(const number of numberArray){
    dialNumber += number;
    if (dialNumber % 100n === 0n) {
        numberOfTimesDialGotZero++;
    }
}

console.log(numberOfTimesDialGotZero);