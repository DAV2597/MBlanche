import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBook, FaCheckCircle, FaUserShield, FaUsers, FaArrowLeft, FaGavel, FaListUl, FaArrowUp, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// --- IMPORT FIREBASE ---
import { db } from '../../firebaseConfig'; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// -----------------------

// Réutilisation de vos couleurs pour la cohérence
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
};

export default function Reglements() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  // NOUVEAUX ÉTATS : Pour les règlements dynamiques depuis Firebase
  const [nouveauxReglements, setNouveauxReglements] = useState([]);
  const [loadingNouveaux, setLoadingNouveaux] = useState(true);

  // 1. DONNÉES PAR DÉFAUT : Le Règlement d'Ordre Intérieur (ROI)
  const sectionsROI = [
    {
      id: "preambule",
      titre: "Préambule & Définitions",
      icon: <FaBook />,
      articles: [
        {
          numero: 1,
          titre: "Objet du Règlement",
          contenu: "Le présent Règlement d'Ordre Intérieur (ROI) a pour objet de définir les règles de vie commune, les droits et les devoirs de chaque résident au sein du Home 'Maison Blanche'. Il vise à garantir un environnement propice à l'étude, au respect mutuel et à l'épanouissement de chacun."
        },
        {
          numero: 2,
          titre: "Champ d'Application",
          contenu: "Ce règlement s'applique à tous les étudiants régulièrement logés dans le Home, ainsi qu'à leurs visiteurs occasionnels. Nul ne peut s'en prévaloir de l'ignorance."
        }
      ]
    },
    {
      id: "chapitre1",
      titre: "Droits & Devoirs du Résident",
      icon: <FaUserShield />,
      articles: [
        {
          numero: 3,
          titre: "Droit au Respect & à la Dignité",
          contenu: "Chaque résident a droit au respect de sa personne, de ses opinions et de sa vie privée. Toute forme de discrimination, d'harcèlement, de bizutage ou de violence est strictement interdite."
        },
        {
          numero: 4,
          titre: "Devoir d'Entretien",
          contenu: "Chaque résident est responsable de la propreté de son logement et du matériel mis à sa disposition. Les espaces communs (couloirs, sanitaires, cuisine) doivent être maintenus propres après chaque utilisation."
        },
        {
          numero: 5,
          titre: "Respect du Matériel Commune",
          contenu: "Toute dégradation volontaire ou par négligence du matériel ou des infrastructures du campus sera facturée à l'auteur, sans préjudice de sanctions disciplinaires."
        }
      ]
    },
    {
      id: "chapitre2",
      titre: "Vie Collective & Horaires",
      icon: <FaUsers />,
      articles: [
        {
          numero: 6,
          titre: "Respect du Calme (Heures de Silence)",
          contenu: "Le silence absolu est exigé entre 22h00 et 06h00 pour garantir le repos et l'étude de chacun. Les activités bruyantes (musique forte, fêtes, travaux) sont interdites durant cette période."
        },
        {
          numero: 7,
          titre: "Accès & Visiteurs",
          contenu: "L'accès au Home est strictement réservé aux résidents. Les visiteurs sont autorisés entre 08h00 et 20h00, et doivent être signalés à la guérite. Les visites nocturnes sont interdites, sauf dérogation spéciale."
        },
        {
          numero: 8,
          titre: "Utilisation des Espaces Communs",
          contenu: "L'accès aux espaces communs (salle d'étude, cuisine collective) est régi par des plannings et des règles d'utilisation affichées sur place. Ils ne peuvent être privatisés."
        }
      ]
    },
    {
      id: "chapitre3",
      titre: "Hygiène, Sécurité & Propreté",
      icon: <FaGavel />,
      articles: [
        {
          numero: 9,
          titre: "Propreté des Locaux",
          contenu: "Les ordures doivent être déposées dans les bacs prévus à cet effet. Il est interdit de jeter des déchets dans les couloirs ou par les fenêtres."
        },
        {
          numero: 10,
          titre: "Sécurité & Incendie",
          contenu: "Il est strictement interdit de manipuler les équipements de sécurité (extincteurs, alarmes) sans nécessité. Les issues de secours doivent rester dégagées en permanence."
        },
        {
          numero: 11,
          titre: "Consommation de Substances Interdites",
          contenu: "La consommation, la possession et la vente de drogues et de produits stupéfiants sont formellement interdites au sein du Home. L'alcool doit être consommé avec modération lors d'événements autorisés."
        }
      ]
    }
  ];

  // NOUVEAU : Lecture des règlements ajoutés depuis l'admin
  useEffect(() => {
    const q = query(collection(db, "reglements"), orderBy("datePublication", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            titre: doc.data().titre,
            contenu: doc.data().contenu,
        }));
        setNouveauxReglements(list);
        setLoadingNouveaux(false);
    }, (error) => {
        console.error("Erreur lecture règlements:", error);
        setLoadingNouveaux(false);
    });

    // Nettoyage de l'écouteur
    return () => unsubscribe();
  }, []);

  // 2. LOGIQUE : Gestion du bouton "Retour en Haut"
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. RENDU (JSX)
  return (
    <ReglementsPage>
      {/* BOUTON RETOUR PREMIUM */}
      <HeaderActions>
        <button className="BtnBack" onClick={() => navigate(-1)} title="Retour à l'accueil">
          <FaArrowLeft /> Retour
        </button>
      </HeaderActions>

      {/* EN-TÊTE DU DOCUMENT PREMIUM */}
      <DocumentHeader>
        <div className="HeaderContent">
          <div className="IconBadge"><FaBook /></div>
          <div className="TextTitle">
            <h1>RÈGLEMENT D'ORDRE INTÉRIEUR (R.O.I.)</h1>
            <p className="Subtitle">Édition Officielle - En vigueur pour l'année académique</p>
          </div>
          <div className="StatusBadge"><FaCheckCircle /> Officiel</div>
        </div>
      </DocumentHeader>

      {/* NOUVEAU LAYOUT : Conteneur unique centré et aéré */}
      <MainContentWrapper>
        
        {/* SECTION SOMMAIRE : Intégrée au début du flux de lecture */}
        <TableOfContents id="toc">
          <div className="TocHeader">
            <FaListUl />
            <h3>Sommaire du Document</h3>
          </div>
          <div className="TocGrid">
            {sectionsROI.map((section) => (
              <a href={`#${section.id}`} className="TocLinkItem" key={section.id}>
                <div className="TocIcon">{section.icon}</div>
                <span>{section.titre}</span>
              </a>
            ))}
            {/* AJOUT DYNAMIQUE : Lien vers les nouvelles règles si elles existent */}
            {!loadingNouveaux && nouveauxReglements.length > 0 && (
              <a href="#nouveaux-reglements" className="TocLinkItem">
                <div className="TocIcon"><FaGavel /></div>
                <span>Mises à jour</span>
              </a>
            )}
          </div>
        </TableOfContents>

        {/* ZONE DE CONTENU PRINCIPAL */}
        <ContentArea>
          {sectionsROI.map((section) => (
            <SectionBlock id={section.id} key={section.id}>
              {/* Titre du Chapitre */}
              <SectionTitle>
                <div className="IconBadgeTitle">{section.icon}</div>
                <h2>{section.titre}</h2>
              </SectionTitle>

              {/* Les Articles de ce Chapitre */}
              <ArticleGrid>
                {section.articles.map((article) => (
                  <ArticleCard key={article.numero}>
                    <div className="ArticleBody">
                        <h3>Art. {article.numero} - {article.titre}</h3>
                        <p>{article.contenu}</p>
                    </div>
                  </ArticleCard>
                ))}
              </ArticleGrid>
            </SectionBlock>
          ))}

          {/* SECTION DYNAMIQUE : Affichage des nouveaux règlements depuis Firebase */}
          {loadingNouveaux ? (
            <LoadingSpinner>
              <FaSpinner className="spin" /> Chargement des mises à jour...
            </LoadingSpinner>
          ) : nouveauxReglements.length > 0 && (
            <SectionBlock id="nouveaux-reglements">
              <SectionTitle>
                <div className="IconBadgeTitle"><FaGavel /></div>
                <h2>Mises à jour et Nouvelles Règles</h2>
              </SectionTitle>
              <ArticleGrid>
                {nouveauxReglements.map((article) => (
                  <ArticleCard key={article.id}>
                    <div className="ArticleBody">
                        {/* Pas de numéro d'article pour les ajouts dynamiques */}
                        <h3>{article.titre}</h3>
                        <p>{article.contenu}</p>
                    </div>
                  </ArticleCard>
                ))}
              </ArticleGrid>
            </SectionBlock>
          )}
          
          {/* Note de fin */}
          <EndNote>
            <FaGavel className="IconEnd" />
            <p>Le présent règlement a été adopté par le Gouvernement du Campus Maison Blanche et est applicable à compter de sa date de publication.</p>
          </EndNote>

        </ContentArea>
      </MainContentWrapper>

      {/* BOUTON FLOTTANT : Retour en haut */}
      <ScrollToTopBtn onClick={scrollToTop} style={{ opacity: showScrollTop ? 1 : 0, pointerEvents: showScrollTop ? 'auto' : 'none' }}>
        <FaArrowUp />
      </ScrollToTopBtn>

    </ReglementsPage>
  );
}

