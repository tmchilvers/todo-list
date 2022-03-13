import React, { useState } from "react";


export default function Form(props) {
    //  --------------------------------------------------------------------------
    //                              Constants    

    //  The name of the task
    const [taskName, setTaskName] = useState("");

    //  --------------------------------------------------------------------------
    //                              Functions    
    
    //  Override the submit function and instead call the addTask function from App.js
    function handleSubmit(e) {
        e.preventDefault();
        props.addTask(taskName);
        setTaskName('');
    }

    //  When there is change detected on the input, update the name of the task
    function handleChange(e) {
        setTaskName(e.target.value);
    }

    //  --------------------------------------------------------------------------
    //                              HTML Block
    return (
        <form onSubmit={handleSubmit} className="form-task">
            <input
            type="text"
            id="input-task"
            className="input"
            autoComplete="off"        
            placeholder="What needs to be done?"    
            name="task"
            value={taskName}
            onChange={handleChange}
            />
            <button type="submit" id="btn-add" className="btn">
            <i className="fa fa-plus"></i>
            </button> 
        </form>
    );
}