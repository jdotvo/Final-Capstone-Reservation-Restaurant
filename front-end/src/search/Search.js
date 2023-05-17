import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { searchByPhoneNumber } from "../utils/api";
import SearchForm from "./SearchForm";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "../dashboard/ListReservations";

function Search(){
    const initialFormState = {
        mobile_number:"",
    };

    const history = useHistory();

    const [formData, setFormData] = useState({...initialFormState});
    const [searchError, setSearchError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

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
            const displayReservation = await searchByPhoneNumber(formData.mobile_number, abortController.signal);
            setSearchResults(displayReservation);
            console.log(displayReservation)
        } catch (error){
            setSearchError(error);
        }
        console.log(searchError)
    };
    
    

    return (
        <div>
            <ErrorAlert error={searchError} />
            <form onSubmit={ handleSubmit }>
                <h1>Search for Reservation by Mobile Number</h1>
                <SearchForm formData={ formData } handleChange={ handleChange }/>
                <div>
                    <button type="submit" className="btn btn-primary mr-3 mb-2">Find</button>
                    <button type="button" className="btn btn-danger mb-2" onClick={() => history.goBack()}>Cancel</button>
                </div>
            </form>
            
            {searchResults.length !== 0 ? (
                <ListReservations reservations={searchResults} />
            ) : (
                <h4>No reservations found</h4>
                )
            }

        </div>
    )
}

export default Search;