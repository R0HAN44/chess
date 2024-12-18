import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../messages";

export const ChessBoard = ({
  board,
  socket,
  setBoard,
  chess,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
}) => {
  const [from, setFrom] = useState<any>(null);
  const [to, setTo] = useState<any>(null);
  return (
    <div className="text-white">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const sq = (
                String.fromCharCode(65 + j) + String(8 - i)
              ).toLowerCase();
              const isSelected = sq === from;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(sq);
                    } else {
                      const move = chess.move({
                        from,
                        to: sq,
                      });
                      console.log({
                        from,
                        to: sq,
                      });
                      if (move) {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from,
                                to: sq,
                              },
                            },
                          })
                        );
                        setBoard(chess.board());
                      } else {
                        console.log("Invalid move");
                      }
                      setFrom(null);
                    }
                  }}
                  key={j}
                  className={`w-16 h-16 flex items-center justify-center ${
                    (i + j) % 2 === 0 ? "bg-yellow-500" : "bg-slate-800"
                  } ${isSelected ? "border-4 border-blue-500" : ""}`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col">
                      {square ? square.type : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
