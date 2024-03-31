require('dotenv').config();

module.exports = {
  development: {
    connection: {
      client:  process.env.CLIENT, 
      host: process.env.HOST,
      user: process.env.USR,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    },
  },
};
