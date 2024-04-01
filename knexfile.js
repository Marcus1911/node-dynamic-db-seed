require('dotenv').config();

module.exports = {
    client:  process.env.CLIENT, 
    connection: {
      host: process.env.HOST,
      user: process.env.USR,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    },
};
