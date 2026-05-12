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

const keyBoardButtons = document.querySelectorAll(".button");

keyBoardButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const keyValue = button.textContent.trim();
        handleKeyboardClick(keyValue);
    });
});

function handleKeyboardClick(key) {
    console.log("Button pressed:", key);

    if (currentGuessCount < 7) {
        if (
            key.length == 1 &&
            lettersPattern.test(key) &&
            currentGuess.dataset.letters.length < 5
        ) {
            updateLetters(key.toLowerCase());
        } else if (key == "Backspace" && currentGuess.dataset.letters != "") {
            deleteFromLetters();
        } else if (key == "Enter" && currentGuess.dataset.letters.length == 5) {
            submitGuess();
        }
    }
}

document.addEventListener("keydown", (e) => {
    let keyPress = e.key;
    console.log(keyPress);

    if (currentGuessCount < 7) {
        if (
            keyPress.length == 1 &&
            lettersPattern.test(keyPress) &&
            currentGuess.dataset.letters.length < 5
        ) {
            updateLetters(keyPress.toLowerCase());
        } else if (
            keyPress == "Backspace" &&
            currentGuess.dataset.letters != ""
        ) {
            deleteFromLetters();
        } else if (
            keyPress == "Enter" &&
            currentGuess.dataset.letters.length == 5
        ) {
            submitGuess();
        }
    }
});

const submitGuess = () => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            revealTile(i, checkLetter(i));
        }, i * 200);
    }
};

const checkIfGuessComplete = (i) => {
    if (i == 4) {
        checkWin();
    }
};

const jumpTiles = () => {
    for (let i = 1; i < 6; i++) {
        setTimeout(() => {
            let currentTile = document.querySelector(
                "#guess" + currentGuessCount + "Tile" + i,
            );
            currentTile.classList.add("jump");
        }, 200 * i);
    }
};

const checkWin = () => {
    if (solutionWord == currentGuess.dataset.letters) {
        alert("Game won! Congrats");
        setTimeout(jumpTiles(), 500);
    } else {
        currentGuessCount++;
        currentGuess = document.querySelector("#guess" + currentGuessCount);
        if (currentGuessCount == 7) {
            showSolution();
        }
    }
};

const showSolution = () => {
    alert(
        "Better luck next time. Solution word is " + "'" + solutionWord + "'",
    );
};

const updateLetters = (letter) => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters + letter;
    let currentTile = newLetters.length;
    currentGuess.dataset.letters = newLetters;
    updateTiles(currentTile, letter);
};

const updateTiles = (tileNumber, letter) => {
    let currentTile = document.querySelector(
        "#guess" + currentGuessCount + "Tile" + tileNumber,
    );
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
    let currentTile = document.querySelector(
        "#guess" + currentGuessCount + "Tile" + tileNumber,
    );
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
    let guessedLetter = currentGuess.dataset.letters[i];

    flipTile(tileNumber, state);

    if (guessedLetter) {
        updateKeyboardButton(guessedLetter, state);
    }

    checkIfGuessComplete(i);
};

const flipTile = (tileNum, state) => {
    let tile = document.querySelector(
        "#guess" + currentGuessCount + "Tile" + tileNum,
    );
    tile.classList.remove("has-letter");
    tile.classList.add("flip-in");
    setTimeout(() => {
        tile.classList.add(state);
    }, 250);
    setTimeout(() => {
        tile.classList.remove("flip-in");
        tile.classList.add("flip-out");
    }, 250);
    setTimeout(() => {
        tile.classList.remove("flip-out");
    }, 1500);
};

const updateKeyboardButton = (letter, state) => {
    const buttons = document.querySelectorAll(".button");

    buttons.forEach((button) => {
        const buttonLetter = button.textContent.trim().toLowerCase();

        if (buttonLetter === letter.toLowerCase()) {
            const currentState = getKeyboardButtonState(button);

            if (shouldUpdateKeyboardState(currentState, state)) {
                button.classList.remove("correct", "present", "absent");
                button.classList.add(state);
            }
        }
    });
};

const getKeyboardButtonState = (button) => {
    if (button.classList.contains("correct")) {
        return "correct";
    }

    if (button.classList.contains("present")) {
        return "present";
    }

    if (button.classList.contains("absent")) {
        return "absent";
    }

    return "";
};

const shouldUpdateKeyboardState = (currentState, newState) => {
    const statePriority = {
        "": 0,
        absent: 1,
        present: 2,
        correct: 3,
    };

    return statePriority[newState] > statePriority[currentState];
};
