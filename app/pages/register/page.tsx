"use client";

import { Button } from '@/app/ui/button';
import axios from 'axios';
import { useState } from 'react';

const CreateAdminPage = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/register', {
        userName,
        password,
        role
      },{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      
      setMessage(response.data.message);
    } catch (error: any) {
      console.error('Error details:', error); 
      setMessage(
        error.response?.data?.message ||
        'An unexpected error occurred' 
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-2 text-gray-700">Username:</label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 text-gray-700">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  </div>
  );
};

export default CreateAdminPage;
