require('dotenv').config();
console.log(process.env.CLIENT);



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

  const table1Columns = table1ColumnsQuery.rows.map(row => row.column_name);
  const table2Columns = table2ColumnsQuery.rows.map(row => row.column_name);

  const newColumns = table1Columns.filter(column => !table2Columns.includes(column));

  return newColumns;
}

async function fetchDataAndGenerateSeedFile(newColumns) {
  const columnDataTypes = {};

  for (const column of newColumns) {
    const columnInfo = await knex.schema.raw(`
      SELECT data_type
      FROM information_schema.columns
      WHERE table_name = 'table1' AND column_name = '${column}'
    `);
    const dataType = columnInfo.rows[0].data_type;
    columnDataTypes[column] = dataType;
  }

  let seedFileContent = 'exports.seed = function(knex) {\n';
  seedFileContent += '  return knex.transaction(async (trx) => {\n';
  seedFileContent += '    await Promise.all([\n';

  newColumns.forEach(column => {
    seedFileContent += `      trx.schema.raw('ALTER TABLE table2 ADD COLUMN ${column} ${columnDataTypes[column]}'),\n`;
  });

  seedFileContent = seedFileContent.trimEnd().slice(0, -1); // Remove last comma
  seedFileContent += '\n    ]);\n';

  // Assuming `id` as a relation. Adjust the condition inside the whereRaw to fit your actual relation.
  newColumns.forEach(column => {
    seedFileContent += `    await trx('table2').update({\n`;
    seedFileContent += `      '${column}': trx.select('${column}').from('table1').whereRaw('table1.id = table2.id')\n`;
    seedFileContent += `    });\n`;
  });

  seedFileContent += '  });\n';
  seedFileContent += '};\n';

  fs.writeFileSync('seeds/seedfile.js', seedFileContent);
  console.log("Seed file generated successfully.");
}

async function main() {
  try {
    const newColumns = await detectNewColumns();
    if (newColumns.length === 0) {
      console.log("No new columns found.");
      return;
    }
    console.log("New columns detected:", newColumns);
    await fetchDataAndGenerateSeedFile(newColumns);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await knex.destroy();
  }
}

main();
