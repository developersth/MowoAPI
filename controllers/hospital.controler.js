//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const Hospital = db.hospital;
const { Op } = require("sequelize");//condition
exports.create = async function (req, res) {
    try {
        const { hospital_name, address, tel, lat, lng, status } = req.body;
        var check_data_exist = Hospital.findAll({
            where: { hospital_name: hospital_name }
        });
        const newData = {
            hospital_name: hospital_name,
            address: address,
            tel:tel,
            lat: lat,
            lng: lng,
            status: status,

        };
         check_data_exist.then(function (doc) {
            if (doc.length == 0) {
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
            res.status(500).send({ message: err });
        });
}
exports.findOne = async function (req, res) {
    const id = req.params.id;
    await Hospital.findByPk(id)
        .then(function (data)  {
            if (data){
                res.send(data);
            }else{
                res.status(404).send({message: "Hospital Not found with id=" + id});
            }
        })
        .catch(err => {
            res.status(500).send({message: "Error retrieving Hospital with id=" + id});
        });
}
exports.update =async function (req, res) {
    try {
        const { hospital_name, address, tel, lat, lng, status } = req.body;
        var check_data_exist = Hospital.findAll({
            where: { 
                [Op.and]: [{ hospital_name: hospital_name }], 
                [Op.not]: [{ _id: req.params.id }],
            }
        });
       await check_data_exist.then(function (doc) {
            if (doc.length == 0) {
                const newData = {
                    hospital_name: hospital_name,
                    address: address,
                    tel:tel,
                    lat: lat,
                    lng: lng,
                    status: status,
                    updated_at:'current timestamp()'
                };
                 Hospital.update(newData, {where: {_id: req.params.id}}).then(data => {
                    res.send({ success: true, message: 'Hospital Edit Successfully', data });
                })
                    .catch(err => {
                        res.status(500).send({ success: false, message: err.message || "Some error occurred while creating the Hospital." });
                    });
            }
            else {
                res.send({ success: false, message: 'Hospital Name already in Hospital' });
            }
        })
             
    } catch (error) {
        res.status(500).send({ error: err });
    }
}
exports.delete =async function (req, res) {
    try {

        await Hospital.destroy({where: {_id: req.params.id}})
        .then(data => {
            res.send({ success: true, message: 'Hospital Delete Successfully', data });
        })
        .catch(err => {
            res.status(200).send({ success: false,message:err});
        });
             
    } catch (error) {
        res.status(500).send({ error: err });
    }
}
