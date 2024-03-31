const knexConfig = require('./knexfile.js');
const knex = require('knex')(knexConfig);

async function testDatabaseConnection() {
  try {
    await knex.raw('SELECT 1+1 as result');
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await knex.destroy();
  }
}

testDatabaseConnection();
