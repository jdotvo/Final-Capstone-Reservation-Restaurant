import React from "react";

function ReservationForm({ formData, handleChange }){

    return (
        <div>
            <input 
                name="reservation_id"
                type="hidden" 
                onChange={handleChange} 
                value={formData.reservation_id || ''} 
            />
            <div className="form-group">
                <label htmlFor="first_name">First Name:</label>
                <input
                    className="form-control" 
                    id="first_name"
                    name="first_name"
                    type="text"
                    style={ {width:"400px"} }
                    placeholder="First Name"
                    required
                    onChange={ handleChange }
                    value={ formData.first_name }
                />
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Last Name:</label>
                <input 
                    className="form-control" 
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    style={ {width:"400px"} }
                    required
                    onChange={ handleChange }
                    value={ formData.last_name }
                />
            </div>
            <div className="form-group">
                <label htmlFor="mobile_number">Mobile Number:</label>
                <input 
                    className="form-control" 
                    id="mobile_number"
                    name="mobile_number"
                    type="tel"
                    pattern="[0-9]{10}"
                    placeholder="xxx-xxx-xxx"
                    style={ {width:"400px"} }
                    required
                    onChange={ handleChange }
                    value={ formData.mobile_number }
                />
            </div>
            <div className="form-group">
                <label htmlFor="reservation_date">Reservation Date:</label>
                <input 
                    className="form-control" 
                    id="reservation_date"
                    name="reservation_date"
                    type="date"
                    style={ {width:"400px"} }
                    required
                    onChange={ handleChange }
                    value={ formData.reservation_date }
                />
            </div>
            <div className="form-group">
                <label htmlFor="reservation_time">Reservation Time:</label>
                <input 
                    className="form-control" 
                    id="reservation_time"
                    name="reservation_time"
                    type="time"
                    style={ {width:"400px"} }
                    required
                    onChange={ handleChange }
                    value={ formData.reservation_time }
                />
            </div>
            <div className="form-group">
                <label htmlFor="people">People:</label>
                <input 
                    className="form-control" 
                    id="people"
                    name="people"
                    type="number"
                    placeholder="Number of people in party"
                    style={ {width:"400px"} }
                    min="1"
                    required
                    onChange={ handleChange }
                    value={ formData.people }
                />
            </div>
        </div>
    )
}

export default ReservationForm;