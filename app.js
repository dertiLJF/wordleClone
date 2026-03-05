var height = 6; // number of guesses
var width = 5; // length of word
var currentRow = 0; // current attempt
var currentCol = 0; // current letter for attempt
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
    initialize();
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

async function initialize() {
    // if (gameMode === "clean") {
    //     wordList = wordListClean;
    // } else {
    //     wordList = wordListRude;
    // }

    wordList = await fetchWords();
    console.log(wordList);
    var randomIndex = Math.floor(Math.random() * wordList.length);
    answer = wordList[randomIndex].toUpperCase(); // get random word from word list, and make it uppercase;
    // for testing put answer on page
    document.getElementById("answer").innerText = "Answer: " + answer;

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
    console.log("check guess running");
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
    currentRow += 1;
    currentCol = 0;
}
