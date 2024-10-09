import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const Chessboard = ({
  chess,
  setBoard,
  board,
  socket,
  player,
  gameStatus,
}: {
  chess: any;
  setBoard: any;
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket | null;
  player: string;
  gameStatus: string | null;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  const [activeSquare, setActiveSquare] = useState<Square | null>(null); // Track active square

  const board_logic = (squareRepresentation: any) => {
    if (gameStatus === "not_started") {
      return;
    }
    if (!from) {
      setFrom(squareRepresentation?.p);
      setActiveSquare(squareRepresentation?.p); // Highlight the selected square
    } else {
      if (socket != null) {
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: {
                from,
                to: squareRepresentation?.p,
              },
            },
          }),
        );
      }
      setFrom(null);
      setActiveSquare(null); // Reset highlight after move

      if (chess.move({ from, to: squareRepresentation?.p }) == null) {
        console.log("invalid move");
        return;
      }

      setBoard(chess.board());
    }
  };

  return (
    <div className="text-white-200">
      {board?.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row?.map((square, j) => {
              const squareRepresentation = {
                p: (String.fromCharCode(97 + (j % 8)) + "" + (8 - i)) as Square,
                c: row[j]?.color.toUpperCase(),
              };

              return (
                <div
                  onClick={() => {
                    board_logic(squareRepresentation);
                  }}
                  key={j}
                  className={`w-20 h-20 ${(i + j) % 2 === 0 ? "bg-green-600" : "bg-green-100"} ${
                    activeSquare === squareRepresentation.p
                      ? "border-4 border-yellow-500"
                      : ""
                  }`}
                >
                  {console.log(squareRepresentation, " ---------------- ")}

                  <div className="w-full flex justify-center h-full">
                    <div className="h-full justify-center flex flex-col">
                      {square ? (
                        <img
                          src={`/images/${square.color === "b" ? square?.type : `${square?.type}w`}.png`}
                          className={`w-16 ${player === "B" ? "rotate-180" : ""} select-none`}
                          alt="chess piece"
                        />
                      ) : null}
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
