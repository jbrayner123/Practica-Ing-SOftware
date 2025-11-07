import React, { useState, useEffect } from 'react';                                                                                                [48/1955]
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  // Para desarrollo: usar localhost, para producción: usar nombre del servicio
  const API_BASE = window.location.hostname === 'localhost'
  ? 'http://192.168.50.5:3001'  // Desarrollo local (desde host anfitrión)
  : 'http://18.217.181.104:3001'; // Producción (IP de EC2)

  useEffect(() => {
    axios.get(`${API_BASE}/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, [API_BASE]);

  const addUser = async () => {
    if (!name.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/users`, { name });
      setUsers([...users, res.data]);
      setName('');
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter user name"
          style={{
            marginRight: '10px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && addUser()}
        />
        <button
          onClick={addUser}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add User
        </button>
      </div>

      <h2>Users List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.length > 0 ? (
          users.map(user => (
            <li
              key={user.id}
              style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}
            >
              {user.name}
            </li>
          ))
        ) : (
          <li style={{ color: '#6c757d' }}>No users found</li>
        )}
      </ul>
    </div>
  );
}

export default App;