const express = require("express");

const router = express.Router();

const {
 createOrder, acceptOrder
} = require("../controllers/order.controller");

router.post(
 "/create",
 createOrder
);

router.post(
  "/accept/:id",
  acceptOrder
);

module.exports = router;