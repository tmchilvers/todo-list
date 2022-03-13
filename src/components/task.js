import React from "react";


export default function Task(props) {
  
  //  --------------------------------------------------------------------------
  //                              HTML Block  
  return (
    <li className="task" ref={props.provided.innerRef} {...props.provided.draggableProps} {...props.provided.dragHandleProps}>
      <input 
        id={props.taskNum} 
        type="checkbox" 
        defaultChecked={props.done} 
        onChange={() => props.finishTask(props.taskNum)}
      />

      <label className="task-checkbox"  htmlFor={props.taskNum}></label>    

      <label className="label-task">
        {props.taskName}
      </label>
    
      <button 
        type="button" 
        id="btn-delete" 
        className="btn" 
        onClick={() => props.removeTask(props.taskNum)}
      >
        <i className="fa fa-trash-o"></i>
      </button>
  </li>  
  );
}