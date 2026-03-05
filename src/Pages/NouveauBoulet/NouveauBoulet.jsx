// src/Pages/NouveauBoulet/NouveauBoulet.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserPlus, FaSync, FaMapMarkerAlt, FaIdCard, FaLevelUpAlt, FaCalendarAlt, FaSearch, FaSpinner } from 'react-icons/fa';

// --- IMPORT FIREBASE ---
// Assurez-vous que le chemin est correct vers votre config Firebase
import { db } from '../../firebaseConfig'; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
// -----------------------

// Réutilisation de vos couleurs
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6", // Version très claire pour les fonds
};

export default function NouveauBoulet() {
  
  // 2. ÉTATS (STATES)
  const [nouveaux, setNouveaux] = useState([]); // Liste principale venant de Firebase
  const [loading, setLoading] = useState(true); // État de chargement
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche

  // --- NOUVEAU : EFFET DE LECTURE TEMPS RÉEL FIREBASE ---
  useEffect(() => {
    // Référence à la collection "utilisateurs" (qui contient boulets et anciens)
    const usersCollection = collection(db, "utilisateurs");

    // Création de la requête : Filtrer pour n'avoir QUE le type 'boulet'
    const q = query(usersCollection, where("type", "==", "boulet"));

    // Écouteur en temps réel (onSnapshot)
    // C'est le cœur du dynamisme : cette fonction est rappelée à chaque changement dans la DB.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // nomComplet, originePromotion, matricule, chambre, faculte, etc.
      }));
      setNouveaux(list);
      setLoading(false);
    }, (error) => {
      console.error("Erreur lecture boulets :", error);
      setLoading(false);
    });

    // Nettoyage : On coupe l'écouteur quand on quitte la page
    return () => unsubscribe();
  }, []);
  // --------------------------------------------------------

  // 4. LOGIQUE : Fonction de rafraîchissement manuel
  const handleRefresh = () => {
    setLoading(true);
    // Le onSnapshot se chargera de remettre les données à jour
    setTimeout(() => setLoading(false), 800);
  };

  // 5. LOGIQUE : Filtrage pour la recherche (sur les données Firebase)
  const bouletsFiltrés = nouveaux.filter(boulet =>
    boulet.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boulet.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boulet.originePromotion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 6. RENDU (JSX)
  return (
    <BouletPageContainer>
      
      {/* BANNIÈRE D'ACCUEIL PREMIUM AVEC RECHERCHE INTÉGRÉE */}
      <WelcomeBanner>
        <div className="Confettis"></div>
        <div className="BannerContent">
          <div className="IconBadge"><FaUserPlus /></div>
          <div className="TextTitle">
            <h1>BIENVENUE AUX NOUVEAUX LOGÉS</h1>
            <p>Découvrez les visages de la nouvelle promotion de la Maison Blanche ({bouletsFiltrés.length} membres).</p>
          </div>
          
          {/* Zone de recherche Premium intégrée à la bannière */}
          <div className="SearchBoxBanner">
            <FaSearch className="SearchIcon" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, origine, matricule..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </WelcomeBanner>

      {/* ZONE PRINCIPALE AVEC GRILLE ET CHARGEMENT */}
      <ContentArea>
        {loading ? (
          // Écran de chargement stylisé
          <LoadingWrapper>
            <FaSpinner className="spin" />
            <p>Récupération des nouveaux arrivants depuis le système...</p>
          </LoadingWrapper>
        ) : bouletsFiltrés.length > 0 ? (
          <NouveauxGrid>
            {bouletsFiltrés.map((boulet, index) => (
              // Carte Ancien avec animation d'apparition décalée (index)
              <BouletCard key={boulet.id} style={{ animationDelay: `${index * 80}ms` }}>
                
                <div className="CardHeader">
                  <div className="ProfileArea">
                    <div className="DefaultAvatar">{boulet.nomComplet.substring(0, 1).toUpperCase()}</div>
                    <div className="HeaderInfo">
                        <h2>{boulet.nomComplet}</h2>
                        <span className="Matricule">{boulet.matricule}</span>
                    </div>
                  </div>
                </div>

                <div className="CardBody">
                  {/* Note: Il faut s'assurer que 'faculte' existe dans Firebase lors de l'ajout */}
                  {boulet.faculte && (
                      <div className="DetailItem faculte">
                        <FaLevelUpAlt /> <span>Faculté : {boulet.faculte}</span>
                      </div>
                  )}
                  
                  <div className="DetailRow">
                    <div className="DetailItem">
                        <FaMapMarkerAlt /> <span>De {boulet.originePromotion}</span>
                    </div>
                    {boulet.chambre && (
                        <div className="DetailItem chambre">
                            <FaIdCard /> <span>Chambre {boulet.chambre}</span>
                        </div>
                    )}
                  </div>

                  {/* Visualisation Premium de l'intégration (Simulée pour l'instant) */}
                  <div className="IntegrationStatus">
                    <div className="IntegrationLabel">
                        <FaSpinner /> <span>Intégration en cours</span>
                        <span className="PercentValue">{boulet.pourcentageIntegration || 50}%</span>
                    </div>
                    <div className="ProgressBackground">
                        <div className="ProgressFill" style={{ width: `${boulet.pourcentageIntegration || 50}%` }} />
                    </div>
                  </div>
                </div>

                <div className="CardFooter">
                  <FaCalendarAlt /> <span>Enregistré le {boulet.dateEnregistrement ? boulet.dateEnregistrement.toDate().toLocaleDateString('fr-FR') : "..."}</span>
                </div>
              </BouletCard>
            ))}
          </NouveauxGrid>
        ) : (
          // Écran "Aucun résultat"
          <NoResultWrapper>
            <FaUserPlus className="IconLarge" />
            <h3>Aucun boulet trouvé</h3>
            <p>Aucun nouveau logé ne correspond à votre recherche "{searchTerm}" ou la liste est vide.</p>
          </NoResultWrapper>
        )}
      </ContentArea>

      {/* BOUTON D'ACTION FLOTTANT (Actualiser) */}
      <FloatingActionButton onClick={handleRefresh} title="Actualiser la liste">
        <FaSync className={loading ? 'Spinning' : ''} />
      </FloatingActionButton>

    </BouletPageContainer>
  );
}

