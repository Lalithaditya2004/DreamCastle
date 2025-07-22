const express = require("express");
const router = express.Router();
const { createOwner, getOwners, updateOwner } = require("../controllers/ownercontroller.js");

router.post("/create", createOwner);
router.get("/view/:pgId", getOwners);
router.put("/update/:userId", updateOwner);  

module.exports = router;
