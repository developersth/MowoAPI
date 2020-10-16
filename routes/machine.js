const express = require('express');
const router = express.Router();
const machinController = require('../controllers/machine.controler');
const db = require('../config/db.config');

router.get('/', machinController.findAll);
router.get('/:id', machinController.findOne);
module.exports = router;