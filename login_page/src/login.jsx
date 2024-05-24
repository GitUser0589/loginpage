import './App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = (event) => {
    event.preventDefault();

    // Simulate login logic (replace with your actual authentication)
    if (username === 'user' && password === 'password') {
      // Login successful
      console.log('Login successful!');
      navigate('/home'); // Redirect to home page after successful login (replace with your actual home route)
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <body>
      <div className="login-container">
        <h1>Login</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>

          {/* Link to signup page */}
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </body>
  );
}

export default Login;
