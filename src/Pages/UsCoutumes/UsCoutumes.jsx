import React from 'react';
import styled from "styled-components";
// --- CORRECTION : Import de l'image supprimé pour éviter l'erreur ---
// import BackImage from "./Assets/photo1.png"; 
// ------------------------------------------------------------------
import { FaBookmark, FaQuoteLeft } from "react-icons/fa";

// Définition des couleurs pour la cohérence de marque
const colors = {
  vertMb: "#266706", // Votre vert d'origine
  vertMbClair: "#e9f0e6", // Version très claire pour les accents
  grisMb: "#D6D6D6", // Votre gris d'origine
};

const UsCoutumes = () => {
    const Coutumes = [
        {
            id: 1,
            text: "De coutume à la maison blanche à chaque fois qu'un logeant du home est frappé par un deuil, les partisants de la maison blanche font de contribution pour aider la personne eprouver, mais aussi le soir de la journée ou la personné est morte , on allume le feu dans le cadre de compatir ensemble avec la personne éprouvée, cette séance commence apartir de 20h30 ou 21h00 jusqu'à 1h du matin"
        },
        {
            id: 2,
            text: "De coutume, tout nouveau au home doit passer à une séance d'initiation qui consiste à apprendre les chansons propre à la maison, puiser de l'eau pour les anciens s'il y a demande et bien d'autres chose"
        },
        {
            id: 3,
            text: "De coutume, à chaque fois qu'il y a coupure du courant toute personne logéant au home doit participé à l'action Kushuka pour revendiquer le retour du courant;"
        },
        {
            id: 4,
            text: "A la maison blanche règne le partage, un partisants du home ne doit pas dormir sans manger pour raison de manque de la nourriture alors que sont voisin à preparé quelque chose à manger ;"
        },
        {
            id: 5,
            text: "De coutume, à chaque qu'un partisant de la maison blanche fini ses études il est prévu une fête denommée effet KUMA qui a pour but de dire aurevoir à notre très cher ainé qui finit ses études, la réussite de cette événement se fait par des contributions en argent ou en nature(le haricot, le riz, la farine), la préparation est faite par les nouveaux sous guide des anciens"
        },
        {
            id: 6,
            text: "Il existe pour chaque une semaine denommé semaine sainte où tout les anciens doivent prodiguer les conseilles aux nouveaux concernant la vie au home après intégration"
        },
        {
            id: 7,
            text: "Chaque fin du mois est prévu un ensemblé général pour evaluer le mois qui vient de prendre fin"
        },
        {
            id: 8,
            text: "De coutume, il existe une fête d'intégration chaque année denommé EFFET KUKU qui a pour but d'intégrer les nouveaux dans les corps des anciens, la participartion à cette cet événement se fait à base de 10 dollars américain, la préparation de cette fête se fait par les nouveaux"
        },
        {
            id: 9,
            text: "Chaque année, est prévue deux quermess au plus dans le cadre d'enrichir nos relation avec nos voisins "
        },
        {
            id: 10,
            text: "De coutume, les choses comme assiettes et bien d'autre bien pour la cuisine sont partageables  "
        },
        {
            id: 11,
            text: "Chaque Samédi est prévu un salongo qui est réalisé par les nouveaux du home sous supervision des anciens "
        },
        {
            id: 12,
            text: "à chaque fois qu'il y a soutenance et que un membre du home doit soutenir il est accompagné lors de la descente dans la salle par une chanson denommé Kumaliza Masomo et quand il finit à faire la soutenance les partisants du home doivent chanter pour lui dans le cadre de la charite "
        },
        {
            id: 13,
            text: "A la maison Blanche Règne une devise (UN POUR TOUS, TOUS POUR UN) qui veut dire......"
        },
    ]

    return (
        <PageContainer>
            
            {/* EN-TÊTE PREMIUM AVEC TITRE ET ICÔNE */}
            <Header>
              <div className="HeaderContent">
                <FaBookmark className="HeaderIcon" />
                <div className="TextTitle">
                  <h1>US ET COUTUMES</h1>
                  <p className="Subtitle">Les traditions orales et les règles de vie de la Maison Blanche.</p>
                </div>
              </div>
            </Header>

            {/* ZONES DE CONTENU AVEC CARTES PREMIUM */}
            <ContentGrid>
                {
                    Coutumes.map((Coutume, index) => (
                        <CoutumeCard key={Coutume.id}>
                            <div className="CardAccent" />
                            <div className="CardBody">
                                <FaQuoteLeft className="QuoteIcon" />
                                <p>{Coutume.text}</p>
                                <span className="CoutumeNumber">Coutume #{Coutume.id}</span>
                            </div>
                        </CoutumeCard>
                    ))
                }
            </ContentGrid>
            
            {/* Pied de page discret */}
            <Footer>
                © 2023 - Gouvernement du Campus Maison Blanche
            </Footer>

        </PageContainer>
    );
}

