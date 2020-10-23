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
            driver_id,
            mobile_id,
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
            update_by,
        } = req.body;
        var status="";
        if (mobile_id) status="AS"
        else status="CB"
        const newBooking = {
            machine_id: machine_id,
            driver_id: driver_id,
            mobile_id: mobile_id,
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
            update_by: update_by,
            status:status
        };

        //check เครื่องว่าง
        var sql = `SELECT count(*) as vcount from booking b
                where  b.reservation_date = '`+ reservation_date + `' 
                AND	   (b.reservation_time_start BETWEEN '`+ reservation_time_start + `' AND '` + reservation_time_end + `' 
                OR     b.reservation_time_end BETWEEN '`+ reservation_time_start + `'  AND '` + reservation_time_end + `' )
                AND machine_id=`+ machine_id
        const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
        console.log(Number(result[0].vcount))
        if (Number(result[0].vcount) > 0)
            res.send({ success: false, message: 'Machine ID:' + machine_id + ' this already reserved' });
        else {
            await Booking.create(newBooking).then(data => {
                res.send({ success: true, message: 'Machine Created Successfully', data });
            })
                .catch(err => {
                    res.status.send({ success: false, message: err.message || "Booking Not Created" });
                });
        }

    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
exports.findAllBookingSearch = async function (req, res, next) {
    const { status, start_date, end_date, keyword,lang } = req.query;
    var cond = "";
    if (status) {
        cond = cond + " and b.status='" + status +"'"
    }
    if (start_date && end_date) {
        cond = cond + " and b.reservation_date BETWEEN '" + start_date + "' and '" + end_date + "'"
    }
    if (keyword) {
        cond = cond + `and job_title like '%`+keyword+ `%' 
                    or m.name like '%`+keyword+ `%'
                    or d.name like '%`+keyword+ `%'
                    or book_id like '%`+keyword+ `%' `
    }
    if (!lang) {lang="en";} //language
    var sql = `select distinct
                book_id,
                machine_id,
                driver_id,
                d.name as driver_name,
                mobile_id,
                m.name as  mobile_name,
                job_title,
                location,
                hospital_id,
                hospital_name,
                lat,
                lng,
                contact_mobile,
                detail,
                reservation_date,
                reservation_time_start,
                reservation_time_end,
                concat(TIME_FORMAT(reservation_time_start,'%H:%i'),'-',TIME_FORMAT(reservation_time_end,'%H:%i')) as reserv_time,
                reservation_by,
                sd.status_name_`+lang+` as status_name
            from
                booking b
            left join users d
            on b.driver_id =d._id
            left join users m 
            on b.mobile_id=m._id
            left join status_desc sd
            on b.status=sd.status_code
            where book_id is not null `+ cond

    const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
    return res.send(result);
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
        var sql = `SELECT m._id,m.machine_name,m.model,CONCAT(' ` + env.Server_URL + `',m.image_path) as url,
                    CASE
                        WHEN m._id  in (SELECT b.machine_id FROM booking b 
                                        where  b.reservation_date = '`+ reservation_date + `' 
                                        AND	   (b.reservation_time_start BETWEEN '`+ reservation_time_start + `' AND '` + reservation_time_end + `' 
                                        OR     b.reservation_time_end BETWEEN '`+ reservation_time_start + `' AND '` + reservation_time_end + `'))  THEN 0
                        ELSE 1 
                    END AS book_status
                    from machine m`
        const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
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

