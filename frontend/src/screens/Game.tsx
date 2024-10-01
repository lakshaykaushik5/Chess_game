import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess, Square, PieceSymbol, Color } from "chess.js";
import { reverse } from "dns";

// Define constants
export const INIT_GAME = "init_Game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

// Define ChessPiece interface
interface ChessPiece {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export const Game = () => {
  const socket = useSocket();
  // const navigate = useNavigate();

  // Initialize chess state
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(chess.board());
  const [player, setPlayer] = useState<string>("W");

  const rotate_board = () => {
    console.log(chess.board());
    const arr = chess.board();
    arr.reverse();
    console.log(arr);
    return arr;
  };

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // console.log(message);
      if (message.type === INIT_GAME) {
        if (message?.payload?.color === "black") {
          setPlayer("B");
        }

        setBoard(chess.board());

        console.log("Game Initialised");
      } else if (message.type === MOVE) {
        const move = message.payload;
        chess.move(move); // Make a move
        setBoard(chess.board());
        console.log("Move made");
      } else if (message.type === GAME_OVER) {
        console.log("Game Over");
      }
    };
  }, [socket, chess]);

  return (
    <>
      <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full">
          <div className="grid grid-cols-6 gap-4 w-full ">
            <div
              className={`col-span-4 w-full flex justify-center ${player === "B" ? "rotate-180" : null}`}
            >
              <Chessboard
                chess={chess}
                setBoard={setBoard}
                board={board}
                socket={socket}
                player={player}
              />
            </div>
            <div className="col-span-2 w-full">
              <Button
                onClick={() => {
                  socket?.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    }),
                  );
                }}
              >
                Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
