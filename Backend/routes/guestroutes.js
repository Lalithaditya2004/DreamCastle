const express = require("express");
const router = express.Router();
const { createGuest, getGuestsByPG } = require("../controllers/guestcontroller");


router.post("/", createGuest);
router.get("/pg/:pgId", getGuestsByPG);

module.exports = router;
