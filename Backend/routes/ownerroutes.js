const express = require("express");
const router = express.Router();
const { createOwner, getOwners } = require("../controllers/ownercontroller.js");

router.post("/", createOwner);
router.get("/", getOwners);

module.exports = router;
