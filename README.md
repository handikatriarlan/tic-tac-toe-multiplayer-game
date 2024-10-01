# Tic Tac Toe Multiplayer Game

This is a simple **Tic Tac Toe** multiplayer game built using **Bun.js** and **Socket.IO** for real-time communication between two players. The game allows two players to play against each other over a local network, where each player is assigned either 'X' or 'O'. The game board updates in real-time, ensuring that both players see the same game state.

## Overview

This project implements a classic **Tic Tac Toe** game where two players take turns marking the spaces in a 3×3 grid. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game. If all nine spaces are filled without a winner, the game is declared a draw.

### How It Was Built

- **Frontend**: The user interface is built with **HTML**, **CSS**, and **JavaScript**, ensuring a smooth and responsive experience for the players.
  - **HTML** provides the structure of the game board.
  - **CSS** styles the board and buttons, making the game visually appealing.
  - **JavaScript** handles the user interaction, game logic, and communication with the backend.
  
- **Backend**: The server is built using **Bun.js** as an alternative to **Node.js**, and **Socket.IO** to enable real-time communication between players. The server handles the game state and ensures that each player's move is broadcasted to the other in real time.

### Features

1. **Real-time Multiplayer**: 
   - Two players can play simultaneously over a local network. The game state is synced in real-time using **Socket.IO**.
   
2. **Turn-based Gameplay**:
   - Each player is assigned either 'X' or 'O'. Players can only mark their own turns, ensuring a fair game.
   
3. **Win and Draw Detection**:
   - The game automatically detects when a player has won or if the board is full with no winner, declaring a draw.
   
4. **Reset Functionality**:
   - A reset button is available only on the server's device, allowing the game to be restarted when a game ends.

5. **Automatic Reset**:
   - When a game is completed (win or draw), the board resets automatically to allow for a new game to begin.

6. **Spectator Mode**:
   - Additional connections beyond the two players will enter spectator mode, where they can watch the game but not participate.

### Technologies Used

- **Bun.js**: A fast JavaScript runtime that serves as the backend for the game.
- **Socket.IO**: Handles WebSocket connections for real-time updates between the two players.
- **HTML, CSS, JavaScript**: Standard web technologies for building the UI.
