require('dotenv').config();

const knex = require('knex')({
        client: process.env.CLIENT, // Assuming PostgreSQL, and you have CLIENT=pg in your .env
        connection: {
          host: process.env.HOST,
          user: process.env.USR, //cant use USER since its reserved
          password: process.env.PASSWORD,
          database: process.env.DATABASE
        }
      });

  async function listTableColumns(tableName) {
    const columns = await knex(tableName).columnInfo();
    return Object.keys(columns); // Returns an array of column names
  }
  
  // Predefined list of expected column names
  const expectedColumns = ['irrrr', 'nammmme', 'emarrrril', 'createdrrrr_at']; // Example expected columns
  
  async function findNewColumns(tableName) {
    const currentColumns = await listTableColumns(tableName);
    const newColumns = currentColumns.filter(column => !expectedColumns.includes(column));
    
    if (newColumns.length > 0) {
      console.log(`New columns in ${tableName}:`, newColumns);
    } else {
      console.log(`No new columns found in ${tableName}.`);
    }
    
    return newColumns;
  }
  
  // Example usage
  const tableName = 'bmx_enrollments';
  findNewColumns(tableName)
    .catch((error) => console.error(error))
    .finally(() => knex.destroy());
  