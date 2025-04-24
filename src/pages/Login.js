import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";


function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://authback-backend-production.up.railway.app/login",
        {
          login: login,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token, user } = response.data;

      // ✅ Remplacer proprement l'ancien token
      localStorage.removeItem("token");
      localStorage.setItem("token", access_token);
      console.log("✅ Nouveau token JWT stocké :", access_token);
      console.log(user)

      // ✅ Navigation avec user info conservée
      if (user.login === "admin") {
        navigate("/admin", {
          state: { userId: user.id, username: user.login },
        });
      } else {
        navigate("/choose-table", {
          state: {
            userId: user.id,
            username: user.login
          }
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Identifiant ou mot de passe incorrect");
      } else {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
      }
      console.error("Erreur détaillée:", error.response?.data);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <motion.img
          src={"/authentification.png"}
          alt="Logo"
          className="logo"
          animate={{ rotate: 0 }}
          transition={{ duration: 1 }}
        />
        <h2>Connexion</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Identifiant"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
          style={{
            backgroundColor: isHoveringButton ? "#ff6b6b" : "#4facfe",
          }}
        >
          Se connecter
        </button>

        <motion.div
          className="register-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
