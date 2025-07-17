const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRoomsByPG,
  getRoomsByFloorInPG,
  getRoomByNumberInPG
} = require("../controllers/roomcontroller");

router.post("/create", createRoom);
router.get("/pg/:pgId", getRoomsByPG);
router.get("/pg/:pgId/floor/:floorNo", getRoomsByFloorInPG);
router.get("/pg/:pgId/roomno/:roomNo", getRoomByNumberInPG);

module.exports = router;
