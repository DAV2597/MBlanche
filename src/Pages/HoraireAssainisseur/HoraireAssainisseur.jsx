// src/Pages/HoraireAssainisseur/HoraireAssainisseur.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// Assurez-vous que l'image de fond existe ou adaptez le chemin
import Back from "../Accueil/Assets/Back.png"; 
import {FaIdCard, FaClock, FaCalendarAlt, FaUserShield, FaBroom, FaWater, FaTrashAlt, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaQrcode } from 'react-icons/fa';

// --- IMPORT FIREBASE ---
import { db } from '../../firebaseConfig'; 
// onSnapshot : écoute temps réel. query/orderBy/limit : pour avoir le DERNIER horaire publié.
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
// -----------------------

// Couleurs MB Premium
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
  rougeWarning: "#d9534f", // Pour le statut 'Non Conforme'
  bleuInfo: "#31708f", // Pour le statut 'En Cours'
};

export default function HoraireAssainisseur() {
  
  // 1. ÉTATS (STATES)
  const [horaireData, setHoraireData] = useState(null); // Stocke le dernier horaire complet
  const [loading, setLoading] = useState(true); // Chargement initial

  // =========================================================================
  // NOUVEAU : EFFET DE LECTURE TEMPS RÉEL FIREBASE (Dynamisme)
  // Cet effet écoute la collection "horaires_assainissement"
  // =========================================================================
  useEffect(() => {
    // 1. Référence à la collection
    const horaireCollectionRef = collection(db, "horaires_assainissement");

    // 2. Requête : On veut le DERNIER horaire publié (trie par dateCreation desc, limite à 1)
    const q = query(horaireCollectionRef, orderBy("dateCreation", "desc"), limit(1));

    // 3. Écouteur en temps réel (onSnapshot)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // On récupère le premier (et seul) document
        const doc = snapshot.docs[0];
        setHoraireData({
          id: doc.id,
          ...doc.data() // dateValidite, statut, superviseur, boulets[{nom, tache, matricule}]
        });
      } else {
        // Aucun horaire trouvé dans la base
        setHoraireData(null);
      }
      setLoading(false); // Arrête le chargement
    }, (error) => {
      console.error("Erreur lecture horaire :", error);
      setLoading(false);
    });

    // 4. Nettoyage
    return () => unsubscribe();
  }, []);
  // =========================================================================


  // LOGIQUE : Obtenir l'icône de tâche
  const getTaskIcon = (tache) => {
    if(!tache) return <FaBroom />;
    const t = tache.toLowerCase();
    if (t.includes('douche') || t.includes('eau')) return <FaWater />;
    if (t.includes('poubelle') || t.includes('dechet')) return <FaTrashAlt />;
    return <FaBroom />; // Par défaut
  };

  // LOGIQUE : Obtenir le style du badge de statut
  const getStatusStyle = (statut) => {
    switch (statut) {
        case 'confirme': return { icon: <FaCheckCircle />, text: "Validé par la Mairie", color: colors.vertMb, bg: "#dff0d8" };
        case 'non_conforme': return { icon: <FaExclamationTriangle />, text: "Non Conforme - À refaire", color: colors.rougeWarning, bg: "#f2dede" };
        case 'en_cours': return { icon: <FaSpinner className="spin" />, text: "Travaux en cours...", color: colors.bleuInfo, bg: "#d9edf7" };
        default: return { icon: <FaClock />, text: "Programmé", color: "#777", bg: "#eee" };
    }
  };


  // RENDU (JSX)
  return (
    <HorairePageContainer>
      
      {/* HEADER PREMIUM ET ANIMÉ */}
      <PageHeader>
        <div className="TitleArea">
          <FaClock className="TitleIcon" />
          <div className="TextTitle">
            <h1>HORAIRE D'ASSAINISSEMENT</h1>
            <p className="Subtitle">Organisation quotidienne de la propreté du Home.</p>
          </div>
        </div>
        
        {/* Visualisation de la date Validité (Dynamique) */}
        {horaireData && (
            <div className="DateBadge">
                <FaCalendarAlt />
                <span>{horaireData.dateValidite}</span>
            </div>
        )}
      </PageHeader>

      {/* ZONE DE CONTENU DYNAMIQUE */}
      <ContentArea>
        {loading ? (
          // Écran de chargement stylisé
          <LoadingWrapper>
            <FaSpinner className="spin" />
            <p>Récupération de l'organisation du jour auprès du Gouvernement...</p>
          </LoadingWrapper>
        ) : horaireData ? (
          <>
            {/* 1. SECTION SUPERVISION (Maire / Vice-Maire) */}
            <SupervisionSection>
                <div className="CardAccent" />
                <div className="SupervisorInfo">
                    <FaUserShield className="ShieldIcon" />
                    <div>
                        <h3>Supervisé par : {horaireData.superviseur}</h3>
                        <p>Responsable de la validation finale des travaux.</p>
                    </div>
                </div>
                {/* Badge de statut dynamique */}
                {(() => {
                    const status = getStatusStyle(horaireData.statut);
                    return (
                        <StatusBadge style={{ color: status.color, backgroundColor: status.bg }}>
                            {status.icon} {status.text}
                        </StatusBadge>
                    );
                })()}
            </SupervisionSection>

            {/* 2. GRILLE DES 6 BOULETS (Le cœur de l'horaire) */}
            <BouletsGrid>
                {horaireData.boulets && horaireData.boulets.map((boulet, index) => (
                    // Carte Boulet avec animation décalée (index)
                    <BouletCard key={index} style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="CardHeader">
                            <span className="NumberBadge">#{index + 1}</span>
                            <div className="TaskIconWrapper">{getTaskIcon(boulet.tache)}</div>
                        </div>
                        
                        <div className="CardBody">
                            <h2 className="BouletNom">{boulet.nom}</h2>
                            <p className="TacheDesc">{boulet.tache}</p>
                        </div>
                        
                        <div className="CardFooter">
                            <FaIdCard /> <span>{boulet.matricule}</span>
                            {/* Le QRCode pour scanner la fin de tâche (Simulation) */}
                            <FaQrcode className="QrIcon" title="Scanner pour valider la tâche" />
                        </div>
                    </BouletCard>
                ))}
            </BouletsGrid>
          </>
        ) : (
          // Écran "Aucun horaire"
          <NoScheduleWrapper>
            <FaBroom className="IconLarge" />
            <h3>Aucun horaire publié pour aujourd'hui</h3>
            <p>Le Gouvernement n'a pas encore programmé l'assainissement. Reposez-vous (ou pas) !</p>
          </NoScheduleWrapper>
        )}
      </ContentArea>

    </HorairePageContainer>
  );
}

