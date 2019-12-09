/*
--- Day 3: Crossed Wires ---
The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back
on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend
outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your
puzzle input).

The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection
point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While
the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire
count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5,
left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........
Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

Here are a few more examples:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
What is the Manhattan distance from the central port to the closest intersection?
*/

const inputs = require('./03_input');

const evaluate = instruction => ({
  direction: instruction.slice(0,1),
  units: Number(instruction.slice(1))
});

const defineGrid = () => {
  let maxLeft = Infinity;
  let maxRight = Number.NEGATIVE_INFINITY;
  let maxUp = Number.NEGATIVE_INFINITY;
  let maxDown = Infinity;
  let horizontal = 0;
  let vertical = 0;

  const move = {
    U: units => { vertical += units },
    D: units => { vertical -= units },
    L: units => { horizontal -= units },
    R: units => { horizontal += units }
  }

  inputs.wire1.split(',').forEach(entry => {
    const instruction = evaluate(entry);
    move[instruction.direction](instruction.units);
    maxLeft = Math.min(maxLeft,horizontal);
    maxRight = Math.max(maxRight,horizontal);
    maxUp = Math.max(maxUp,vertical);
    maxDown = Math.min(maxDown,vertical);
  });
  horizontal = 0;
  vertical = 0;
  console.log(maxLeft, maxRight, maxUp, maxDown);
  inputs.wire2.split(',').forEach(entry => {
    const instruction = evaluate(entry);
    move[instruction.direction](instruction.units);
    maxLeft = Math.min(maxLeft,horizontal);
    maxRight = Math.max(maxRight,horizontal);
    maxUp = Math.max(maxUp,vertical);
    maxDown = Math.min(maxDown,vertical);
  });
  console.log(maxLeft, maxRight, maxUp, maxDown);
  return { maxLeft, maxRight, maxUp, maxDown };
}

const bruteForce = () => {
  const boundaries = defineGrid();
  const row = Array.apply(null, Array(boundaries.maxRight - boundaries.maxLeft + 1).map(() => 0));
  const grid = [];
  for (let i=0; i<(boundaries.maxUp - boundaries.maxDown + 1); i++) {
    grid.push(row.slice());
  }
  console.log('Rows', grid.length);
  console.log('Columns', grid[0].length);
  const originColumn = (boundaries.maxLeft * -1);
  const originRow = boundaries.maxUp;
  let horizontal = originColumn;
  let vertical = originRow;
  let closest = Infinity;
  let closestSteps = Infinity;
  let wire1TotalSteps = 0;
  let wire2TotalSteps = 0;
  let wire1StepRecord = {};

  inputs.wire1.split(',').forEach(entry => {
    const instruction = evaluate(entry);
    for (let i=0; i<instruction.units; i++) {
      wire1TotalSteps ++;
      if (instruction.direction === 'U') {
        vertical --;
      } else if (instruction.direction === 'D') {
        vertical ++;
      } else if (instruction.direction === 'L') {
        horizontal --;
      } else {
        horizontal ++;
      }
      grid[vertical][horizontal] = 1;
      wire1StepRecord[`${vertical}-${horizontal}`] = wire1StepRecord[`${vertical}-${horizontal}`] || wire1TotalSteps;
    }
  });
  horizontal = originColumn;
  vertical = originRow;
  inputs.wire2.split(',').forEach(entry => {
    const instruction = evaluate(entry);
    for (let i=0; i<instruction.units; i++) {
      wire2TotalSteps ++;
      if (instruction.direction === 'U') {
        vertical --;
      } else if (instruction.direction === 'D') {
        vertical ++;
      } else if (instruction.direction === 'L') {
        horizontal --;
      } else {
        horizontal ++;
      }
      // console.log(entry,vertical,horizontal); 
      if (grid[vertical][horizontal] === 1) {
        let manhattan = (Math.abs(originColumn-horizontal) + Math.abs(originRow-vertical));
        closest = Math.min(closest,manhattan);
        closestSteps = Math.min(closestSteps,wire2TotalSteps + wire1StepRecord[`${vertical}-${horizontal}`]);
        grid[vertical][horizontal] === 3;
      } else {
        grid[vertical][horizontal] === 2;
      }
    }
  });
  console.log('Part 1 answer:', closest);
  console.log('Part 2 answer:', closestSteps);
}

bruteForce();

/*
--- Part Two ---
It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the
sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the
first time it visits that position when calculating the total value of a specific intersection.

The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location,
including the intersection being considered. Again consider the example from above:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire
and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes
only 7+6+2 = 15, a total of 15+15 = 30 steps.

Here are the best steps for the extra examples from above:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = 610 steps
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = 410 steps
What is the fewest combined steps the wires must take to reach an intersection?
*/
