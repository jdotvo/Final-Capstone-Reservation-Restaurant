import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import { Link, useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservations";
import ListTables from "./ListTables";

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

  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [cancelError, setCancelError] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  async function handleFinish({ table_id, reservation_id }) {
    const confirmationWindow = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    const abortController = new AbortController();
    if (confirmationWindow) {
      try {
        await finishTable(table_id, abortController.signal);
        await updateStatus(reservation_id, "finished", abortController.signal);
        loadDashboard();
      } catch (error) {
        setTablesError(error);
      }
    }
  };

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
      <ErrorAlert error={tablesError} />
      <h1 className ="d-md-flex justify-content-center">Dashboard</h1>
      <div className="d-md-flex mb-3 justify-content-center">
        <h4 className="mb-0">Reservations for { date }</h4>
      </div>
      <div className="container">
        <div className="d-flex mt-3 justify-content-center">
        <Link
          to={`/dashboard/?date=${previous(date)}`}
          className="btn btn-dark"
        >
          Previous Day
        </Link>
        <Link to={`/dashboard?date=${today()}`} className="btn btn-dark mx-3">
          Today
        </Link>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next Day
        </button>
        </div>
      </div>
      <div>
        <h2>Reservations</h2>
      </div>
      <ListReservations reservations={reservations} date={date} handleCancel={handleCancel} />
      <div>
        <h2>Tables</h2>
      </div>
      <ListTables tables={tables} handleFinish={handleFinish}/>
    </main>
  );
}

export default Dashboard;
