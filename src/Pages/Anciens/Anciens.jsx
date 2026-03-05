// src/Pages/Anciens/Anciens.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserGraduate, FaSearch, FaCalendarAlt, FaIdCard, FaSpinner } from 'react-icons/fa';

// --- IMPORT FIREBASE (Vérifié) ---
// Assurez-vous que le chemin est correct vers votre fichier firebaseConfig à la racine
import { db } from '../../firebaseConfig'; 
// onSnapshot : écoute en temps réel. collection : référence la collection.
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
// ---------------------------------

// Réutilisation de vos couleurs
const colors = {
  vertMb: "#266706",
  grisMb: "#D6D6D6",
};

export default function Anciens() {
  
  // 1. ÉTATS (STATES)
  // 'anciens' est vide au début, il sera rempli par Firebase.
  const [anciens, setAnciens] = useState([]); 
  const [loading, setLoading] = useState(true); // État de chargement initial
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche

  // =========================================================================
  // NOUVEAU : EFFET DE LECTURE TEMPS RÉEL FIREBASE (Dynamisme)
  // Cet effet s'exécute une fois au montage du composant.
  // =========================================================================
  useEffect(() => {
    // 1. Référence à la collection dédiée "anciens"
    const utilisateursCollectionRef = collection(db, "utilisateurs");

    // 2. Création d'une requête : On filtre pour ne prendre que les utilisateurs de type "ancien"
    const q = query(utilisateursCollectionRef, where("type", "==", "ancien"), orderBy("dateEnregistrement", "desc"));

    // 3. Écouteur en temps réel (onSnapshot)
    // C'est le cœur du dynamisme : cette fonction est rappelée à chaque changement (ajout, suppr) dans la DB.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Transformation des documents Firebase en objets JavaScript simples
      const list = snapshot.docs.map(doc => ({
        id: doc.id, // L'ID unique généré par Firebase
        ...doc.data() // nomComplet, originePromotion, matricule, photoUrl
      }));
      
      console.log(`${list.length} anciens récupérés depuis Firebase.`);
      setAnciens(list); // Met à jour l'état avec la vraie liste
      setLoading(false); // Désactive l'écran de chargement
    }, (error) => {
      // Gestion des erreurs (permissions, connexion, etc.)
      console.error("Erreur lors de la lecture des anciens :", error);
      setLoading(false);
    });

    // 4. Nettoyage : On coupe l'écouteur quand on quitte la page
    return () => unsubscribe();
  }, []);
  // =========================================================================

  // 3. LOGIQUE : Filtrage pour la recherche (sur les données Firebase)
  // J'ai mis à jour les filtres pour utiliser vos noms de champs Firebase (nomComplet, originePromotion)
  const anciensFiltrés = anciens.filter(ancien =>
    ancien.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ancien.originePromotion.includes(searchTerm)
    // Note : Il faut s'assurer que 'faculte' existe dans Firebase lors de l'ajout si vous voulez filtrer dessus
  );

  // 4. LOGIQUE : Génération d'avatar par défaut (Initiales)
  const getInitials = (name) => {
    if(!name) return ""; // Sécurité si le nom est vide
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  // 5. RENDU (JSX)
  return (
    <AnciensPage>
      {/* EN-TÊTE DE LA PAGE : Titre et Barre de recherche */}
      <PageHeader>
        <div className="TitleArea">
          <FaUserGraduate className="TitleIcon" />
          <div className="TextTitle">
            <h1>ANNUAIRE DES ANCIENS</h1>
            <p className="Subtitle">Retrouvez les diplômés de la Maison Blanche ({anciensFiltrés.length} membres)</p>
          </div>
        </div>
        
        {/* Zone de recherche Premium */}
        <div className="SearchBox">
          <FaSearch className="SearchIcon" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou promotion..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* GRILLE DES ANCIENS DYNAMIQUE */}
      <AnciensGrid>
        {loading ? (
            // Écran de chargement stylisé
            <LoadingWrapper>
                <FaSpinner className="spin" />
                <p>Chargement de l'annuaire depuis la Maison Blanche...</p>
            </LoadingWrapper>
        ) : anciensFiltrés.length > 0 ? (
          anciensFiltrés.map((ancien) => (
            <AncienCard key={ancien.id}>
              {/* Petite barre verte décorative en haut */}
              <div className="CardAccent" />
              
              {/* Zone Photo / Avatar */}
              <div className="AvatarSection">
                {/* On utilise photoUrl qui est le nom du champ dans Firebase (MairiePic) */}
                {ancien.photoUrl ? (
                  <img src={ancien.photoUrl} alt={ancien.nomComplet} className="ProfilePic" />
                ) : (
                  <div className="DefaultAvatar">{getInitials(ancien.nomComplet)}</div> // Changé nom en nomComplet
                )}
              </div>

              {/* Informations */}
              <div className="InfoSection">
                <h2 className="AncienName">{ancien.nomComplet}</h2> {/* Changé nom en nomComplet */}
                
                {/* Note : J'ai masqué la faculté car elle n'est pas gérée dans le formulaire d'ajout Mairie */}
                {/* {ancien.faculte && (
                    <div className="DetailItem faculte">
                        <FaGraduationCap /> <span>{ancien.faculte}</span>
                    </div>
                )} */}
                
                <div className="DetailRow">
                    <div className="DetailItem">
                        <FaCalendarAlt /> <span>Promo {ancien.originePromotion}</span> {/* Changé promotion en originePromotion */}
                    </div>
                    <div className="DetailItem matricule">
                        <FaIdCard /> <span>{ancien.matricule}</span>
                    </div>
                </div>
              </div>

              {/* Bouton d'action (optionnel) */}
              <div className="CardFooter">
                <button className="BtnViewProfile" onClick={() => alert(`Profil détaillé de ${ancien.nomComplet} prochainement disponible.`)}>
                    Voir Profil
                </button>
              </div>
            </AncienCard>
          ))
        ) : (
          
          // Écran "Aucun résultat"
          <NoResultWrapper>
            <FaUserGraduate className="IconLarge" />
            <h3>Aucun ancien trouvé</h3>
            <p>Aucun diplômé ne correspond à votre recherche "{searchTerm}" ou l'annuaire est vide (Maire, ajoutez des anciens !).</p>
          </NoResultWrapper>
        )}
      </AnciensGrid>
    </AnciensPage>
  );
}

