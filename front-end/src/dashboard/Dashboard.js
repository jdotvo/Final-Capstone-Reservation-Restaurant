import React, { useEffect, useState } from "react";
import { listReservations, updateStatus } from "../utils/api";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { formatAsDate, today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservations";
import TableList from "./ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const dateQuery = useQuery().get("date");
  if (dateQuery) {
    date = dateQuery;
  }

  const displayDate = formatAsDate(date);
  const previousDate = previous(date);
  const nextDate = next(date);

  function pushDate(dateToMove) {
    history.push(`/dashboard?date=${dateToMove}`);
  }

  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [cancelError, setCancelError] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  async function handleCancel( reservation_id ) {
    const confirmationWindow = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    const abortController = new AbortController();
    if (confirmationWindow) {
      try {
        await updateStatus(reservation_id, "cancelled", abortController.signal);
        loadDashboard();
      } catch (error) {
        setCancelError([...cancelError, error]);
      }
    }
  };

  // **** Can switch link to button if needed ***
  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <h1 className ="d-md-flex justify-content-center">Dashboard</h1>
      <div className="d-md-flex mb-3 justify-content-center">
        <h4 className="mb-0">Reservations for { displayDate }</h4>
      </div>
      <div className="container">
        <div className="d-flex mt-3 justify-content-center">
        <button
          className="btn btn-dark"
          onClick={() => pushDate(previousDate)}
        >
          Previous Date
        </button>
        <button
          className="btn btn-dark mx-3"
          onClick={() => history.push("/dashboard")}
          disabled={date === today()}
        >
          Today
        </button>
        <button 
          className="btn btn-dark" 
          onClick={() => pushDate(nextDate)}>
            Next day
        </button>
        </div>
      </div>
      <div>
        <h2>Reservations</h2>
      </div>
      <ListReservations reservations={reservations} handleCancel={handleCancel} />
      <div>
        <h2>Tables</h2>
      </div>
      <TableList />
    </main>
  );
}

export default Dashboard;