// --- STYLE (Styled-Components) : Premium, Épuré & Aéré ---

const ReglementsPage = styled.div`
  padding: 30px;
  background-color: #f4f7f6; /* Fond très léger pour le contraste */
  min-height: 100vh;
  font-family: 'Poppins', sans-serif; /* Assurez-vous d'avoir chargé Poppins */
  animation: fadeIn 0.5s ease-out;
  position: relative; /* Pour le bouton flottant */

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// 0. BOUTONS D'ACTION (RETOUR)
const HeaderActions = styled.div`
    margin-bottom: 25px;
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

// 1. STYLE DE L'EN-TÊTE DU DOCUMENT
const DocumentHeader = styled.div`
  width: 100%;
  max-width: 900px; /* Aligné avec le contenu central */
  margin: 0 auto 30px auto;
  background: white; /* Fond blanc premium */
  border-radius: 12px;
  padding: 25px 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); /* Ombre douce Premium */

  .HeaderContent {
    display: flex;
    align-items: center;
    gap: 25px;
    flex-wrap: wrap;

    .IconBadge {
      font-size: 35px;
      color: ${colors.vertMb};
      padding: 12px;
      background-color: ${colors.vertMbClair};
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .TextTitle {
      flex-grow: 1;
      h1 { margin: 0; font-size: 22px; color: #333; font-weight: 700; letter-spacing: 0.5px; }
      p { margin: 5px 0 0 0; color: #777; font-size: 14px; max-width: 600px; line-height: 1.4; }
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
        border: 1px solid rgba(38, 103, 6, 0.2);
    }
  }
`;

