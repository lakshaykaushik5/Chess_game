import { gameStart, createGame } from "../service/game";

export const create_game = async (req: any, res: any) => {
  const payload = req.body;
  const response = await createGame(payload);
  res.sendd(response);
};

export const game_start = async (req: any, res: any) => {
  const payload = req.body;
  const response = await gameStart(payload);
  res.send(response);
};
