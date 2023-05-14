import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable(){
    const initialFormState = {
        table_name: "",
        capacity: "",
    };

    const history = useHistory();

    const [formData, setFormData] = useState({...initialFormState});
    const [tablesError, setTablesError] = useState(false);

    const handleChange = ({target}) => {
        if (target.name === "capacity") {
            target.value = Number(target.value);
        }
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await createTable(formData, abortController.signal)
            history.push(`/dashboard`)
        } catch(error) {
            setTablesError(error)
        }
    };

    return (
        <div>
            <ErrorAlert error={ tablesError }/>
            <form onSubmit= { handleSubmit }>
                <h1>New Table</h1>
                <TableForm formData={ formData } handleChange= { handleChange }/>
                <div>
                    <button type="submit" className="btn btn-primary mr-3 mb-2">Submit</button>
                    <button type="button" className="btn btn-danger mb-2" onClick={() => history.goBack()}>Cancel</button>
                </div>
            </form>
        </div>

    )
}

export default NewTable;