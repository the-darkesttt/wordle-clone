const lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/;
let currentGuessCount = 1;
let currentGuess = document.querySelector("#guess" + currentGuessCount);

let words = ["baker", "store", "horse", "clone", "speak", "apple"];
let solutionWord = "";
const chooseWord = () => {
    let randomItem = Math.floor(Math.random() * (words.length - 1)) + 1;
    solutionWord = words[randomItem];
};

chooseWord();
console.log(solutionWord);

document.addEventListener("keydown", (e) => {
    let keyPress = e.key;
    console.log(e.key);
    if (
        keyPress.length == 1 &&
        lettersPattern.test(e.key) &&
        currentGuess.dataset.letters.length < 5
    ) {
        updateLetters(keyPress);
    } else if (e.key == "Backspace" && currentGuess.dataset.letters != "") {
        deleteFromLetters();
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

const deleteFromLetters = () => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters.slice(0, -1);
    currentGuess.dataset.letters = newLetters;
    deleteFromTiles(oldLetters.length);
};

const deleteFromTiles = (tileNumber) => {
    document.querySelector("#guessTile" + tileNumber).innerText = "";
};
