const express = require("express");
const router = express.Router();
const wardenController = require("../controllers/wardencontroller");

router.post("/create", wardenController.createWarden);
router.get("/view", wardenController.getWardens);

// New routes
router.get("/pg/:pgId", wardenController.getWardensByPG);
router.delete("/delete/:userId", wardenController.deleteWarden);
router.put("/update-salstatus/:userId", wardenController.updateSalaryStatus);
router.put("/update/:userId", wardenController.updateWarden);

module.exports = router;
