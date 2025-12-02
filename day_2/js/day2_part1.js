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

function isInvalidKey(bigint) {
    const stringNumber = bigint.toString();
    // odd digit keys are necesseraly valid
    if (stringNumber.length % 2 === 1){
        return false;
    }
    const mid = stringNumber.length / 2;
    const first = stringNumber.slice(0, mid);
    const second = stringNumber.slice(mid);
    return first === second;
}

