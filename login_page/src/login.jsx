import './App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from './supabase'; // Import your Supabase client

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Implement your user login function here
  const userLogin = async (email, password) => {
    try {
      // Query the "users" table with email filter
      const { data, error } = await supabase
        .from('users')
        .select('*') // Select all columns (adjust if needed)
        .eq('email', email)
        .single();

      if (error) {
        throw new Error('Error fetching user data'); // Re-throw for handling in handleSubmit
      }

      // Check if user exists
      if (!data) {
        return 'Invalid email or password.'; // User not found
      }

      // Compare password hashes securely (assuming hashed passwords)
      const isPasswordValid = await supabase.auth.verifyPassword({
        identifier: email,
        password,
        token: data.access_token, // Use access token from retrieved user data
      });

      if (isPasswordValid.error) {
        return 'Invalid email or password.'; // Password mismatch
      }

      // Login successful, return user data
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return 'An unexpected error occurred. Please try again.'; // Generic error for unexpected issues
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage(''); // Clear any previous error message

    try {
      const userData = await userLogin(email, password); // Call the userLogin function
      
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
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
