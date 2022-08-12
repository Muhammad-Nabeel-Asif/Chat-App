import express from "express";

import {
  createChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  updateGroupName,
} from "../controllers/chatController";

export const router = express.Router();

router.route("/create-chat").post(createChat);
router.route("/fetch-chats").get(fetchChats);
router.route("/create-group-chat").post(createGroupChat);
router.route("/update-group-name").put(updateGroupName);
router.route("/add-to-group").put(addToGroup);
router.route("/remove-from-group").put(removeFromGroup);
