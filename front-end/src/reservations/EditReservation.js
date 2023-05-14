import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, updateReservation } from "../utils/api";

function EditReservation(){
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };

    const { reservation_id } = useParams();
    const history = useHistory();

    const [formData, setFormData] = useState({...initialFormState});
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setReservationsError(null);
        getReservation(reservation_id, abortController.signal)
          .then((reservation) => setFormData(reservation))
          .catch((error) => setReservationsError(error.message || "An error occurred while loading the reservation."));
        return () => abortController.abort();
    }

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
            const validFormData = {
                reservation_id: formData.reservation_id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                mobile_number: formData.mobile_number,
                reservation_date: formData.reservation_date,
                reservation_time: formData.reservation_time,
                people: formData.people,
            };
            await updateReservation(validFormData, abortController.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
        } catch(error) {
            setReservationsError(error)
        }
        console.log(formData)
    }

    return (
        <div>
            <ErrorAlert error={reservationsError}/>
            <h1>Edit Reservation</h1>
            <ReservationForm formData={formData} handleChange={handleChange} reservation_id={reservation_id} />
            <div>
                <button type="submit" className="btn btn-primary mr-3 mb-2" onClick={handleSubmit}>Submit</button>
                <button type="button" className="btn btn-danger mb-2" onClick={() => history.goBack()}>Cancel</button>
            </div>
        </div>
    )
}

export default EditReservation;