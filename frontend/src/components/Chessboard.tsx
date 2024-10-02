import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const Chessboard = ({
  chess,
  setBoard,
  board,
  socket,
  player,
}: {
  chess: any;
  setBoard: any;
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket | null;
  player: string;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  const [piece, setPiece] = useState<string>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const board_logic = (squareRepresentaion: any) => {
    setIsActive(true);
    if (!from) {
      setFrom(squareRepresentaion?.p);
      setPiece(squareRepresentaion?.c);
    } else {
      if (socket != null) {
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: {
                from,
                to: squareRepresentaion?.p,
              },
            },
          }),
        );
      }
      setFrom(null);

      // if (chess.move({ from, to: squareRepresentaion }) == null) {
      //   console.log("invalid move");
      // }
      if (piece === player) {
        try {
          chess.move({
            from,
            to: squareRepresentaion?.p,
          });
        } catch (e) {
          console.log(e);
          return;
        }
      }

      setBoard(chess.board());

      console.log(from, squareRepresentaion);
    }
  };

  return (
    <>
      {/* <div>Chessboard</div> */}
      <div className="text-white-200">
        {board?.map((row, i) => {
          return (
            <div key={i} className="flex">
              {row?.map((square, j) => {
                const squareRepresentaion = {
                  p: (String.fromCharCode(97 + (j % 8)) +
                    "" +
                    (8 - i)) as Square,
                  c: row[j]?.color.toUpperCase(),
                };

                return (
                  <div
                    onClick={() => {
                      board_logic(squareRepresentaion);
                    }}
                    key={j}
                    className={`w-20 h-20 ${(i + j) % 2 === 0 ? "bg-green-600" : "bg-green-100"}`}
                  >
                    <div className="w-full flex justify-center h-full">
                      <div className="h-full justify-center flex flex-col">
                        {square ? (
                          <img
                            className={`w-16 ${player == "B" ? "rotate-180" : null} ${isActive === true ? "bg-yellow-200" : ""}`}
                            src={`/images/${square.color === "b" ? square?.type : `${square?.type}w`}.png`}
                          />
                        ) : null}
                        {/* <img src={r} /> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
