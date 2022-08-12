import asyncHandler from "express-async-handler";

import { Message } from "../models/messageModel";
import { User } from "../models/userModel";
import { Chat } from "../models/chatModel";

//@description     Get all Messages
//@route           GET /api/messages/fetch-all-messages/:chatId
//@access          Protected
const fetchAllMessages = asyncHandler(async (req: any, res: any) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "picture email")
      .populate("chat");

    res.json(messages);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Send a new Message
//@route           POST /api/messages/send-message
//@access          Protected
const sendMessage = asyncHandler(async (req: any, res: any) => {
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
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    // message = await User.populate(message, {
    //   path: "chat.users",
    //   select: "name pic email",
    // });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports = { fetchAllMessages, sendMessage };
