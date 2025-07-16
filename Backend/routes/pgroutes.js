const express = require("express");
const router  = express.Router();
const { createPG, getAllPGs } = require('../controllers/pgcontroller');

router.post('/',createPG);
router.get('/',getAllPGs)

module.exports = router;