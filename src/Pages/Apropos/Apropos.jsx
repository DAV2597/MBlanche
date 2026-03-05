import React from 'react';
import Me from './Assets/Me.png' // Assurez-vous que le chemin est correct
import styled from "styled-components";
import { FaFacebook, FaWhatsapp, FaPhoneSquareAlt, FaGoogle, FaUserTie, FaChevronRight } from "react-icons/fa"

const Apropos = () => {
    // Conservation de vos adresses et couleurs d'origine
    const Adresses = [
        {
            logo: <FaFacebook color="rgb(38, 50, 141)" />,
            titre: "Facebook",
            contenu: "jeremie ndeke museremu sesa",
            ref: "https://facebook.com/jeremiendekemuseremusesa"
        },
        {
            logo: <FaPhoneSquareAlt color="rgb(20, 141, 54)" />,
            titre: "Téléphone",
            contenu: "+243 991 744 708, 829 149 785",
            ref: "tel:+243991744708"
        },
        {
            logo: <FaWhatsapp color="rgb(20, 141, 54)" />,
            titre: "WhatsApp",
            contenu: "jeremie ndeke museremu sesa",
            ref: "https://wa.link/mv5xgw"
        },
        {
            logo: <FaGoogle color="rgb(187, 34, 34)" />,
            titre: "Email",
            contenu: "Jeremiendekemuseremu@gmail.com",
            ref: "mailto:Jeremiendekemuseremu@gmail.com"
        }
    ]

    return (
        <AproposContainer>
            <div className="MainWrapper">
                
                {/* SECTION 1 : PHOTO ET DESCRIPTION (Gauche) */}
                <ProfileSection>
                    <div className="AvatarFrame">
                        <img src={Me} alt="Jeremie Ndeke" />
                    </div>
                    
                    <div className="description">
                        <h2><FaUserTie className="TitleIcon" /> À propos du Créateur</h2>
                        <p>
                            <strong>MB App</strong> est une application créée dans le but 
                            de permettre la sauvegarde de quelques coutumes 
                            et us de la Maison Blanche. À partir de cette 
                            application, tous les nouveaux du home 
                            sauront les règles qui régissent les logeants 
                            du home, mais aussi vivront, à partir des images,
                            les événements qui se font à la Maison Blanche.
                        </p>
                        <p>
                            MB App contient également un dictionnaire
                            des mots souvent utilisés au home et leurs significations. 
                        </p>
                        <p className="DevCredits">
                            MB App est créée par <strong>Monsieur Jeremie Ndeke Museremu Sesa</strong>, 
                            étudiant à la faculté des Sciences dans le département de l'Informatique.
                        </p>
                    </div>
                </ProfileSection>

                {/* SECTION 2 : CONTACTS (Droite) */}
                <ContactSection>
                    <div className="contacts">
                        <h3>Discutons Ensemble</h3>
                        <p className="ContactInstruct">Pour toute suggestion, partenariat ou question, n'hésitez pas à me contacter.</p>
                        
                        <div className="AdresseGrid">
                            {Adresses.map((adresse, index) => (
                                <a href={adresse.ref} target="_blank" rel="noopener noreferrer" className='adresse' key={index}>
                                    <div className="Logos">
                                        <div className="icone">
                                            {adresse.logo}
                                        </div>
                                    </div>
                                    <div className="TextContent">
                                        <span className="Label">{adresse.titre}</span>
                                        <p className="Value">{adresse.contenu}</p>
                                    </div>
                                    <FaChevronRight className="Arrow" />
                                </a>
                            ))}
                        </div>
                    </div>
                </ContactSection>

            </div>
        </AproposContainer>
    );
}

export default Apropos;

// --- STYLE (Styled-Components) : Premium & Moderne ---

const AproposContainer = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background-color: #f4f7f6; /* Fond très léger pour le contraste */
  
  animation: apa 0.6s ease-out;

  @keyframes apa {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .MainWrapper {
    width: 100%;
    max-width: 1100px; /* Limite la largeur sur grand écran */
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr; /* 1 colonne par défaut (mobile) */
    gap: 20px;
    
    /* Responsive : 2 colonnes sur tablette/desktop */
    @media (min-width: 768px) {
        grid-template-columns: 1.5fr 1fr; /* Gauche plus large */
        align-items: start;
    }
  }
`;

// SECTION PROFIL (Photo + Texte)
const ProfileSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); /* Ombre douce Premium */
  font-family: 'Poppins', sans-serif; /* Assurez-vous d'avoir chargé Poppins */

  .AvatarFrame {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;

    img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        
        /* Double cercle premium autour de la photo */
        border: 4px solid white;
        box-shadow: 0 0 0 4px rgba(38, 103, 6, 0.1), /* Votre vert Mb très léger */
                    0 0 20px rgba(0,0,0,0.1);
    }
  }

  .description {
    color: #333;
    line-height: 1.6;

    h2 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 0;
        margin-bottom: 15px;
        color: #266706; /* Votre vert Mb */
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.5px;
        
        .TitleIcon { font-size: 18px; }
    }

    p {
        margin: 0 0 15px 0;
        font-size: 15px;
        text-align: justify;
    }

    .DevCredits {
        border-top: 1px solid rgba(0,0,0,0.05);
        padding-top: 15px;
        font-size: 14px;
        color: #666;
        font-style: italic;
        background-color: rgba(38, 103, 6, 0.03);
        padding: 15px;
        border-radius: 8px;
    }
  }
`;

// SECTION CONTACTS
const ContactSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  font-family: 'Poppins', sans-serif;

  .contacts {
    h3 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #333;
        font-size: 18px;
        font-weight: 600;
    }

    .ContactInstruct {
        margin: 0 0 20px 0;
        color: #777;
        font-size: 14px;
        line-height: 1.4;
    }

    .AdresseGrid {
        display: flex;
        flex-direction: column;
        gap: 12px; /* Espace entre les boutons */
    }

    .adresse {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 18px;
        text-decoration: none; /* Enlève le soulignement du lien */
        border-radius: 8px;
        
        /* Transformation Premium du gris Mb */
        background-color: #f9f9f9; 
        border: 1px solid #eee;
        
        cursor: pointer;
        transition: all 0.2s ease-out;

        /* Effet Hover Premium */
        &:hover {
            transform: translateY(-2px);
            background-color: white;
            border-color: rgba(38, 103, 6, 0.2); /* Bordure verte légère */
            box-shadow: 0 4px 12px rgba(38, 103, 6, 0.1);

            .Arrow { transform: translateX(3px); color: #266706; }
            .TextContent .Label { color: #266706; }
        }

        .Logos {
            display: flex;
            align-items: center;
            justify-content: center;
            
            .icone {
                font-size: 20px;
                display: flex;
            }
        }

        .TextContent {
            flex-grow: 1; /* Prend tout l'espace central */
            display: flex;
            flex-direction: column;

            .Label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #aaa;
                font-weight: 600;
                transition: color 0.2s;
            }

            .Value {
                margin: 0;
                font-size: 13px;
                color: #444; /* Gris plus lisible pour le contenu */
                font-weight: 500;
            }
        }

        .Arrow {
            font-size: 12px;
            color: #ddd;
            transition: all 0.2s ease;
        }
    }
  }
`;