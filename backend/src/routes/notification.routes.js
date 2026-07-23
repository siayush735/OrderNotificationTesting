const express = require("express");

const router = express.Router();

const {
  sendNotification,
  acknowledgeNotification
} = require("../controllers/notification.controller");

router.post("/send", sendNotification);

router.post(
  "/acknowledge",
  acknowledgeNotification
);


module.exports = router;