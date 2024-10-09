import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import {
  push_to_redis_queue,
  push_to_redis_queue_create,
} from "./redis_worker";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moves: string[];
  private startTime: Date;
  private moveCount: number;

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    id1: number,
    id2: number,
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
    this.moveCount = 0;
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          id: id1,
        },
      }),
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          id: id2,
        },
      }),
    );
    push_to_redis_queue_create(id1, id2);
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    },
    board: string[][],
    id: number,
  ) {
    console.log(move, " --- ");
    console.log(this.moveCount, " count ");
    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      return;
    }
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      return;
    }
    try {
      this.board.move(move);
      this.moveCount++;
      push_to_redis_queue(id, board);
    } catch (e) {
      return;
    }

    console.log(move, " ---2 ");

    if (this.board.isGameOver()) {
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "Black" : "White",
          },
        }),
      );
    }
    console.log(this.moveCount, " count ");
    if (this.moveCount % 2 === 0) {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    } else {
      console.log(move, " ---3 ");
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    }
  }
}
