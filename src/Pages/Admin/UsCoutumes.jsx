import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { FaBookmark, FaQuoteLeft, FaSpinner } from "react-icons/fa";
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
};

const UsCoutumes = () => {
    const [coutumes, setCoutumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "coutumes"), orderBy("dateAjout", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCoutumes(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <PageContainer>
            <Header>
              <div className="HeaderContent">
                <FaBookmark className="HeaderIcon" />
                <div className="TextTitle">
                  <h1>US ET COUTUMES</h1>
                  <p className="Subtitle">Les traditions orales et les règles de vie de la Maison Blanche.</p>
                </div>
              </div>
            </Header>

            <ContentGrid>
                {loading ? (
                    <LoadingWrapper><FaSpinner className="spin" /> Chargement...</LoadingWrapper>
                ) : (
                    coutumes.map((coutume) => (
                        <CoutumeCard key={coutume.id}>
                            <div className="CardAccent" />
                            <div className="CardBody">
                                <FaQuoteLeft className="QuoteIcon" />
                                <h3>{coutume.titre}</h3>
                                <p>{coutume.description}</p>
                            </div>
                        </CoutumeCard>
                    ))
                )}
            </ContentGrid>
            
            <Footer>
                © {new Date().getFullYear()} - Gouvernement du Campus Maison Blanche
            </Footer>

        </PageContainer>
    );
}

export default UsCoutumes;

// --- STYLES ---
const PageContainer = styled.div`
  min-height: 100vh; padding: 30px; background-color: #f4f7f6;
  font-family: 'Poppins', sans-serif; animation: apa 0.6s ease-out;
  @keyframes apa { from { opacity: 0; } to { opacity: 1; } }
`;

const Header = styled.div`
  width: 100%; max-width: 900px; margin: 0 auto 30px auto; background: white;
  border-radius: 12px; padding: 25px 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  .HeaderContent { display: flex; align-items: center; gap: 20px;
    .HeaderIcon { font-size: 30px; color: ${colors.vertMb}; padding: 10px; background-color: ${colors.vertMbClair}; border-radius: 10px; }
    .TextTitle {
      h1 { margin: 0; font-size: 20px; color: #333; font-weight: 700; }
      .Subtitle { margin: 5px 0 0 0; color: #777; font-size: 13px; }
    }
  }
`;

const ContentGrid = styled.div`
  width: 100%; max-width: 900px; margin: 0 auto; display: flex;
  flex-direction: column; gap: 15px;
`;

const CoutumeCard = styled.div`
  background: white; border-radius: 10px; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.3s ease-out;
  border: 1px solid transparent; display: flex; position: relative;
  &:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.08); border-color: ${colors.vertMbClair}; }
  .CardAccent { width: 4px; background-color: ${colors.vertMb}; position: absolute; top: 0; left: 0; height: 100%; }
  .CardBody {
    padding: 20px 25px 20px 30px; flex-grow: 1; display: flex; flex-direction: column; gap: 12px;
    .QuoteIcon { font-size: 14px; color: #ddd; }
    h3 { margin: 0; font-size: 16px; color: ${colors.vertMb}; }
    p { margin: 0; font-size: 13.5px; color: #555; line-height: 1.6; text-align: justify; }
  }
`;

const Footer = styled.div`
    width: 100%; max-width: 900px; margin: 30px auto 0 auto; text-align: center;
    font-size: 11px; color: #bbb;
`;

const LoadingWrapper = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 80px; color: ${colors.vertMb};
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  background: white; border-radius: 12px; border: 1px solid #eee;
  .spin { font-size: 35px; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  p { margin: 0; font-size: 15px; font-style: italic; color: #888; }
`;