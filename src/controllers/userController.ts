import asyncHandler from "express-async-handler";

import { User } from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import { expireToken } from "../utils/expireToken";

//@description     Get or Search all users or provide search query to get specific ones
//@route           GET /api/user/getUsers?search=
//@access          Private
export const getUsers = asyncHandler(async (req: any, res: any) => {
  const searchTerm = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchTerm)
    .find({ _id: { $ne: req.user._id } })
    .select("_id mobile_number email picture");
  res.send(users);
});

//@description     Register / Signup new user
//@route           POST /api/users/signup
//@access          Public
export const signUp = asyncHandler(async (req: any, res: any) => {
  const { name, mobile_number, email, password, pic } = req.body;

  if (!email || !password || !mobile_number) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ mobile_number });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    mobile_number,
    email,
    password,
    pic,
  });
  // !! TODO --------------------------------------------
  // if (user) {
  //   const token = generateToken(user._id);
  //   res.cookie("myCookie", token, {
  //     // 2592000000ms = 30 days
  //     expires: new Date(Date.now() + 2592000000),
  //     httpOnly: true,
  //   });
  //   res.status(201).json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     mobile_number: user.mobile_number,
  //     isAdmin: user.isAdmin,
  //     pic: user.pic,
  //   });
  // } else {
  //   res.status(400);
  //   throw new Error("User not found");
  // }
});

//@description     Auth / Login the user
//@route           POST /api/users/login
//@access          Public
export const login = asyncHandler(async (req: any, res: any) => {
  const { mobile_number, password } = req.body;

  const user = await User.findOne({ mobile_number });

  // !! TODO
  //   if (user && (await user.matchPassword(password))) {
  //     const token = generateToken(user._id);
  //     res.json({
  //       _id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       mobile_number: user.mobile_number,
  //       // !! TODO
  //       // isAdmin: user.isAdmin,
  //       pic: user.picture,
  //       token,
  //     });
  //   } else {
  //     res.status(401);
  //     throw new Error("Invalid Email or Password");
  //   }
});

//@description     Auth / Logout the user
//@route           GET /api/users/logout
//@access          Private
export const logout = asyncHandler(async (req: any, res: any) => {
  const token = expireToken(req.user._id);
  res.status(200).json({
    status: "success",
    token,
    message: "Successfully logged out of your account",
  });
});
