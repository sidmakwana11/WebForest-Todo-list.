import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; 
import { Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const requestBody = JSON.stringify({ username, email, password });

    console.log("Sending Signup Request:", requestBody); // Debugging

    try {
      const response = await fetch("https://todo-list-backend-9jhe.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Redirect to Login Page after successful signup
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='Signup-container'>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className='Signup-form' onSubmit={handleSubmit}>
        <div>
          <label className='Signup-label' htmlFor='username'>Username </label>
          <input
            className='Signup-input'
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <label className='Signup-label' htmlFor='email' autocomplete="off">Email </label>
          <input
            className='Signup-input'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label className='Signup-label' htmlFor='password'>Password </label>
          <input
            className='Signup-input'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='Signup-button' type='submit'>Signup</button>
        <div>
          <p>Already a member? <Link to='/login'>Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
