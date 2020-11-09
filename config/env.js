const env = {
    database: 'sodexodb',
    username: 'sodexodb',
    password: 'sodexodb',
    host: 'mangoaccth.com',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    api_auth:{
      username:'admin',
      password:'p@ssw0rd',
    },
    //Server_URL:"http://127.0.0.1:3000/",
    Server_URL:"https://booking-sodexo.web.app/"

  };
  
  module.exports = env;