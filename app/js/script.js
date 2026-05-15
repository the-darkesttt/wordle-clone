import {
    memoize,
    BiDirectionalPriorityQueue,
    getStats,
    saveGameResult,
    resetStats,
} from "./js/library/index.js";

const lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/;
let currentGuessCount = 1;
let currentGuess = document.querySelector("#guess" + currentGuessCount);

let solutionWord = "";

const gameEventsQueue = new BiDirectionalPriorityQueue();
const addGameEvent = (message, priority) => {
    gameEventsQueue.enqueue(message, priority);
};

const getWinPercent = (stats) => {
    if (stats.played === 0) {
        return 0;
    }
    return Math.round((stats.wins / stats.played) * 100);
};

const renderStats = () => {
    const stats = getStats();
    const playedElement = document.querySelector("#stats-played");
    const winPercentElement = document.querySelector("#stats-win-percent");
    const currentStreakElement = document.querySelector(
        "#stats-current-streak",
    );
    const maxStreakElement = document.querySelector("#stats-max-streak");
    if (!playedElement) {
        return;
    }
    playedElement.innerText = stats.played;
    winPercentElement.innerText = getWinPercent(stats);
    currentStreakElement.innerText = stats.currentStreak;
    maxStreakElement.innerText = stats.maxStreak;

    renderGuessDistribution(stats);
};

const renderGuessDistribution = (stats) => {
    const container = document.querySelector("#guess-distribution");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    const distributionValues = Object.values(stats.guessDistribution);
    const maxValue = Math.max(...distributionValues, 1);
    for (let i = 1; i <= 6; i++) {
        const count = stats.guessDistribution[i];
        const widthPercent = Math.max((count / maxValue) * 100, 8);
        const row = document.createElement("div");
        row.classList.add("stats-row");
        row.innerHTML = `
            <span class="stats-row__number">${i}</span>
            <div class="stats-bar" style="width: ${widthPercent}%">
                ${count}
            </div>
        `;
        container.appendChild(row);
    }
};

const openStatsModal = () => {
    renderStats();
    const modal = document.querySelector("#stats-modal");
    if (modal) {
        modal.classList.remove("hidden");
    }
};

const closeStatsModal = () => {
    const modal = document.querySelector("#stats-modal");
    if (modal) {
        modal.classList.add("hidden");
    }
};

const setupStatsModal = () => {
    const statsButton = document.querySelector("#stats-button");
    const closeStatsButton = document.querySelector("#close-stats");
    const statsModal = document.querySelector("#stats-modal");
    if (statsButton) {
        statsButton.addEventListener("click", openStatsModal);
    }
    if (closeStatsButton) {
        closeStatsButton.addEventListener("click", closeStatsModal);
    }
    if (statsModal) {
        statsModal.addEventListener("click", (event) => {
            if (event.target === statsModal) {
                closeStatsModal();
            }
        });
    }
};

setupStatsModal();

const checkWordExists = (word) => {
    if (!/^[a-z]{5}$/.test(word)) {
        return Promise.resolve(false);
    }
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => response.ok)
        .catch((error) => {
            console.error("Dictionary API error:", error);
            return false;
        });
};

const chooseWord = () => {
    fetch(
        "https://random-words-api.kushcreates.com/api?language=en&category=wordle&length=5&words=1&type=lowercase",
    )
        .then((response) => response.json())
        .then((data) => {
            const randomWord = data[0].word || data[0];
            const normalizedWord = randomWord.toLowerCase();
            return checkWordExists(normalizedWord).then((wordExists) => {
                if (wordExists) {
                    solutionWord = normalizedWord;
                    console.log("Solution word:", solutionWord);
                    addGameEvent("Solution word loaded", 40);
                } else {
                    console.log(
                        "Invalid solution word from API:",
                        normalizedWord,
                    );
                    addGameEvent("Invalid API word: " + normalizedWord, 70);
                    chooseWord();
                }
            });
        })
        .catch((error) => {
            console.error("Error while choosing word:", error);
            solutionWord = "apple";
            console.log("Fallback solution word:", solutionWord);
            addGameEvent("Fallback solution word used", 90);
        });
};

