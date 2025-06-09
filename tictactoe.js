const board = document.getElementById("board");
const status = document.getElementById("status");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
let cells = Array.from(document.getElementsByClassName("cell"));

let currentPlayer = "X";
let gameActive = false;
let boardState = Array(9).fill("");
let gameMode = "friend"; // "friend" or "computer"

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function startGame(mode) {
  gameMode = mode;
  gameActive = true;
  menu.style.display = "none";
  game.style.display = "inline-block";
  status.textContent = "Player X's turn";
}

function handleClick(e) {
  const index = parseInt(e.target.getAttribute("data-index"));
  if (!gameActive || boardState[index]) return;

  makeMove(index, currentPlayer);

  if (checkGameOver()) return;

  if (gameMode === "computer" && currentPlayer === "X") {
    currentPlayer = "O";
    status.textContent = "Computer's turn";
    setTimeout(computerMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;
}

function computerMove() {
  const empty = boardState
    .map((val, idx) => (val === "" ? idx : null))
    .filter(v => v !== null);
  if (empty.length === 0 || !gameActive) return;

  const choice = empty[Math.floor(Math.random() * empty.length)];
  makeMove(choice, "O");
  if (checkGameOver()) return;

  currentPlayer = "X";
  status.textContent = "Your turn";
}

function checkGameOver() {
  if (checkWin(currentPlayer)) {
    status.textContent = (gameMode === "computer" && currentPlayer === "O")
      ? "Computer wins!"
      : `Player ${currentPlayer} wins!`;
    gameActive = false;
    return true;
  }

  if (boardState.every(cell => cell !== "")) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function checkWin(player) {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return (
      boardState[a] === player &&
      boardState[b] === player &&
      boardState[c] === player
    );
  });
}

function resetGame() {
  boardState.fill("");
  cells.forEach(cell => (cell.textContent = ""));
  currentPlayer = "X";
  gameActive = true;
  status.textContent = "Player X's turn";
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
