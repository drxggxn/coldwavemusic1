import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/releases', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReleases(response.data);
      } catch (error) {
        console.error('Ошибка при получении релизов', error);
      }
    };

    fetchReleases();
  }, []);

  return (
    <div>
      <h2>Мои релизы</h2>
      <ul>
        {releases.map((release) => (
          <li key={release._id}>
            <h3>{release.title}</h3>
            <p>{release.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