chooseWord();

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
        } else if (
            key == "Enter" &&
            currentGuess.dataset.letters.length == 5 &&
            solutionWord !== ""
        ) {
            submitGuess();
        }
    }
}

document.addEventListener("keydown", (e) => {
    let keyPress = e.key;

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
            currentGuess.dataset.letters.length == 5 &&
            solutionWord !== ""
        ) {
            submitGuess();
        }
    }
});

const submitGuess = () => {
    const guessedWord = currentGuess.dataset.letters.toLowerCase();
    memoizedCheckWordExists(guessedWord).then((wordExists) => {
        if (!wordExists) {
            addGameEvent("Invalid guess: " + guessedWord, 80);
            shakeCurrentGuess();
            return;
        }
        addGameEvent("Valid guess: " + guessedWord, 50);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                revealTile(i, checkLetter(i));
            }, i * 200);
        }
    });
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

function* colorCycleGenerator() {
    const colors = ["#6aaa64", "#c9b458", "#787c7e", "#538d4e"];

    let index = 0;

    while (true) {
        yield colors[index];

        index++;

        if (index >= colors.length) {
            index = 0;
        }
    }
}

const consumeIteratorWithTimeout = (
    iterator,
    timeoutInSeconds,
    callback,
    intervalInMilliseconds = 150,
) => {
    const startTime = Date.now();
    const timeoutInMilliseconds = timeoutInSeconds * 1000;

    const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= timeoutInMilliseconds) {
            clearInterval(interval);
            return;
        }

        const nextValue = iterator.next().value;

        callback(nextValue);
    }, intervalInMilliseconds);
};

const startWinColorEffect = () => {
    const colorIterator = colorCycleGenerator();
    consumeIteratorWithTimeout(colorIterator, 2, (color) => {
        for (let i = 1; i < 6; i++) {
            const currentTile = document.querySelector(
                "#guess" + currentGuessCount + "Tile" + i,
            );
            currentTile.style.backgroundColor = color;
        }
    });
};

const checkWin = () => {
    if (solutionWord == currentGuess.dataset.letters) {
        addGameEvent("Player won the game", 100);
        saveGameResult(true, currentGuessCount);
        startWinColorEffect();
        setTimeout(() => {
            jumpTiles();
        }, 500);
    } else {
        currentGuessCount++;
        currentGuess = document.querySelector("#guess" + currentGuessCount);
        if (currentGuessCount == 7) {
            showSolution();
        }
    }
};

const showSolution = () => {
    addGameEvent("Player lost. Solution was: " + solutionWord, 100);
    saveGameResult(false);
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

const memoizedCheckWordExists = memoize(checkWordExists, {
    maxSize: 50,
    strategy: "LRU",
    ttl: 5 * 60 * 1000,
});

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

const shakeCurrentGuess = () => {
    currentGuess.classList.add("shake");
    setTimeout(() => {
        currentGuess.classList.remove("shake");
    }, 400);
};

const testGameEventsQueue = () => {
    console.log("----- Priority Queue Test -----");

    console.log("Peek highest:", gameEventsQueue.peek("highest"));
    console.log("Peek lowest:", gameEventsQueue.peek("lowest"));
    console.log("Peek oldest:", gameEventsQueue.peek("oldest"));
    console.log("Peek newest:", gameEventsQueue.peek("newest"));

    console.log("Dequeue highest:", gameEventsQueue.dequeue("highest"));
    console.log("Dequeue lowest:", gameEventsQueue.dequeue("lowest"));
    console.log("Dequeue oldest:", gameEventsQueue.dequeue("oldest"));
    console.log("Dequeue newest:", gameEventsQueue.dequeue("newest"));

    console.log("Queue size after test:", gameEventsQueue.getSize());
};
window.testGameEventsQueue = testGameEventsQueue;
window.gameEventsQueue = gameEventsQueue;
