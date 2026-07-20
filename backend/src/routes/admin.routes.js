const express = require("express");

const router = express.Router();

const {
  registerToken,
} = require("../controllers/admin.controller");

router.post(
  "/register-token",
  registerToken
);


module.exports = router;