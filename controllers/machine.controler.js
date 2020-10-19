//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const Machine = db.machine;
const { Op } = require("sequelize");//condition
exports.upload = async function (req, res, next) {
    console.log(req.file)
    res.send({ success: true })
}
exports.create = function (req, res) {
    try {
        const { machine_name, model, status } = req.body;
        let path = null;
        if (req.file) {
            path = req.file.path;
            path=path.replace('public\\', '');//ตัด public ทิ้ง
        }

        const newData = {
            machine_name: machine_name,
            model: model,
            status: status,
            image_path: path
        };
        var check_data_exist = Machine.findAll({
            where: {
                [Op.and]: [
                    { machine_name: machine_name },
                    { model: model }
                ]
            }
        });
        check_data_exist.then(function (data) {
            if (data.length == 0) {
                Machine.create(newData).then(data => {
                    res.send({ success: true, message: 'Machine Created Successfully', data });
                })
                    .catch(err => {
                        res.status(500).send({ success: false, message: err.message || "Some error occurred while creating the Machine." });
                    });
            }
            else {
                res.send({ success: false, message: 'Machine name already in Machine' });
            }
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
exports.findAll = async function (req, res, next) {
    const machine= await Machine.findAll({attributes: ['_id','machine_name', 'model','status',['image_path','url']]});
    res.send(machine);

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


