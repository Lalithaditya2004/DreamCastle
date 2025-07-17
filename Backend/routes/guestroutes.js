const express = require("express");
const router = express.Router();
const { createGuest, getGuestsByPG, getGuestsByRoomNumber,getGuestsByFloorNumber} = require("../controllers/guestcontroller");


router.post("/create", createGuest);
router.get("/pg/:pgId", getGuestsByPG);
router.get("/pg/:pgId/room/:roomNumber", getGuestsByRoomNumber);
router.get("/pg/:pgId/floor/:floorNumber", getGuestsByFloorNumber);

module.exports = router;
