const url = "https://sugoku.onrender.com/board?difficulty=";
const game = document.querySelector(".game");
const rows = game.querySelectorAll(".row");
const boxes = game.querySelectorAll(".box");
const numPadNumber = document.querySelectorAll(".num");
const newGameBtn = document.querySelector(".newGame");

let boardVal = [];
let arr = [];
let sol = [];
let score = 0;
let mistakes = 0;
let hints = 3;
let stack = [];
let dif = "easy";
let time = null;
let h = 0;
let m = 0;
let s = 0;

function checkEmpty(i, j) {
    return sol[i][j] === 0;
}

function checkPos(i, j, k) {
    for (let x = 0; x < 9; x++) {
        if (sol[i][x] === k || sol[x][j] === k) return false;
    }
    const x = Math.floor(i / 3) * 3;
    const y = Math.floor(j / 3) * 3;
    for (let p = x; p < x + 3; p++) {
        for (let q = y; q < y + 3; q++) {
            if (sol[p][q] === k) return false;
        }
    }
    return true;
}

function solve(i, j) {
    if (i === 9) return true;
    if (j === 9) return solve(i + 1, 0);
    if (checkEmpty(i, j)) {
        for (let k = 1; k <= 9; k++) {
            if (checkPos(i, j, k)) {
                sol[i][j] = k;
                if (solve(i, j + 1)) {
                    return true;
                }
                sol[i][j] = 0;
            }
        }
        return false;
    } else {
        return solve(i, j + 1);
    }
}

function populateMatrix() {
    for (let i = 0; i < 9; i++) {
        const box = rows[i].querySelectorAll(".box");
        for (let j = 0; j < 9; j++) {
            if (arr[i][j] !== 0) {
                box[j].innerText = arr[i][j];
                box[j].classList.add("og");
            } else {
                box[j].innerText = "";
                box[j].classList.remove("og");
            }
            box[j].classList.add("showText");
        }
    }
}

function updateScore() {
    const newScore = document.querySelector(".score");
    if (score < 0) score = 0;
    newScore.innerText = `Score: ${score}`;
}

function updateMistakes() {
    const mist = document.querySelector(".mistakes");
    mist.innerText = `Mistakes: ${mistakes}/3`;
    if (mistakes === 3) {
        setTimeout(() => {
            alert("Game Over");
            refreshGame();
        }, 0);
    }
}

function fillNumber(event) {
    const clickedNumber = event.target;
    const selectedBox = document.querySelector('.selected');
    if (selectedBox && !selectedBox.classList.contains("og")) {
        const boxId = parseInt(selectedBox.id);
        const i = Math.floor(boxId / 9);
        const j = boxId % 9;
        const num = parseInt(clickedNumber.innerText);
        if (selectedBox.innerText !== num.toString()) {
            stack.push(boxId);
            selectedBox.innerText = num;
            arr[i][j] = num;
            selectedBox.classList.remove('red', 'green');
            if (num === sol[i][j]) {
                selectedBox.classList.add('green');
                score += 100;
            } else {
                selectedBox.classList.add('red');
                score -= 50;
                mistakes++;
            }
            updateScore();
            updateMistakes();
        }
    }
    if (arraysEqual(arr, sol)) gameFinished();
}

function arraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) return false;
        }
    }
    return true;
}

async function fetchNewPuzzle() {
    try {
        const response = await fetch(`${url}${dif}`);
        const data = await response.json();
        boardVal = data.board;
        arr = boardVal.map(row => row.slice());
        sol = boardVal.map(row => row.slice());
        solve(0, 0);
        populateMatrix();
    } catch (error) {
        console.error("Error fetching new puzzle:", error);
    }
}

function getDifficulty() {
    const difModal = document.querySelector(".difficultyModal");
    difModal.style.display = "block";
    const dSubmitBtn = document.querySelector("#submitDiffBtn");

    dSubmitBtn.onclick = () => {
        const dropdown = document.querySelector("#dropdown-list");
        dif = dropdown.value;
        difModal.style.display = "none";
        fetchNewPuzzle().then(refreshGame);
    };

    const dCloseBtn = document.querySelector(".dclose-button");
    dCloseBtn.onclick = () => {
        difModal.style.display = "none";
    };
}

function refreshGame() {
    arr = boardVal.map(row => row.slice());
    boxes.forEach(box => {
        box.innerText = '';
        box.classList.remove('red', 'green', 'selected', 'hideText', 'blur', 'og');
        box.addEventListener('click', selectBox);
    });
    score = 0;
    mistakes = 0;
    stack = [];
    hints = 3;
    h = 0;
    m = 0;
    s = -1;
    updateScore();
    updateMistakes();
    startTimer();
    updateHints();
    populateMatrix();
}

