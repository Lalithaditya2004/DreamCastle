const express = require("express");
const router = express.Router();
const { createOwner, getOwners } = require("../controllers/ownercontroller.js");

router.post("/create", createOwner);
router.get("/view", getOwners);

module.exports = router;
