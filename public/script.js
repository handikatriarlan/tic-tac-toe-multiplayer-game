const socket = io()
const boardElement = document.getElementById('board')
const resetButton = document.createElement('button')
resetButton.textContent = 'Reset Game'
document.body.appendChild(resetButton)

let board = Array(9).fill(null)
let currentPlayer = 'X'
let playerSymbol = null
let isSpectator = false

function renderBoard() {
    boardElement.innerHTML = ''
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div')
        cellElement.classList.add('cell')
        cellElement.textContent = cell || ''
        if (!isSpectator) {
            cellElement.addEventListener('click', () => handleMove(index))
        }
        boardElement.appendChild(cellElement)
    })
}

function handleMove(index) {
    if (board[index] || currentPlayer !== playerSymbol) {
        console.log(`Invalid move: either the cell is occupied or not your turn.`)
        return
    }
    socket.emit('move', { index })
}

socket.on('init', (data) => {
    board = data.board
    currentPlayer = data.currentPlayer
    playerSymbol = data.playerSymbol
    console.log(`You are playing as: ${playerSymbol}`)
    renderBoard()
})

socket.on('update', (data) => {
    board = data.board
    currentPlayer = data.currentPlayer
    console.log(`Board updated. Current turn: ${currentPlayer}`)
    renderBoard()
})

socket.on('gameOver', (data) => {
    if (data.winner) {
        alert(`Player ${data.winner} wins!`)
    } else {
        alert("It's a draw!")
    }
    renderBoard()
})

socket.on('spectator', () => {
    isSpectator = true
    console.log("You are a spectator. Watch the game.")
    renderBoard()
})

resetButton.addEventListener('click', () => {
    socket.emit('resetGame')
})

renderBoard()
