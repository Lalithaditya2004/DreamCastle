const express = require("express");
const router = express.Router();
const pgController = require('../controllers/pgcontroller');

router.post('/create', pgController.createPG);
// router.get('/view', pgController.getAllPGs);
router.get('/owner/:ownerId', pgController.getPGsByOwnerId);
router.delete('/delete/:pgId', pgController.deletePG);
router.put('/update/:pgId', pgController.updatePGDetails);
router.put('/update-revenue/:pgId', pgController.updatePGRevenue);
router.put('/update-warden/:pgId', pgController.updateWardenID);

module.exports = router;
