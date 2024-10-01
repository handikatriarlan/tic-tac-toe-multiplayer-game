const socket = io();
const boardElement = document.querySelectorAll(".box");
const resetButton = document.getElementById("play-again");
const resultsElement = document.getElementById("results");
let turn = "X";
let isGameOver = false;
let playerSymbol = null;
let isServer = false;

boardElement.forEach((box) => {
  box.addEventListener("click", () => {
    const index = box.getAttribute("data-index");
    if (!isGameOver && box.innerHTML === "" && playerSymbol === turn) {
      socket.emit("move", { index });
    }
  });
});

socket.on("init", (data) => {
  data.board.forEach((val, index) => {
    boardElement[index].innerHTML = val || "";
  });
  turn = data.currentPlayer;
  playerSymbol = data.playerSymbol;
  isServer = data.isServer;

  // Adjust turn indicator
  document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
  resetButton.style.display = isServer ? "inline" : "none";
});

socket.on("update", (data) => {
  data.board.forEach((val, index) => {
    boardElement[index].innerHTML = val || "";
  });
  turn = data.currentPlayer;
  document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
});

socket.on("gameOver", (data) => {
  isGameOver = true;
  resultsElement.innerHTML = data.winner ? `${data.winner} wins!` : "Draw!";
  if (isServer) {
    resetButton.style.display = "inline";
  }
});

resetButton.addEventListener("click", () => {
  socket.emit("resetGame");
});

socket.on("reset", () => {
  isGameOver = false;
  resultsElement.innerHTML = "";
  boardElement.forEach((box) => {
    box.innerHTML = "";
    box.style.removeProperty("background-color");
    box.style.color = "#fff";
  });
  resetButton.style.display = "none";
});
