const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controler');
const db = require('../config/db.config');

router.post('/', hospitalController.create);
router.get('/', hospitalController.findAll);
router.get('/:id', hospitalController.findOne);
router.put('/:id', hospitalController.update);
router.delete('/:id', hospitalController.delete);
module.exports = router;