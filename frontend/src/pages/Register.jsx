import React from 'react';
import { useState } from 'react';
import supabase from '../helper/supabaseClient';
import axios from 'axios'; // Add axios for HTTP requests
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      try {
        await axios.post('http://127.0.0.1:8010/api/users/', {
          username: username, 
          email,
          supa_id: data.user.id,
        });
        setMessage('Account created successfully');
        setEmail('');
        setPassword('');
        navigate('/login');
      } catch (err) {
        setMessage('Error saving user to backend: ' + err.message);
      }
    }
  };

  return (
    <>
      <div>Register</div>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className='input input-bordered w-full max-w-xs'
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className='input input-bordered w-full max-w-xs'
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className='input input-bordered w-full max-w-xs'
        />
        <button className='btn btn-primary' type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;