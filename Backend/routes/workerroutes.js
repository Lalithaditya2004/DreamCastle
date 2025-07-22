const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workercontroller");

router.post("/create", workerController.createWorker);
router.get("/pg/:pgId", workerController.getWorkersByPG);
router.get("/pg/:pgId/job/:job", workerController.getWorkersByJob);

// New routes
router.delete("/:aadharId", workerController.deleteWorker);
router.put("/update-salstatus/:aadharId", workerController.updateSalaryStatus);
router.put("/update/:aadharId", workerController.updateWorker);

module.exports = router;
