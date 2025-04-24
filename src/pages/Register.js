// src/pages/Register.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    phone_number:'',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }
   
  
    try {
      const response = await axios.post('https://authback-backend-production.up.railway.app:5000/register', {
        login: formData.login,
        password: formData.password,
        phone_number: formData.phone_number
      });
  
      if (response.data.success) {
        const { access_token, user } = response.data;
  
        // ✅ Stockage du token PUIS navigation
        localStorage.setItem('token', access_token);
  
        // ✅ On attend que tout soit bien fini avec un petit délai si besoin (optionnel)
        setTimeout(() => {
          navigate("/choose-table", {
            state: { userId: user.id, username: user.login }
          });
        }, 100); // petite pause pour laisser localStorage se propager
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
      console.error("Erreur d'inscription:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOtp = async () => {
    try {
      const res = await axios.post('https://authback-backend-production.up.railway.app:5000/verify-code', {
        phone_number: "+212"+formData.phone_number,
        code: formData.otp
      });
      if (res.data.verified) {
        setOtpVerified(true);
      } else {
        setOtpError("Code incorrect");
      }
    } catch (err) {
      setOtpError("Erreur de vérification");
      console.error(err);
    }
  };


  const sendOtp = async () => {
    setOtpError('');
    try {
      const res = await axios.post('https://authback-backend-production.up.railway.appt:5000/send-verification-code', {
        phone_number: "+212"+formData.phone_number
      });
      if (res.data.status === 'pending') {
        setOtpSent(true);
      }
    } catch (err) {
      setOtpError("Échec d'envoi du code. Vérifie le numéro.");
      console.error(err);
    }
  };
  







  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Créer un compte</h2>
  
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="login"
            placeholder="Nom d'utilisateur"
            value={formData.login}
            onChange={handleChange}
            required
            minLength="3"
          />
  
          <input
            type="password"
            name="password"
            placeholder="Mot de passe (6 caractères minimum)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
  
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmez le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
  
          {/* 📞 Numéro de téléphone + OTP */}
          <div className="form-group phone-wrapper">
            <label htmlFor="phone_number" className="hidden-label">Numéro de téléphone</label>
  
            <div className="phone-input-container">
              <span className="phone-prefix">+212</span>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                placeholder="6XXXXXXXX"
                value={formData.phone_number}
                onChange={handleChange}
                pattern="[6-7][0-9]{8}"
                required
                className="phone-input-field"
              />
            </div>
  
           
          </div>
  
          <button
            type="submit"
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
  
        <div className="login-link">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </div>
      </div>
    </div>
  );}
  






  export default Register;