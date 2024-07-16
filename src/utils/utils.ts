import { red, cyan, green } from "colorette";
import { Response } from "express";
import Stripe from "stripe";

//local imports
import { Rol } from "../models/rol";
import { User } from "../models/user";
import { STRIPE_PRICE_ID, STRIPE_SECRET_KEY } from "../config";
import { Lobby } from "../models/lobby";

export const roles = [
  { name: "admin" },
  { name: "anonymous" },
  { name: "customer" },
  { name: "authenticated" },
];

async function createRoles() {
  for (const role of roles) {
    const rol = await Rol.findOne({ name: role.name });
    if (!rol) {
      await Rol.create(role);
    }
  }
}

async function createModels() {
  try {
    await createRoles();
    console.log(green("Creating models..."));
    await User.createCollection();
    await Lobby.createCollection();
    console.log(cyan("Models created"));
  } catch (error: any) {
    console.log(red(`Can't create the models: ${error.message}`));
  }
}

export async function createDatabase() {
  try {
    await createModels();
  } catch (error: any) {
    console.log(red(`Can't create the database: ${error.message}`));
  }
}

export async function getUserByEmailOrUsername(
  email: string,
  username: string
) {
  return await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
}

export async function createCheckoutSession(email: string) {
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    payment_method_types: ["card"],
    customer_email: email,
    mode: "subscription",
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
  });
  return session;
}
