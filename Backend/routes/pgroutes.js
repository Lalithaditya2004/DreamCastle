const express = require("express");
const router  = express.Router();
const { createPG, getAllPGs } = require('../controllers/pgcontroller');

router.post('/create',createPG);
router.get('/view',getAllPGs)

module.exports = router;