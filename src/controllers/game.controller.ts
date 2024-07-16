import { Request, Response } from "express";

// local imports
import { Game } from "../models/game";
import { handleValidationErrors } from "../validators/validate";

export const getGames = async (_req: Request, res: Response) => {
  try {
    const games = await Game.find();
    return res.status(200).json(games);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    return res.status(200).json(game);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const game = new Game(req.body);
    await game.save();
    return res.status(201).json(game);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const updateGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id, req.body);
    if (!game) return res.status(404).json({ message: "Game not found" });
    return res.status(200).json(game);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndDelete(id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    return res.status(204).json({ message: "Game deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
