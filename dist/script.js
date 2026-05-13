"use strict";
var lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/,
    currentGuessCount = 1,
    currentGuess = document.querySelector("#guess" + currentGuessCount),
    solutionWord = "",
    chooseWord = function () {
        fetch(
            "https://random-words-api.kushcreates.com/api?language=en&category=wordle&length=5&words=1&type=lowercase",
        )
            .then(function (e) {
                return e.json();
            })
            .then(function (e) {
                ((solutionWord = (solutionWord =
                    e[0].word || e[0]).toLowerCase()),
                    console.log("Solution word:", solutionWord));
            })
            .catch(function (e) {
                (console.error("Error while choosing word:", e),
                    (solutionWord = "apple"));
            });
    };
chooseWord();
var keyBoardButtons = document.querySelectorAll(".button");
function handleKeyboardClick(e) {
    (console.log("Button pressed:", e),
        currentGuessCount < 7 &&
            (1 == e.length &&
            lettersPattern.test(e) &&
            currentGuess.dataset.letters.length < 5
                ? updateLetters(e.toLowerCase())
                : "Backspace" == e && "" != currentGuess.dataset.letters
                  ? deleteFromLetters()
                  : "Enter" == e &&
                    5 == currentGuess.dataset.letters.length &&
                    "" !== solutionWord &&
                    submitGuess()));
}
(keyBoardButtons.forEach(function (e) {
    e.addEventListener("click", function () {
        handleKeyboardClick(e.textContent.trim());
    });
}),
    document.addEventListener("keydown", function (e) {
        var t = e.key;
        currentGuessCount < 7 &&
            (1 == t.length &&
            lettersPattern.test(t) &&
            currentGuess.dataset.letters.length < 5
                ? updateLetters(t.toLowerCase())
                : "Backspace" == t && "" != currentGuess.dataset.letters
                  ? deleteFromLetters()
                  : "Enter" == t &&
                    5 == currentGuess.dataset.letters.length &&
                    "" !== solutionWord &&
                    submitGuess());
    }));
var submitGuess = function () {
        var e = currentGuess.dataset.letters.toLowerCase();
        checkWordExists(e).then(function (e) {
            if (e)
                for (
                    var t = function (e) {
                            setTimeout(function () {
                                revealTile(e, checkLetter(e));
                            }, 200 * e);
                        },
                        s = 0;
                    s < 5;
                    s++
                )
                    t(s);
            else shakeCurrentGuess();
        });
    },
    checkIfGuessComplete = function (e) {
        4 == e && checkWin();
    },
    jumpTiles = function () {
        for (
            var e = function (e) {
                    setTimeout(function () {
                        document
                            .querySelector(
                                "#guess" + currentGuessCount + "Tile" + e,
                            )
                            .classList.add("jump");
                    }, 200 * e);
                },
                t = 1;
            t < 6;
            t++
        )
            e(t);
    },
    startWinColorEffect = function () {
        var e = (0, _index.colorCycleGenerator)();
        (0, _index.consumeIteratorWithTimeout)(e, 2, function (e) {
            for (var t = 1; t < 6; t++) {
                document.querySelector(
                    "#guess" + currentGuessCount + "Tile" + t,
                ).style.backgroundColor = e;
            }
        });
    },
    checkWin = function () {
        solutionWord == currentGuess.dataset.letters
            ? (startWinColorEffect(),
              setTimeout(function () {
                  jumpTiles();
              }, 500))
            : (currentGuessCount++,
              (currentGuess = document.querySelector(
                  "#guess" + currentGuessCount,
              )),
              7 == currentGuessCount && showSolution());
    },
    showSolution = function () {
        alert("Better luck next time. Solution word is '" + solutionWord + "'");
    },
    updateLetters = function (e) {
        var t = currentGuess.dataset.letters + e,
            s = t.length;
        ((currentGuess.dataset.letters = t), updateTiles(s, e));
    },
    updateTiles = function (e, t) {
        var s = document.querySelector(
            "#guess" + currentGuessCount + "Tile" + e,
        );
        ((s.innerText = t), s.classList.add("has-letter"));
    },
    deleteFromLetters = function () {
        var e = currentGuess.dataset.letters,
            t = e.slice(0, -1);
        ((currentGuess.dataset.letters = t), deleteFromTiles(e.length));
    },
    deleteFromTiles = function (e) {
        var t = document.querySelector(
            "#guess" + currentGuessCount + "Tile" + e,
        );
        ((t.innerText = ""), t.classList.remove("has-letter"));
    },
    checkLetter = function (e) {
        var t = currentGuess.dataset.letters.charAt(e);
        return t == solutionWord.charAt(e)
            ? "correct"
            : checkLetterExists(t)
              ? "present"
              : "absent";
    },
    checkLetterExists = function (e) {
        return solutionWord.includes(e);
    },
    checkWordExists = function (e) {
        return /^[a-z]{5}$/.test(e)
            ? fetch(
                  "https://api.dictionaryapi.dev/api/v2/entries/en/".concat(e),
              )
                  .then(function (e) {
                      return e.ok;
                  })
                  .catch(function (e) {
                      return (console.error("Dictionary API error:", e), !1);
                  })
            : Promise.resolve(!1);
    },
    revealTile = function (e, t) {
        var s = e + 1,
            r = currentGuess.dataset.letters[e];
        (flipTile(s, t),
            r && updateKeyboardButton(r, t),
            checkIfGuessComplete(e));
    },
    flipTile = function (e, t) {
        var s = document.querySelector(
            "#guess" + currentGuessCount + "Tile" + e,
        );
        (s.classList.remove("has-letter"),
            s.classList.add("flip-in"),
            setTimeout(function () {
                s.classList.add(t);
            }, 250),
            setTimeout(function () {
                (s.classList.remove("flip-in"), s.classList.add("flip-out"));
            }, 250),
            setTimeout(function () {
                s.classList.remove("flip-out");
            }, 1500));
    },
    updateKeyboardButton = function (e, t) {
        document.querySelectorAll(".button").forEach(function (s) {
            if (s.textContent.trim().toLowerCase() === e.toLowerCase()) {
                var r = getKeyboardButtonState(s);
                shouldUpdateKeyboardState(r, t) &&
                    (s.classList.remove("correct", "present", "absent"),
                    s.classList.add(t));
            }
        });
    },
    getKeyboardButtonState = function (e) {
        return e.classList.contains("correct")
            ? "correct"
            : e.classList.contains("present")
              ? "present"
              : e.classList.contains("absent")
                ? "absent"
                : "";
    },
    shouldUpdateKeyboardState = function (e, t) {
        var s = { "": 0, absent: 1, present: 2, correct: 3 };
        return s[t] > s[e];
    },
    shakeCurrentGuess = function () {
        (currentGuess.classList.add("shake"),
            setTimeout(function () {
                currentGuess.classList.remove("shake");
            }, 400));
    };
//# sourceMappingURL=script.js.map
