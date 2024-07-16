import { NextFunction, Request, Response } from "express";
import multer from "multer";

// local imports
import { Game } from "../models/game";

// multer configuration
const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadGameImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const img = req.file;

  if (!img) return res.status(400).json({ message: "Image is required" });
  try {
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.image = img.buffer;
    await game.save();
    return res
      .status(200)
      .json({ message: "Image uploaded successfully", img });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const errorHandlingFiles = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError)
    return res.status(400).json({ message: "Unexpected field in the request" });
  next();
};
