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
// Login
exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const passwordHash = password;
    const id = req.params.id;
    //ค้นหาข้อมูลใน Database ว่ามี email หรือ เบอร์มือถือไม่
    await Users.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { mobile: username },
                { email: username }
            ]
        }
    })
        .then(data => {
            if (data) {
                bcrypt.compare(passwordHash, data.password, function (err, user) {
                    if (err) res.status(400).send(err);
                    if (user) {
                        // Send JWT
                        // Create and assign token
                        const token = jwt.sign(user, 'your_jwt_secret');
                        res.header("auth-token", token).send({
                            success: true,
                            message: "Login Succesfuly",
                            token: token,
                            user_id: data._id,
                            username: data.username,
                            email: data.email,
                        });
                    } else {
                        // response is OutgoingMessage object that server response http request
                        return res.send({ success: false, message: "Mobile/Email or Password is wrong." });
                    }
                })
            }
            else return res.send({ success: false, message: "Mobile/Email not found" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Users with id=" + id
            });
        });
}
