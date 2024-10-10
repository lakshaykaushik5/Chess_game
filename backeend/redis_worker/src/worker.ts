import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const redis_worker_client = createClient();

redis_worker_client.on("error", (err) => {
  console.log("error on redis worker client");
});

const worker_redis = async () => {
  try {
    await redis_worker_client.connect();
    console.log("redis worker connected");

    while (true) {
      const data = await redis_worker_client.BRPOP("game_data", 0);
      const create_data = await redis_worker_client.BRPOP("create_game", 0);
      if (data) {
        await push_to_database(data?.element);
      }
      if (create_data) {
        await push_to_database_create(data?.element);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const push_to_database_create = async (data: any) => {
  const { id1, id2 } = JSON.parse(data);
  const create_game = await prisma.master_games.create({
    data: {
      white_player: id1,
      black_player: id2,
      game: "",
      game_status: true,
      game_result: "PROGRESS",
    },
  });
};

const push_to_database = async (data: string) => {
  const { id, game_data } = JSON.parse(data);
  const json_gamee_data = JSON.stringify(game_data);
  const game = await prisma.master_games.findFirst({
    where: {
      id: id,
    },
  });

  if (game) {
    const updateGame = await prisma.master_games.update({
      where: {
        id: id,
      },
      data: {
        game: json_gamee_data,
      },
    });
  }
};

worker_redis();
