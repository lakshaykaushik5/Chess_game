import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const gameStart = async (payload: any) => {
  try {
    const id = payload.id;
    const valid_game = await prisma.master_games.findMany({
      select: {
        game: true,
      },
      where: {
        AND: {
          white_player: id,
          game_status: false,
        },
      },
    });

    if (valid_game) {
      return {
        data: { status: 401, msg: "Game already exit", value: valid_game },
      };
    } else {
      return {
        data: {
          status: 200,
          msg: "Game doesnot exists",
        },
      };
    }
  } catch (e) {
    console.log(e);
  }
};

export const createGame = async (payload: any) => {
  try {
    const { w_id, b_id, board } = payload;
    const create_game = await prisma.master_games.create({
      data: {
        white_player: w_id,
        black_player: b_id,
        game_status: false,
        game_result: "PROGRESS",
        game: board,
      },
    });
    return { data: { status: 200, msg: "Game Created" } };
  } catch (e) {
    console.log(e);
  }
};
