exports.seed = function(knex) {
  return knex.transaction(async (trx) => {
    await Promise.all([
      trx.schema.raw('ALTER TABLE table2 ADD COLUMN price numeric'),
      trx.schema.raw('ALTER TABLE table2 ADD COLUMN phone character varying'),
    ]);
    await knex('table2').update('price', knex.raw('??', ['table1.price']));
    await knex('table2').update('phone', knex.raw('??', ['table1.phone']));
  });
};
