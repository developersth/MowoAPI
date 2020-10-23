const Sequelize = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: 0,
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import model
db.users = require('../models/users.model.js')(sequelize, Sequelize);
db.users_role = require('../models/users_role.model.js')(sequelize, Sequelize);
db.booking = require('../models/booking.model.js')(sequelize, Sequelize);
db.machine = require('../models/machine.model.js')(sequelize, Sequelize);
db.hospital = require('../models/hospital.model.js')(sequelize, Sequelize);
db.status_desc = require('../models/status_desc.model.js')(sequelize, Sequelize);
module.exports = db;