import './App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from './supabase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage(''); // Clear any previous error message

    try {
      const { error } = await supabase.auth.signInWithPassword({
        // **Credential Check:** This section attempts to sign in the user with Supabase using the provided email and password.
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error); // Log the error for debugging
        // Handle specific error codes (if available):
        if (error.error_code === 'auth/incorrect-email-or-password') {
          setErrorMessage('Invalid email or password.');
        } else {
          setErrorMessage('An error occurred during login. Please try again.');
        }
      } else {
        console.log('Login successful!');
        navigate('/home'); // Redirect to home page after successful login
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <body>
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
    </body>
  );
}

export default Login;
