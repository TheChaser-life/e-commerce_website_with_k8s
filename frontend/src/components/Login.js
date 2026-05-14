import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    axios.post('/users/login', { username, password })
      .then((response) => {
        if (response.data === 'Login successful') {
          onLogin();
          navigate('/products');
          return;
        }

        setMessage('Invalid username or password.');
      })
      .catch(() => setMessage('Login failed.'));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Need an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default Login;
