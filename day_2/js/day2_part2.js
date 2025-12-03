import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, '..', 'input.txt');
const data = readFileSync(filePath, 'utf8');

const intervals = data.split(",");

class IntervalIterator {
    constructor(closedIntervalString) {
        const interval = closedIntervalString.split("-").map((numInString) => BigInt(numInString));
        this.start = interval[0];
        this.end = interval[1];
    }

    // returns bigint or null
    next(){
        // assumption: start < end
        if (this.currentValue >= this.end){
            // there is no next element (sends signal to parent iterator to pass to the next interval)
            return null;
        }
        if (this.currentValue === undefined){
            this.currentValue = this.start;
        } else {
            this.currentValue++;
        }
        return this.currentValue;
        
    }
}

class TotalIterator {
    intervals = [];

    constructor(intervalsStrings){
        for (let index = 0; index < intervalsStrings.length; index++) {
            this.intervals[index] = new IntervalIterator(intervalsStrings[index]);
        }
        // assumption: there is at least one interval
        this.currentIntervalIndex = 0;
    }

    // returns an intervalIterator or null
    #nextInterval(){
        if (this.currentIntervalIndex >= this.intervals.length) {
            return null;
        }
        this.currentIntervalIndex++;
        return this.intervals[this.currentIntervalIndex];

    }

    // returns bigint or null
    next(){
        const currentInterval = this.#getCurrentInterval();
        const out = currentInterval.next();
        if (out !== null) {
            return out;
        }
        // if the interval has run out, pass to the next
        const nextInterval = this.#nextInterval();
        if (nextInterval !== null && nextInterval !== undefined) {
            return nextInterval.next();
        }
        // there are no more intervals
        return null;
    }

    #getCurrentInterval(){
        return this.intervals[this.currentIntervalIndex];
    }

}

// TODO: research doing this lazily with generators

const totalIt = new TotalIterator(intervals);
let total = 0n;
let value;
while ((value = totalIt.next()) !== null) {
    if (isInvalidKey(value)) {
        total += value;
    }
}
console.log(total);
// console.log("-------");
// console.log("5: " + isInvalidKey(5n));
// console.log("55: " + isInvalidKey(55n));
// console.log("556: " + isInvalidKey(556n));
// console.log("611: " + isInvalidKey(611n));
// console.log("2323: " + isInvalidKey(2323n));
// console.log("666: " + isInvalidKey(666n));
// console.log("446446: " + isInvalidKey(446446));
// console.log("565656: " + isInvalidKey(565656));

function isInvalidKey(bigint) {
    const stringNumber = bigint.toString();
    const numberLength = BigInt(stringNumber.length);
    const numberLengthNum = stringNumber.length; // normal number
    const numberDivisors = calculateDivisors(numberLength);

    if (numberLengthNum === 1) {
        return false;
    }

    for (const divisor of numberDivisors) {
        const divisorNum = Number(divisor); // convert once

        if (divisorNum === 1){
            if (new Set(stringNumber).size === 1){
                return true;
            } else {
                continue;
            }
        }

        const numberSlices = [];
        const sliceCount = numberLengthNum / divisorNum;

        for (let index = 0; index < sliceCount; index++) {
            numberSlices.push(stringNumber.slice(
                index * divisorNum,
                (index + 1) * divisorNum
            ));
        }

        if (allStringsEqual(numberSlices)) {
            return true;
        }
    }
    return false;
}

function calculateDivisors(number){
    const divisors = [];
    for (let i = 1n; i * i <= number; i++) {
        if (number % i === 0n) {
            divisors.push(i);
            
            if (i*i !== number // do not repeat the square root
                && i !== 1n // do not include the number itself
            ) {
                divisors.push(number/i);
            }
        }
    }
    return divisors;
}

function allStringsEqual(stringsArray){
    if (stringsArray.length === 0) return false;
    const firstString = stringsArray[0];
    for (const str of stringsArray) {
        if (str !== firstString) {
            return false;
        }
    }
    return true;
}