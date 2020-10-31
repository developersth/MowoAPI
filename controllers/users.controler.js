//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const sequelize = db.sequelize;
const Users = db.users;
const { Op } = require("sequelize");//condition
exports.create = async function (req, res) {
    try {
        const { name, mobile, email, password } = req.body;
        var check_data_exist = Users.findAll({
            where: {
                [Op.or]: [
                    { email: email },
                    { mobile: mobile }
                ]
            }
        });
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = {
            name: name,
            mobile: mobile,
            email: email,
            password: passwordHash,

        };
        check_data_exist.then(function (users) {
            if (users.length == 0) {
                Users.create(newUser).then(data => {
                    res.send({ success: true, message: 'Users Created Successfully', data });
                })
                    .catch(err => {
                        res.status(500).send({ success: false, message: err.message || "Some error occurred while creating the users." });
                    });
            }
            else {
                res.send({ success: false, message: 'Email or Mobile already in user' });
            }
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
}
exports.findAll = async function (req, res, next) {
    const result = Users.findAll();
    await result.then(function (users) {
        return res.json(users);
    })

}
exports.findAllSearch = async function (req, res, next) {
    var sql = `select
                us._id,
                role_id,
                username,
                mobile,
                email,
                password,
                name,
                last_login,
                status,
                us.created_at,
                us.updated_at,
                ur.role_name,
                ur.role_type 
            from
                users us
            left join users_role ur
            on us.role_id  = ur._id `
    const result = await sequelize.query(sql, { type: Op.SELECT });
    return res.send(result[0]);
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
                            name: data.name,
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
