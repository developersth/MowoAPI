const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controler');
const db = require('../config/db.config');
// define variable
const sequelize = db.sequelize;
const Users = db.users;

router.post('/', userController.create);
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
// Login
router.post('/login', userController.login);
module.exports = router;