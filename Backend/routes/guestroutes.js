const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestcontroller");

router.post("/create", guestController.createGuest);
router.get("/pg/:pgId", guestController.getGuestsByPG);
router.get("/pg/:pgId/room/:roomNumber", guestController.getGuestsByRoomNumber);
router.get("/pg/:pgId/floor/:floorNumber", guestController.getGuestsByFloorNumber);
router.delete("/delete/:aadharId", guestController.deleteGuest);
router.put("/update-fee-status/:aadharId", guestController.updateFeeStatus);
router.put("/update-dol/:aadharId", guestController.updateDOL);
router.put("/update-details/:aadharId", guestController.updateGuestDetails);
router.get("/pg/:pgId/pending", guestController.getPendingGuestsByPG);
router.put("/assign-room/:aadharId", guestController.assignRoomToGuest);


module.exports = router;
