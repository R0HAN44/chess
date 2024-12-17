"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
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
        //validation - is it this users move, is the move valid
        if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.moves.length % 2 !== 0 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        //check if game is over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.board.moves.length % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        //send updated board to both players
    }
}
exports.Game = Game;
