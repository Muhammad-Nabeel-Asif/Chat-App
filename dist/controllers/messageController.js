"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const messageModel_1 = require("../models/messageModel");
const chatModel_1 = require("../models/chatModel");
const fetchAllMessages = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const messages = await messageModel_1.Message.find({ chat: req.params.chatId })
            .populate("sender", "picture email")
            .populate("chat");
        res.json(messages);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
const sendMessage = (0, express_async_handler_1.default)(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        var message = await messageModel_1.Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        await chatModel_1.Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
exports = { fetchAllMessages, sendMessage };
//# sourceMappingURL=messageController.js.map