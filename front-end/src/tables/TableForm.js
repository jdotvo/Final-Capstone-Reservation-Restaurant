import React from "react";

function TableForm({ formData, handleChange}){

    return(
        <div>
            <div className="form-group">
            <label htmlFor="table_name">Table Name:</label>
                <input
                    className="form-control" 
                    id="table_name"
                    name="table_name"
                    type="text"
                    style={ {width:"400px"} }
                    placeholder="Table Name"
                    minLength="2"
                    required
                    onChange={ handleChange }
                    value={ formData.table_name }
                />
            </div>
            <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
                <input
                    className="form-control" 
                    id="capacity"
                    name="capacity"
                    type="number"
                    style={ {width:"400px"} }
                    placeholder="Number of Guests"
                    min="1"
                    required
                    onChange={ handleChange }
                    value={ formData.capacity }
                />
            </div>

        </div>
    )
}

export default TableForm;