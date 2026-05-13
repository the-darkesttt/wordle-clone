import {
    colorCycleGenerator,
    counterGenerator,
    consumeIteratorWithTimeout,
} from "wordle-task1-library";

const colorIterator = colorCycleGenerator();

consumeIteratorWithTimeout(colorIterator, 2, (color) => {
    console.log("Current color:", color);
});

const counterIterator = counterGenerator(10);

consumeIteratorWithTimeout(counterIterator, 3, (number) => {
    console.log("Current number:", number);
});
