import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, getReservation, seatReservationAtTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationInfoForSeat from "./ReservationInfoForSeat";

function SeatReservation(){
    const history = useHistory();
    const { reservation_id } = useParams();

    const initialFormState = {
        table_id:"",
    };

    const [formData, setFormData] = useState({...initialFormState});
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [reservation, setReservation] = useState({});
    const [reservationError, setReservationError] = useState(null);

    useEffect(loadTable, []);

    function loadTable(){
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
    };

    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setReservationError(null);
        getReservation(reservation_id, abortController.signal)
          .then(setReservation)
          .catch(setReservationError);
        return () => abortController.abort();
    }; 

    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
            try {
              await seatReservationAtTable(formData.table_id, reservation_id, abortController.signal);
              await updateStatus(reservation_id, "seated", abortController.signal)
              history.push(`/dashboard`)
            } catch(error){
              setTablesError(error)
            }
        console.log(formData)
    };

    if(tables && tables.length>0){
        return (
            <div>
                <ErrorAlert error={ tablesError } />
                <ErrorAlert error={ reservationError } />
                <h1>Seat Reservation</h1>
                <ReservationInfoForSeat 
                    reservation_id={reservation.reservation_id}
                    first_name={reservation.first_name}
                    last_name={reservation.last_name}
                    mobile_number={reservation.mobile_number}
                    reservation_date={[reservation.reservation_date].toString().split("").splice(0,10).join("")}
                    reservation_time={reservation.reservation_time}
                    people={reservation.people}

                />
                <form onSubmit={ handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="table_id">
                            Select table for reservation:
                            <select
                            className="ml-1"
                            id="table_id"
                            name="table_id"
                            onChange={ handleChange }
                            value={ formData.table_id }
                            >
                                <option value="">-- Available Table & Capacity --</option>
                                {tables.map((table) => (
                                    <option key={table.table_id} value={table.table_id}>
                                        {table.table_name} - {table.capacity}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary mr-3 mb-2">Submit</button>
                        <button type="button" className="btn btn-danger mb-2" onClick={() => history.goBack()}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Seat Reservation</h1>
                <h5>There are no tables available for Reservation ID: {reservation_id}</h5>
            </div>
        )
    }
}

export default SeatReservation;