import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
// import r from "../../public/images/r.png";
// import n from "../../public/images/n.png";
// import b from "../../public/images/r.png";
// import k from "../../public/images/r.png";
// import q from "../../public/images/r.png";
// import p from "../../public/images/p.png";
// import rw from "../../public/images/r.png";
// import nw from "../../public/images/r.png";
// import bw from "../../public/images/r.png";
// import kw from "../../public/images/r.png";
// import qw from "../../public/images/r.png";
// import pw from "../../public/images/r.png";

// interface ChessPiece {
//   square: Square;
//   type: PieceSymbol;
//   color: Color;
// }

export const Chessboard = ({
  chess,
  setBoard,
  board,
  socket,
}: {
  chess: any;
  setBoard: any;
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket | null;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

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
                // console.log(squareRepresentaion);
                return (
                  <div
                    onClick={() => {
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
                        setBoard(chess.board());
                        console.log(from, squareRepresentaion);
                      }
                    }}
                    key={j}
                    className={`w-20 h-20 ${(i + j) % 2 === 0 ? "bg-green-600" : "bg-green-100"}`}
                  >
                    <div className="w-full flex justify-center h-full">
                      <div className="h-full justify-center flex flex-col">
                        {square ? (
                          <img
                            className="w-16"
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
