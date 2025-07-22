const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomcontroller");

router.post("/create", roomController.createRoom);
router.get("/pg/:pgId", roomController.getRoomsByPG);
router.get("/pg/:pgId/floor/:floorNo", roomController.getRoomsByFloorInPG);
router.get("/pg/:pgId/roomno/:roomNo", roomController.getRoomByNumberInPG);

// New Routes
router.get("/pg/:pgId/vacancies", roomController.getVacantRooms);
router.get("/pg/:pgId/floor/:floorNo/cleaning-status", roomController.getCleaningStatus);

module.exports = router;
