import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import "./CatalogueBoissons.css";
import Navbar from "../Components/Navbar";

function CatalogueBoissons() {
  const [boissons, setBoissons] = useState([]);
  const [parCategorie, setParCategorie] = useState({});
  const [selection, setSelection] = useState({});
  const [quantites, setQuantites] = useState({});
  const [error, setError] = useState("");
  const [anonUserId, setAnonUserId] = useState("");

  const { table_numero } = useParams(); // On récupère le numéro de table depuis l'URL

  const nom = localStorage.getItem("username");

  // ✅ Si un jour tu veux récupérer d'autres infos du state transmis :
  const routerLocation = useLocation();
  const { state } = routerLocation || {};
  const { Id, Login } = state || {};

  // ✅ Gérer la session anonyme
  useEffect(() => {
    let existingId = localStorage.getItem("anon_user_id");
    if (!existingId) {
      existingId = uuidv4();
      localStorage.setItem("anon_user_id", existingId);
    }
    setAnonUserId(existingId);
  }, []);

  // ✅ Charger le catalogue des boissons
  useEffect(() => {
    axios
      .get("https://authback-backend-production.up.railway.app/catalogue-boissons")
      .then((res) => {
        const groupes = {};
        res.data.forEach((boisson) => {
          const cat = boisson.categorie || "autre";
          if (!groupes[cat]) groupes[cat] = [];
          groupes[cat].push(boisson);
        });
        setBoissons(res.data);
        setParCategorie(groupes);
      })
      .catch((err) => {
        console.error("Erreur récupération catalogue :", err);
        setError("Impossible de charger les boissons");
      });
  }, []);

  // ✅ Ajouter une boisson
  const ajouter = (boisson) => {
    setSelection({ ...selection, [boisson._id]: true });
    setQuantites({ ...quantites, [boisson._id]: 1 });
  };

  const retirerBoisson = (boissonId) => {
    setSelection((prev) => {
      const updated = { ...prev };
      delete updated[boissonId];
      return updated;
    });
  
    setQuantites((prev) => {
      const updated = { ...prev };
      delete updated[boissonId];
      return updated;
    });
  };







  // ✅ Changer la quantité
  const changerQuantite = (id, val) => {
    const q = Math.max(1, parseInt(val) || 1);
    setQuantites({ ...quantites, [id]: q });
  };

  // ✅ Valider la commande
  const validerCommande = (boisson) => {
    const commande = {
      user_id: anonUserId,
      table_numero: table_numero,
      boissons: [
        {
          boisson_id: boisson._id,
          nom: boisson.nom,
          taille: boisson.taille,
          quantite: quantites[boisson._id],
          prix: boisson.prix,
        },
      ],
      image_url: boisson.image_url,
    };
   
      

    axios
      .post("https://authback-backend-production.up.railway.app/commande-boissons/anonyme", commande, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert(`✅ Commande pour ${boisson.nom} validée (table ${table_numero})`);
        setSelection((prev) => ({ ...prev, [boisson._id]: false }));
      })
      .catch((err) => {
        console.error("Erreur commande :", err);
        alert("❌ Une erreur est survenue.");
      });
  };

  return (
    <div className="catalogue-container">
      <Navbar />
      <h1>Catalogue des Boissons</h1>
      <h3>Table numéro : {table_numero}</h3>

      {error && <p className="error-message">{error}</p>}

      {Object.keys(parCategorie).map((categorie) => (
        <div key={categorie}>
          <h2 className="categorie-title">{categorie.toUpperCase()}</h2>
          <div className="boissons-row">
            {parCategorie[categorie].map((boisson) => (
              <div className="boisson-card" key={boisson._id}>
                <img src={`https://authback-backend-production.up.railway.app${boisson.image_url}`} alt={boisson.nom} />
                <h3>{boisson.nom}</h3>
                <p>{boisson.taille}</p>
                <p><strong>{boisson.prix} MAD</strong></p>

                {!selection[boisson._id] ? (
                  <button onClick={() => ajouter(boisson)}>Ajouter</button>
                ) : (
                  <div className="selection-section">
                    <div className="quantite-controller">
                      <button className="quantite-btn" onClick={() => changerQuantite(boisson._id, quantites[boisson._id] - 1)}>-</button>
                      <span className="quantite-value">{quantites[boisson._id]}</span>
                      <button className="quantite-btn" onClick={() => changerQuantite(boisson._id, quantites[boisson._id] + 1)}>+</button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
  <button className="valider-btn" onClick={() => validerCommande(boisson)}>Valider</button>
  <button className="retirer-btn" onClick={() => retirerBoisson(boisson._id)}>Retirer</button>
</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CatalogueBoissons;
