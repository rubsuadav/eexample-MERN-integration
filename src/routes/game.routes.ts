import { Router } from "express";

// local imports
import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "../controllers/game.controller";
import { checkAdmin } from "../middlewares/checkAdmin";
import {
  errorHandlingFiles,
  upload,
  uploadGameImage,
} from "../utils/uploadImage";

const router = Router();

router.get("/games", getGames);
router.post("/games", checkAdmin, createGame);
router.get("/game/:id", getGameById);
router.patch("/game/:id", checkAdmin, updateGame);
router.delete("/game/:id", checkAdmin, deleteGame);
router.post(
  "/game/:id/uploadImage",
  checkAdmin,
  upload.single("image"),
  errorHandlingFiles,
  uploadGameImage
);

export default router;
