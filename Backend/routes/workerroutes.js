const express = require("express");
const router = express.Router();
const { createWorker, getWorkersByPG } = require("../controllers/workercontroller");

router.post("/", createWorker);
router.get("/pg/:pgId", getWorkersByPG);

module.exports = router;
