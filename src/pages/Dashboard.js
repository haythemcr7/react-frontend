// src/pages/Dashboard.js
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './Dashboard.css';


function Dashboard() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, username } = location.state || {};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Simulation de données utilisateur
    setUserData({
      username: username,
      id_nb: userId,
      lastLogin: new Date().toLocaleString(),
      stats: { visits: 42, messages: 3 }
    });
  }, [navigate]);

  if (!userData) return <div>Chargement...</div>;

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
         <h1>Bienvenue, {userData.username}  (ID : {userData.id_nb}) !</h1>
        <div className="stats">
          <div className="stat-card">
            <h3>Visites</h3>
            <p>{userData.stats.visits}</p>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <p>{userData.stats.messages}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;