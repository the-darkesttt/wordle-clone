const lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/;
let currentGuessCount = 1;
let currentGuess = document.querySelector("#guess" + currentGuessCount);

document.addEventListener("keydown", (e) => {
    let keyPress = e.key;
    console.log(e.key);
    if (keyPress.length == 1 && lettersPattern.test(e.key)) {
        // console.log("is letter");
        updateLetters(keyPress);
    }
});

const updateLetters = (letter) => {
    currentGuess.dataset.letters = currentGuess.dataset.letters + letter;
};

const updateTiles = () => {};
