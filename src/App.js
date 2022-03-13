//  Main libraries
import './App.css';
import Task from "./components/task";
import Form from "./components/form";
import Search from "./components/search";
import React, { useState, useEffect } from "react";

//  3rd party libraries
import { v4 as uuid } from 'uuid';  //  generate unique ID
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';  //  create draggable UI

function App(props) {
  //  --------------------------------------------------------------------------
  //                              Constants

  //  Use multiple lists of tasks so that we do not overwrite the main list and lose data
  const [tasks, setTasks] = useState(props.taskData); //  Main list of tasks
  const [filter, setFilter] = useState(props.taskData); //  Filtered list of tasks
  const [search, setSearch] = useState(props.taskData);  // Searched list of tasks

  //  States for the various filter options
  const [filterChoice, setFilterChoice] = useState("all"); // all, active, finished, searched

  //  Below are used for whether the button is pressed or not
  const [allState, setAllState] = useState(true);
  const [activeState, setActiveState] = useState(false);
  const [finishedState, setFinishedState] = useState(false);   
  
  //  State to disable dragging tasks when we are currently searching our tasks
  const [dropDisabled, setDropDisabled] = useState(false);

  //  Main array list of tasks
  const taskData = tasks?.map((task, index) => 
                                      <Draggable key={task.taskNum} draggableId={task.taskNum} index={index}>
                                        {(provided) => (
                                          <Task 
                                                taskNum={task.taskNum} 
                                                taskName={task.taskName} 
                                                done={task.done} 
                                                key={task.taskNum}
                                                finishTask={finishTask}
                                                removeTask={removeTask}
                                                provided={provided}
                                          />
                                        )}
                                      </Draggable>
                                    );

  //  Filtered array list of tasks
  const filteredData = filter?.map((task, index) =>
                                            <Draggable key={task.taskNum} draggableId={task.taskNum} index={index}>
                                              {(provided) => (
                                                <Task 
                                                      taskNum={task.taskNum} 
                                                      taskName={task.taskName} 
                                                      done={task.done} 
                                                      key={task.taskNum}
                                                      finishTask={finishTask}
                                                      removeTask={removeTask}
                                                      provided={provided}

                                                />
                                              )}
                                            </Draggable>
                                          );     
                                         
  //  Searched array list of tasks                                              
  const searchedData = search?.map((task, index) =>
                                            <Draggable key={task.taskNum} draggableId={task.taskNum} index={index}>
                                              {(provided) => (
                                                <Task 
                                                      taskNum={task.taskNum} 
                                                      taskName={task.taskName} 
                                                      done={task.done} 
                                                      key={task.taskNum}
                                                      finishTask={finishTask}
                                                      removeTask={removeTask}
                                                      provided={provided}
                                                />
                                              )}
                                            </Draggable>
                                          );     

  //  Number of unfinished tasks
  const numUnfinished = `${(tasks.filter(task => task.done === false)).length} task left`;

  //  Use effect to ensure the latest list of tasks is being displayed
  useEffect(() => {
    setFilter(() => filterTasks(filterChoice));
  }, [tasks]);
  
  // ===========================================================================
  //                               FUNCTIONS
  // ===========================================================================

  //  --------------------------------------------------------------------------
  //                           Add / Remove Tasks  

  //  Add a new task to the list of tasks
  function addTask(taskName) {
    const task = {taskNum: "task-" + uuid(), taskName: taskName, done: false};

    if (task.taskName !== "")
      setTasks([...tasks, task]);
  }

  //  Remove a task from the list of tasks
  function removeTask(id) {
    const taskList = tasks.filter(task => id !== task.taskNum );

    filterTasks(filterChoice);
    setTasks(taskList);
  }

  //  --------------------------------------------------------------------------
  //                               Filter Tasks

  //  Filter tasks to search results
  function searchTasks(taskName) {
  
    //  Reset to main list of tasks when input is empty
    if(taskName === '') {
      setFilterChoice('all');
      setDropDisabled(false);
    }
    else {
      setFilterChoice('search');
      filterTasks('search');
    }

    const taskList = tasks.filter(task => task.taskName.includes(taskName));
    setSearch(taskList);
  }

  //  Filter tasks by main list, active list, and finished list
  function filterTasks(filterOption) {
    setDropDisabled(false);

    if(filterOption === "active") {
      setAllState(false);
      setActiveState(true);
      setFinishedState(false);
      const taskList = tasks.filter(task => task.done === false);
      setFilter(taskList);
    }

    else if(filterOption === "finished") {
      setAllState(false);
      setActiveState(false);
      setFinishedState(true);      
      const taskList = tasks.filter(task => task.done === true);
      setFilter(taskList);
    }

    else if (filterOption === "all") {
      setAllState(true);
      setActiveState(false);
      setFinishedState(false);
      setFilter(tasks);
    }

    else {
      setDropDisabled(true);
      filterOption="search"
      setAllState(false);
      setActiveState(false);
      setFinishedState(false);      
    }

    setFilterChoice(filterOption)
  }

  //  --------------------------------------------------------------------------
  //                               Finish Tasks

  //  Update task data when a task is finished
  function finishTask(id) {

    //  Find the task in the list of tasks and update it
    const taskList = tasks.map(task => {
      if (id === task.taskNum) {
        return {...task, done: !task.done}
      }
      return task;
    });

    filterTasks(filterChoice);
    setTasks(taskList);
  }

  function removeFinishedTasks() {
    const taskList = tasks.filter(task => task.done === false);

    setFilterChoice('all');
    filterTasks('all');
    setTasks(taskList);
  }  

  //  --------------------------------------------------------------------------
  //                             Dragging Tasks

  function handleOnDragEnd(result) {
    if(filterChoice !== 'all' && filterChoice !== 'search') {
      const itemsFiltered = Array.from(filter);
      const [reorderedItemFiltered] = itemsFiltered.splice(result.source.index, 1);
      itemsFiltered.splice(result.destination.index, 0, reorderedItemFiltered);    

      setFilter(itemsFiltered);

      if(filterChoice === 'active') {
        const otherTasks = tasks.filter(task => task.done === true);
        const items = [...itemsFiltered, ...otherTasks]

        //  Call hook
        setTasks(items);  
      } 

      else {
        const otherTasks = tasks.filter(task => task.done === false);
        const items = [...otherTasks, ...itemsFiltered]

        //  Call hook
        setTasks(items);  
      }
    }

    else if (filterChoice === 'all') {
      const items = Array.from(tasks);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      //  Call hook
      setTasks(items);    
    }
  }

  //  --------------------------------------------------------------------------
  //                              HTML Block
  return (
    <fragment className="wrapper">
      {/* Background blocks for aesthetics */}
      <div className="back-block block-1"></div>
      <div className="back-block block-2"></div>      

      {/* Main App */}
      <div className="todo-app">

        {/* Top Section - Form for user to input each task */}      
          <Form addTask={addTask}/>

          <Search searchTasks={searchTasks}/>

        {/* Middle Section - Display list of tasks along with a completed button and delete button */}
        <DragDropContext onDragEnd={handleOnDragEnd}>        
          <Droppable droppableId="list-task" isDropDisabled={dropDisabled}>          
            {(provided) => (          
              <ul className="list-task" {...provided.droppableProps} ref={provided.innerRef}>
                {filterChoice === "all" ? taskData : (filterChoice === "search" ? searchedData : filteredData) }
                {provided.placeholder}                
              </ul>
            )}
          </Droppable>          
        </DragDropContext>

        {/* Bottom Section - Filter Buttons and Information */}
        <div className="bottom">

          <p id="task-left">
            {numUnfinished}
          </p>

          <div className="filter-task">
            <button 
              type="button" 
              id="btn-filter" 
              className="btn btn-border" 
              aria-pressed={allState}
              onClick={() => filterTasks("all")}
            >
              <span>all</span>
            </button>
            
            <button 
              type="button" 
              id="btn-filter" 
              className="btn btn-border" 
              aria-pressed={activeState}
              onClick={() => filterTasks("active")}            
            >
              <span>active</span>
            </button>
            
            <button 
              type="button" 
              id="btn-filter"  
              className="btn btn-noborder" 
              aria-pressed={finishedState}
              onClick={() => filterTasks("finished")}
            >              
              <span>finished</span>
            </button>
          </div>

          <button 
            type="button" 
            id="btn-clear" 
            className="btn"
            onClick={() => removeFinishedTasks()}
          >
            <span>clear finished</span>
          </button>

        </div>      
      </div>
    </fragment>
  );
}

export default App;
