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
        var status = "";
        if (mobile_id) status = "AS"
        else status = "CB"
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
            status: status
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
    const { status, start_date, end_date, keyword, lang } = req.query;
    var cond = "";
    if (status) {
        cond = cond + " and b.status='" + status + "'"
    }
    if (start_date && end_date) {
        cond = cond + " and b.reservation_date BETWEEN '" + start_date + "' and '" + end_date + "'"
    }
    if (keyword) {
        cond = cond + `and job_title like '%` + keyword + `%' 
                    or m.name like '%`+ keyword + `%'
                    or d.name like '%`+ keyword + `%'
                    or book_id like '%`+ keyword + `%' `
    }
    if (!lang) { lang = "en"; } //language
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
                sd.status_name_`+ lang + ` as status_name
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
        var sql = `select
                    m._id,
                    m.machine_name,
                    m.model,
                    CONCAT('`+ env.Server_URL + `', m.image_path) as url,
                    case
                        when m._id in (
                        select
                            b.machine_id
                        from
                            booking b
                        where
                            b.reservation_date = '`+ reservation_date + `'
                            and (b.reservation_time_start between '`+ reservation_time_start + `' and '` + reservation_time_end + `'
                            or b.reservation_time_end between '`+ reservation_time_start + `' and '` + reservation_time_end + `')) then 0
                        else 1
                    end as book_status
                from
                    machine m`
        const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
        return res.send(result);
    }
}

exports.findOne = async function (req, res) {
    const id = req.params.id;
    await Booking.findByPk(id)
        .then(function (data)  {
            if (data){
                res.send(data);
            }else{
                res.status(404).send({message: "Booking Not found with id=" + id});
            }
        })
        .catch(err => {
            res.status(500).send({message: "Error retrieving Booking with id=" + id});
        });
}
exports.update = async function (req, res) {
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
            update_by: update_by
        };

        await Booking.update(newBooking,  {where: {book_id: req.params.id}}).then(data => {
            res.send({ success: true, message: 'Booking Edit Successfully', data });
        })
            .catch(err => {
                res.status(500).send({ success: false, message: err.message || "Some error occurred while Edit the Booking." });
            });

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
    }
}
exports.cancel_booking =async function (req, res) {
    try {
        const newData={
            cancel_booking:1,
            status:'CC'
        }
        await Booking.update(newData,{where: {book_id: req.params.book_id}})
        .then(data => {
            res.send({ success: true, message: 'Booking Cancel Successfully', data });
        })
        .catch(err => {
            res.status(200).send({ success: false,message:err});
        });
             
    } catch (error) {
        res.status(500).send({ error: error });
    }
}