// --- STYLE (Styled-Components) : Premium & Moderne --- (Inchangé)

const AnciensPage = styled.div`
  padding: 30px;
  background-color: #f4f7f6; /* Fond légèrement gris clair pour le contraste */
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;

  .TitleArea {
    display: flex;
    align-items: center;
    gap: 15px;

    .TitleIcon {
      font-size: 35px;
      color: ${colors.vertMb};
      padding: 10px;
      background-color: #e9f0e6;
      border-radius: 12px;
    }

    .TextTitle {
      h1 { margin: 0; font-size: 24px; color: #333; font-weight: 700; }
      .Subtitle { margin: 5px 0 0 0; color: #777; font-size: 14px; }
    }
  }

  .SearchBox {
    position: relative;
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 400px;
    min-width: 250px;
    background: white;
    border-radius: 25px;
    border: 1px solid #ddd;
    padding: 0 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.3s;

    &:focus-within {
      border-color: ${colors.vertMb};
      box-shadow: 0 3px 10px rgba(38, 103, 6, 0.15);
    }

    .SearchIcon { color: #aaa; margin-right: 12px; }

    input {
      border: none;
      padding: 12px 0;
      width: 100%;
      outline: none;
      background: transparent;
      font-size: 15px;
      color: #333;
      &::placeholder { color: #bbb; }
    }
  }
`;

const AnciensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  width: 100%;
`;

const AncienCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    border-color: #e9f0e6;
  }

  .CardAccent { height: 4px; width: 100%; background-color: ${colors.vertMb}; position: absolute; top: 0; left: 0; }
  .AvatarSection { padding-top: 25px; display: flex; justify-content: center;
    .ProfilePic, .DefaultAvatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .DefaultAvatar { background-color: #e9f0e6; color: ${colors.vertMb}; display: flex; justify-content: center; align-items: center; font-size: 30px; font-weight: 700; letter-spacing: 1px; }
  }
  .InfoSection { padding: 20px; text-align: center; border-bottom: 1px solid #f0f0f0;
    .AncienName { margin: 0 0 10px 0; font-size: 18px; color: #333; font-weight: 600; }
    .DetailItem { display: flex; align-items: center; justify-content: center; gap: 7px; color: #777; font-size: 13px; margin-bottom: 8px; svg { color: #aaa; font-size: 14px; } span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        &.faculte { color: #555; font-weight: 500; }
    }
    .DetailRow { display: flex; justify-content: center; gap: 15px; margin-top: 5px; .DetailItem { margin-bottom: 0; font-size: 12px; } }
  }
  .CardFooter { padding: 12px; background-color: #fafafa; display: flex; justify-content: center;
    .BtnViewProfile { background: none; border: 1px solid ${colors.vertMb}; color: ${colors.vertMb}; padding: 7px 18px; border-radius: 15px; cursor: pointer; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s;
        &:hover { background-color: ${colors.vertMb}; color: white; box-shadow: 0 2px 5px rgba(38, 103, 6, 0.2); }
    }
  }
`;

// NOUVEAUX STYLES POUR LE DYNAMISME
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