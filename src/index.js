import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

//  --------------------------------------------------------------------------
//                              Constants  

//  All data pertaining to each task
const TASK_DATA= [
  { taskNum: "task-0", taskName: "Clean dishes", done: false},
  { taskNum: "task-1", taskName: "Vacuum", done: false},
  { taskNum: "task-3", taskName: "Fill up car with gas", done: false}
]

//  --------------------------------------------------------------------------
//                                Render  
ReactDOM.render(
  <React.StrictMode>
    <App taskData = {TASK_DATA} />
  </React.StrictMode>,
  document.getElementById('root')
);