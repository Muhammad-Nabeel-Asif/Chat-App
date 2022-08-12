import express from "express";

import {
  fetchAllMessages,
  sendMessage,
} from "../controllers/messageController";

export const router = express.Router();

// Fetch all Messages of a specific user by providing the chatId.
router.route("/fetch-all-messages/:chatId").get(fetchAllMessages);
// Send Message to a specific user.
router.route("/send-message").post(sendMessage);
