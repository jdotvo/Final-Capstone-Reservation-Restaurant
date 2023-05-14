import React from "react";

function ListReservations({ reservations, handleCancel }){
    return (
        <div>
          <div>
            <table className="table table-striped table-bordered my-2">
              <thead className="thread-dark">
                <tr>
                  <th>Reservation ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Mobile Number</th>
                  <th>Reservation Time</th>
                  <th>Party Size</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length !== 0 ? (
                    reservations.map((reservation) => (
                      <tr key={reservation.reservation_id}>
                        <td>{reservation.reservation_id}</td>
                        <td>{reservation.first_name}</td>
                        <td>{reservation.last_name}</td>
                        <td>{reservation.mobile_number}</td>
                        <td>{reservation.reservation_time}</td>
                        <td>{reservation.people}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>
                        {reservation.status}
                        </td>
                        <td>
                        {reservation.status === "booked"  && 
                          reservation.status !== "seated" && (
                            <a
                                href={`/reservations/${reservation.reservation_id}/seat`}
                                className="btn btn-primary mx-1"
                            >
                            Seat
                            </a>
                        )}
                        {reservation.status === "booked" && (
                            <a
                                href={`/reservations/${reservation.reservation_id}/edit`}
                                className="btn btn-primary mx-1"
                            >
                            Edit
                            </a>
                        )}
                        {reservation.status === "booked" && (
                            <button
                            type="button"
                            className="btn btn-danger"
                            data-reservation-id-cancel={reservation.reservation_id}
                            onClick={() => handleCancel(reservation.reservation_id)}
                        >
                            Cancel
                        </button>
                        )}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="9">No reservations were found.</td>
                    </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default ListReservations;