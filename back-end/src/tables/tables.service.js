const knex = require("../db/connection");

// List tables and sort by table name
function listTables(){
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

// Create table
function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((createdRecord) => createdRecord[0]);
}

// Read table by table_id
function read(table_id) {
    return knex("tables")
      .select("*")
      .where({ table_id: table_id })
      .then((readTables) => readTables[0]);
}

// Read reservation by reservation_id
function readReservation(reservation_id) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id: reservation_id })
      .then((readReservations) => readReservations[0]);
}

// Update table
function update(updatedTable) {
    return knex("tables")
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*")
      .then((updatedTables) => updatedTables[0]);
}

function removeTableAssignment(table_id){
    return knex("tables")
      .select("*")
      .where({ table_id: table_id })
      .update({ reservation_id: null});
}

// Deletes table by table_id
function destroy(table_id){
    return knex("tables")
      .select("*")
      .where({ table_id: table_id })
      .del();
}

module.exports = {
    listTables,
    create,
    read,
    readReservation,
    update,
    removeTableAssignment,
    delete: destroy,
}