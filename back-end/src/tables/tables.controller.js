const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
    "table_name",
    "capacity",
    "reservation_id",
];

const REQUIRED_PROPERTIES = [
    "reservation_id",
];

const TABLE_PROPERTIES = [
    "table_name",
    "capacity",
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

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({
      status: 404,
      message: `table_id ${table_id} cannot be found.`,
    });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await service.readReservation(reservation_id);
  if (reservation && reservation.status !== "seated") {
    res.locals.reservation = reservation;
    return next();
  } else if (reservation && reservation.status === "seated"){
    return next({
      status: 400,
      message: `reservation_id ${reservation_id} is already seated.`
    });
  } else {
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} cannot be found.`,
    });
  }
}

//Table_name must be at least 2 characters long
function tableNameLength(req, res, next) {
    const { table_name } = req.body.data;
    if ( !table_name || (table_name && table_name.length > 1)) {
        return next();
    } else {
        return next({
            status: 400,
            message: "table_name must be at least 2 characters in length."
        });
    }
}

//Table capacity must be a numeric value
function tableCapacity(req, res, next) {
    const { capacity } = req.body.data;
    if (!capacity || typeof capacity === "number") {
        return next();
    } else {
        return next({
            status: 400, 
            message: `capacity needs to be a number.`
        });
    }
}

//Table must have enough capacity for reservation
function enoughSeatingCapacity(req, res, next) {
  if (res.locals.table.capacity < res.locals.reservation.people) {
    return next({
      status: 400,
      message: `Table does not have enough capacity for reservation.`,
    });
  }
  return next();
}

//Check if table is occupied
function tableIsOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next({
      status: 400,
      message: `Table is currently occupied.`,
    });
  }
  return next();
}

//Check if table is not occupied
function tableIsNotOccupied(req, res, next) {
    const { reservation_id } = res.locals.table;
    if (!reservation_id) {
      return next({
        status: 400,
        message: `Table is not occupied.`,
      });
    }
    return next();
  }

//List handler for table
async function list(req, res) {
    const data = await service.listTables();
    res.json({ data });
}

//Create handler for table
async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
}

//Read handler for table
async function read(req, res) {
  const data = await service.read(req.params.table_id);
  res.json({ data });
}

//Update handler for table
async function update(req, res) {
    const updatedTable = {
      ...req.body.data,
      table_id: res.locals.table.table_id,
    };
    const data = await service.update(updatedTable);
    res.status(200).json({ data });
}

async function updateToSeatedStatus(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  await service.updateStatus(
    updatedReservation.reservation_id,
    updatedReservation.status
  );
  next();
}

async function removeTableAssignment(req, res){
    const { table_id, reservation_id } = res.locals.table;
    await service.updateStatus(reservation_id, "finished");
    await service.removeTableAssignment(table_id);
    res.status(200).json({});
}

// Delete handler
async function destroy(req, res) {
  const { table } = res.locals;
  await service.delete(table.table_id);
  res.sendStatus(204);
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasProperties(...TABLE_PROPERTIES),
        hasOnlyValidProperties,
        tableNameLength,
        tableCapacity,
        asyncErrorBoundary(create),
    ],
    read: [asyncErrorBoundary(read), asyncErrorBoundary(tableExists)],
    update: [
        hasProperties(...REQUIRED_PROPERTIES),
        hasOnlyValidProperties,
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        tableNameLength,
        tableCapacity,
        enoughSeatingCapacity,
        tableIsOccupied,
        updateToSeatedStatus,
        asyncErrorBoundary(update),
    ],
    removeTableAssignment: [
        asyncErrorBoundary(tableExists),
        tableIsNotOccupied,
        asyncErrorBoundary(removeTableAssignment),
    ],
    delete :[
        asyncErrorBoundary(tableExists),
        tableIsNotOccupied,
        asyncErrorBoundary(destroy),
    ],
}