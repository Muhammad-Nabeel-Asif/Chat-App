"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../models/userModel");
const expireToken_1 = require("../utils/expireToken");
const getUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const searchTerm = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = await userModel_1.User.find(searchTerm)
        .find({ _id: { $ne: req.user._id } })
        .select("_id mobile_number email picture");
    res.send(users);
});
const signUp = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, mobile_number, email, password, pic } = req.body;
    if (!email || !password || !mobile_number) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }
    const userExists = await userModel_1.User.findOne({ mobile_number });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await userModel_1.User.create({
        name,
        mobile_number,
        email,
        password,
        pic,
    });
});
const login = (0, express_async_handler_1.default)(async (req, res) => {
    const { mobile_number, password } = req.body;
    const user = await userModel_1.User.findOne({ mobile_number });
});
const logout = (0, express_async_handler_1.default)(async (req, res) => {
    const token = (0, expireToken_1.expireToken)(req.user._id);
    res.status(200).json({
        status: "success",
        token,
        message: "Successfully logged out of your account",
    });
});
exports = { getUsers, signUp, login, logout };
//# sourceMappingURL=userController.js.map