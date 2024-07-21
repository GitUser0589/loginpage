import './App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Implement your user login function here
  const userLogin = async (username, password) => {
    try {
      const response = await connection.query(
        'SELECT * FROM customer WHERE username = ? AND password = ?',
        [username, password] // Prevent SQL injection with prepared statements
      );

      if (response.length === 0) {
        return 'Invalid username or password.'; // User not found
      }

      // Login successful, return user data (assuming you need the entire row)
      return response[0];
    } catch (error) {
      console.error('Login error:', error);
      return 'An unexpected error occurred. Please try again.'; // Generic error for unexpected issues
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage(''); // Clear any previous error message

    try {
      const userData = await userLogin(username, password);

      if (userData) {
        console.log('Login successful!');
        setErrorMessage('Login Successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setErrorMessage(userData); // Set error message from userLogin
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text" // Username is typically not an email
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        {/* Link to signup page */}
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
