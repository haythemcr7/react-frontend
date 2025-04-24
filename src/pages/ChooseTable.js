import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./ChooseTable.css";
import { useLocation } from "react-router-dom";

function ChooseTable() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { username, userId } = state || {};
  

  // 📦 Charger la liste des tables depuis le backend
  useEffect(() => {
    axios.get("http://authback-backend-production.up.railway.app/tables")
      .then((res) => setTables(res.data))
      .catch((err) => {
        console.error("Erreur chargement des tables :", err);
        setTables([]);
      });
  }, []);

  // ✅ Lorsqu'une table est sélectionnée
  const handleSelect = (numero) => {
    setSelected(numero);
    setTimeout(() => {

      // ✅ Redirection vers l'interface catalogue avec le numéro de table
      navigate(`/table/${numero}`, {
        state: {
           Id: userId,
           Login: username
        }
      })
    }, 800);
  };

  return (
    <div className="choose-container">
      <h1>🎲 Bienvenue {username} choisissez votre table de jeu</h1>
      <div className="tables-grid">
        {tables.map((t) => (
          <motion.div
            key={t._id}
            className={`table-card ${selected === t.numero ? "selected" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(t.numero)}
          >
            <h3>Table {t.numero}</h3>
            <img src={`http://react-frontend-production-62fe.up.railway.app${t.image_url}`} alt={t.surnom} className="table-logo" />
            <p>{t.surnom}</p>
            <span className={`status ${t.etat}`}>{t.etat.toUpperCase()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ChooseTable;
