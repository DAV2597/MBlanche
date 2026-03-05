// src/Pages/Communiques/Communiques.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBullhorn, FaCalendarAlt, FaUserTie, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// --- IMPORT FIREBASE (Ajusté à votre chemin racine) ---
import { db } from '../../firebaseConfig'; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// --------------------------------------------------------

// Réutilisation de vos couleurs
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
};

export default function Communiques() {
  const navigate = useNavigate();

  // ÉTATS DE LA PAGE
  const [communiques, setCommuniques] = useState([]); // Stocke la liste des communiqués
  const [loading, setLoading] = useState(true); // État de chargement initial
  const [error, setError] = useState(null); // Stocke l'erreur éventuelle

  // --- EFFET : Lecture en Temps Réel de Firebase ---
  useEffect(() => {
    // 1. Référence à la collection "communiques"
    const communiquesCollection = collection(db, "communiques");

    // 2. Création de la requête : Trier par date (la plus récente en premier)
    // Note : Cela nécessite un index composé dans Firebase si vous filtrez aussi.
    // Pour l'instant, un tri simple sur la dateCreation.
    const q = query(communiquesCollection, orderBy("dateCreation", "desc"));

    // 3. Écouteur en temps réel (onSnapshot)
    // C'est le cœur du dynamisme : cette fonction est rappelée à chaque changement dans la DB.
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id, // L'ID unique du document Firebase
          ...doc.data() // Toutes les données du document (titre, contenu, auteur, etc.)
        }));
        setCommuniques(list); // Met à jour l'état avec la nouvelle liste
        setLoading(false); // Désactive le chargement
      },
      (error) => {
        console.error("Erreur lors de la lecture des communiqués : ", error);
        setError("Impossible de charger les communiqués. Vérifiez votre connexion.");
        setLoading(false);
      }
    );

    // 4. Nettoyage : On coupe l'écouteur quand on quitte la page (désabonnement)
    return () => unsubscribe();
  }, []);

  // --- FONCTION : Formatage de la date Firebase (Timestamp) ---
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Convertit le Timestamp en Date JavaScript
    
    // Formatage : DD/MM/YYYY à HH:MM
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).replace(' à ', ' - ');
  };

  // --- RENDU : Gestion des états de chargement et d'erreur ---
  
  // 1. Affichage pendant le chargement initial
  if (loading) {
    return (
      <CommuniquesPageContainer>
        <LoadingArea>
          <FaSpinner className="spin" />
          <p>Chargement des communiqués officiels...</p>
        </LoadingArea>
      </CommuniquesPageContainer>
    );
  }

  // 2. Affichage en cas d'erreur
  if (error) {
    return (
      <CommuniquesPageContainer>
        <ErrorArea>
          <FaExclamationTriangle className="IconError" />
          <h3>Oups !</h3>
          <p>{error}</p>
          <button className="BtnBack" onClick={() => navigate('/App/Accueil')}>Retour à l'accueil</button>
        </ErrorArea>
      </CommuniquesPageContainer>
    );
  }

  // 3. Affichage normal (Liste des communiqués)
  return (
    <CommuniquesPageContainer>
      
      {/* EN-TÊTE DE LA PAGE PREMIUM */}
      <PageHeader>
        <div className="HeaderContent">
          <div className="IconBadge"><FaBullhorn /></div>
          <div className="TextTitle">
            <h1>COMMUNIQUÉS OFFICIELS</h1>
            <p className="Subtitle">Toutes les annonces et décisions du Gouvernement de la Maison Blanche.</p>
          </div>
          <div className="StatusBadge"><FaCheckCircle /> Mis à jour en temps réel</div>
        </div>
      </PageHeader>

      {/* ZONE PRINCIPALE AVEC LES CARTES DE COMMUNIQUÉS */}
      <ContentArea>
        {communiques.length > 0 ? (
          <CommuniqueGrid>
            {communiques.map((communique) => (
              <CommuniqueCard key={communique.id}>
                
                {/* En-tête de la carte (Titre + Badge Officiel) */}
                <div className="CardHeader">
                    <FaExclamationTriangle className="IconWarning" />
                    <h3>{communique.titre}</h3>
                    <div className="StatusBadgeMini">Officiel</div>
                </div>

                {/* Corps de la carte (Contenu textuel) */}
                <div className="CardBody">
                    <p>{communique.contenu}</p>
                </div>

                {/* Pied de la carte (Méta-données : Auteur + Date) */}
                <div className="CardFooter">
                    <div className="FooterInfo"><FaUserTie /> {communique.auteur}</div>
                    <div className="FooterInfo"><FaCalendarAlt /> {formatDate(communique.dateCreation)}</div>
                </div>

              </CommuniqueCard>
            ))}
          </CommuniqueGrid>
        ) : (
          <NoCommunique>
              <FaBullhorn className="IconLarge" />
              <h3>Aucun communiqué</h3>
              <p>Il n'y a pas encore de communiqués officiels publiés.</p>
          </NoCommunique>
        )}
      </ContentArea>

    </CommuniquesPageContainer>
  );
}

