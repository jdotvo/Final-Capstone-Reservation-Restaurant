import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation(){
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    };

    const history = useHistory();

    const [formData, setFormData] = useState({...initialFormState});
    const [reservationError, setReservationError] = useState(false);

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
            await createReservation(formData, abortController.signal)
            history.push(`/dashboard?date=${formData.reservation_date}`)
        } catch(error) {
            setReservationError(error)
        } 
    }

    return (
        <div>
            <ErrorAlert error={ reservationError }/>
            <form onSubmit={ handleSubmit }>
                <h1>New Reservation</h1>
                <ReservationForm formData={ formData } handleChange={ handleChange }/>
                <div>
                    <button type="submit" className="btn btn-primary mr-3 mb-2">Submit</button>
                    <button type="button" className="btn btn-danger mb-2" onClick={() => history.goBack()}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default NewReservation;