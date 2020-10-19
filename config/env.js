const env = {
    database: 'mowodb',
    username: 'root',
    password: '',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    api_auth:{
      username:'admin',
      apasword:'Pb5U@L.):/\z,Qc7',
    },
    Server_URL:"http://127.0.0.1:3000/"

  };
  
  module.exports = env;