import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import "./AdminCommandes.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function AdminCommandes() {
  const [grouped, setGrouped] = useState({});
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // 🔐 Authentification de l'admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.sub);
        setUserId(decoded.id);

        if (decoded.sub !== "admin") {
          navigate("/login");
        }

      } catch (err) {
        console.error("Token invalide :", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // 📦 Charger les commandes à l'initialisation
  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = () => {
    axios.get("https://authback-backend-production.up.railway.app/admin/commandes")
      .then(res => {
        const regroupé = {};

        res.data.forEach((cmd) => {
          let tableLabel = "❌ Aucune table";

          if (cmd.table_numero !== null && cmd.table_numero !== undefined) {
            tableLabel = `🪑 Table ${cmd.table_numero}`;
          }

          if (!regroupé[tableLabel]) regroupé[tableLabel] = [];
          regroupé[tableLabel].push(cmd);
        });

        setGrouped(regroupé);
      })
      .catch(err => {
        console.error("Erreur chargement commandes admin :", err);
      });
  };
  const handleArchiver = async () => {
    const token = localStorage.getItem("token");
  
    try {
      await axios.post("https://authback-backend-production.up.railway.app/admin/archiver-commandes", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      alert("✅ Commandes archivées avec succès !");
      fetchCommandes(); // Recharge après archivage (sera vide)
    } catch (err) {
      console.error("Erreur archivage :", err.response?.data || err.message);
      alert("❌ Une erreur est survenue lors de l'archivage.");
    }
  };

  // ✅ Marquer une commande comme livrée
  const handleLivrerCommande = async (commandeId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `https://authback-backend-production.up.railway.app/admin/commandes/${commandeId}/livrer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCommandes(); // Recharge les données
    } catch (err) {
      console.error("❌ Erreur lors de la livraison :", err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-container">
      <Navbar />
      <h1>Interface Administrateur</h1>
      <p>Connecté en tant que : <strong>{username}</strong> (ID : {userId})</p>
      <h2>📦 Commandes groupées par table</h2>
      <button className="archiver-btn" onClick={handleArchiver}>
  📁 Archiver les commandes
</button>

      <div className="commandes-list">
        {Object.entries(grouped).map(([table, commandes]) => (
          <div key={table} className="commande-table-group">
            <h3>{table}</h3>
            {commandes.map((cmd) => (
              <div key={cmd._id} className="commande-card">
                <p><strong>Client:</strong> {cmd.user_id || "Anonyme"}</p>
                <p><strong>Date:</strong> {new Date(cmd.date_commande).toLocaleString()}</p>
                <p><strong>Statut:</strong> {cmd.statut}</p>
                <ul>
                  {cmd.boissons.map((b, i) => (
                    <li key={i}>{b.nom} - {b.quantite}x ({b.taille})</li>
                  ))}
                </ul>

                <button
                  className={`statut-btn ${cmd.statut === "livrée" ? "disabled" : ""}`}
                  onClick={() => handleLivrerCommande(cmd._id)}
                  disabled={cmd.statut === "livrée"}
                >
                  {cmd.statut === "livrée" ? "✅ Déjà livrée" : "📤 Marquer comme livrée"}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCommandes;
