"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        // Send initial game data to player1
        this.player1.send(JSON.stringify({
            type: 'INIT_GAME',
            payload: {
                color: "white"
            }
        }));
        // Send initial game data to player2
        this.player2.send(JSON.stringify({
            type: 'INIT_GAME',
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Validate whose turn it is
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Not player 1's turn");
            return;
        }
        if (this.moveCount % 2 !== 0 && socket !== this.player2) {
            console.log("Not player 2's turn");
            return;
        }
        // Attempt to apply the move
        const moveResult = this.board.move(move);
        if (!moveResult) {
            console.log("Invalid move attempted:", move);
            return;
        }
        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            const gameOverPayload = {
                type: messages_1.GAME_OVER,
                payload: { winner },
            };
            this.player1.send(JSON.stringify(gameOverPayload));
            this.player2.send(JSON.stringify(gameOverPayload));
            return;
        }
        // Broadcast the move to both players
        const movePayload = {
            type: messages_1.MOVE,
            payload: move,
        };
        this.player1.send(JSON.stringify(movePayload));
        this.player2.send(JSON.stringify(movePayload));
        // Increment move count
        this.moveCount++;
    }
}
exports.Game = Game;
