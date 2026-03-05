// TODO :
// WORDLE

// wordle bits
//
var height = 6; // number of guesses
var width = 5; // length of word
var currentRow = 0; // current attempt
var currentCol = 0; // current column for attempt
var gameOver = false;
var wordListRude = [
    "asses",
    "dicks",
    "prick",
    "cunts",
    "sluts",
    "skank",
    "twats",
    "shits",
    "fucks",
    "cocks",
    "scums",
    "louse",
    "lousy",
    "jerks",
    "boobs",
    "idiot",
    "moron",
    "whore",
    "craps",
    "pussy",
    "wanks",
    "filth",
    "scabs",
    "snots",
    "punks",
    "worms",
    "dirty",
    "grubs",
    "loser",
    "stink",
    "reeks",
    "fugly",
    "skuzz",
];
var wordListClean = [
    "apple",
    "bread",
    "chair",
    "table",
    "plant",
    "light",
    "sound",
    "stone",
    "water",
    "earth",
    "cloud",
    "river",
    "ocean",
    "field",
    "grass",
    "smile",
    "laugh",
    "dream",
    "sweet",
    "spice",
    "train",
    "plane",
    "truck",
    "phone",
    "watch",
    "clock",
    "glass",
    "plate",
    "spoon",
    "knife",
    "shirt",
    "pants",
    "shoes",
    "socks",
    "paper",
    "brush",
    "paint",
    "color",
    "music",
    "piano",
    "flute",
    "drums",
    "heart",
    "brain",
    "hands",
    "teeth",
    "mouth",
];
var wordList = [];
var legalWords = [];
var answer = "";
var guess = "";
var gameMode = "clean"; // default game mode

window.onload = function () {
    codeBreaker();
    // notWordle();
};

async function fetchWords() {
    try {
        const response = await fetch(
            "https://api.datamuse.com/words?sp=?????&max=5000",
        );
        const data = await response.json();

        const wordsArray = data
            .map((item) => item.word.toLowerCase()) // extract word
            .filter((word) => /^[a-z]{5}$/.test(word)); // ensures only five letter words

        console.log(`Loaded ${wordsArray.length} words`);
        return wordsArray;
    } catch (error) {
        console.error("Error fetching words: ", error);
        return [];
    }
}

async function notWordle() {
    // if (gameMode === "clean") {
    //     wordList = wordListClean;
    // } else {
    //     wordList = wordListRude;
    // }

    wordList = await fetchWords();
    var randomIndex = Math.floor(Math.random() * wordList.length);
    answer = wordList[randomIndex].toUpperCase(); // get random word from word list, and make it uppercase;
    // document.getElementById("answer").innerText = "Answer: " + answer; // for testing

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString(); // e.g 0-1, 1-3
            tile.classList.add("tile"); // give class 'tile', so we can style it in css
            tile.innerText = ""; // placeholder text
            document.getElementById("board").appendChild(tile);
        }
    }

    // listen for key press
    document.addEventListener("keyup", (e) => {
        if (gameOver) return; // if end of game, stop game

        // alert(e.code); // for testing, alert the key code of the key pressed

        if ("KeyA" <= e.code && e.code <= "KeyZ") {
            if (currentCol < width) {
                let currentTile = document.getElementById(
                    currentRow.toString() + "-" + currentCol.toString(),
                );
                if (currentTile.innerText == "") {
                    currentTile.innerText = e.code[3]; // get the letter from the key code, e.g. 'KeyA' = 'A'
                    currentCol += 1;
                }
            }
        } else if (e.code == "Backspace") {
            if (currentCol > 0) {
                currentCol -= 1;
                let currentTile = document.getElementById(
                    currentRow.toString() + "-" + currentCol.toString(),
                );
                currentTile.innerText = "";
            }
        } else if (e.code == "Enter") {
            if (currentCol == width) {
                // check the guess
                guess = "";
                for (let c = 0; c < width; c++) {
                    let currentTile = document.getElementById(
                        currentRow.toString() + "-" + c.toString(),
                    );
                    guess += currentTile.innerText; // add the letter in each tile to the guess
                }
                let checkWord = guess.toLowerCase();

                if (wordList.includes(checkWord)) {
                    checkGuess(guess);
                }
            }
        }
    });
}

