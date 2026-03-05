import React, { useState } from 'react';
import styled from "styled-components";
import { NavLink } from 'react-router-dom';
import { FaTimes } from "react-icons/fa";
import GouvernementModal from './GouvernementModal.jsx'; // Assurez-vous que ce fichier existe

// Définition des couleurs
const colors = {
  vertMb: "#266706",
  grisMb: "#D6D6D6",
};

export default function SideBar({ SideBarShow }) {
  const [showGovModal, setShowGovModal] = useState(false);

  // Fonction pour ouvrir le modal
  const handleOpenGovModal = (e) => {
    e.preventDefault(); // Empêche la navigation
    setShowGovModal(true);
  };

  // Fonction pour fermer le modal
  const handleCloseGovModal = () => {
    setShowGovModal(false);
    SideBarShow(); // Ferme aussi la sidebar
  };

  // Fermer la sidebar en cliquant à l'extérieur
  const handleOverlayClick = (e) => {
    if (e.target.id === "sidebar-overlay") {
      SideBarShow();
    }
  };

  return (
    <> {/* --- AJOUT DU FRAGMENT DE DÉPART ICI --- */}
      
      <SideBarContainer id="sidebar-overlay" onClick={handleOverlayClick}>
        <nav onClick={(e) => e.stopPropagation()}>
          
          <div className='SidebarHeader'>
            <h3>MENU</h3> 
            <button className='CloseButton' onClick={SideBarShow} title="Fermer">
              <FaTimes />
            </button>
          </div>

          <div className="Contenu">
            <span className="SectionTitle">Navigation</span>
            
            <NavLink to={"/App/Accueil"} className="MenuItem" onClick={SideBarShow}>
              Home
            </NavLink>
            <NavLink to={"/App/Apropos"} className="MenuItem" onClick={SideBarShow}>
              À propos
            </NavLink>
            
            {/* Lien Mairie qui ouvre le Modal */}
            <a href="#" className="MenuItem" onClick={handleOpenGovModal}>
              Mairie (Connexion Gov)
            </a>

            <NavLink to={"/App/Anciens"} className="MenuItem" onClick={SideBarShow}>
              Anciens
            </NavLink>
            <NavLink to={"/App/NouveauBoulet"} className="MenuItem" onClick={SideBarShow}>
              Nouveau Boulet
            </NavLink>
            
            <NavLink to={"/App/Contact"} className="MenuItem" onClick={SideBarShow}>
              Contactez-nous
            </NavLink>
          </div>

          <div className="SidebarFooter">
            © 2023 MB Blanche
          </div>

        </nav>
      </SideBarContainer>

      {/* --- LE MODAL EST BIEN À L'INTÉRIEUR DU FRAGMENT --- */}
      {showGovModal && (
          <GouvernementModal show={showGovModal} handleClose={handleCloseGovModal} />
      )}

    </> 
  );
}

// --- STYLE (Styled-Components) ---

const SideBarContainer = styled.div`
  height: 100vh;
  width: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  
  background-color: rgba(0, 0, 0, 0.5); 
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  
  animation: fadeInOverlay 0.4s ease-out;

  @keyframes fadeInOverlay {
    from { background-color: rgba(0, 0, 0, 0); backdrop-filter: blur(0px); }
    to { background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px); }
  }

  nav {
    background-color: ${colors.vertMb};
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 280px;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    
    animation: slideInRight 0.4s ease-out;
    font-family: 'Poppins', 'Segoe UI', sans-serif;
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .SidebarHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid rgba(214, 214, 214, 0.1);
    
    h3 {
      margin: 0;
      color: ${colors.grisMb};
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
    }

    .CloseButton {
      background: none;
      border: none;
      font-size: 22px;
      color: ${colors.grisMb};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(214, 214, 214, 0.15);
        transform: rotate(90deg);
      }
    }
  }

  .Contenu {
    display: flex;
    flex-direction: column;
    padding: 30px 0;
    flex-grow: 1;

    .SectionTitle {
      color: rgba(214, 214, 214, 0.5);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0 25px;
      margin-bottom: 15px;
      font-weight: 500;
    }

    .MenuItem {
      padding: 15px 25px;
      color: ${colors.grisMb};
      font-size: 17px;
      text-decoration: none;
      font-weight: 400;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      border-left: 3px solid transparent;

      &:hover {
        background-color: rgba(214, 214, 214, 0.1);
        color: white;
        border-left: 3px solid ${colors.grisMb};
        padding-left: 30px;
      }

      &.active {
        font-weight: 600;
        color: white;
        background-color: rgba(214, 214, 214, 0.15);
        border-left: 3px solid ${colors.grisMb};
      }
    }
  }

  .SidebarFooter {
    padding: 15px 25px;
    font-size: 11px;
    color: rgba(214, 214, 214, 0.4);
    border-top: 1px solid rgba(214, 214, 214, 0.1);
    text-align: center;
  }
`;