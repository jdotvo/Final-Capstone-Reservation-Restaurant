const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

//Reservation date is valid date value
function dateIsValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);
  if (date && date > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `reservation_date is not a valid date.`,
    });
  }
}

//Reservation time is valid value
function timeIsValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const isTime = reservation_time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  if (isTime) {
    res.locals.reservation_time = reservation_time;
    return next();
  } else {
    next({
      status: 400,
      message: `reservation_time is not a valid time.`,
    });
  }
}

//Value of people is a number
function peopleIsNumber(req, res, next) {
  let { people } = req.body.data;
  if (typeof people !== "number" || people < 1) {
    next({
      status: 400,
      message: `people must be a number and greater than zero.`,
    });
  } 
  return next();
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation ID ${reservationId} cannot be found.`,
  });
}

//Reservation date can only be be on future date
function notInThePast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservation = new Date(`${reservation_date} PDT`).setHours(reservation_time.substring(0, 2), reservation_time.substring(3));
  const now = Date.now();
  if (reservation > now) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservations must be made in the future. Please select another date.",
    });
  }
}

//Reservation date cannot be on Tuesday
function notOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const day = date.getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesday. Please select another date.",
    });
  } else {
    return next();
  }
}

//Reservation time cannot be before 10:30 am or after 9:30 pm
function onlyDuringOperationTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const open = 1030;
  const close = 2130;
  const reservation = reservation_time.substring(0, 2) + reservation_time.substring(3);
  if (reservation > open && reservation < close) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation can only be made between 10:30 AM and 9:30 PM. Please select another time.",
    });
  }
}

//Only reservation with "booked" status can be seated
function statusNotBooked(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status !== "booked") {
      return next({
        status: 400,
        message: `Unable to seat a reservation with a status of ${status}.`,
      });
    } else if (status === "booked") {
      return next();
    }
  }
  next();
}

//Status type must be valid
function validStatus(req, res, next) {
  const { status } = req.body.data;
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    return next();
  }
  next({
    status: 400,
    message: `${status} is not a valid status.`,
  });
}

//Reservation already seated
function alreadySeated(req, res, next){
  const { status } = req.body.data;
  if (status === "seated"){
    return next({
      status: 400,
      message: "Reservation is already seated",
    })
  } else {
    return next();
  }
}

//Finished status cannot be updated
function statusIsNotFinished(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400, 
      message: "A finished reservation cannot be updated.",
    });
  } else {
    return next();
  }
}

/**
 * List handler for reservation 
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let data;
  if (date){
    data = await service.listReservationDates(date);
  } else if (mobile_number) {
    data = await service.search(mobile_number);
    /*if (!data || data.length === 0) {
      return res.status(404).json({error: "No reservations found."})
    }*/
  } /*else {
    return res.status(500)// throw error about input validation
  }*/
  
  res.json({ data });
}

//Create handler for reservation
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//Read handler for reservation
async function read(req, res) {
  const data = await service.read(req.params.reservationId);
  res.json({ data });
}

//Update handler for reservation
async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

//Handler to update status of reservation
async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservation_id, status);
  console.log(data)
  res.status(200).json({ data });
}

module.exports = {
  list: [
    asyncErrorBoundary(list),
  ],
  create: [
    hasProperties(...REQUIRED_PROPERTIES),
    hasOnlyValidProperties,
    dateIsValid,
    timeIsValid,
    notOnTuesday,
    notInThePast,
    onlyDuringOperationTime,
    peopleIsNumber,
    statusNotBooked,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasProperties(...REQUIRED_PROPERTIES),
    hasOnlyValidProperties,
    dateIsValid,
    timeIsValid,
    peopleIsNumber,
    notOnTuesday,
    notInThePast,
    onlyDuringOperationTime,
    statusNotBooked,
    alreadySeated,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    statusIsNotFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