// --- STYLE (Styled-Components) : Premium, Moderne & Interactif ---

const CommuniquesPageContainer = styled.div`
  min-height: 100vh;
  padding: 30px;
  background-color: #f4f7f6; /* Fond très léger pour le contraste */
  font-family: 'Poppins', sans-serif; /* Assurez-vous d'avoir chargé Poppins */
  
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// 1. STYLE DES ÉTATS DE CHARGEMENT ET D'ERREUR
const LoadingArea = styled.div`
    width: 100%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    color: ${colors.vertMb};
    
    .spin { font-size: 35px; animation: fa-spin 1s infinite linear; }
    p { margin: 0; font-size: 15px; color: #777; }

    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ErrorArea = styled.div`
    width: 100%;
    max-width: 500px;
    margin: 50px auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    .IconError { font-size: 40px; color: #d9534f; }
    h3 { margin: 0; font-size: 20px; color: #333; }
    p { margin: 0; font-size: 14px; color: #777; }

    .BtnBack {
        margin-top: 15px;
        padding: 10px 20px;
        background-color: ${colors.vertMb};
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
        
        &:hover { background-color: #1a4d04; }
    }
`;

// 2. STYLE DE L'EN-TÊTE DE LA PAGE
const PageHeader = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 30px auto;
  background: white;
  border-radius: 12px;
  padding: 25px 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  border-left: 4px solid ${colors.vertMb}; /* Accent vert premium */

  .HeaderContent {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .IconBadge {
    font-size: 30px;
    color: ${colors.vertMb};
    padding: 12px;
    background-color: ${colors.vertMbClair};
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .TextTitle {
    h1 { margin: 0; font-size: 22px; color: #333; font-weight: 700; letter-spacing: 0.5px; }
    .Subtitle { margin: 5px 0 0 0; color: #777; font-size: 14px; font-weight: 400; max-width: 600px; line-height: 1.4; }
  }

  .StatusBadge {
      background-color: ${colors.vertMbClair};
      color: ${colors.vertMb};
      padding: 7px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 7px;
  }
`;

// 3. ZONE DE CONTENU PRINCIPAL ET GRILLE
const ContentArea = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const CommuniqueGrid = styled.div`
  display: flex;
  flex-direction: column; /* Liste verticale */
  gap: 20px;
  width: 100%;
`;

// 4. STYLE DE LA CARTE COMMUNIQUE (Premium & Moderne Action Card)
const CommuniqueCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden; /* Pour que CardAccent respecte l'arrondi */
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease-out;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-3px); /* S'élève légèrement au survol */
    box-shadow: 0 6px 15px rgba(0,0,0,0.08); /* Ombre plus marquée */
    border-color: ${colors.vertMbClair}; /* Bordure verte légère */
    
    .CardHeader h3 { color: ${colors.vertMb}; } /* Titre s'illumine */
  }

  /* En-tête de la carte (Titre + Badge Officiel) */
  .CardHeader {
    padding: 15px 20px 10px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #f0f0f0;
    
    .IconWarning { font-size: 18px; color: #f0ad4e; /* Jaune warning subtile */ }
    h3 { margin: 0; font-size: 16px; color: #333; font-weight: 600; flex-grow: 1; transition: color 0.3s ease; }
    
    .StatusBadgeMini {
        background-color: ${colors.vertMbClair};
        color: ${colors.vertMb};
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
  }

  /* Corps de la carte (Contenu textuel) */
  .CardBody {
    padding: 15px 20px 10px 20px;
    
    p { 
        margin: 0; 
        font-size: 14px; 
        color: #666; /* Gris lisible pour le texte long */
        font-weight: 400; 
        line-height: 1.6; 
        text-align: justify; 
    }
  }

  /* Pied de la carte (Méta-données : Auteur + Date) */
  .CardFooter {
    padding: 10px 20px 15px 20px;
    display: flex;
    justify-content: flex-end; /* Aligné à droite */
    align-items: center;
    gap: 20px;
    background-color: #fafafa;
    border-top: 1px solid #f0f0f0;

    .FooterInfo {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 12px;
        color: #bbb; /* Gris très très léger */
        font-weight: 400;
        
        svg { font-size: 11px; color: #ddd; }
    }
  }
`;

// 5. STYLE POUR L'ÉTAT "AUCUN COMMUNIQUÉ"
const NoCommunique = styled.div`
    width: 100%;
    min-height: 250px;
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #ccc;
    text-align: center;
    
    .IconLarge { font-size: 40px; }
    h3 { margin: 0; font-size: 18px; color: #888; }
    p { margin: 0; font-size: 14px; color: #aaa; }
`;