import { createClient } from "redis";

const redis_client = createClient();
redis_client.on("error", (err) => {
  console.log("redis client error", err);
});

export const push_to_redis_queue = async (
  id: number,
  game_data: string[][],
) => {
  try {
    await redis_client.LPUSH("game_data", JSON.stringify({ id, game_data }));
  } catch (err) {
    console.log("redis client error", err);
  }
};

export const push_to_redis_queue_create = async (id1: number, id2: number) => {
  try {
    await redis_client.LPUSH("create_game", JSON.stringify({ id1, id2 }));
  } catch (err) {
    console.log("redis client error", err);
  }
};
