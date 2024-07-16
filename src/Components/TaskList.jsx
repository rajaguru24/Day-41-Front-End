import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import axios from "axios";
import { toast } from "react-toastify";
import loaderImg from "../assets/react.svg";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isloading, setisLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [taskID, setTaskID] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (formData.name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`/api/tasks`, formData);
      setFormData({ ...formData, name: "" });
      toast.success("Task added successfully");
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTasks = async () => {
    setisLoading(true);
    try {
      const { data } = await axios.get("/api/tasks");
      setTasks(data);
      setisLoading(false);
    } catch (error) {
      toast.error(error.message);
      setisLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (formData.name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.put(`/api/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      toast.success("Task updated successfully");
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(cTask);
  }, [tasks]);

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        isEditing={isEditing}
        updateTask={updateTask}
        handleInputChange={handleInputChange}
        createTask={createTask}
        name={formData.name}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {isloading && (
        <div className="--flex-center">
          <img src={loaderImg} alt="Loading"></img>
        </div>
      )}
      {!isloading && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={index}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;