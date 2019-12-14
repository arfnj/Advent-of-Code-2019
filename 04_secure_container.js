/*
--- Day 4: Secure Container ---
You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on
a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?

Your puzzle input is 231832-767346.
*/

const START = 231832;
const END = 767346;

let part1matches = 0;

for (let i=START; i<=END; i++) {
  let prevNumber = i%10;
  let workingNumber = Math.floor(i/10);
  let doubles = false;
  let valid = true;
  while (workingNumber > 0 && valid) {
    let nextNumber = workingNumber%10;
    if (nextNumber > prevNumber) {
      valid = false;
      break;
    } else if (nextNumber === prevNumber) {
      doubles = true;
    }
    prevNumber = nextNumber;
    workingNumber = Math.floor(workingNumber/10);
  }
  if (!valid || !doubles) {
    continue;
  }
  part1matches ++;
}

console.log(part1matches);

/*
--- Part Two ---
An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of
matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
How many different passwords within the range given in your puzzle input meet all of the criteria?
*/

let part2matches = 0;

for (let i=START; i<=END; i++) {
  let prevNumber = i%10;
  let workingNumber = Math.floor(i/10);
  let streaks = [];
  let valid = true;
  let streak = 1;
  while (workingNumber > 0 && valid) {
    let nextNumber = workingNumber%10;
    if (nextNumber > prevNumber) {
      valid = false;
      break;
    } else if (nextNumber === prevNumber) {
      streak ++;
    } else if (nextNumber < prevNumber) {
      streaks.push(streak);
      streak = 1;
    }
    prevNumber = nextNumber;
    workingNumber = Math.floor(workingNumber/10);
  }
  streaks.push(streak);
  if (!valid || !streaks.includes(2)) {
    continue;
  }
  part2matches ++;
}

console.log(part2matches);
