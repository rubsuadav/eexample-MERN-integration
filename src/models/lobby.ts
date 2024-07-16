import mongoose from "mongoose";
import { Schema } from "mongoose";

// local imports
import { User } from "./user";
import { Game } from "./game";

const lobbySchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: Game,
    required: [true, "Game is required"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
    min: [1, "Duration can't be shorter than 1 minute"],
    max: [60, "Duration can't be longer than 60 minutes"],
  }, // in minutes
  maxPlayers: {
    type: Number,
    required: [true, "Max players is required"],
    min: [2, "A lobby must have at least 2 players"],
    max: [10, "A lobby can't have more than 10 players"],
  },
  players: [{ type: Schema.Types.String, ref: User }],
  status: {
    type: String,
    enum: ["En espera", "En curso", "Finalizada"],
    default: "En espera",
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.String, ref: User },
});

export const Lobby = mongoose.model("Lobby", lobbySchema, "lobbies");
