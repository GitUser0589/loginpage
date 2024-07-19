import React, { useState } from 'react';
import connection from '../src/backend/server.js';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null); // Reset success message before submission
    try {
      const connection = await getConnection(); // Wait for connection to be established

      const [results] = await connection.execute(
        'INSERT INTO customer (name, email, password) VALUES (?, ?, ?)',
        [formData.name, formData.email, formData.password]
      );

      console.log('Sign-up successful:', results);
      setSuccessMessage('Sign-up successful! You can now log in.');
    } catch (error) {
      setError(error.message); // Handle any errors during connection or query execution
    } finally {
      // Close the connection (optional, might be handled by connection pool)
      connection.end();
      setIsSubmitting(false);
    }
  };
  return (
    <div className="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
