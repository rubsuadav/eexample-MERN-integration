import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// local imports
import {
  checkPassword,
  handleValidateEmail,
  handleValidatePassword,
  handleValidatePhone,
  handleValidateRol,
  handleValidateUniqueUser,
  handleValidationErrors,
} from "../validators/validate";
import { User } from "../models/user";
import {
  createCheckoutSession,
  getUserByEmailOrUsername,
} from "../utils/utils";

async function registerUser(req: Request, res: Response) {
  const newUser = new User(req.body);
  newUser.password = await bcrypt.hash(newUser.password, 10);
  await newUser.save();
  return res.status(201).json({ message: `${newUser}` });
}

export const signup = async (req: Request, res: Response) => {
  const { email, username, password, phone, rol } = req.body;
  if (handleValidateRol(rol, res)) return;
  if (await handleValidateUniqueUser({ email, username, phone }, res)) return;
  if (handleValidateEmail(email, res)) return;
  if (handleValidatePhone(phone, res)) return;
  if (handleValidatePassword(password, res)) return;
  try {
    if (rol === "admin") {
      registerUser(req, res);
      // const session = await createCheckoutSession(email);
      // const subscrition = await getCustomerSubscriptionByEmail(email);
      // if (subscrition) {
      //   const newUser = new User(req.body);
      //   newUser.password = await bcrypt.hash(newUser.password, 10);
      //   await newUser.save();
      //   return res.status(201).json({ message: `${newUser}` });
      // }
      // return res.status(201).json({ url: session.url });
    } else {
      await registerUser(req, res);
    }
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  const userFound = await getUserByEmailOrUsername(
    req.body.email,
    req.body.username
  );
  if (!req.body.password)
    return res.status(400).json({ message: "Password is required" });
  if (!userFound) return res.status(404).json({ message: "User not found" });
  if (await checkPassword(req.body.password, res, userFound)) return;

  const token = jwt.sign(
    { id: userFound._id, rol: userFound.rol, username: userFound.username },
    "secretKey",
    {
      expiresIn: 86400, // 24 horas
      algorithm: "HS512",
    }
  );
  return res.status(200).json({ token });
};
