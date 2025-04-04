import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    const requestBody = JSON.stringify({ email, password });
  
    console.log("Sending Login Request:", requestBody); 
  
    try {
      const response = await fetch("http://localhost:4001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
  
      const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Login failed");
}


localStorage.setItem("userId", data.userId);
localStorage.setItem("username", data.username); 


navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='Login-container'>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className='Login-form' onSubmit={handleSubmit} >
        <div>
          <label className='Login-label' htmlFor='email'>Email </label>
          <input
            className='Login-input'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label className='Login-label' htmlFor='password'>Password </label>
          <input
            className='Login-input'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />  
        </div>
        <button className='Login-button' type='submit'>Login</button>
        <div>
          <p>New Here? <Link to="/signup">Signup</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