// --- STYLE (Styled-Components) : Premium, Moderne & Animé --- (Fusionné et Corrigé)

const BouletPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow-x: hidden;
`;

// 1. STYLE DE LA BANNIÈRE D'ACCUEIL
const WelcomeBanner = styled.div`
  width: 100%;
  padding: 40px 30px;
  background: linear-gradient(135deg, ${colors.vertMb} 0%, #1a4d04 100%);
  color: white;
  position: relative;
  overflow: hidden;

  .Confettis {
    position: absolute; top: -50px; right: -50px; width: 200px; height: 200px;
    background-image: radial-gradient(white 10%, transparent 11%), radial-gradient(rgba(255,255,255,0.2) 10%, transparent 11%);
    background-size: 20px 20px; background-position: 0 0, 10px 10px; opacity: 0.3; border-radius: 50%; transform: rotate(15deg);
  }

  .BannerContent {
    display: flex; align-items: center; gap: 25px; position: relative; z-index: 1; flex-wrap: wrap;

    .IconBadge { font-size: 40px; color: white; padding: 15px; background-color: rgba(255, 255, 255, 0.15); border-radius: 15px; backdrop-filter: blur(5px); }
    .TextTitle { flex-grow: 1; h1 { margin: 0; font-size: 24px; color: white; font-weight: 700; letter-spacing: 0.5px; } p { margin: 5px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px; } }
  }

  /* Zone de recherche intégrée à la bannière */
  .SearchBoxBanner {
    position: relative; display: flex; align-items: center; width: 100%; max-width: 350px; min-width: 250px;
    background: rgba(255, 255, 255, 0.1); border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0 15px; backdrop-filter: blur(5px); transition: all 0.3s;
    
    &:focus-within { background: rgba(255, 255, 255, 0.2); border-color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .SearchIcon { color: rgba(255, 255, 255, 0.6); margin-right: 12px; font-size: 14px; }
    input { border: none; padding: 10px 0; width: 100%; outline: none; background: transparent; font-size: 14px; color: white; font-family: inherit; &::placeholder { color: rgba(255, 255, 255, 0.4); } }
  }
`;

const ContentArea = styled.div` padding: 30px; `;
const NouveauxGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; width: 100%; `;

const BouletCard = styled.div`
  background: white; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.06); transition: all 0.3s ease; border: 1px solid #eee;
  opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards;
  @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
  &:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.12); border-color: ${colors.vertMbClair}; }

  .CardHeader { padding: 20px; border-bottom: 1px solid #f0f0f0;
    .ProfileArea { display: flex; align-items: center; gap: 15px; }
    .DefaultAvatar { width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(135deg, ${colors.vertMb} 0%, #3e8e12 100%); color: white; display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: 700; }
    .HeaderInfo { h2 { margin: 0; font-size: 16px; color: #333; font-weight: 600; } .Matricule { margin: 3px 0 0 0; color: #aaa; font-size: 11px; text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px; } }
  }

  .CardBody { padding: 20px;
    .DetailItem { display: flex; align-items: center; gap: 8px; color: #777; font-size: 13px; margin-bottom: 10px; svg { color: #aaa; font-size: 14px; } span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        &.faculte { color: #555; font-weight: 500; }
    }
    .DetailRow { display: flex; justify-content: space-between; gap: 10px; margin-top: 5px; margin-bottom: 20px; .DetailItem { margin-bottom: 0; font-size: 12px; } .DetailItem.chambre { color: ${colors.vertMb}; font-weight: 500; } }
    
    .IntegrationStatus { margin-top: 15px;
        .IntegrationLabel { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #888; margin-bottom: 6px; svg { color: #ccc; margin-right: 5px; font-size: 11px; animation: spin 2s infinite linear; } .PercentValue { color: ${colors.vertMb}; font-weight: 600; } }
        .ProgressBackground { height: 6px; width: 100%; background-color: #eee; border-radius: 3px; overflow: hidden; }
        .ProgressFill { height: 100%; background-color: ${colors.vertMb}; border-radius: 3px; transition: width 1s ease-out; }
    }
  }

  .CardFooter { padding: 12px 20px; background-color: #fafafa; border-radius: 0 0 12px 12px; border-top: 1px solid #eee; display: flex; align-items: center; gap: 8px; font-size: 11px; color: #bbb; font-weight: 500; }
`;

const LoadingWrapper = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 80px; color: ${colors.vertMb};
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  background: white; border-radius: 12px; border: 1px solid #eee;
  .spin { font-size: 35px; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  p { margin: 0; font-size: 15px; font-style: italic; color: #888; max-width: 400px; line-height: 1.4; }
`;

const NoResultWrapper = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 60px; color: #ccc;
  display: flex; flex-direction: column; align-items: center; gap: 15px;
  background: white; border-radius: 12px; border: 1px solid #eee;
  .IconLarge { font-size: 50px; margin-bottom: 10px; }
  h3 { margin: 0; font-size: 18px; color: #555; font-weight: 600; }
  p { margin: 0; font-size: 14px; color: #aaa; max-width: 400px; font-style: italic; }
`;

const FloatingActionButton = styled.button`
  position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%;
  background-color: ${colors.vertMb}; color: white; border: none; font-size: 24px; cursor: pointer;
  display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(38, 103, 6, 0.4);
  transition: all 0.3s ease; z-index: 100;
  &:hover { transform: scale(1.1); background-color: #1a4d04; box-shadow: 0 6px 20px rgba(38, 103, 6, 0.5); }
  .Spinning { animation: spin 1s linear infinite; }
`;