// src/Pages/AdminLogin/AdminLogin.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserShield, FaKey, FaSignInAlt, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// src/Pages/AdminLogin/AdminLogin.jsx (Ligne 10 corrigée - Option B)
// src/Pages/AdminLogin/AdminLogin.jsx (Ligne 10 corrigée - Option A)
import LogoApp from '../../Components/LogoApp'; // Ce chemin remonte d'un niveau (../) vers Pages, puis descend dans Mobile

// Réutilisation de vos couleurs
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
};

// =========================================================================
// DONNÉES DE CONNEXION (Hardcoded - Pour commencer)
// Dans une version finale, cela sera géré par Firebase Auth.
// =========================================================================
const ADMIN_CREDENTIALS = [
    { name: "Maire MB", role: "Maire", password: "MaireMB2023", permission: "admin" },
    { name: "Vice-Maire MB", role: "Vice-Maire", password: "VmaireMB2023", permission: "admin" },
    // Ajoutez ici les autres ministres si nécessaire
];

export default function AdminLogin() {
  const navigate = useNavigate();

  // ÉTATS DU FORMULAIRE
  const [password, setPassword] = useState(''); // Stocke le mot de passe tapé
  const [error, setError] = useState(''); // Stocke le message d'erreur
  const [loading, setLoading] = useState(false); // État de chargement simulé

  // --- LOGIQUE : Gestion de la soumission du formulaire ---
  const handleLogin = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Efface l'erreur précédente
    setLoading(true); // Active le chargement

    // Simulation d'une latence réseau (0.8s) pour faire "premium"
    setTimeout(() => {
        // 1. Recherche si le mot de passe correspond à un admin
        const foundAdmin = ADMIN_CREDENTIALS.find(admin => admin.password === password);

        if (foundAdmin) {
            // 2. CONNEXION RÉUSSIE : Création de la "session"
            // On stocke les infos de l'admin (sauf le mdp) dans le localStorage du navigateur.
            // C'est notre preuve de connexion simple.
            const sessionData = {
                connected: true,
                nom: foundAdmin.name,
                role: foundAdmin.role,
                permission: foundAdmin.permission,
                loginTime: new Date().getTime() // Heure de connexion
            };
            localStorage.setItem('govSession', JSON.stringify(sessionData)); // Sauvegarde locale

            // 3. REDIRECTION : Vers l'espace gouvernement
            navigate('/App/AdminGouvernement');
        } else {
            // 4. ÉCHEC : Mot de passe incorrect
            setError("Mot de passe incorrect. Action réservée au Gouvernement.");
        }
        setLoading(false); // Désactive le chargement
    }, 800);
  };

  // RENDU (JSX)
  return (
    <LoginPageContainer>
      
      {/* BOUTON RETOUR DISCRET */}
      <HeaderActions>
        <button className="BtnBack" onClick={() => navigate('/App/Accueil')} title="Retour à l'accueil">
          <FaArrowLeft /> Retour
        </button>
      </HeaderActions>

      <LoginWrapper>
        {/* EN-TÊTE DU FORMULAIRE (Logo + Titre) */}
        <LoginHeader>
          <LogoArea>
            <LogoApp /> {/* Affiche votre logo */}
          </LogoArea>
          <div className="TextTitle">
            <h1>ESPACE GOUVERNEMENT</h1>
            <p className="Subtitle">Connectez-vous pour gérer la Maison Blanche.</p>
          </div>
        </LoginHeader>

        {/* ZONE DU FORMULAIRE DE CONNEXION */}
        <LoginForm onSubmit={handleLogin}>
          
          <div className="LoginIcon">
            <FaUserShield />
          </div>

          <h3>Authentification Requise</h3>
          <p className="Instruct">Veuillez entrer le mot de passe d'administration fourni par le cabinet du Maire.</p>

          {/* Affichage de l'erreur si elle existe */}
          {error && (
            <ErrorMessage>
              <FaExclamationTriangle />
              <span>{error}</span>
            </ErrorMessage>
          )}

          {/* CHAMP MOT DE PASSE */}
          <InputGroup>
            <div className="InputIcon"><FaKey /></div>
            <input 
              type="password" 
              placeholder="Mot de passe d'administration..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Met à jour l'état
              required // Champ obligatoire
            />
          </InputGroup>

          {/* BOUTON DE CONNEXION */}
          <button type="submit" className="SubmitButton" disabled={loading}>
            {loading ? (
              <> <div className="spinner"></div> Connexion...</>
            ) : (
              <><FaSignInAlt /> Se connecter</>
            )}
          </button>

          <p className="FooterNote">Seuls le Maire et le Vice-Maire ont accès à cet espace.</p>
        </LoginForm>
      </LoginWrapper>

    </LoginPageContainer>
  );
}

