"use strict";
const express = require("express");
const { createChat, fetchChats, createGroupChat, removeFromGroup, addToGroup, updateGroupName, } = require("../controllers/chatController");
const router = express.Router();
router.route("/create-chat").post(createChat);
router.route("/fetch-chats").get(fetchChats);
router.route("/create-group-chat").post(createGroupChat);
router.route("/update-group-name").put(updateGroupName);
router.route("/add-to-group").put(addToGroup);
router.route("/remove-from-group").put(removeFromGroup);
module.exports = router;
//# sourceMappingURL=chatRoutes.js.map