// 2. NOUVEAU LAYOUT CENTRALISÉ
const MainContentWrapper = styled.div`
    width: 100%;
    max-width: 900px; /* Largeur optimale pour la lecture */
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

// NOUVEAU STYLE DU SOMMAIRE : Grille épurée au début du document
const TableOfContents = styled.div`
    background: white;
    border-radius: 12px;
    padding: 25px 30px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.04);
    border: 1px solid #eee;
    
    &::before { /* Ancre de scroll décalée */
        content: ""; display: block; height: 100px; margin-top: -100px; visibility: hidden; pointer-events: none;
    }

    .TocHeader {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
        
        svg { color: #aaa; font-size: 18px; }
        h3 { margin: 0; font-size: 16px; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    }

    .TocGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Grille de liens */
        gap: 15px;
    }

    .TocLinkItem {
        text-decoration: none;
        color: #777;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 8px;
        background-color: #fafafa;
        border: 1px solid #f0f0f0;
        transition: all 0.3s;

        &:hover {
            background-color: white;
            color: ${colors.vertMb};
            border-color: ${colors.vertMbClair};
            box-shadow: 0 3px 10px rgba(38, 103, 6, 0.08);
            
            .TocIcon { background-color: ${colors.vertMb}; color: white; }
        }

        .TocIcon {
            font-size: 14px;
            color: #aaa;
            padding: 8px;
            background-color: white;
            border-radius: 8px;
            display: flex;
            transition: all 0.3s;
        }
        
        span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }
`;

// ZONE DE CONTENU PRINCIPAL
const ContentArea = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
`;

// 3. STYLE D'UN BLOC DE CHAPITRE
const SectionBlock = styled.div`
    width: 100%;
    
    &::before { /* Ancre de scroll décalée pour les liens du sommaire */
        content: ""; display: block; height: 100px; margin-top: -100px; visibility: hidden; pointer-events: none;
    }
`;

const SectionTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #ddd;
    
    .IconBadgeTitle {
        font-size: 20px;
        color: ${colors.vertMb};
        padding: 10px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    h2 { margin: 0; font-size: 19px; color: #333; font-weight: 700; letter-spacing: 0.5px; }
`;

// STYLE D'UNE GRILLE D'ARTICLES : Liste verticale aérée
const ArticleGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

// STYLE D'UNE CARTE ARTICLE (Aérée et simple)
const ArticleCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    border-color: ${colors.vertMbClair};
  }

  .ArticleBody {
    padding: 20px 25px; /* Espacement généreux Premium */

    h3 { margin: 0 0 10px 0; font-size: 15px; color: ${colors.vertMb}; font-weight: 600; }
    p { margin: 0; font-size: 13.5px; color: #555; font-weight: 400; line-height: 1.65; text-align: justify; }
  }
`;

// NOUVEAU : Spinner de chargement
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: #888;
  font-style: italic;

  .spin { animation: spin 1s linear infinite; }
`;

// NOTE DE FIN (Sceau de document)
const EndNote = styled.div`
    margin-top: 30px;
    padding: 25px;
    background-color: #fafafa;
    border-radius: 12px;
    border: 2px solid rgba(0,0,0,0.03);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    text-align: center;
    color: #bbb;
    font-size: 12px;
    font-style: italic;

    .IconEnd { font-size: 30px; color: #ddd; }
    p { margin: 0; max-width: 500px; }
`;

// STYLE DU BOUTON FLOTTANT : Retour en haut
const ScrollToTopBtn = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${colors.vertMb};
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(38, 103, 6, 0.4);
  transition: all 0.3s ease-out;
  z-index: 100;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    background-color: #1a4d04;
    box-shadow: 0 6px 18px rgba(38, 103, 6, 0.5);
  }
`;