function selectBox(event) {
    boxes.forEach(box => box.classList.remove('selected'));
    event.target.classList.add('selected');
}

function releaseBox(event) {
    if (!event.target.classList.contains("box"))
        boxes.forEach(box => box.classList.remove('selected'));
}

function eraseData() {
    const selected = document.querySelector(".selected");
    if (selected && !selected.classList.contains("og")) {
        const boxId = parseInt(selected.id);
        const index = stack.indexOf(boxId);
        if (index !== -1) stack.splice(index, 1);
        const i = Math.floor(boxId / 9);
        const j = boxId % 9;
        if (selected.classList.contains('green')) {
            score -= 100;
            updateScore();
        }
        selected.innerText = "";
        arr[i][j] = 0;
        selected.classList.remove('red', 'green');
    }
}

function updateHints() {
    const hint = document.querySelector("#count");
    hint.innerText = `(${hints})`;
}

function findHelp() {
    const selected = document.querySelector(".selected");
    if (selected && !selected.classList.contains("og") && hints > 0) {
        stack.push(parseInt(selected.id));
        const boxId = parseInt(selected.id);
        const i = Math.floor(boxId / 9);
        const j = boxId % 9;
        selected.innerText = sol[i][j].toString();
        arr[i][j] = sol[i][j];
        selected.classList.add('green');
        hints--;
        updateHints();
    }
    if (arraysEqual(arr, sol)) gameFinished();
}

function undoStuff() {
    const boxId = stack.pop();
    if (boxId !== undefined) {
        const box = document.getElementById(boxId.toString());
        const i = Math.floor(boxId / 9);
        const j = boxId % 9;
        arr[i][j] = 0;
        box.innerText = "";
        if (box.classList.contains('green')) score -= 100;
        updateScore();
        box.classList.remove('red', 'green');
    }
}

function updateTimer() {
    const timer = document.querySelector(".timer p");
    const hours = h < 10 ? "0" + h : h;
    const minutes = m < 10 ? "0" + m : m;
    const seconds = s < 10 ? "0" + s : s;
    timer.innerText = h === 0 ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

function ticToc() {
    s++;
    if (s === 60) {
        s = 0;
        m++;
        if (m === 60) {
            m = 0;
            h++;
        }
    }
    updateTimer();
}

function startTimer() {
    const play = document.getElementById("playImg");
    play.style.display = "none";
    boxes.forEach(box => {
        box.classList.remove("hideText");
        box.classList.add("showText");
    });
    game.classList.remove("blur");
    boxes.forEach(box => box.addEventListener('click', selectBox));
    if (time !== null) clearInterval(time);
    time = setInterval(ticToc, 1000);
}

function stopTimer() {
    clearInterval(time);
    time = null;
    hideBoard();
}

function hideBoard() {
    boxes.forEach(box => {
        box.classList.remove("showText");
        box.classList.add("hideText");
    });
    game.classList.add("blur");
    boxes.forEach(box => box.removeEventListener('click', selectBox));
    const play = document.getElementById("playImg");
    play.style.display = "block";
    play.addEventListener('click', startTimer);
}

function hideModal() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
}

function togglePlay() {
    const play = document.getElementById("playImg");
    play.style.display = play.style.display === "block" ? "none" : "block";
}

function gameFinished() {
    stopTimer();
    const modal = document.querySelector(".modal");
    modal.style.display = "block";
    togglePlay();

    const closeButton = modal.querySelector('.close-button');
    const startNewGameButton = modal.querySelector('#startNewGameButton');

    closeButton.addEventListener('click', hideModal);
    closeButton.addEventListener('click', togglePlay);

    startNewGameButton.addEventListener('click', () => {
        hideModal();
        getDifficulty();
        refreshGame();
    });
}


numPadNumber.forEach(num => num.addEventListener('click', fillNumber));
newGameBtn.addEventListener("click", getDifficulty);
document.getElementById("erase").addEventListener('click', eraseData);
document.querySelector("#help").addEventListener('click', findHelp);
document.querySelector("#undo").addEventListener('click', undoStuff);
document.querySelector(".timer img").addEventListener('click', stopTimer);

// Load a new puzzle when the page loads
fetchNewPuzzle().then(refreshGame);
document.addEventListener('click', releaseBox);
