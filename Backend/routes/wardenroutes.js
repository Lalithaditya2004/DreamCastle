const express = require("express");
const router = express.Router();
const { createWarden, getWardens } = require("../controllers/wardencontroller");

router.post("/", createWarden);
router.get("/", getWardens);

module.exports = router;
