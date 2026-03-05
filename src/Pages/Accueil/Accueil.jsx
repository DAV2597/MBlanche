// src/Pages/Accueil/Accueil.jsx
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
// Assurez-vous que l'image existe à ce chemin ou adaptez-le
import Back from "./Assets/Back.png"; // Ajustement du chemin relatif probable
import { useNavigate } from "react-router-dom";
// Ajout des nouvelles icônes
import { FaBookOpen, FaImages, FaBuilding, FaChevronRight, FaBullhorn, FaClock, FaMusic, FaGlassCheers, FaUsers } from "react-icons/fa";

// --- IMPORT FIREBASE ---
import { db } from '../../firebaseConfig';
import { collection, getCountFromServer } from "firebase/firestore";

// Définition des couleurs pour la cohérence de marque MB
const colors = {
  vertMb: "#266706", 
  vertMbClair: "#e9f0e6", 
  grisMb: "#D6D6D6", 
};

export default function Accueil() {
    const navigate = useNavigate();
    const [memberCount, setMemberCount] = useState('...'); // Pour le compteur de membres

    // Effet pour charger le nombre total de membres (boulets + anciens)
    useEffect(() => {
        const fetchMemberCount = async () => {
            try {
                const snapshot = await getCountFromServer(collection(db, "utilisateurs"));
                setMemberCount(snapshot.data().count);
            } catch (error) {
                console.error("Erreur pour compter les membres:", error);
            }
        };
        fetchMemberCount();
    }, []);
    
    // Données des cartes d'action mises à jour
    const actionCards = [
        {
            id: "Communiques",
            nom: "Communiqués Officiels",
            path: "/App/Communiques", 
            icon: <FaBullhorn />, 
        },
        // --- NOUVEAU MENU : Horaire Assainisseur ---
        {
            id: "Horaire",
            nom: "Horaire Assainisseur",
            path: "/App/HoraireAssainisseur",
            icon: <FaClock />,
        },
        // --- NOUVEAU MENU : Fêtes Organisées ---
        {
            id: "Fetes",
            nom: "Fêtes Organisées",
            path: "/App/Fetes", // Nouvelle page
            icon: <FaGlassCheers />,
        },
        // ------------------------------------------
        {
            id: "Reglements",
            nom: "Réglèment d'ordre Intérieur",
            path: "/App/Reglements",
            icon: <FaBookOpen />,
        },
        {
            id: "Dictionaire",
            nom: "Dictionnaire de Mots",
            path: "/App/Dictionnaire",
            icon: <FaBookOpen />,
        },
        {
            id: "Album",
            nom: "Album Photos",
            path: "/App/Album",
            icon: <FaImages />,
        },
        {
            id: "Coutumes",
            nom: "Us et Coutumes",
            path: "/App/UsCoutumes",
            icon: <FaBuilding />,
        },
        // --- NOUVEAU MENU : Chansons ---
        {
            id: "Chansons",
            nom: "Chansons du Home",
            path: "/App/Chanson", // Nouvelle page
            icon: <FaMusic />,
        }
    ];

    const Ouvrir = (Lien) => {
        navigate(Lien);
    };

  return (
    <AccueilScreen>
        
        <WelcomeHeader>
          <div className="HeaderContent">
            <h1>BIENVENUE AU HOME</h1>
            <p>Découvrez les règles, traditions et moments forts de la Maison Blanche.</p>
          </div>
        </WelcomeHeader>

        <StatsBar>
            <StatItem>
                <div className="StatIcon"><FaUsers /></div>
                <div className="StatText">
                    <span className="StatValue">{memberCount}</span>
                    <span className="StatLabel">Membres au Home</span>
                </div>
            </StatItem>
        </StatsBar>

        <ContentArea>
          <ActionGrid>
              {
                  actionCards.map((card) => (
                      <ActionCard key={card.id} onClick={() => Ouvrir(card.path)}>
                          <div className="CardBody">
                              <div className="IconBadge">
                                  {card.icon}
                              </div>
                              <div className="TextContent">
                                  <h2>{card.nom}</h2>
                                  <p className="Subtitle">Cliquez pour découvrir le contenu</p>
                              </div>
                              <FaChevronRight className="Arrow" />
                          </div>
                      </ActionCard>
                  ))
              }
          </ActionGrid>
        </ContentArea>

    </AccueilScreen>
  );
}

// --- STYLE (Styled-Components) - Inchangé mais vérifié ---

const AccueilScreen = styled.div`
  background-image: url(${Back});
  background-size: cover;
  background-position: center;
  min-height: 84vh;
  width: 100%;
  padding: 30px;
  background-color: #f4f7f6;
  
  
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const WelcomeHeader = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto 30px auto;
  background: white;
  border-radius: 12px;
  padding: 25px 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  font-family: 'Poppins', sans-serif;

  .HeaderContent {
    h1 { margin: 0; font-size: 22px; text-align: center;color: ${colors.vertMb}; font-weight: 700; letter-spacing: 0.5px; }
    p { margin: 5px 0 0 0; color: #777; font-size: 14px; max-width: 600px; line-height: 1.4; }

  }
`;

const StatsBar = styled.div`
    width: 100%;
    max-width: 900px;
    margin: -15px auto 30px auto; /* Se place entre le header et le contenu */
    display: flex;
    justify-content: center;
    gap: 20px;
`;

const StatItem = styled.div`
    background: ${colors.vertMb};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 5px 15px rgba(38, 103, 6, 0.2);

    .StatIcon { font-size: 24px; opacity: 0.7; }
    .StatText { display: flex; flex-direction: column; align-items: flex-start; }
    .StatValue { font-size: 20px; font-weight: 700; }
    .StatLabel { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
`;

const ContentArea = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease-out;
  cursor: pointer;
  border: 1px solid ${colors.grisMb};
  font-family: 'Poppins', sans-serif;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.08);
    border-color: ${colors.vertMbClair};

    .Arrow { transform: translateX(3px); color: ${colors.vertMb}; }
  }

  .CardBody {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .IconBadge {
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border-radius: 50%;
    background-color: ${colors.vertMbClair};
    color: ${colors.vertMb};
  }

  .TextContent {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    h2 { margin: 0; font-size: 16px; color: #333; font-weight: 600; }
    .Subtitle { margin: 2px 0 0 0; color: #777; font-size: 12px; font-weight: 400; }
  }

  .Arrow {
    font-size: 12px;
    color: #ddd;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
`;