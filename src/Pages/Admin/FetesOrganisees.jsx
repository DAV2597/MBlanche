import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firebaseConfig';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { FaGlassCheers, FaCalendarAlt, FaDonate, FaSpinner, FaSearch } from 'react-icons/fa';

const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
};

const FeteCard = ({ fete }) => {
    const getFeteTypeDetails = (type) => {
        switch(type) {
            case 'kuma': return { label: "Effet Kuma", color: "#c9302c" };
            case 'kuku': return { label: "Effet Kuku", color: "#f0ad4e" };
            default: return { label: "Fête", color: "#5bc0de" };
        }
    };
    const typeDetails = getFeteTypeDetails(fete.typeFete);

    return (
        <CardContainer>
            <CardHeader style={{ backgroundColor: typeDetails.color }}>
                <span className="fete-type">{typeDetails.label}</span>
            </CardHeader>
            <CardBody>
                <h2>{fete.titre}</h2>
                <p className="description">{fete.description}</p>
                <InfoGrid>
                    <InfoItem>
                        <FaCalendarAlt />
                        <span>{new Date(fete.dateFete).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </InfoItem>
                    <InfoItem>
                        <FaDonate />
                        <span>Contribution: <strong>{fete.contribution || 'Non spécifiée'}</strong></span>
                    </InfoItem>
                </InfoGrid>
            </CardBody>
            <CardFooter>
                Publié par {fete.auteur}
            </CardFooter>
        </CardContainer>
    );
};

export default function FetesOrganisees() {
    const [fetes, setFetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, "fetes"), orderBy("dateFete", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFetes(fetesList);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredFetes = fetes.filter(fete => 
        fete.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fete.typeFete.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer>
            <PageHeader>
                <div className="TitleArea">
                    <FaGlassCheers className="TitleIcon" />
                    <h1>Fêtes & Événements</h1>
                </div>
                <div className="SearchBox">
                    <FaSearch className="SearchIcon" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une fête..." 
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
                        <NoResultWrapper>Aucune fête ne correspond à votre recherche.</NoResultWrapper>
                    )}
                </FetesGrid>
            )}
        </PageContainer>
    );
}

// Styles
const PageContainer = styled.div`padding: 30px; background-color: #f4f7f6; min-height: 100vh; font-family: 'Poppins', sans-serif;`;
const PageHeader = styled.div`display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; .TitleArea { display: flex; align-items: center; gap: 15px; } .TitleIcon { font-size: 35px; color: ${colors.vertMb}; } h1 { margin: 0; font-size: 24px; color: #333; } .SearchBox { position: relative; max-width: 400px; width: 100%; input { width: 100%; padding: 10px 10px 10px 40px; border-radius: 20px; border: 1px solid #ddd; font-size: 15px; } .SearchIcon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; } }`;
const FetesGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px;`;
const LoadingWrapper = styled.div`text-align: center; padding: 50px; font-size: 18px; color: #888; .spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
const NoResultWrapper = styled.div`text-align: center; padding: 50px; font-size: 16px; color: #aaa; grid-column: 1 / -1;`;
const CardContainer = styled.div`background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); display: flex; flex-direction: column; overflow: hidden;`;
const CardHeader = styled.div`padding: 10px 15px; color: white; text-align: right; .fete-type { font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }`;
const CardBody = styled.div`padding: 20px; flex-grow: 1; h2 { margin: 0 0 10px 0; font-size: 18px; color: #333; } .description { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 20px; }`;
const InfoGrid = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const InfoItem = styled.div`display: flex; align-items: center; gap: 10px; font-size: 13px; color: #555; svg { color: ${colors.vertMb}; }`;
const CardFooter = styled.div`padding: 10px 20px; background-color: #fafafa; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: right; font-style: italic;`;