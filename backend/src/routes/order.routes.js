const express = require("express");

const router = express.Router();

const {
  createOrder,
  acceptOrder,
  getLatestOrder,
  rejectOrder,
} = require("../controllers/order.controller");

router.post("/create", createOrder);

router.get("/latest-order", getLatestOrder);

router.post("/accept/:id", acceptOrder);

router.post("/reject/:id", rejectOrder);
module.exports = router;
