//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const { fn, col } = db.sequelize
const Machine = db.machine;
const { Op } = require("sequelize");//condition
const env = require('../config/env');
var gm = require('gm');
const sharp = require('sharp');
const fs = require('fs');
exports.upload = async function (req, res, next) {
    console.log(req.file)
    res.send({ success: true })
}
exports.create = async function (req, res) {
    try {
        const { machine_name, model, status } = req.body;

        let image_path = null;
        if (req.file) {
            image_path = req.file.path;
            //var filename =req.file.filename;
            //path=path.replace('public\\', '');//ตัด public ทิ้ง
            //resize
            //sharp(image_path).resize(1024, 1024).toFile('uploads/machine/resize/'+filename, (err, info) => {if (!err) console.log('Resize Success')});
        }

        const newData = {
            machine_name: machine_name,
            model: model,
            status: status,
            image_path: image_path
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
                try { if (req.file) {fs.unlinkSync(image_path)}} catch(err) {console.error(err)}
            }
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
exports.findAll = async function (req, res, next) {
    //concat
    const machine = await Machine.findAll({ attributes: ['_id', 'machine_name', 'model', 'status', [fn('CONCAT', env.Server_URL, col('image_path')), 'url']] });
    res.send(machine);

}
exports.findOne = function (req, res) {
    const id = req.params.id;

    Machine.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Users with id=" + id
            });
        });
}
exports.delete =async function (req, res) {
    try {
        const result= await Machine.findByPk(req.params.id);
        var image_path='';
        if(result)
          image_path=result.image_path;

        await Machine.destroy({where: {_id: req.params.id}})
        .then(data => {
            //delete images
            try { if (result) {fs.unlinkSync(image_path)}} catch(err) {if(!err) console.log('delete images file '+image_path)}
            res.send({ success: true, message: 'Machine Delete Successfully', data });
        })
        .catch(err => {
            res.status(200).send({ success: false,message:err});
        });
             
    } catch (error) {
        res.status(500).send({ error: err });
    }
}

