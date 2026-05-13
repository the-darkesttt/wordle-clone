# Wordle Clone

A browser Wordle clone built with HTML, SCSS, JavaScript and Gulp.

## Task 1 Library

The project includes a small local JavaScript library with:

- `colorCycleGenerator()` — infinite color generator.
- `counterGenerator(startValue)` — infinite counter generator.
- `consumeIteratorWithTimeout(iterator, timeoutInSeconds, callback)` — consumes iterator values for a limited time.

## Usage in Wordle

The Wordle game uses `colorCycleGenerator()` and `consumeIteratorWithTimeout()` to create a short color animation after the player wins.

## Example Project

An example project is located in:

```text
examples/task1-demo
```

## Live Demo

https://the-darkesttt.github.io/wordle-clone/