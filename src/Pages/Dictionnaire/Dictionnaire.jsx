import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { FaChevronDown, FaPlus, FaSearch, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

// Importation de la référence de la base de données
import { db } from '../../firebaseConfig';
// Importation des fonctions Firestore nécessaires
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";

export default function Dictionnaire() {
  // 1. DONNÉES PAR DÉFAUT (Utilisées UNIQUEMENT si la DB est vide)
  const defaultData = [
    { mot: "Prara", Contenu: "Un embécile" },
    { mot: "Greku ou Kugre", Contenu: "Le Vagin" },
    { mot: "Zengele", Contenu: "Un distrait" },
    { mot: "Ndayo", Contenu: "La relation sexuelle" },
    { mot: "Tala", Contenu: "Une fille Brune" },
    { mot: "Lac", Contenu: "Les gros seins" },
    { mot: "Defour", Contenu: "Prendre une partie de la nourriture(Haricots) sans l'autorisation du detenteur" },
    { mot: "Effet Deyong", Contenu: "Prendre toute la nourriture d'autruit sans son autorisation" },
    { mot: "Effet Kuma", Contenu: "Une fête pour les personnes qui finient leurs études" },
    { mot: "Effet KUKU", Contenu: "La fête d'intégration" },
    { mot: "Effet Kikomo", Contenu: "Le fait d'enlever la main d'un camarade dans l'assiette" },
    { mot: "Effet Mukwege", Contenu: "Le fait d'introduire son doigt dans le vagin" },
    { mot: "Mukenge", Contenu: "Uriner" },
    { mot: "Effe Chantu", Contenu: "Préparer les oeufs 3 jours successives" },
    { mot: "Feneke", Contenu: "Un distrait, Idiot" }
  ];

  // 2. ÉTATS (STATES)
  const [dictionnaire, setDictionnaire] = useState([]); // Liste principale commence vide
  const [loading, setLoading] = useState(true); // État de chargement
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [openIds, setOpenIds] = useState({}); // Gère quels articles sont déroulés
  
  // État pour le formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMot, setNewMot] = useState("");
  const [newContenu, setNewContenu] = useState("");

  // État pour l'édition
  const [editingId, setEditingId] = useState(null);
  const [editMot, setEditMot] = useState("");
  const [editContenu, setEditContenu] = useState("");

  // Référence à la collection Firestore
  const motsCollectionRef = collection(db, "mots");

  // 3. EFFETS (USEEFFECT) - Chargement des données Firestore
  useEffect(() => {
    // Création d'une requête ordonnée par date de création (décroissant)
    const q = query(motsCollectionRef, orderBy('createdAt', 'desc'));

    // Écoute en temps réel des modifications sur la collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedData = snapshot.docs.map(doc => ({
        id: doc.id, // L'ID réel généré par Firebase
        ...doc.data()
      }));

      // --- Logique d'initialisation (Optionnelle) ---
      // Si la base est vide ET que c'est le premier chargement, 
      // on peut injecter les données par défaut.
      if (loadedData.length === 0 && loading) {
        console.log("Base de données vide. Initialisation avec les données par défaut...");
        defaultData.forEach(async (item) => {
          await addDoc(motsCollectionRef, { ...item, createdAt: serverTimestamp() });
        });
        // Note: l'onSnapshot sera rappelé automatiquement après les ajouts.
      } else {
        setDictionnaire(loadedData);
        setLoading(false); // Fin du chargement
      }
    });

    // Nettoyage de l'écouteur quand le composant est démonté
    return () => unsubscribe();
  }, [loading, motsCollectionRef, defaultData]);

  // 4. FONCTIONS D'ÉVÉNEMENTS (LOGIQUE FIREBASE)

  // Toggle afficher/masquer contenu
  const toggleArticle = (id) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // AJOUTER (Firebase addDoc)
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newMot.trim() || !newContenu.trim()) return;

    try {
      await addDoc(motsCollectionRef, {
        mot: newMot,
        // La 'cle' est supprimée, on utilise l'ID Firestore
        Contenu: newContenu,
        createdAt: serverTimestamp() // Ajout d'un timestamp serveur
      });

      // Réinitialisation formulaire (onSnapshot mettra à jour la liste)
      setNewMot("");
      setNewContenu("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  // SUPPRIMER (Firebase deleteDoc)
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce mot de la base de données ?")) {
      try {
        await deleteDoc(doc(db, "mots", id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  // Activer le mode édition
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditMot(item.mot);
    setEditContenu(item.Contenu);
    setOpenIds(prev => ({ ...prev, [item.id]: true })); // Assure que c'est ouvert
  };

  // SAUVEGARDER L'ÉDITION (Firebase updateDoc)
  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "mots", id), {
        mot: editMot,
        Contenu: editContenu
      });
      setEditingId(null); // Quitter mode édition
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  // 5. FILTRAGE POUR LA RECHERCHE (Local sur les données chargées)
  const dataFiltrer = dictionnaire.filter(item =>
    item.mot.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Contenu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 6. RENDU (JSX)
  return (
    <Diction>
      <div className="header">
        <h4>DICTIONNAIRE DE MOTS (Réel)</h4>
        
        <div className="action-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-toggle" onClick={() => setShowAddForm(!showAddForm)}>
            <FaPlus />
          </button>
        </div>
      </div>

      {showAddForm && (
        <form className="add-form Container" onSubmit={handleAddEntry}>
          <h5>Ajouter un nouveau mot</h5>
          <input 
            type="text" 
            placeholder="Le mot..." 
            value={newMot} 
            onChange={(e) => setNewMot(e.target.value)} 
            required
          />
          <textarea 
            placeholder="Le contenu..." 
            value={newContenu} 
            onChange={(e) => setNewContenu(e.target.value)}
            rows="3"
            required
          />
          <div className="form-buttons">
            <button type="submit" className="btn-save"><FaSave /> Enregistrer</button>
            <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}><FaTimes /> Annuler</button>
          </div>
        </form>
      )}

      <div className="ListContainer">
        {loading ? (
          <p className="no-result">Chargement des mots...</p>
        ) : dataFiltrer.length > 0 ? (
          dataFiltrer.map((Article) => (
            <div className="Container" key={Article.id}>
              <div className="Article">
                <div className="titre-wrapper">
                  <div className="titre" onClick={() => toggleArticle(Article.id)}>
                    {editingId === Article.id ? (
                      <input 
                        type="text" 
                        value={editMot} 
                        onChange={(e) => setEditMot(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="edit-input-mot"
                        required
                      />
                    ) : (
                      <p>{Article.mot}</p>
                    )}
                    <FaChevronDown className={`arrow-icon ${openIds[Article.id] ? 'rotate' : ''}`} />
                  </div>
                  
                  <div className="action-buttons">
                    {editingId === Article.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(Article.id)} className="btn-action save" title="Sauvegarder"><FaSave /></button>
                        <button onClick={() => setEditingId(null)} className="btn-action cancel" title="Annuler"><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(Article)} className="btn-action edit" title="Modifier"><FaEdit /></button>
                        <button onClick={() => handleDelete(Article.id)} className="btn-action delete" title="Supprimer"><FaTrash /></button>
                      </>
                    )}
                  </div>
                </div>

                <div className={`ContenuArticle ${openIds[Article.id] ? 'View' : ''}`}>
                  {editingId === Article.id ? (
                    <textarea 
                      value={editContenu} 
                      onChange={(e) => setEditContenu(e.target.value)}
                      rows="4"
                      className="edit-input-contenu"
                      required
                    />
                  ) : (
                    <p>{Article.Contenu}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-result">Aucun résultat trouvé pour "{searchTerm}"</p>
        )}
      </div>
    </Diction>
  );
}

// 7. STYLE (Inchangé par rapport au précédent, juste nettoyé)
const Diction = styled.div`
  padding: 8px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  animation: apa 0.6s ease-in;
  font-family: sans-serif;
  
  @keyframes apa {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .header {
    margin-bottom: 12px;
    font-size: 20px;
    width: 100%;
    max-width: 800px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .action-bar {
    display: flex;
    width: 100%;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 500px;
    background: white;
    border-radius: 20px;
    border: 1px solid #ccc;
    padding: 0 15px;

    .search-icon {
      color: #888;
      margin-right: 10px;
    }

    input {
      border: none;
      padding: 10px 0;
      width: 100%;
      outline: none;
      background: transparent;
      font-size: 16px;
    }
  }

  .btn-add-toggle {
    background-color: #266706;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s;
    flex-shrink: 0;

    &:hover {
      background-color: #1a4d04;
    }
  }

  .add-form {
    background: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    margin-bottom: 15px;
    max-width: 800px;
    width: 100%;
    
    h5 { margin-top: 0; margin-bottom: 10px; color: #266706; }
    
    input, textarea {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-family: inherit;
    }

    .form-buttons {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .btn-save { background-color: #266706; color: white; }
    .btn-cancel { background-color: #888; color: white; }
  }

  .ListContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .no-result {
    margin-top: 20px;
    color: #666;
    font-style: italic;
  }

  .Container {
    display: flex;
    width: 100%;
    max-width: 800px;
    flex-direction: column;

    .Article {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      border-radius: 5px;
      align-items: left;
      width: 100%;
      background: white;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);

      .titre-wrapper {
        display: flex;
        align-items: center;
        background: #D6D6D6;
        width: 100%;
      }

      .titre {
        display: flex;
        padding: 10px 15px;
        flex-grow: 1;
        color: #266706;
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
        
        p {
          margin: 0;
          font-weight: bold;
        }

        .arrow-icon {
          transition: transform 0.3s ease;
          margin-left: 10px;
        }

        .arrow-icon.rotate {
          transform: rotate(180deg);
        }
      }

      .action-buttons {
        display: flex;
        gap: 5px;
        padding-right: 10px;
        
        .btn-action {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .edit { color: #888; &:hover { background: rgba(0,0,0,0.05); color: #555; } }
        .delete { color: #d9534f; &:hover { background: #fee; } }
        .save { color: #266706; &:hover { background: #e6fffa; } }
        .cancel { color: #888; &:hover { background: rgba(0,0,0,0.05); } }
      }

      .edit-input-mot {
        font-size: 16px;
        font-weight: bold;
        color: #266706;
        border: 1px solid #aaa;
        border-radius: 4px;
        padding: 2px 5px;
        width: 90%;
        background: white;
      }

      .edit-input-contenu {
        width: 100%;
        border: 1px solid #aaa;
        border-radius: 4px;
        padding: 8px;
        font-family: inherit;
        resize: vertical;
        box-sizing: border-box;
      }

      .ContenuArticle {
        text-align: justify;
        display: none;
        padding: 15px;
        border-top: 1px solid #eee;
        
        p { margin: 0; }
      }

      .View {
        display: block;
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    }
  }
`;

// import React from 'react'
// import styled from "styled-components";
// import {FaChevronDown} from "react-icons/fa"
// export default function Dictionnaire() {
//   const Data=[
//     {
//       mot:"Prara",
//       cle:"Prara",
//       Contenu:"Un embécile"
//     },
//     {
//       mot:"Greku ou Kugre",
//       cle:"Greku",
//       Contenu:"Le Vagin "
//     },
   
//     {
//       mot:"Zengele",
//       cle:"Zengele",
//       Contenu:"Un distrait "
//     },
//     {
//       mot:"Ndayo",
//       cle:"Ndayo",
//       Contenu:"La relation sexuelle"
//     },
//     {
//       mot:"Tala",
//       cle:"Tala",
//       Contenu:"Une fille Brune"
//     },
//     {
//       mot:"Lac",
//       cle:"Lac",
//       Contenu:"Les gros seins"
//     },
//     {
//       mot:"Defour",
//       cle:"Defour",
//       Contenu:"Prendre une partie de la nourriture(Haricots) sans l'autorisation du detenteur "
//     },
//     {
//       mot:"Effet Deyong",
//       cle:"Deyong",
//       Contenu:"Prendre toute la nourriture d'autruit sans son autorisation"
//     },
//     {
//       mot:"Effet Kuma",
//       cle:"EffetKuma",
//       Contenu:"Une fête pour les personnes qui finient leurs études "
//     },
//     {
//       mot:"Effet KUKU",
//       cle:"EffetKUKU",
//       Contenu:"La fête d'intégration "
//     },
//     {
//       mot:"Effet Kikomo",
//       cle:"EffetKikomo",
//       Contenu:"Le fait d'enlever la main d'un camarade dans l'assiette "
//     },
//   {
//     mot:"Effet Mukwege",
//     cle:"EffetMukwege",
//     Contenu:"Le fait d'introduire son doigt dans le vagin "
//   },
//   {
//     mot:"Mukenge",
//     cle:"Mukenge",
//     Contenu:"Uriner "
//   },
//   {
//     mot:"Effe Chantu",
//     cle:"EffeChantu",
//     Contenu:"Préparer les oeufs 3 jours successives"
//   },
//   {
//     mot:"Feneke",
//     cle:"Feneke",
//     Contenu:"Un distrait, Idiot"
//   }
//   ]
//  function ShowClique(Cl){
//     document.querySelector("#"+Cl).classList.toggle("View");
//     console.log("."+Cl)
//   }
//   return (
//     <Diction>
//     <div className="header">
//       <h4>DICTIONNAIRE DE MOT </h4>
//     </div>
//     {
//       Data.map((Article,index)=>(
//         <div className="Container">
//       <div className="Article">
//         <div className="titre" onClick={()=>ShowClique(Article.cle)}> 
//           <p>{Article.mot}</p>
//           <FaChevronDown/>
//         </div>
//         <div className="ContenuArticle" id={Article.cle}>
         
//             <p>{Article.Contenu}</p>
          
//         </div>
//       </div>
//     </div>
//       ))
//     }
//   </Diction>
//   )
// }
// const Diction = styled.div`
// padding:8px;
// display:flex;
// width:100%;
// height:100%;
// flex-direction:column;
// align-items:center;
// animation: apa 0.6s ease-in;

// @keyframes apa {
//    0% {
//      opacity: 0;
//    }
//    100% {
//      opacity: 1;
//    }
//  }
// .header{
//   margin-bottom:12px;
//   font-size:20px;
// }
// .Container{
//   display:flex;
//   width:100%;
//   flex-direction:column;

//   .Article{
//     margin-top:10px;
//     display:flex;
//     flex-direction:column;
//     border-radius:5px;
//     padding:5px;
//     align-items:left;
//     width:100%;
//     background:white;

//     .titre
//     {
//       display:flex;
//       padding:10px;
//       width:100%;
//       background:#D6D6D6;
//       color:#266706;
//       p{
//         width:100%;

    
//       }
//     }
//     .ContenuArticle
//     {
//       text-align:justify;
//       display:none;
//     }
//     .View{
//       display:block;
//     }
//   }
// }

// `