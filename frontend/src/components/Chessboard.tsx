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

  const board_logic = (squareRepresentaion: Square | null) => {
    if (!from) {
      setFrom(squareRepresentaion);
    } else {
      if (socket != null) {
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: {
                from,
                to: squareRepresentaion,
              },
            },
          }),
        );
      }
      setFrom(null);
      chess.move({
        from,
        to: squareRepresentaion,
      });
      console.log(chess.board(), "board");
      // if (player === "B") {
      // setBoard(rotate_board());
      // } else {
      setBoard(chess.board());
      // }

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
                const squareRepresentaion = (String.fromCharCode(97 + (j % 8)) +
                  "" +
                  (8 - i)) as Square;
                console.log(squareRepresentaion, typeof squareRepresentaion);
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
                        {console.log(player, "player")}
                        {square ? (
                          <img
                            className={`w-16 ${player == "B" ? "rotate-180" : null}`}
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
