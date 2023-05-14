import React from "react";

function ReservationInfoForSeat({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people }){
    
    return(
        <div className="card my-2" style={{ width: "440px" }}>
            <h6 className="card-header">{`Name: ${first_name} ${last_name}`}</h6>
            <div className="card-body">
                <p>
                    {`Reservation ID: ${reservation_id}`} <br />
                    {`Date of Reservation: ${reservation_date}`} <br />
                    {`Time of Reservation: ${reservation_time}`} <br />
                    {`Size of Party: ${people}`} <br />
                    {`Phone Number: ${mobile_number}`}    
                </p>
            </div>
        </div>
    )
}

export default ReservationInfoForSeat;