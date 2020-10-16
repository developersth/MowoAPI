module.exports = (sequelize, Sequelize) => {
    const hospital = sequelize.define(
        'hospital',
        {
            _id: {
                type: Sequelize.INTEGER,
                field: '_id',
                primaryKey: true,
                autoIncrement: true
            },
            khet: {
                type: Sequelize.STRING(100),
                field: 'khet'
            },
            hospital_name: {
                type: Sequelize.STRING(100),
                field: 'hospital_name'
            },
            address: {
                type: Sequelize.STRING,
                field: 'address'
            },
            tel: {
                type: Sequelize.STRING(20),
                field: 'tel'
            },
            status: {
                type: Sequelize.INTEGER,
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
    return hospital;
};