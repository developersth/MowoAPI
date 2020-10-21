//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const Hospital = db.hospital;
const { Op } = require("sequelize");//condition
exports.create = async function (req, res) {
    try {
        const { hospital_name, address, tel, lat,lng,status} = req.body;
        var check_data_exist = Hospital.findAll({
            where: {
                [Op.or]: [
                    { hospital_name: hospital_name },
                ]
            }
        });
        const newData = {
            hospital_name:hospital_name,
            address: address,
            tel: lat,
            lng: lng,
            status: status,
           
        };
         check_data_exist.then(function (newData) {
            if (newData.length == 0) {
                Hospital.create(newData).then(data => {
                    res.send({ success: true, message: 'Hospital Created Successfully', data });
                })
                    .catch(err => {
                        res.status(500).send({ success: false, message: err.message || "Some error occurred while creating the users." });
                    });
            }
            else {
                res.send({ success: false, message: 'Hospital Name already in Hospital' });
            }
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
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