export default UsCoutumes;

// --- STYLE (Styled-Components) : Premium, Épuré & Moderne ---

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 30px;
  
  /* --- CORRECTION ICI : Fond unie élégante au lieu de l'image manquante --- */
  background-color: #f4f7f6; /* Fond légèrement gris-bleu très clair */
  /* ------------------------------------------------------------------------ */
  
  font-family: 'Poppins', sans-serif; /* Assurez-vous d'avoir chargé Poppins ou une police similaire */
  
  animation: apa 0.6s ease-out;

  @keyframes apa {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// 1. STYLE DE L'EN-TÊTE
const Header = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto 30px auto;
  background: white; /* Fond blanc premium */
  border-radius: 12px;
  padding: 25px 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); /* Ombre douce Premium */

  .HeaderContent {
    display: flex;
    align-items: center;
    gap: 20px;

    .HeaderIcon {
      font-size: 30px;
      color: ${colors.vertMb};
      padding: 10px;
      background-color: ${colors.vertMbClair};
      border-radius: 10px;
    }

    .TextTitle {
      h1 { margin: 0; font-size: 20px; color: #333; font-weight: 700; letter-spacing: 0.5px; }
      .Subtitle { margin: 5px 0 0 0; color: #777; font-size: 13px; font-weight: 400; }
    }
  }
`;

// 2. ZONE DE GRILLE DES CARTES DE COUTUMES
const ContentGrid = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espace entre les cartes */
`;

// 3. STYLE DE LA CARTE COUTUME (Premium Actionable Card)
const CoutumeCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden; /* Pour que CardAccent respecte l'arrondi */
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease-out;
  border: 1px solid transparent;
  display: flex;
  position: relative;

  &:hover {
    transform: translateY(-3px); /* S'élève légèrement au survol */
    box-shadow: 0 6px 15px rgba(0,0,0,0.08); /* Ombre plus marquée */
    border-color: ${colors.vertMbClair}; /* Bordure verte légère */
    
    .CoutumeNumber { color: ${colors.vertMb}; } /* Numérotation s'illumine */
  }

  /* Bande d'accentuation à gauche Premium */
  .CardAccent {
    width: 4px;
    background-color: ${colors.vertMb};
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }

  .CardBody {
    padding: 20px 25px 20px 30px; /* Padding ajusté pour l'accent */
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .QuoteIcon {
        font-size: 14px;
        color: #ddd; /* Icône de citation subtile */
    }

    p { 
        margin: 0; 
        font-size: 13.5px; 
        color: #555; /* Gris plus lisible pour le texte long */
        font-weight: 400; 
        line-height: 1.6; 
        text-align: justify; 
    }

    .CoutumeNumber {
        margin: 5px 0 0 0;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(0,0,0,0.15); /* Gris très très léger par défaut */
        font-weight: 600;
        text-align: right;
        transition: color 0.3s ease;
    }
  }
`;

// 4. STYLE DU PIED DE PAGE
const Footer = styled.div`
    width: 100%;
    max-width: 900px;
    margin: 30px auto 0 auto;
    text-align: center;
    font-size: 11px;
    color: #bbb;
    font-weight: 400;
`;