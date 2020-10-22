module.exports = (sequelize, Sequelize) => {
    const Users_Role = sequelize.define(
        'users_role',
        {
            _id: {
                type: Sequelize.INTEGER,
                field: '_id',
                primaryKey: true,
                autoIncrement: true
            },
            role_name: {
                type: Sequelize.STRING(100),
                field: 'role_name',
                unique: true
            },
            role_type: {
                type: Sequelize.STRING(1),
                field: 'role_type'
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
    return Users_Role;
};