// --- STYLE (Styled-Components) : Premium, Épuré & Moderne ---

const LoginPageContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f7f6; /* Fond très léger pour le contraste */
  font-family: 'Poppins', sans-serif; /* Assurez-vous d'avoir chargé Poppins */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centre verticalement */
  align-items: center; /* Centre horizontalement */
  
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// 0. BOUTONS D'ACTION (RETOUR)
const HeaderActions = styled.div`
    position: absolute;
    top: 30px;
    left: 30px;
    display: flex;
    justify-content: flex-start;

    .BtnBack {
        background: none;
        border: 1px solid #ddd;
        color: #777;
        padding: 8px 18px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;

        &:hover {
            background-color: white;
            color: ${colors.vertMb};
            border-color: ${colors.vertMb};
            box-shadow: 0 2px 5px rgba(38, 103, 6, 0.1);
        }
    }
`;

// 1. LE CONTENEUR PRINCIPAL CENTRÉ
const LoginWrapper = styled.div`
    width: 100%;
    max-width: 450px; /* Largeur optimale pour un formulaire de login */
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

// 2. EN-TÊTE DU FORMULAIRE (Logo + Titre)
const LoginHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  .TextTitle {
    h1 { margin: 0; font-size: 19px; color: #333; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .Subtitle { margin: 3px 0 0 0; color: #777; font-size: 13px; font-weight: 400; line-height: 1.4; }
  }
`;

const LogoArea = styled.div`
    font-size: 35px; /* Ajuste la taille du logo */
    color: ${colors.vertMb};
`;

// 3. ZONE DU FORMULAIRE DE CONNEXION (Premium Card)
const LoginForm = styled.form`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05); /* Ombre douce Premium */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  transition: all 0.3s;

  &:hover {
    border-color: ${colors.vertMbClair};
  }

  .LoginIcon {
    font-size: 50px;
    color: ${colors.vertMb};
    padding: 15px;
    background-color: ${colors.vertMbClair};
    border-radius: 50%;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h3 { margin: 0; font-size: 19px; color: #333; font-weight: 600; }
  .Instruct { margin: 8px 0 25px 0; color: #777; font-size: 13.5px; font-weight: 400; line-height: 1.6; }

  /* Le Bouton de Connexion */
  .SubmitButton {
    width: 100%;
    margin-top: 15px;
    padding: 14px 20px;
    background-color: ${colors.vertMb};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
    font-family: inherit;

    &:hover:not(:disabled) {
      background-color: #1a4d04;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(38, 103, 6, 0.2);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* Le Spinner de Chargement */
    .spinner {
        width: 15px;
        height: 15px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: fa-spin 0.8s infinite linear;
    }
  }

  .FooterNote {
      margin: 25px 0 0 0;
      font-size: 11px;
      color: #bbb;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.5px;
  }

  @keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 4. STYLE DU CHAMP D'ENTRÉE (Input Group)
const InputGroup = styled.div`
    width: 100%;
    position: relative;
    margin-bottom: 20px;

    .InputIcon {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #aaa;
        font-size: 18px;
        border-right: 1px solid #eee;
    }

    input {
        width: 100%;
        padding: 14px 15px 14px 65px; /* Padding à gauche pour l'icône */
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 15px;
        font-family: inherit;
        background-color: #fafafa;
        box-sizing: border-box; /* padding inclus */
        transition: all 0.3s;

        &:focus {
            outline: none;
            border-color: ${colors.vertMb};
            background-color: white;
            box-shadow: 0 0 0 4px ${colors.vertMbClair};
            
            & + .InputIcon { color: ${colors.vertMb}; border-color: ${colors.vertMbClair}; }
        }
    }
`;

// 5. STYLE DU MESSAGE D'ERREUR
const ErrorMessage = styled.div`
    width: 100%;
    margin-bottom: 20px;
    padding: 12px 15px;
    background-color: #fdf2f2;
    color: #d9534f;
    border-radius: 8px;
    border: 1px solid #fee;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    
    svg { font-size: 16px; flex-shrink: 0; }
`;