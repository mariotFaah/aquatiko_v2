/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('factures', (table) => {
    // Nouveaux champs pour le paiement flexible
    table.string('statut_paiement', 20).defaultTo('non_paye');
    table.string('type_paiement', 20).defaultTo('comptant');
    table.decimal('montant_paye', 15, 2).defaultTo(0);
    table.decimal('montant_restant', 15, 2);
    table.date('date_finale_paiement');
    table.decimal('montant_minimum_paiement', 15, 2).defaultTo(0);
    table.decimal('penalite_retard', 5, 2).defaultTo(0);
  });

  // Créer la table paiements
  await knex.schema.createTable('paiements', (table) => {
    table.increments('id').primary();
    table.integer('numero_facture').unsigned().notNullable();
    table.decimal('montant', 15, 2).notNullable();
    table.string('mode_paiement', 50).defaultTo('especes');
    table.string('reference', 100);
    table.date('date_paiement').defaultTo(knex.fn.now());
    table.text('notes');
    table.timestamps(true, true);

    // Clé étrangère
    table.foreign('numero_facture')
      .references('numero_facture')
      .inTable('factures')
      .onDelete('CASCADE');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('paiements');
  
  await knex.schema.alterTable('factures', (table) => {
    table.dropColumn('statut_paiement');
    table.dropColumn('type_paiement');
    table.dropColumn('montant_paye');
    table.dropColumn('montant_restant');
    table.dropColumn('date_finale_paiement');
    table.dropColumn('montant_minimum_paiement');
    table.dropColumn('penalite_retard');
  });
}