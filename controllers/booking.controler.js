//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const sequelize = db.sequelize;
const Users = db.users;
const Booking = db.booking;
const { QueryTypes } = require("sequelize");//condition
const env = require('../config/env');
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
            reservation_time_start,
            reservation_time_end,
            reservation_by,
            update_by
        } = req.body;
        const newBooking = {
            machine_id: machine_id,
            user_id: user_id,
            job_title: job_title,
            location: location,
            hospital_id: hospital_id,
            hospital_name: hospital_name,
            contact_person: contact_person,
            contact_mobile: contact_mobile,
            detail: detail,
            reservation_date: reservation_date,
            reservation_time_start: reservation_time_start,
            reservation_time_end: reservation_time_end,
            reservation_by: reservation_by,
            update_by: update_by
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
exports.findMachineBooking = async function (req, res, next) {
    const { reservation_date, reservation_time_start, reservation_time_end } = req.query;
    if (!reservation_date || !reservation_time_start || !reservation_time_end) {
        res.status(200).send({ success: false, message: 'please put reserv_date, time_start, time_end' });
    } else {
        const result = await sequelize.query(
            `SELECT m._id,m.machine_name,m.model,CONCAT(' ` + env.Server_URL + `',m.image_path) as url,
                CASE
                    WHEN m._id  in (SELECT b.machine_id FROM booking b 
                                                where	b.reservation_date = '`+ reservation_date + `' 
                                                AND	(b.reservation_time_start BETWEEN '`+ reservation_time_start + `' AND '` + reservation_time_end + `' 
                                                OR  b.reservation_time_end BETWEEN '`+ reservation_time_start + `' AND '` + reservation_time_end + `'))  THEN 0
                    ELSE 1 
                END AS book_status
                from machine m`
            , { type: QueryTypes.SELECT });
            return res.send(result);

    }


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

