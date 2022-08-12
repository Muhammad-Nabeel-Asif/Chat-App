"use strict";
const express = require("express");
const { fetchAllMessages, sendMessage, } = require("../controllers/messageController");
const router = express.Router();
router.route("/fetch-all-messages/:chatId").get(fetchAllMessages);
router.route("/send-message").post(sendMessage);
module.exports = router;
//# sourceMappingURL=messageRoutes.js.map