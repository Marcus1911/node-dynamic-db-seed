require('dotenv').config();
const fs = require('fs');
const knex = require('knex')({
  client: process.env.CLIENT,
  connection: {
    host: process.env.HOST,
    user: process.env.USR,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  }
});

async function detectNewColumns() {
  const table1ColumnsQuery = await knex.schema.raw(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'table1'
  `);
  
  const table2ColumnsQuery = await knex.schema.raw(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'table2'
  `);
  
  // Extract column names from the query results
  const table1Columns = table1ColumnsQuery.rows.map(row => row.column_name);
  const table2Columns = table2ColumnsQuery.rows.map(row => row.column_name);
  
  const newColumns = table1Columns.filter(column => !table2Columns.includes(column));
  
  return newColumns;
}

async function fetchDataAndGenerateSeedFile(newColumns) {
  const seedData = {};
  const columnDataTypes = {};

  for (const column of newColumns) {
    // Fetch data and data type for each new column
    const data = await knex('table1').pluck(column);
    const columnInfo = await knex.schema.raw(`
      SELECT data_type
      FROM information_schema.columns
      WHERE table_name = 'table1' AND column_name = '${column}'
    `);
    const dataType = columnInfo.rows[0].data_type;

    seedData[column] = data;
    columnDataTypes[column] = dataType;
  }

  // Generate seed file content including data and data types
  let seedFileContent = 'exports.seed = function(knex) {\n';
  seedFileContent += '  return knex.transaction(async (trx) => {\n';
  seedFileContent += '    await Promise.all([\n';

  for (const column of newColumns) {
    seedFileContent += `      trx.schema.raw('ALTER TABLE table2 ADD COLUMN ${column} ${columnDataTypes[column]}'),\n`;
  }

  seedFileContent += '    ]);\n';

  for (const column of newColumns) {
    seedFileContent += `    await knex('table2').update('${column}', knex.raw('??', ['table1.${column}']));\n`;
  }

  seedFileContent += '  });\n';
  seedFileContent += '};\n';

  // Write the seed file
  fs.writeFileSync('seeds/seedfile.js', seedFileContent);
  console.log("Seed file generated successfully.");
}


async function main() {
  try {
    const newColumns = await detectNewColumns();
    if (newColumns.length === 0) {
      console.log("No new columns found.");
    } else {
      console.log("New columns detected:", newColumns);
      await fetchDataAndGenerateSeedFile(newColumns);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await knex.destroy();
  }
}

main();
