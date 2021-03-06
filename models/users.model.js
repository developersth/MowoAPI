module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define(
        'users',
        {
            _id: {
                type: Sequelize.INTEGER,
                field: '_id',
                primaryKey: true,
                autoIncrement: true
            },
            role_id: {
                type: Sequelize.INTEGER,
                field: 'role_id',
            },
            username: {
                type: Sequelize.STRING(100),
                field: 'username'
            },
            mobile: {
                type: Sequelize.STRING(11),
                field: 'mobile'
            },
            email: {
                type: Sequelize.STRING(100),
                field: 'email'
            },
            password: {
                type: Sequelize.STRING,
                field: 'password'
            },
            name: {
                type: Sequelize.STRING(100),
                field: 'name'
            },
            last_login: {
                type: Sequelize.DATE(),
                field: 'last_login',
            },
            image_path: {
                type: Sequelize.STRING,
                field: 'image_path'
            },
            status: {
                type: Sequelize.BOOLEAN,
                field: 'status',//0=หยุดใช้งาน,1 = ใช้งาน
                defaultValue: 1,
            },
            created_at: {
                type: Sequelize.DATE(),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
            },
            updated_at: {
                type: Sequelize.DATE(),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            engine: 'InnoDB',
            charset: 'utf8',
        }
    );
    return Users;
};