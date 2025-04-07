const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 
const app = express(); 

require('dotenv').config();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://todo-list-frontend-e7fc.onrender.com',
  credentials: true
})); 
const Todo = require('./models/Todo');
const User = require('./models/User'); 

const port = process.env.port || 4001; 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to the MongoDB database...'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


  app.post('/signup', async (req, res) => {
    console.log("📩 Received request body:", req.body);
  
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Invalid request format. Ensure you're sending JSON." });
    }
  
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, email, password: hashedPassword });
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("❌ Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

app.post('/login', async (req, res) => {
  console.log("📩 Received request body in /login:", req.body);  

  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const { email, password } = req.body;  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("🟢 Login request received for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ Login successful!");
    res.json({ 
      message: "Login successful", 
      userId: user._id, 
      username: user.username 
    });
  } catch (error) {
    console.error("❌ Error in /login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Get all Todos
app.get('/todo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userTasks = await Todo.find({ userId });
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ✅ Create a new Todo
app.post('/todo/new', async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!title || title.trim() === '' || !userId) {
      return res.status(400).json({ error: "Task title and user ID are required!" });
    }

    const newTask = await Todo.create({ title, userId });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ✅ Delete a Todo
app.delete('/todo/delete/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: "Task not found!" });
    }

    res.json({ message: "Task deleted successfully", task: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ✅ Start Server
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