function checkGuess() {
    if (guess == answer) {
        // change boxes to green, alert win message, end game

        for (let c = 0; c < width; c++) {
            let currentTile = document.getElementById(
                currentRow.toString() + "-" + c.toString(),
            );
            currentTile.classList.add("correct"); // add correct class to all tiles in row, so they turn green in css
        }
        alert("Congratulations! You won!");
        return;
    } else {
        // change to green if letter in correct position
        for (let pos = 0; pos < guess.length; pos++) {
            if (guess[pos] === answer[pos]) {
                let position = document.getElementById(
                    currentRow.toString() + "-" + pos.toString(),
                );
                position.classList.add("correct");
            }
        }
        // change to yellow if letter is there but incorrect position
        for (let pos = 0; pos < guess.length; pos++) {
            if (guess[pos] !== answer[pos] && answer.includes(guess[pos])) {
                let position = document.getElementById(
                    currentRow.toString() + "-" + pos.toString(),
                );
                position.classList.add("position");
            }
        }
        // change to grey if letter is not in word
        for (let pos = 0; pos < guess.length; pos++) {
            let position = document.getElementById(
                currentRow.toFixed() + "-" + pos.toString(),
            );
            if (
                !position.classList.contains("correct") &&
                !position.classList.contains("position")
            ) {
                position.classList.add("incorrect");
            }
        }
    }
    currentRow++;
    currentCol = 0;
    if (currentRow == height) {
        gameOver = true;
        alert("You ran out of guesses! You lose!");
    }
}
//
//
var codeColumn = 0;
var codeRow = 0;
var breakerWidth = 4;
var breakerHeight = 6;
var numbers = "";

// Code guessing game
function codeBreaker() {
    // generate random number
    for (let n = 0; n < breakerWidth; n++) {
        numbers += Math.floor(Math.random() * 10);
    }
    console.log(numbers);

    // create board
    for (let r = 0; r < breakerHeight; r++) {
        for (let c = 0; c < breakerWidth; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";

            document.getElementById("codeBoard").appendChild(tile);
        }
    }

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        if ("Digit0" <= e.code && e.code <= "Digit9") {
            if (codeColumn < breakerWidth) {
                let currentTile = document.getElementById(
                    codeRow.toString() + "-" + codeColumn.toString(),
                );

                if (currentTile.innerText == "") {
                    currentTile.innerText = e.code[5];
                    codeColumn += 1;
                }
            }
        } else if (e.code == "Backspace") {
            if (codeColumn > 0) {
                codeColumn -= 1;
                let currentTile = document.getElementById(
                    codeRow.toString() + "-" + codeColumn.toString(),
                );
                currentTile.innerText = "";
            }
        } else if (e.code == "Enter") {
            if (codeColumn == breakerWidth) {
                let guess = "";

                for (let c = 0; c < breakerWidth; c++) {
                    let currentTile = document.getElementById(
                        codeRow.toString() + "-" + c.toString(),
                    );
                    guess += currentTile.innerText;
                }

                checkNumber(guess, numbers);
            }
        } else if (e.code == "Enter") {
            if (codeColumn == breakerWidth) {
                // check the guess
                let guess = "";
                for (let c = 0; c < breakerWidth; c++) {
                    let currentTile = document.getElementById(
                        codeRow.toString() + "-" + c.toString(),
                    );
                    guess += currentTile.innerText; // add the letter in each tile to the guess
                }

                checkNumber(guess, numbers);
            }
        }
    });
}

function checkNumber(guess, numbers) {
    console.log("test - checking numbers"); // for testing
    if (guess === numbers) {
        for (let c = 0; c < breakerWidth; c++) {
            let currentTile = document.getElementById(
                codeRow.toString() + "-" + c.toString(),
            );
            currentTile.classList.add("correct"); // add correct class to all tiles in row, so they turn green in css
        }
        alert("Congratulations! You won!");
        return;
    } else {
        for (let pos = 0; pos < guess.length; pos++) {
            if (guess[pos] === numbers[pos]) {
                let currentTile = document.getElementById(
                    codeRow.toString() + "-" + pos.toString(),
                );
                currentTile.classList.add("correct");
            } else if (guess[pos] < numbers[pos]) {
                let position = document.getElementById(
                    codeRow.toString() + "-" + pos.toString(),
                );
                position.classList.add("position");
                let symbol = document.createElement("p");
                symbol.innerHTML = "&#8593;";
                position.appendChild(symbol);
            } else {
                let position = document.getElementById(
                    codeRow.toString() + "-" + pos.toString(),
                );
                position.classList.add("position");
                let symbol = document.createElement("p");
                symbol.innerHTML = "&#8595;";
                position.appendChild(symbol);
            }
        }
    }
    codeRow++;
    codeColumn = 0;
    if (codeRow == breakerHeight) {
        gameOver = true;
        alert("You ran out of guesses! You lose!");
    }
}
