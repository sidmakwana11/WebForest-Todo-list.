import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoItem from "./TodoItems";
import { useNavigate } from "react-router-dom";
import "./TodoList.css";

const API_URL = "http://localhost:4001/todo";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  // Redirect to login if not logged in
 useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    navigate("/login");
  } else {
    fetchTasks();
  }
}, [userId, navigate]);

  // ✅ Fetch tasks for logged-in user
  const fetchTasks = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/${userId}`)
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  };

  // ✅ Add a task for specific user
  const addTask = () => {
    if (!newTask.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    axios
      .post(`${API_URL}/new`, { title: newTask, userId })
      .then(() => {
        setNewTask("");
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  // ✅ Delete task
  const deleteTask = (id) => {
    axios
      .delete(`${API_URL}/delete/${id}`)
      .then(() => fetchTasks())
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>{username}'s To-Do List</h1>
      <button onClick={handleLogout}>Logout</button>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} disabled={!newTask.trim()}>
          Add Task
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TodoItem key={task._id} task={task} deleteTask={deleteTask} />
            ))
          ) : (
            <li>No tasks available</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
