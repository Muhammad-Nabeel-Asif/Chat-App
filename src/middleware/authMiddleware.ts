import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { User } from "../models/userModel";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.cookie) {
    token = req.headers.cookie;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  try {
    // then decode token id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
