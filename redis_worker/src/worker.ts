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
      if (data) {
        await push_to_database(data?.element);
      }
    }
  } catch (err) {
    console.log(err);
  }
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
