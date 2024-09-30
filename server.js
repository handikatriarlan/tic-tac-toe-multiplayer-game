import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'

const app = express()
const server = createServer(app)
const io = new Server(server)

let board = Array(9).fill(null)
let currentPlayer = 'X'
let players = {}
let playerAddresses = {}

app.use(express.static('public'))

function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ]

    for (let combo of winningCombinations) {
        const [a, b, c] = combo
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]
        }
    }
    return null
}

function isBoardFull(board) {
    return board.every(cell => cell !== null)
}

io.on('connection', (socket) => {
    const playerIP = socket.handshake.address
    console.log(`Player connected: ${socket.id} from IP: ${playerIP}`)

    if (playerAddresses[playerIP]) {
        players[socket.id] = playerAddresses[playerIP]
        console.log(`Player ${socket.id} reconnected as ${players[socket.id]}`)
    } else if (Object.keys(players).length < 2) {
        const symbol = Object.keys(players).length === 0 ? 'X' : 'O'
        players[socket.id] = symbol
        playerAddresses[playerIP] = symbol
        console.log(`Player ${socket.id} assigned as ${symbol}`)
    } else {
        socket.emit('spectator')
        console.log(`Player ${socket.id} is a spectator.`)
    }

    socket.emit('init', { board, currentPlayer, playerSymbol: players[socket.id] })

    socket.on('move', (data) => {
        if (players[socket.id] !== currentPlayer) {
            console.log(`It's not your turn! Current player is: ${currentPlayer}`)
            return
        }

        if (!board[data.index]) {
            board[data.index] = currentPlayer
            const winner = checkWinner(board)

            if (winner) {
                io.emit('gameOver', { winner })
                board = Array(9).fill(null)
                currentPlayer = 'X'
            } else if (isBoardFull(board)) {
                io.emit('gameOver', { winner: null })
                board = Array(9).fill(null)
                currentPlayer = 'X'
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
                io.emit('update', { board, currentPlayer })
            }
        }
    })

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`)
        delete players[socket.id]
    })

    socket.on('resetGame', () => {
        board = Array(9).fill(null)
        currentPlayer = 'X'
        io.emit('update', { board, currentPlayer })
    })
})

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
