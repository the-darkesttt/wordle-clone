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
    if (
        keyPress.length == 1 &&
        lettersPattern.test(e.key) &&
        currentGuess.dataset.letters.length < 5
    ) {
        updateLetters(keyPress);
    } else if (e.key == "Backspace" && currentGuess.dataset.letters != "") {
        deleteFromLetters();
    } else if (e.key == "Enter" && currentGuess.dataset.letters.length == 5) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                revealTile(i, checkLetter(i));
            }, i * 200);
        }
    }
});

const updateLetters = (letter) => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters + letter;
    let currentTile = newLetters.length;
    currentGuess.dataset.letters = newLetters;
    updateTiles(currentTile, letter);
};

const updateTiles = (tileNumber, letter) => {
    let currentTile = document.querySelector("#guessTile" + tileNumber);
    currentTile.innerText = letter;
    currentTile.classList.add("has-letter");
};

const deleteFromLetters = () => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters.slice(0, -1);
    currentGuess.dataset.letters = newLetters;
    deleteFromTiles(oldLetters.length);
};

const deleteFromTiles = (tileNumber) => {
    let currentTile = document.querySelector("#guessTile" + tileNumber);
    currentTile.innerText = "";
    currentTile.classList.remove("has-letter");
};

const checkLetter = (position) => {
    let guessedLetter = currentGuess.dataset.letters.charAt(position);
    let solutionLetter = solutionWord.charAt(position);
    if (guessedLetter == solutionLetter) {
        return "correct";
    } else {
        return checkLetterExists(guessedLetter) ? "present" : "absent";
    }
};

const checkLetterExists = (letter) => {
    return solutionWord.includes(letter);
};

const revealTile = (i, state) => {
    let tileNumber = i + 1;
    let tile = document.querySelector("#guessTile" + tileNumber);
    flipTile(tileNumber, state);
};

const flipTile = (tileNum, state) => {
    let tile = document.querySelector("#guessTile" + tileNum);
    tile.classList.remove("has-letter");
    tile.classList.add("flip-in");
    setTimeout(() => {
        tile.classList.add(state);
    }, 250);
    setTimeout(() => {
        tile.classList.remove("flip-in");
        tile.classList.add("flip-out");
    }, 250);
};
