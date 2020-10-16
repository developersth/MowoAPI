//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const Machine = db.machine;
const { Op } = require("sequelize");//condition
exports.create = async function (req, res) {
    try {
        const { username, mobile, email, password } = req.body;
        var check_data_exist = Users.findAll({
            where: {
                [Op.or]: [
                    { email: email },
                    { mobile: mobile },
                    { username: username },
                ]
            }
        });
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = {
            username: username,
            mobile: mobile,
            email: email,
            password: passwordHash,
        };
        check_data_exist.then(function (users) {
            if (users.length == 0) {
                Users.create(newUser).then(data => {
                    res.send({ success: true, message: 'Users Created Successfully', data });
                })
                    .catch(err => {
                        res.status(500).send({ success: false, message: err.message || "Some error occurred while creating the users." });
                    });
            }
            else {
                res.send({ success: false, message: 'Username or Email or Mobile already in user' });
            }
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
exports.findAll = async function (req, res, next) {
    const result = Machine.findAll();
    await result.then(function (data) {
      return res.json(data);
    })
    .catch(err => {
        res.status(500).send({ message: err});
    });
}
exports.findOne = function (req, res) {
    const id = req.params.id;

    Users.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Users with id=" + id
            });
        });
}


