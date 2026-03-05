import React from 'react';
import styled from "styled-components";
import LogoApp from './LogoApp'; // Assurez-vous que ce chemin est correct
import { FaBars } from "react-icons/fa";

// Définition des couleurs pour la cohérence
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6", // Version très claire pour les interactions
};

export default function NavBar({ SideBarShow }) {
  return (
    <NavContainer>
      <div className="NavWrapper">
        <div className="leftArea">
          <LogoApp />
          <div className="brandTitle">
            <p>Mb App</p>
          </div>
        </div>
        
        <div className="rightArea">
          {/* Le bouton menu est enveloppé pour un meilleur style interactif */}
          <button className="MenuTrigger" onClick={SideBarShow} title="Ouvrir le menu">
            <FaBars />
          </button>
        </div>
      </div>
    </NavContainer>
  );
}

// --- STYLE (Styled-Components) : Premium, Moderne & Glassmorphism ---

const NavContainer = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000; /* Z-index élevé pour rester au-dessus */
  
  /* --- EFFET PREMIUM & MODERNE --- */
  background-color: rgba(255, 255, 255, 0.9); /* Fond blanc légèrement transparent */
  backdrop-filter: blur(10px); /* Effet de flou sur l'arrière-plan (Glassmorphism) */
  -webkit-backdrop-filter: blur(10px); /* Pour la compatibilité Safari */
  
  /* Remplacement de la bordure par une ombre douce premium */
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  
  /* Padding aéré */
  padding: 10px 20px;
  box-sizing: border-box; /* Assure que le padding n'augmente pas la largeur */

  .NavWrapper {
    max-width: 1200px; /* Limite la largeur sur grand écran */
    margin: 0 auto; /* Centre la navbar */
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  /* Zone de gauche : Logo + Titre */
  .leftArea {
    display: flex;
    align-items: center;
    gap: 12px;

    .brandTitle {
      p {
        margin: 0;
        font-family: 'Poppins', 'Segoe UI', sans-serif; /* Police moderne */
        font-size: 19px;
        font-weight: 600; /* Un peu plus gras */
        color: ${colors.vertMb}; /* Utilisation de votre vert */
        letter-spacing: 0.5px;
      }
    }
  }

  /* Zone de droite : Bouton Menu */
  .rightArea {
    .MenuTrigger {
      background: none;
      border: none;
      font-size: 22px;
      color: ${colors.vertMb};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 50%; /* Bouton circulaire */
      transition: all 0.3s ease;

      /* Effet au survol/clic pour un feedback premium */
      &:hover, &:active {
        background-color: ${colors.vertMbClair};
        transform: scale(1.05);
      }
    }
  }
`;