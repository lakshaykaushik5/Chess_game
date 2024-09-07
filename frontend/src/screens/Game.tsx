import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { useEffect } from "react";

export const INIT_GAME = "init_Game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === INIT_GAME) {
        console.log("Game Initialised");
      } else if (message.type === MOVE) {
        console.log("Move made");
      } else if (message.type === GAME_OVER) {
        console.log("Game Over");
      }
    };
  }, [socket]);

  return (
    <>
      <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full">
          <div className="grid grid-cols-6 gap-4 w-full ">
            <div className="col-span-4 bg-red w-full">
              <Chessboard />
            </div>
            <div className="col-span-2 bg-green w-full">
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    }),
                  );
                }}
              >
                Play Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
