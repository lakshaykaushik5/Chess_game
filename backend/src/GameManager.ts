import { Socket } from "dgram";
import { WebSocket, WebSocketServer } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private user: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.user = [];
  }

  addUser(socket: WebSocket) {
    this.user.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.user = this.user.filter((user) => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
          console.log("game has started");
        } else {
          this.pendingUser = socket;
          console.log("you are entered in queue");
        }
      }
      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket,
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}
