import React from "react";

function SearchForm({ formData, handleChange }){
    return (
        <div>
        <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
            className="form-control"
                name="mobile_number"
                id="mobile_number"
                type="text" 
                style={ {width:"400px"} }
                placeholder="Please enter phone number"
                required
                onChange={ handleChange }
                value={ formData.mobile_number }
            />
        </div>
    </div>
    )
}

export default SearchForm;