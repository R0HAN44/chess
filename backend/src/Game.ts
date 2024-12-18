import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages"

export class Game{
  public player1 : WebSocket;
  public player2 : WebSocket;
  private board : Chess
  private startTime : Date;
  private moveCount = 0;

  constructor(player1 : WebSocket,player2 : WebSocket){
    this.player1 = player1
    this.player2 = player2
    this.board = new Chess()
    this.startTime = new Date()
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

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
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
      type: GAME_OVER,
      payload: { winner },
    };
    this.player1.send(JSON.stringify(gameOverPayload));
    this.player2.send(JSON.stringify(gameOverPayload));
    return;
  }

  // Broadcast the move to both players
  const movePayload = {
    type: MOVE,
    payload: move,
  };
  this.player1.send(JSON.stringify(movePayload));
  this.player2.send(JSON.stringify(movePayload));

  // Increment move count
  this.moveCount++;
}

}