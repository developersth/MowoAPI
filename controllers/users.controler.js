//const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const jwt = require('jsonwebtoken')
// define variable
const sequelize = db.sequelize;
const Users = db.users;
const UsersRole = db.users_role;
const { Op, json } = require("sequelize");//condition
exports.create = async function (req, res) {
    try {
        const { name, username,password, email,mobile,role_id,status } = req.body;
        var check_data_exist = Users.findAll({
            where: {
                [Op.or]: [
                    { mobile: mobile },
                    { username : username },
                ]
            }
        });
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = {
            name    :   name,
            username:   username,
            password:   passwordHash,
            email   :   email,
            mobile  :   mobile,
            role_id :   role_id,
            status  :   status
        };
       await check_data_exist.then(function (users) {
            if (users.length == 0) {
                Users.create(newUser).then(data => {
                    res.send({ success: true, message: 'Users Created Successfully', data });
                })
                    .catch(err => {
                        res.status(500).send({ success: false, message: err.message || "Some error occurred while creating the users." });
                    });
            }
            else {
                res.send({ success: false, message: 'Username or Mobile already in User' });
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
exports.getUserRole = async function (req, res, next) {
    const result = await UsersRole.findAll();
    return res.json(result);
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
exports.update =async function (req, res) {
    try {
        const { name, username,password, email,mobile,role_id,status } = req.body;
        const check_data_exist = Users.findAll({
            where: { 
                [Op.and]: [{ username: username }], 
                [Op.not]: [{ _id: req.params.id }],
            }
        });
        await check_data_exist.then(function (users) {
            if (users.length> 0) {
                res.send({ success: false, message: "Username already in User" });
            }else{
                let passwordHash=""
                const userObj =  Users.findByPk(req.params.id);
                const oldPassword = userObj.password;
                
                if (password){
                    passwordHash = bcrypt.hashSync(password, 10);
                }else{
                    passwordHash = oldPassword;
                }
                const newUser = {
                    name    :   name,
                    username:   username,
                    password:   passwordHash,
                    email   :   email,
                    mobile  :   mobile,
                    role_id :   role_id,
                    status  :   status
                };
                const result =  Users.update(newUser, {where: {_id: req.params.id}})
                res.send({ success: true, message: 'User Edit Successfully', result });
            }
        })

    } catch (error) {
        res.send({ success: false, message: error });
    }
}
exports.delete = async function (req, res) {
    try {
        await  Users.destroy({where: {_id: req.params.id}})
        res.send({ success: true, message: 'Delete User Successfully' });
    } catch (error) {
        res.send({ success: false, message: error });
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
                let role_name = ""
                let role_type = "";
                 UsersRole.findByPk(data.role_id).then(role => {
                     if(role){
                        role_name   = role.role_name,
                        role_type   = role.role_type
                     }
                     bcrypt.compare(passwordHash, data.password, function (err, user) {
                        if (err) res.status(400).send(err);
                        if (user) {
                            // Send JWT
                            // Create and assign token
                            const token = jwt.sign(user, 'your_jwt_secret');
                            res.header("auth-token", token).send({
                                success     : true,
                                message     : "Login Succesfuly",
                                token       : token,
                                user_id     : data._id,
                                name        : data.name,
                                email       : data.email,
                                role_id     : data.role_id,
                                role_name   : role_name,
                                role_type   : role_type
                            });
                        } else {
                            // response is OutgoingMessage object that server response http request
                            return res.send({ success: false, message: "Mobile/Email or Password is wrong." });
                        }
                    })
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
