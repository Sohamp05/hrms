import Admin from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newAdmin = new Admin({ username, email, password: hashedPassword });
  try {
    await newAdmin.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validAdmin = await Admin.findOne({ email: email });
    if (!validAdmin) return next(errorHandler(404, "User not Found!!"));
    const validPassword = bcryptjs.compareSync(password, validAdmin.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credential"));

    const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validAdmin._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

export const getStorageStats = async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const storageStats = await Promise.all(
      collections.map(async ({ name }) => {
        const stats = await db.command({ collStats: name });
        return { name, size: stats.size };
      })
    );
    res.json(storageStats);
  } catch (error) {
    console.error("Error retrieving storage stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
