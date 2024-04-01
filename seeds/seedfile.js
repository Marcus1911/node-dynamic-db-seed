exports.seed = function(knex) {
  return knex.transaction(async (trx) => {
    await Promise.all([
      trx.schema.raw('ALTER TABLE table2 ADD COLUMN price numeric'),
      trx.schema.raw('ALTER TABLE table2 ADD COLUMN phone character varying')
    ]);
    await trx('table2').update({
      'price': trx.select('price').from('table1').whereRaw('table1.id = table2.id')
    });
    await trx('table2').update({
      'phone': trx.select('phone').from('table1').whereRaw('table1.id = table2.id')
    });
  });
};
