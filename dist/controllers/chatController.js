"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chatModel_1 = require("../models/chatModel");
const userModel_1 = require("../models/userModel");
const createChat = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "UserId not sent with request" });
    }
    let isChat = await chatModel_1.Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    isChat = await userModel_1.User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name picture email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await chatModel_1.Chat.create(chatData);
            const FullChat = await chatModel_1.Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).json(FullChat);
        }
        catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});
const fetchChats = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        chatModel_1.Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
            results = await userModel_1.User.populate(results, {
                path: "latestMessage.sender",
                select: "mobile_number picture email",
            });
            res.status(200).send(results);
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
const createGroupChat = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);
    try {
        const groupChat = await chatModel_1.Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await chatModel_1.Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
const updateGroupName = (0, express_async_handler_1.default)(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel_1.Chat.findByIdAndUpdate(chatId, {
        chatName: chatName,
    }, {
        new: true,
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(updatedChat);
    }
});
const removeFromGroup = (0, express_async_handler_1.default)(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await chatModel_1.Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId },
    }, {
        new: true,
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(removed);
    }
});
const addToGroup = (0, express_async_handler_1.default)(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await chatModel_1.Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId },
    }, {
        new: true,
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(added);
    }
});
exports = {
    createChat,
    fetchChats,
    createGroupChat,
    updateGroupName,
    addToGroup,
    removeFromGroup,
};
//# sourceMappingURL=chatController.js.map