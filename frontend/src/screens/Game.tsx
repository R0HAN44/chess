import { useEffect, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "../messages";
import { Chess } from "chess.js";

function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          const newGame = new Chess();
          setChess(newGame);
          setBoard(newGame.board());
          break;
        case MOVE:
          const move = message.payload.move;
          console.log(move);
          if (chess.move(move)) {
            setBoard(chess.board());
          }
          break;
        case GAME_OVER:
          console.log("Game Over");
          break;
      }
    };
  }, [socket, chess]);

  if (!socket) return <div>connecting</div>;
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
            />
          </div>
          <div>
            <button
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
                setChess(new Chess());
                setBoard(chess.board());
              }}
              className="rounded-lg bg-green-400 p-4 col-span-2"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
