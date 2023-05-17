const knex = require("../db/connection");

function list(){
    return knex("reservations")
        .select("*")
        .orderBy("reservation_date");
}

// List reservations by date and sort by time
function listReservationDates(date){
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .whereNot({ status: "finished" })
        .orderBy("reservation_time");
}

//Create reservation
function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecord) => createdRecord[0]);
}

//Read reservation by reservation_id
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

//Update reservation
function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updatedRecord) => updatedRecord[0]);
}

function updateStatus(reservationId, status) {
    return knex("reservations")
        .where({ reservation_id: reservationId })
        .update({ status: status }, "*")
        .then((updatedRecord) => updatedRecord[0]);
}

//Find reservation by phone number
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
    list,
    listReservationDates,
    create,
    read,
    update,
    updateStatus,
    search,
}