const express = require("express");

const router = express.Router();

const {
  sendNotification,
  acknowledgeNotification,
  getLatestNotification,
} = require("../controllers/notification.controller");

router.post("/send", sendNotification);

router.post(
  "/acknowledge/:id",
  acknowledgeNotification
);

router.get(
  "/latest",
  getLatestNotification
);

module.exports = router;