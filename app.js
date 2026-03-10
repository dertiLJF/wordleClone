// WORDLE + CODEBREAKER

var game = "";
var listenerAdded = false;

window.onload = function () {
    setupKeyListener();

    if (game === "") {
        game = "codeBreaker";
        showGame(game);
    }

    document.getElementById("notWordleNav").onclick = function () {
        showGame("notWordle");
    };

    document.getElementById("codeBreakerNav").onclick = function () {
        showGame("codeBreaker");
    };
};

function setupKeyListener() {
    if (listenerAdded) return;

    document.addEventListener("keyup", handleInput);

    listenerAdded = true;
}

function handleInput(e) {
    if (gameOver) return;

    if (game === "notWordle") {
        handleWordleInput(e);
    }

    if (game === "codeBreaker") {
        handleCodeBreakerInput(e);
    }
}

function showGame(gameId) {
    if (game) {
        document.getElementById(game).classList.add("hidden");
        document.getElementById(game + "Nav").classList.remove("selected");
    }

    document.getElementById(gameId).classList.remove("hidden");
    document.getElementById(gameId + "Nav").classList.add("selected");

    game = gameId;

    if (game === "notWordle") {
        notWordle();
    } else {
        codeBreaker();
    }
}

//
// WORDLE
//

var height = 6;
var width = 5;

var currentRow = 0;
var currentCol = 0;

var gameOver = false;

var wordList = [];
var answer = "";
var guess = "";

async function fetchWords() {
    try {
        const response = await fetch(
            "https://api.datamuse.com/words?sp=?????&max=5000",
        );

        const data = await response.json();

        const wordsArray = data
            .map((item) => item.word.toLowerCase())
            .filter((word) => /^[a-z]{5}$/.test(word));

        return wordsArray;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function notWordle() {
    gameOver = false;

    currentRow = 0;
    currentCol = 0;

    document.getElementById("board").innerHTML = "";

    if (wordList.length === 0) {
        wordList = await fetchWords();
    }

    let randomIndex = Math.floor(Math.random() * wordList.length);
    answer = wordList[randomIndex].toUpperCase();

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");

            tile.id = `w-${r}-${c}`;
            tile.classList.add("tile");

            document.getElementById("board").appendChild(tile);
        }
    }
}

function handleWordleInput(e) {
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (currentCol < width) {
            let tile = document.getElementById(`w-${currentRow}-${currentCol}`);

            if (tile.innerText === "") {
                tile.innerText = e.code[3];
                currentCol++;
            }
        }
    } else if (e.code === "Backspace") {
        if (currentCol > 0) {
            currentCol--;

            let tile = document.getElementById(`w-${currentRow}-${currentCol}`);
            tile.innerText = "";
        }
    } else if (e.code === "Enter") {
        if (currentCol === width) {
            guess = "";

            for (let c = 0; c < width; c++) {
                let tile = document.getElementById(`w-${currentRow}-${c}`);
                guess += tile.innerText;
            }

            if (wordList.includes(guess.toLowerCase())) {
                checkGuess();
            }
        }
    }
}

function checkGuess() {
    if (guess === answer) {
        for (let c = 0; c < width; c++) {
            document
                .getElementById(`w-${currentRow}-${c}`)
                .classList.add("correct");
        }

        gameOver = true;
        alert("You won!");
        return;
    }

    for (let pos = 0; pos < guess.length; pos++) {
        let tile = document.getElementById(`w-${currentRow}-${pos}`);

        if (guess[pos] === answer[pos]) {
            tile.classList.add("correct");
        } else if (answer.includes(guess[pos])) {
            tile.classList.add("position");
        } else {
            tile.classList.add("incorrect");
        }
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === height) {
        gameOver = true;
        alert("You lose!");
    }
}

//
// CODEBREAKER
//

var breakerWidth = 4;
var breakerHeight = 6;

var codeRow = 0;
var codeColumn = 0;

var numbers = "";

function codeBreaker() {
    gameOver = false;

    codeRow = 0;
    codeColumn = 0;

    numbers = "";

    document.getElementById("codeBoard").innerHTML = "";

    for (let i = 0; i < breakerWidth; i++) {
        numbers += Math.floor(Math.random() * 10);
    }

    for (let r = 0; r < breakerHeight; r++) {
        for (let c = 0; c < breakerWidth; c++) {
            let tile = document.createElement("span");

            tile.id = `c-${r}-${c}`;
            tile.classList.add("tile");

            document.getElementById("codeBoard").appendChild(tile);
        }
    }
}

function handleCodeBreakerInput(e) {
    if ("Digit0" <= e.code && e.code <= "Digit9") {
        if (codeColumn < breakerWidth) {
            let tile = document.getElementById(`c-${codeRow}-${codeColumn}`);

            if (tile.innerText === "") {
                tile.innerText = e.code[5];
                codeColumn++;
            }
        }
    } else if (e.code === "Backspace") {
        if (codeColumn > 0) {
            codeColumn--;

            document.getElementById(`c-${codeRow}-${codeColumn}`).innerText =
                "";
        }
    } else if (e.code === "Enter") {
        if (codeColumn === breakerWidth) {
            let guess = "";

            for (let c = 0; c < breakerWidth; c++) {
                guess += document.getElementById(`c-${codeRow}-${c}`).innerText;
            }

            checkNumber(guess);
        }
    }
}

function checkNumber(guess) {
    if (guess === numbers) {
        for (let c = 0; c < breakerWidth; c++) {
            document
                .getElementById(`c-${codeRow}-${c}`)
                .classList.add("correct");
        }

        gameOver = true;
        alert("You won!");
        return;
    }

    for (let pos = 0; pos < guess.length; pos++) {
        let tile = document.getElementById(`c-${codeRow}-${pos}`);

        if (guess[pos] === numbers[pos]) {
            tile.classList.add("correct");
        } else if (guess[pos] < numbers[pos]) {
            tile.classList.add("position");
            tile.innerHTML += "↑";
        } else {
            tile.classList.add("position");
            tile.innerHTML += "↓";
        }
    }

    codeRow++;
    codeColumn = 0;

    if (codeRow === breakerHeight) {
        gameOver = true;
        alert("You lose!");
    }
}
