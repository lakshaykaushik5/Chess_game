import { Button1 } from "../game_components/button";
import { Chessboard } from "../game_components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess, Square, PieceSymbol, Color } from "chess.js";
import axios from "axios";
import { HTTP_URL } from "@/env";

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
  const [gameStatus, setGameStatus] = useState<string | null>("not_started");

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
        setGameStatus("Started");
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

  const onPlayLogic = async () => {
    const user_details = localStorage.getItem("USER_DET");
    const id = parseInt(user_details);
    console.log(id, user_details);
    const payload = { id: id };
    const response = await axios.post(
      HTTP_URL + "/api/gameStatus/start_game",
      payload,
      // { withCredentials: true },
    );
    console.log(response?.data?.data?.status, " status ");
    if (response?.data?.data?.status === 200) {
      // alert("working");
      // socket?.send(
      //   JSON.stringify({
      //     type: INIT_GAME,
      //   }),
      // );
      try {
        socket?.send(
          JSON.stringify({
            type: INIT_GAME,
          }),
        );
        alert("WebSocket message sent successfully");
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
      }
    }
  };

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
                gameStatus={gameStatus}
              />
            </div>
            <div className="col-span-2 w-full">
              <Button1
                onClick={() => {
                  onPlayLogic();
                }}
              >
                Play
              </Button1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
