// src/components/Navbar.js
import './Navbar.css';


import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";



const Navbar = () => {
  const navigate = useNavigate();
  const { state } = location || {};
  const [tableNumero, setTableNumero] = useState(null);

  useEffect(() => {
    const numero = localStorage.getItem("table_numero");
    if (numero) setTableNumero(numero);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
 

  return (
    <nav className="navbar">
 <div className="navbar-brand">
  <img
    src="/static/navlogo.png"
    alt="Logo Rendez-vous Dar"
    className="navbar-logo"
  />
  
  <Link to={`/table/${tableNumero}`} className="navbar-title">Rendez-vous Dar</Link>
</div>

  <div className="navbar-menu">
    <Link to="/profile" className="nav-item">Profil</Link>
    <Link to="/settings" className="nav-item">Paramètres</Link>
    <button onClick={handleLogout} className="nav-item logout-btn">
      Déconnexion
    </button>
  </div>
</nav>

  );
};

export default Navbar;