//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const Hospital = db.hospital;
const { Op } = require("sequelize");//condition
exports.findAll = async function (req, res, next) {
    const result = Hospital.findAll();
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


