import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firebaseConfig';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { FaGlassCheers, FaCalendarAlt, FaDonate, FaSpinner, FaSearch, FaUserTie, FaInfoCircle } from 'react-icons/fa';

const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
  grisMb: "#D6D6D6",
};

const FeteCard = ({ fete }) => {
    // Détermine le style en fonction du type de fête
    const getFeteStyle = (type) => {
        switch(type) {
            case 'kuma': return { label: "🎓 Effet Kuma (Fin d'études)", color: "#c9302c", bg: "#fdecea", border: "#c9302c" };
            case 'kuku': return { label: "🐣 Effet Kuku (Intégration)", color: "#856404", bg: "#fff3cd", border: "#ffeeba" };
            default: return { label: "🎉 Fête / Événement", color: "#155724", bg: "#d4edda", border: "#c3e6cb" };
        }
    };
    const style = getFeteStyle(fete.typeFete);

    return (
        <CardContainer>
            <CardHeader style={{ backgroundColor: style.color }}>
                <span className="fete-type">{style.label}</span>
                <span className="fete-date">Publié le {fete.dateCreation?.toDate().toLocaleDateString()}</span>
            </CardHeader>
            <CardBody>
                <div className="MainInfo">
                    <h2>{fete.titre}</h2>
                    <div className="DateBadge">
                        <FaCalendarAlt /> 
                        {new Date(fete.dateFete).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                
                <DescriptionBox>
                    <FaInfoCircle className="icon" />
                    <p>{fete.description}</p>
                </DescriptionBox>

                <ContributionInfo style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
                    <FaDonate />
                    <span><strong>Contribution :</strong> {fete.contribution || 'Aucune / Non spécifiée'}</span>
                </ContributionInfo>
            </CardBody>
            <CardFooter>
                <div className="Auteur">
                    <FaUserTie /> Organisé par : <strong>{fete.auteur}</strong>
                </div>
            </CardFooter>
        </CardContainer>
    );
};

export default function Fetes() {
    const [fetes, setFetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // On trie par date de création pour voir les dernières publications en premier
        const q = query(collection(db, "fetes"), orderBy("dateCreation", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFetes(fetesList);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredFetes = fetes.filter(fete => 
        fete.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fete.description && fete.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <PageContainer>
            <PageHeader>
                <div className="TitleArea">
                    <FaGlassCheers className="TitleIcon" />
                    <div className="TitleText">
                        <h1>Fêtes Organisées</h1>
                        <p>Agenda des festivités de la Maison Blanche</p>
                    </div>
                </div>
                <div className="SearchBox">
                    <FaSearch className="SearchIcon" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un événement..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </PageHeader>

            {loading ? (
                <LoadingWrapper><FaSpinner className="spin" /> Chargement des événements...</LoadingWrapper>
            ) : (
                <FetesGrid>
                    {filteredFetes.length > 0 ? (
                        filteredFetes.map(fete => <FeteCard key={fete.id} fete={fete} />)
                    ) : (
                        <NoResultWrapper>Aucun événement trouvé pour le moment.</NoResultWrapper>
                    )}
                </FetesGrid>
            )}
        </PageContainer>
    );
}

// --- STYLES ---
const PageContainer = styled.div`
    padding: 30px; background-color: #f4f7f6; min-height: 100vh; font-family: 'Poppins', sans-serif;
    animation: fadeIn 0.5s ease-out;
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const PageHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    .TitleArea { display: flex; align-items: center; gap: 15px; }
    .TitleIcon { font-size: 40px; color: ${colors.vertMb}; padding: 10px; background: ${colors.vertMbClair}; border-radius: 50%; }
    .TitleText h1 { margin: 0; font-size: 22px; color: #333; }
    .TitleText p { margin: 0; font-size: 13px; color: #777; }
    .SearchBox { position: relative; max-width: 300px; width: 100%; input { width: 100%; padding: 12px 15px 12px 40px; border-radius: 25px; border: 1px solid #ddd; font-size: 14px; outline: none; &:focus { border-color: ${colors.vertMb}; } } .SearchIcon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; } }
`;

const FetesGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;`;

const CardContainer = styled.div`background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); overflow: hidden; transition: transform 0.2s; &:hover { transform: translateY(-5px); }`;

const CardHeader = styled.div`
    padding: 12px 20px; color: white; display: flex; justify-content: space-between; align-items: center;
    .fete-type { font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
    .fete-date { font-size: 11px; opacity: 0.9; }
`;

const CardBody = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 15px;`;

const DescriptionBox = styled.div`
    display: flex; gap: 10px; font-size: 14px; color: #555; line-height: 1.5;
    .icon { color: ${colors.vertMb}; margin-top: 3px; flex-shrink: 0; }
    p { margin: 0; white-space: pre-wrap; }
`;

const ContributionInfo = styled.div`
    padding: 10px 15px; border-radius: 8px; border: 1px solid transparent; display: flex; align-items: center; gap: 10px; font-size: 14px;
    svg { font-size: 16px; }
`;

const CardFooter = styled.div`
    padding: 12px 20px; background-color: #fafafa; border-top: 1px solid #eee; font-size: 12px; color: #666;
    .Auteur { display: flex; align-items: center; gap: 8px; }
`;

const LoadingWrapper = styled.div`text-align: center; padding: 50px; font-size: 16px; color: #888; .spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
const NoResultWrapper = styled.div`text-align: center; padding: 50px; font-size: 16px; color: #aaa; grid-column: 1 / -1; background: white; border-radius: 12px;`;