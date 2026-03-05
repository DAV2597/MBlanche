import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaLock, FaUser, FaIdCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Importation de la configuration
import { gouvernementMembres } from '../config/gouvernementConfig'; // Ajustez le chemin si nécessaire

// Réutilisation de vos couleurs
const colors = {
  vertMb: "#266706",
  grisMb: "#D6D6D6",
};

export default function GouvernementModal({ show, handleClose }) {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [nom, setNom] = useState('');
  const [roleIndex, setRoleIndex] = useState(''); // Stocke l'index du rôle sélectionné
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. Vérification basique
    if (!nom.trim() || roleIndex === '' || !code.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // 2. Récupération des infos du rôle sélectionné
    const membreAttendu = gouvernementMembres[roleIndex];

    // 3. Vérification du code (Authentification)
    if (code === membreAttendu.code) {
      // CONNEXION RÉUSSIE
      console.log("Connexion réussie :", membreAttendu.roleNom);
      
      // Stockage temporaire des infos de connexion (Simulé, idéalement utiliser Context/Redux)
      const userSession = {
        nom: nom.trim(),
        role: membreAttendu.roleNom,
        permission: membreAttendu.permission,
        connected: true
      };
      // Stockage dans le localStorage pour persister sur la page admin
      localStorage.setItem('govSession', JSON.stringify(userSession));

      handleClose(); // Ferme le modal
      // Redirection vers la page d'administration (à créer plus tard)
      navigate('/App/AdminGouvernement'); 
    } else {
      // ÉCHEC
      setError('Code de reconnaissance invalide pour ce rôle.');
      setCode(''); // Efface le code
    }
  };

  if (!show) return null; // Ne rien afficher si show est false

  return (
    <ModalOverlay onClick={handleClose}>
      {/* stopPropagation empêche de fermer quand on clique dans le formulaire */}
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <div className="ModalHeader">
          <h3><FaLock /> ESPACE GOUVERNEMENT</h3>
          <button className="CloseButton" onClick={handleClose}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="Instruct">Identifiez-vous pour accéder à la gestion de la Maison Blanche.</p>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Champ Nom */}
          <InputGroup>
            <label><FaUser /> Votre Nom complet</label>
            <input 
              type="text" 
              value={nom} 
              onChange={(e) => setNom(e.target.value)} 
              placeholder="Ex: Jean Dupont"
              required 
            />
          </InputGroup>

          {/* Champ Sélection du Rôle */}
          <InputGroup>
            <label><FaIdCard /> Votre Fonction</label>
            <select 
              value={roleIndex} 
              onChange={(e) => setRoleIndex(e.target.value)} 
              required
            >
              <option value="" disabled>-- Sélectionnez votre rôle --</option>
              {gouvernementMembres.map((membre, index) => (
                <option key={index} value={index}>
                  {membre.roleNom}
                </option>
              ))}
            </select>
          </InputGroup>

          {/* Champ Code de reconnaissance */}
          <InputGroup>
            <label><FaLock /> Code de reconnaissance</label>
            <input 
              type="password" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="******"
              maxLength={6}
              required 
            />
          </InputGroup>

          <SubmitButton type="submit">Se connecter</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

// --- STYLE (Styled-Components) ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000; /* Au-dessus de la sidebar */
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  overflow: hidden;
  animation: slideDown 0.3s ease-out;
  font-family: 'Poppins', sans-serif;

  @keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .ModalHeader {
    background-color: ${colors.vertMb};
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: 1px;
    }

    .CloseButton {
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 20px;
      cursor: pointer;
      transition: color 0.3s;
      &:hover { color: white; }
    }
  }

  form {
    padding: 25px;

    .Instruct {
      margin-top: 0;
      margin-bottom: 20px;
      color: #666;
      font-size: 14px;
      text-align: center;
    }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 18px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: ${colors.vertMb};
    font-weight: 500;
    font-size: 14px;
  }

  input, select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #eee;
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    transition: border-color 0.3s;
    box-sizing: border-box; /* Important pour le padding */

    &:focus {
      outline: none;
      border-color: ${colors.vertMb};
    }
  }

  select {
    appearance: none; /* Cache la flèche par défaut pour le style */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23266706' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 15px;
    color: #333;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: ${colors.vertMb};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  letter-spacing: 1px;

  &:hover {
    background-color: #1a4d04;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #d9534f;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fcc;
`;