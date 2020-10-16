//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const sequelize = db.sequelize;
const Users = db.users;
const Booking = db.booking;
const { Op } = require("sequelize");//condition
exports.create = async function (req, res) {
    try {
        const {
            machine_id,
            user_id,
            job_title,
            location,
            hospital_id,
            hospital_name,
            contact_person,
            contact_mobile,
            detail,
            reservation_date,
            reservation_time,
            reservation_by,
            update_by
        } = req.body;
        const newBooking = {
            machine_id:machine_id,
            user_id:user_id,
            job_title:job_title,
            location:location,
            hospital_id:hospital_id,
            hospital_name:hospital_name,
            contact_person:contact_person,
            contact_mobile:contact_mobile,
            detail:detail,
            reservation_date:reservation_date,
            reservation_time:reservation_time,
            reservation_by:reservation_by,
            update_by:update_by
        };
        await Booking.create(newBooking).then(data => {
            res.send({ success: true, message: 'Booking Created Successfully', data });
        })
            .catch(err => {
                res.status.send({ success: false, message: err.message || "Booking Not Created" });
            });

    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
exports.findAll = async function (req, res, next) {
    const result = Users.findAll();
    await result.then(function (users) {
        if (users.length > 0) {
            return res.json(users);
        }
        else {
            res.status(404).send({ success: false, message: 'User No Data' });
        }
    })

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
exports.update = function (req, res) {
    try {
        Users.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, users) {
            if (!users)
                return res.status(404).send({ message: "User No data found." });
            else
                res.send({ success: true, message: `Update User ID: ${users.id} successfully.` })
        })
    } catch (error) {
        res.status(500).send({ error: err });
    }
}
exports.delete = async function (req, res) {
    try {
        await Users.findByIdAndRemove(req.params.id, function (err, users) {
            if (!users)
                return res.status(404).send({ message: "User No data found." });
            else
                res.send({ message: "'Delete users successfully." })
        })
    } catch (error) {
        res.status(500).send({ error: err });
    }
}

