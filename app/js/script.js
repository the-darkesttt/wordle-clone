const lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/;
let currentGuessCount = 1;
let currentGuess = document.querySelector("#guess" + currentGuessCount);

document.addEventListener("keydown", (e) => {
    let keyPress = e.key;
    console.log(e.key);
    if (keyPress.length == 1 && lettersPattern.test(e.key)) {
        updateLetters(keyPress);
    }
});

const updateLetters = (letter) => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters + letter;
    let currentTile = newLetters.length;
    currentGuess.dataset.letters = newLetters;
    console.log("currentTile = " + currentTile);
    updateTiles(currentTile, letter);
};

const updateTiles = (tileNumber, letter) => {
    let currentTile = document.querySelector("#guessTile" + tileNumber);
    currentTile.innerText = letter;
};
