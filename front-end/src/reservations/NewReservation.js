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
       /* let name = target.name;
        let value = target.value;
 
Error check for reservation date
- Reservation date cannot be on Tuesday
- Reservation date can only be be on future date

        if (name === "reservation_date"){
            const inputtedDate = new Date(`${value} PDT`);
            const reservationDate = inputtedDate.getTime();
            const currentDate = Date.now();
            let dateError = [];

            if (inputtedDate.getUTCDay() === 2){
                dateError.push(
                    "The restaurant is closed on Tuesday."
                );
            } 
            if (reservationDate < currentDate){
                dateError.push(
                    " Reservation date must be made in the future."
                );
            } 
            setReservationError(dateError);
        }

/Error check for reservation time
- Reservation time cannot be before 10:30 am
- Reservation time cannot be after 9:30 pm

        if (name === "reservation_time"){
            const openTime = 1030;
            const closeTime = 2130;
            const reservationTime = value.substring(0, 2) + value.substring(3);
            const timeError = [];

            if (reservationTime < openTime || reservationTime > closeTime){
                timeError.push(
                    "Reservation time must be made between 10:30 AM and 9:30 PM."
                );
            }
            setReservationError(timeError)
        } */

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