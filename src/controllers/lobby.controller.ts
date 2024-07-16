import { Request, Response } from "express";

// local imports
import { Lobby } from "../models/lobby";
import {
  handleValidationErrors,
  validateJoinableLobby,
  validateLeavingLobby,
  validateStartGame,
} from "../validators/validate";
import { CustomRequest } from "../interfaces/customRequest";

export const getInWaitLobbies = async (req: Request, res: Response) => {
  try {
    const lobbies = await Lobby.find({ status: "En espera" });
    return res.status(200).json(lobbies);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInProgressLobbies = async (req: Request, res: Response) => {
  try {
    const lobbies = await Lobby.find({ status: "En curso" });
    return res.status(200).json(lobbies);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createLobby = async (req: CustomRequest, res: Response) => {
  try {
    const lobby = new Lobby(req.body);
    lobby.createdBy = req.user?.username;
    await lobby.save();
    return res.status(201).json(lobby);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const joinLobby = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lobby = await Lobby.findById(id);

    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    if (validateJoinableLobby(lobby, res)) return;

    const user = req.user?.username;

    if (!lobby.players.includes(user)) {
      lobby.players.push(user);
      await lobby.save();
      return res.status(200).json(lobby);
    } else {
      return res.status(400).json({ message: "User already in lobby" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const leaveLobby = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lobby = await Lobby.findById(id);

    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    if (validateLeavingLobby(lobby, res)) return;

    const user = req.user?.username;

    if (lobby.players.includes(user)) {
      lobby.players = lobby.players.filter((player) => player !== user);
      await lobby.save();
      return res.status(200).json(lobby);
    } else {
      return res.status(400).json({ message: "User not in lobby" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const startGame = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lobby = await Lobby.findById(id);
    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    if (validateStartGame(lobby, res)) return;

    lobby.status = "En curso";

    // ir incrementando el tiempo de juego
    // configurar el juego, asignar roles, asignar turnos, asignar cartas, etc.

    await lobby.save();
    return res.status(200).json({ message: "Game started" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
