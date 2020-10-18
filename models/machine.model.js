module.exports = (sequelize, Sequelize) => {
    const Machine = sequelize.define(
        'machine',
        {
            _id: {
                type: Sequelize.INTEGER,
                field: '_id',
                primaryKey: true,
                autoIncrement: true
            },
            machine_name: {
                type: Sequelize.STRING(100),
                field: 'machine_name'
            },
            model: {
                type: Sequelize.STRING(100),
                field: 'model'
            },
            status: {
                type: Sequelize.INTEGER,
                field: 'status',//0=หยุดใช้งาน,1 = ใช้งาน
                defaultValue: 1,
            },
            image_path: {
                type: Sequelize.STRING,
                field: 'image_path'
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
    return Machine;
};