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
                defaultValue: 1,
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
                field: 'email',
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                field: 'password'
            },
            firstname: {
                type: Sequelize.STRING(100),
                field: 'firstname'
            },
            lastname: {
                type: Sequelize.STRING(100),
                field: 'lastname'
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