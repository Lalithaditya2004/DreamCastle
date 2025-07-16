const express = require("express");
const router = express.Router();
const { createRoom, getRoomsByPG } = require("../controllers/roomcontroller");

router.post("/", createRoom);
router.get("/pg/:pgId", getRoomsByPG);

module.exports = router;
