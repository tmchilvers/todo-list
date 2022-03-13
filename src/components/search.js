import React, { useState } from "react";


export default function Search(props) {
    //  --------------------------------------------------------------------------
    //                              Constants    

    //  The name of the task you are searching for
    const [term, setTerm] = useState('');

    //  --------------------------------------------------------------------------
    //                              Functions    
    
    //  Override the submit function and prevent default
    function handleSubmit(e) {
        e.preventDefault();
    }

    //  When there is change detected on the input, update name of term and call searchTasks from App.js
    function handleChange(e) {
        setTerm(e.target.value);
        props.searchTasks(e.target.value);
    }

    //  --------------------------------------------------------------------------
    //                              HTML Block
    return (
        <form onSubmit={handleSubmit} className="search-task">
            <label id="label-search">
                Search your tasks:
            </label>
            <input
            type="text"
            id="input-search"
            autoComplete="off"
            className="input"
            name="task"
            value={term}
            onChange={handleChange}
            />
        </form>
    );
}