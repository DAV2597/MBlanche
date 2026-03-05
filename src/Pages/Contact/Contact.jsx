import React from 'react';
import styled from 'styled-components';
import { FaPhoneAlt, FaWhatsapp, FaFacebookMessenger, FaEnvelope, FaMapMarkerAlt, FaUsers, FaUserTie, FaChevronRight } from 'react-icons/fa';

// Définition des couleurs pour la cohérence de marque MB
const colors = {
  vertMb: "#266706", 
  vertMbClair: "#e9f0e6", 
  grisMb: "#D6D6D6",
};

export default function Contact() {
  // 1. DONNÉES DES CONTACTS
  const contactMethods = [
    {
      id: 1,
      type: "Vice-maire du Campus LUCIEN Bikuba",
      icon: <FaPhoneAlt />,
      value: "+243 998 653 886",
      action: "Appeler",
      link: "tel:+243998653886",
      color: "#2196F3"
    },
    {
      id: 2,
      type: "WhatsApp Officiel MB",
      icon: <FaWhatsapp />,
      value: "Maison Blanche Connect",
      action: "Discuter",
      link: "https://wa.me/243999888777",
      color: "#4CAF50"
    },
    {
      id: 3,
      type: "Messenger (Facebook)",
      icon: <FaFacebookMessenger />,
      value: "Maison Blanche Officiel",
      action: "Envoyer",
      link: "https://m.me/nomdepagefacebook",
      color: "#0084FF"
    },
    {
      id: 4,
      type: "Email du Gouvernement",
      icon: <FaEnvelope />,
      value: "barakaatosha960@gmail.com",
      action: "Écrire",
      link: "mailto:mairie.mb@campus.edu",
      color: "#f44336"
    },
    {
      id: 5,
      type: "Bureau de la Mairie",
      icon: <FaMapMarkerAlt />,
      value: "Bâtiment Lycée Wima, Mblanche",
      action: "Y aller",
      link: "#",
      color: "#795548"
    }
  ];

  // 2. DONNÉES DU MAIRE DU CAMPUS
  const maireContact = {
    nom: "Monsieur le Maire du Campus BARAKA Atosha",
    icon: <FaUserTie />,
    value: "+243 994 529 540",
    action: "Appel Direct",
    link: "tel:+243994529540",
    color: colors.vertMb // Correction ici : pas de ${}
  };

  // 3. RENDU (JSX)
  return (
    <ContactPageContainer>
      
      <PageHeader>
        <div className="HeaderContent">
          <div className="IconBadge"><FaEnvelope /></div>
          <div className="TextTitle">
            <h1>CONTACTEZ LE GOUVERNEMENT</h1>
            <p>Une question, une suggestion ou besoin d'aide ? Nous sommes à votre écoute.</p>
          </div>
        </div>
      </PageHeader>

      <ContentArea>
        
        <MaireSection>
          <h3><FaUserTie /> Contact Direct du Maire</h3>
          <p>Pour les questions urgentes ou officielles, vous pouvez contacter directement le Maire du Campus.</p>
          
          <ContactCard key="maire" accentColor={maireContact.color}>
            <div className="CardBody">
                <div className="MainIconArea" style={{ color: maireContact.color }}>
                    {maireContact.icon}
                </div>
                <div className="TextContent">
                    <h4>{maireContact.nom}</h4>
                    <p className="Value">{maireContact.value}</p>
                </div>
                <a href={maireContact.link} className="BtnAction" style={{ backgroundColor: maireContact.color }}>
                    {maireContact.action} <FaChevronRight />
                </a>
            </div>
          </ContactCard>
        </MaireSection>

        <NetworkSection>
          <h3><FaUsers /> Autres Réseaux & Services</h3>
          <p>Utilisez nos réseaux sociaux et lignes officielles pour vos demandes courantes.</p>
          
          <ContactGrid>
            {contactMethods.map((contact) => (
              <ContactCard key={contact.id} accentColor={contact.color}>
                <div className="CardBody">
                    <div className="MainIconArea" style={{ color: contact.color }}>
                        {contact.icon}
                    </div>
                    <div className="TextContent">
                        <h4>{contact.type}</h4>
                        <p className="Value">{contact.value}</p>
                    </div>
                    {contact.link !== "#" && (
                      <a href={contact.link} target={contact.link.startsWith('http') ? '_blank' : ''} rel="noopener noreferrer" className="BtnAction" style={{ backgroundColor: contact.color }}>
                          {contact.action} <FaChevronRight />
                      </a>
                    )}
                </div>
              </ContactCard>
            ))}
          </ContactGrid>
        </NetworkSection>

      </ContentArea>

    </ContactPageContainer>
  );
}

// --- STYLE (Styled-Components) ---

const ContactPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PageHeader = styled.div`
  width: 100%;
  padding: 40px 30px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);

  .HeaderContent {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 25px;

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
      h1 { margin: 0; font-size: 24px; color: #333; font-weight: 700; letter-spacing: 0.5px; }
      p { margin: 5px 0 0 0; color: #777; font-size: 15px; max-width: 600px; line-height: 1.4; }
    }
  }
`;

const ContentArea = styled.div`
  padding: 40px 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

const MaireSection = styled.div`
  margin-bottom: 40px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg { color: ${colors.vertMb}; font-size: 16px; }
  }

  p {
    margin: 0 0 20px 0;
    color: #777;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const NetworkSection = styled.div`
  h3 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg { color: ${colors.vertMb}; font-size: 16px; }
  }

  p {
    margin: 0 0 20px 0;
    color: #777;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  width: 100%;
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease-out;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.08);
    border-color: ${colors.vertMbClair};
    
    .BtnAction {
        transform: scale(1.03);
        
        svg { transform: translateX(3px); }
    }
  }

  .CardBody {
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .MainIconArea {
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 50%;
    background-color: #f9f9f9;
  }

  .TextContent {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    h4 { margin: 0; font-size: 15px; color: #333; font-weight: 600; }
    .Value { 
        margin: 2px 0 0 0; 
        color: #666; 
        font-size: 13px; 
        font-weight: 400; 
        word-break: break-all;
    }
  }

  .BtnAction {
    padding: 8px 15px;
    color: white;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all 0.3s ease-out;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;

    &:hover {
        transform: scale(1.05);
    }

    svg { 
        font-size: 10px; 
        transition: transform 0.2s ease;
    }
  }
`;