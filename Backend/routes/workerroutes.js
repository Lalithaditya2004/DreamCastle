const express = require("express");
const router = express.Router();
const { createWorker, getWorkersByPG, getWorkersByJob } = require("../controllers/workercontroller");

router.post("/create", createWorker);
router.get("/pg/:pgId", getWorkersByPG);
router.get("/pg/:pgId/job/:job", getWorkersByJob);

module.exports = router;