// --- STYLE (Styled-Components) : Premium, Moderne & Animé ---

const HorairePageContainer = styled.div`
  min-height: 100vh;
  background-image: url(${Back}); /* Image de fond MB */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Fond fixe pour l'effet premium */
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow-x: hidden;
  padding: 30px;
`;

// 1. STYLE DE L'EN-TÊTE
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  .TitleArea {
    display: flex;
    align-items: center;
    gap: 15px;

    .TitleIcon {
      font-size: 30px;
      color: ${colors.vertMb};
      padding: 12px;
      background-color: ${colors.vertMbClair};
      border-radius: 12px;
    }

    .TextTitle {
      h1 { margin: 0; font-size: 22px; color: #333; font-weight: 700; }
      .Subtitle { margin: 3px 0 0 0; color: #777; font-size: 13px; }
    }
  }

  .DateBadge {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 20px; background-color: ${colors.vertMb}; color: white;
      border-radius: 25px; font-size: 14px; font-weight: 600;
      box-shadow: 0 3px 8px rgba(38, 103, 6, 0.2);
  }
`;

// 2. ZONE DE CONTENU PRINCIPAL
const ContentArea = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

// SECTION SUPERVISION (Moderne & Claire)
const SupervisionSection = styled.div`
    position: relative;
    background: white;
    padding: 20px 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    margin-bottom: 25px;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;
    overflow: hidden; /* Pour CardAccent */
    
    .CardAccent { height: 100%; width: 5px; background-color: ${colors.vertMb}; position: absolute; top: 0; left: 0; }

    .SupervisorInfo {
        display: flex; align-items: center; gap: 15px;
        .ShieldIcon { font-size: 30px; color: ${colors.vertMb}; }
        h3 { margin: 0; font-size: 16px; color: #333; font-weight: 600; }
        p { margin: 3px 0 0 0; color: #777; font-size: 12px; }
    }
`;

const StatusBadge = styled.div`
    display: flex; align-items: center; gap: 8px;
    padding: 8px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
`;


// 3. GRILLE DES 6 BOULETS
const BouletsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Cartes larges */
  gap: 20px;
  width: 100%;
`;

// CARTE BOULET (Premium Card Design)
const BouletCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  border: 1px solid #eee;
  overflow: hidden;
  
  /* Animation d'apparition (FadeInUp) */
  opacity: 0; transform: translateY(20px);
  animation: fadeInUpHoraire 0.5s ease-out forwards;
  @keyframes fadeInUpHoraire { to { opacity: 1; transform: translateY(0); } }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    border-color: ${colors.vertMbClair};
  }

  .CardHeader {
    padding: 20px 20px 10px 20px;
    display: flex; justify-content: space-between; align-items: center;
    
    .NumberBadge {
        font-size: 12px; font-weight: 700; color: ${colors.vertMb};
        padding: 5px 10px; background-color: ${colors.vertMbClair}; border-radius: 15px;
    }
    
    .TaskIconWrapper {
        font-size: 22px; color: ${colors.vertMb};
        padding: 10px; background-color: #fafafa; border-radius: 50%; border: 1px solid #eee;
    }
  }

  .CardBody {
    padding: 0 20px 20px 20px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;

    .BouletNom { margin: 0; font-size: 17px; color: #333; font-weight: 600; }
    .TacheDesc { margin: 5px 0 0 0; color: ${colors.vertMb}; font-size: 14px; font-weight: 500; font-style: italic; }
  }

  .CardFooter {
    padding: 12px 20px;
    background-color: #fafafa;
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; color: #bbb; font-weight: 500;
    
    span { flex-grow: 1; text-transform: uppercase; letter-spacing: 0.5px; }
    .QrIcon { font-size: 16px; color: #ccc; cursor: pointer; transition: color 0.3s; &:hover { color: #333; } }
  }
`;

// 4. STYLE DE L'ÉCRAN DE CHARGEMENT
const LoadingWrapper = styled.div`
  text-align: center; padding: 80px; color: ${colors.vertMb};
  background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  .spin { font-size: 35px; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  p { margin: 0; font-size: 15px; font-style: italic; color: #888; max-width: 400px; line-height: 1.4; }
`;

// 5. STYLE DE L'ÉCRAN "AUCUN HORAIRE"
const NoScheduleWrapper = styled.div`
  text-align: center; padding: 60px; color: #ccc;
  background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; align-items: center; gap: 15px;
  .IconLarge { font-size: 50px; margin-bottom: 10px; }
  h3 { margin: 0; font-size: 18px; color: #555; font-weight: 600; }
  p { margin: 0; font-size: 14px; color: #aaa; max-width: 400px; font-style: italic; }
`;