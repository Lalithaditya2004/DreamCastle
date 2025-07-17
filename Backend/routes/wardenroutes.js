const express = require("express");
const router = express.Router();
const { createWarden, getWardens } = require("../controllers/wardencontroller");

router.post("/create", createWarden);
router.get("/view", getWardens);

module.exports = router;
