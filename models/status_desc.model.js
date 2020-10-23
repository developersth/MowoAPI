module.exports = (sequelize, Sequelize) => {
    const Status_desc = sequelize.define(
        'status_desc',
        {
            _id: {
                type: Sequelize.INTEGER,
                field: '_id',
                primaryKey: true,
                autoIncrement: true
            },
            group_name: {
                type: Sequelize.STRING(100),
                field: 'group_name',
            },
            status_code: {
                type: Sequelize.STRING(10),
                field: 'status_code',
            },
            status_name_en: {
                type: Sequelize.STRING(100),
                field: 'status_name_en',
            },
            status_name_th: {
                type: Sequelize.STRING(100),
                field: 'status_name_th',
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
    return Status_desc;
};