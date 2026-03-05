// src/Pages/Admin/AdminGouvernement.jsx (Imports Finalisés et Corrigés)
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


import { 
  FaUserShield, FaCamera, FaDoorOpen, FaPlusCircle, FaBook, 
  FaBullhorn, FaUsers, FaGlassCheers, FaTools, FaUserSlash, 
  FaEdit, FaSave, FaTimesCircle, FaClock, FaSpinner, FaTrash, 
  FaQrcode, FaVideo, FaSearch, FaBroom, FaUserAstronaut, 
  FaDonate, FaCheck, FaHeartBroken, 
  FaIdCard, FaCalendarAlt // Ajoutés pour l'horaire de fête
} from 'react-icons/fa';

// --- IMPORT FIREBASE (Mise à jour complète) ---
import { db } from '../../firebaseConfig'; 
// Ajout de query, orderBy, updateDoc, setDoc pour le dynamisme
import { 
  collection, addDoc, serverTimestamp, onSnapshot, 
  doc, deleteDoc, updateDoc, query, orderBy, setDoc 
} from "firebase/firestore";
// -----------------------------------------------

// Configuration locale (Assurez-vous que ce fichier existe)
import { PERMISSIONS } from '../../config/gouvernementConfig'; 

// =========================================================================
// Couleurs MB (Définition unique pour tout le fichier)
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6", // Ajouté pour les styles de fête
  colors_fete: "#e9f0e6", // Correction pour cohérence
  grisMb: "#D6D6D6",
};

// =========================================================================
// 1. DÉFINITION DES FORMULAIRES (Composants Graphiques / JSX pur)
// Ces composants ne font qu'afficher les données reçues via les props.
// =========================================================================

// -- Commun : Publier un communiqué --
const FormPublierCommuniqué = ({ titre, setTitre, contenu, setContenu, onSubmit, loading, onClose }) => (
  <FormContainer>
    <h3><FaBullhorn /> Publier un communiqué (Public)</h3>
    <p>Ce communiqué sera visible par tous les membres (public).</p>
    <input type="text" placeholder="Titre du communiqué..." value={titre} onChange={(e) => setTitre(e.target.value)} />
    <textarea placeholder="Contenu du communiqué..." rows="5" value={contenu} onChange={(e) => setContenu(e.target.value)}></textarea>
    <div className="FormButtons">
      <button className="BtnSave" onClick={onSubmit} disabled={loading}>
        {loading ? <FaSpinner className="spin" /> : <FaSave />} Publier
      </button>
      <button className="BtnCancel" onClick={onClose} disabled={loading}><FaTimesCircle /> Annuler</button>
    </div>
  </FormContainer>
);

// -- Commun : Lancer Règlement (ROI) --
const FormLancerRèglement = ({ titre, setTitre, contenu, setContenu, onSubmit, loading, onClose }) => (
    <FormContainer>
      <h3><FaBook /> Lancer de nouveaux règlements (R.O.I.)</h3>
      <p>Proposez ou publiez de nouvelles règles pour la vie en communauté.</p>
      <input type="text" placeholder="Titre du règlement ou de la règle..." value={titre} onChange={(e) => setTitre(e.target.value)} />
      <textarea placeholder="Contenu détaillé du règlement..." rows="6" value={contenu} onChange={(e) => setContenu(e.target.value)}></textarea>
      <div className="FormButtons">
        <button className="BtnSave" onClick={onSubmit} disabled={loading}>
          {loading ? <FaSpinner className="spin" /> : <FaSave />} Enregistrer Règlement
        </button>
        <button className="BtnCancel" onClick={onClose} disabled={loading}><FaTimesCircle /> Annuler</button>
      </div>
    </FormContainer>
);

// -- Admin : Gérer les Fêtes (CRUD complet) --
const FormGererFetes = ({ onClose, userName }) => {
    const [fetes, setFetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFete, setEditingFete] = useState(null); // null for new, or fete object for editing

    // Form states
    const [titre, setTitre] = useState('');
    const [typeFete, setTypeFete] = useState('kuma'); // kuma, kuku
    const [dateFete, setDateFete] = useState('');
    const [contribution, setContribution] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Read fetes from Firestore
    useEffect(() => {
        const q = query(collection(db, "fetes"), orderBy("dateCreation", "desc"));
        const unsubscribe = onSnapshot(q, snapshot => {
            setFetes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Set form when editingFete changes
    useEffect(() => {
        if (editingFete && editingFete.id) {
            setTitre(editingFete.titre || '');
            setTypeFete(editingFete.typeFete || 'kuma');
            setDateFete(editingFete.dateFete || '');
            setContribution(editingFete.contribution || '');
            setDescription(editingFete.description || '');
        } else {
            // Reset form for new fete
            setTitre(''); setTypeFete('kuma'); setDateFete(''); setContribution(''); setDescription('');
        }
    }, [editingFete]);

    const handleSubmit = async () => {
        if (!titre || !dateFete) return toast.error("Le titre et la date sont requis.");
        setIsSubmitting(true);
        const feteData = { titre, typeFete, dateFete, contribution, description, auteur: userName };

        try {
            if (editingFete && editingFete.id) {
                await updateDoc(doc(db, "fetes", editingFete.id), feteData);
                toast.success("Fête mise à jour !");
            } else {
                await addDoc(collection(db, "fetes"), { ...feteData, dateCreation: serverTimestamp(), likes: 0, commentaires: 0 });
                toast.success("Nouvelle fête publiée !");
            }
            setEditingFete(null); // Close form and go back to list
        } catch (e) {
            toast.error("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette fête ?")) {
            await deleteDoc(doc(db, "fetes", id));
            toast.success("Fête supprimée.");
        }
    };

    if (editingFete) {
        return (
            <FormContainer>
                <h3>{editingFete.id ? <FaEdit /> : <FaPlusCircle />} {editingFete.id ? "Modifier la Fête" : "Organiser une Fête"}</h3>
                <input type="text" placeholder="Nom de la fête (ex: Effet Kuma de X)" value={titre} onChange={e => setTitre(e.target.value)} />
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <select value={typeFete} onChange={e => setTypeFete(e.target.value)}>
                        <option value="kuma">Effet Kuma (Fin d'études)</option>
                        <option value="kuku">Effet Kuku (Intégration)</option>
                        <option value="autre">Autre Fête</option>
                    </select>
                    <input type="date" value={dateFete} onChange={e => setDateFete(e.target.value)} />
                </div>
                <input type="text" placeholder="Montant contribution (ex: 10$ ou 'En nature')" value={contribution} onChange={e => setContribution(e.target.value)} />
                <textarea placeholder="Description, programme, infos importantes..." rows="4" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                <div className="FormButtons">
                    <button className="BtnSave" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? <FaSpinner className="spin" /> : <FaSave />} {editingFete.id ? "Mettre à jour" : "Publier"}</button>
                    <button className="BtnCancel" onClick={() => setEditingFete(null)} disabled={isSubmitting}><FaTimesCircle /> Annuler</button>
                </div>
            </FormContainer>
        );
    }

    return (
        <FormContainer>
            <h3><FaGlassCheers /> Gestion des Fêtes</h3>
            <ActionButton onClick={() => setEditingFete({})} style={{width: '100%', marginBottom: '20px'}}>
                <FaPlusCircle /> Organiser une nouvelle fête
            </ActionButton>
            <DeleteListContainer>
                {loading ? <div className="LoadingList"><FaSpinner className="spin"/></div> :
                 fetes.map(fete => (
                    <DeleteUserItem key={fete.id}>
                        <div className="UserInfo">
                            <span className="UserName">{fete.titre} ({fete.typeFete})</span>
                            <span className="UserMeta">Date: {fete.dateFete} - Contrib: {fete.contribution || 'N/A'}</span>
                        </div>
                        <div>
                            <BtnIcon onClick={() => setEditingFete(fete)}><FaEdit /></BtnIcon>
                            <BtnIconDanger onClick={() => handleDelete(fete.id)}><FaTrash /></BtnIconDanger>
                        </div>
                    </DeleteUserItem>
                 ))}
            </DeleteListContainer>
            <div className="FormButtons"><button className="BtnCancel" onClick={onClose}><FaTimesCircle /> Fermer</button></div>
        </FormContainer>
    );
};

// -- Admin : Gérer les Deuils --
const FormGererDeuils = ({ onClose, userName }) => {
    const [deuils, setDeuils] = useState([]);
    const [loadingDeuils, setLoadingDeuils] = useState(true);
    const [activeDeuil, setActiveDeuil] = useState(null);
    const [view, setView] = useState('list');
    const [deuilTitre, setDeuilTitre] = useState('');
    const [deuilDate, setDeuilDate] = useState(new Date().toISOString().split('T')[0]);
    const [users, setUsers] = useState([]);
    const [contributions, setContributions] = useState({});
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (view === 'list') {
            const q = query(collection(db, "deuils"), orderBy("dateCreation", "desc"));
            const unsubscribe = onSnapshot(q, snapshot => {
                setDeuils(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoadingDeuils(false);
            });
            return () => unsubscribe();
        }
    }, [view]);

    useEffect(() => {
        if (view === 'manage' && activeDeuil) {
            setLoadingUsers(true);
            const usersUnsub = onSnapshot(collection(db, "utilisateurs"), uSnap => setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() }))));
            const contribsUnsub = onSnapshot(collection(db, "deuils", activeDeuil.id, "contributions"), cSnap => {
                const cData = {}; cSnap.forEach(doc => { cData[doc.id] = doc.data(); });
                setContributions(cData); setLoadingUsers(false);
            });
            return () => { usersUnsub(); contribsUnsub(); };
        }
    }, [view, activeDeuil]);

    const handleCreateDeuil = async () => {
        if (!deuilTitre) return toast.error("Le titre est requis.");
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "deuils"), { titre: deuilTitre, dateDeuil: deuilDate, creePar: userName, dateCreation: serverTimestamp(), statut: 'ouvert' });
            toast.success("Événement de deuil créé."); setView('list'); setDeuilTitre('');
        } catch (e) { toast.error("Erreur."); } finally { setIsSubmitting(false); }
    };
    
    const handleSaveContribution = async (userId, userData, newMontant, newDescription) => {
        if (!activeDeuil) return;
        const contribRef = doc(db, "deuils", activeDeuil.id, "contributions", userId);
        try {
            await setDoc(contribRef, { montant: newMontant || 0, description: newDescription || '', nomContributeur: userData.nomComplet, dateContribution: serverTimestamp() }, { merge: true });
            toast.success(`Contribution pour ${userData.nomComplet} enregistrée.`);
        } catch (e) { toast.error("Erreur d'enregistrement."); }
    };

    if (view === 'create') return (
        <FormContainer>
            <h3><FaPlusCircle /> Créer un événement de deuil</h3>
            <input type="text" placeholder="Titre (ex: Deuil famille Y)" value={deuilTitre} onChange={e => setDeuilTitre(e.target.value)} />
            <input type="date" value={deuilDate} onChange={e => setDeuilDate(e.target.value)} />
            <div className="FormButtons">
                <button className="BtnSave" onClick={handleCreateDeuil} disabled={isSubmitting}>{isSubmitting ? <FaSpinner className="spin"/> : "Créer"}</button>
                <button className="BtnCancel" onClick={() => setView('list')}>Annuler</button>
            </div>
        </FormContainer>
    );

    if (view === 'manage') return (
        <FormContainer>
            <h3><FaDonate /> Gérer les contributions pour : {activeDeuil.titre}</h3>
            <DeleteListContainer style={{maxHeight: '400px'}}>
                {loadingUsers ? <div className="LoadingList"><FaSpinner className="spin"/></div> :
                 users.map(user => {
                     const contrib = contributions[user.id] || {};
                     return (
                        <DeleteUserItem key={user.id} style={{background: contrib.dateContribution ? colors.vertMbClair : 'white'}}>
                            <div className="UserInfo"><span className="UserName">{user.nomComplet}</span><span className="UserMeta">{user.type}</span></div>
                            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                                <input type="number" placeholder="Montant" style={{width: '80px', margin: 0}} defaultValue={contrib.montant || ''} onBlur={e => handleSaveContribution(user.id, user, e.target.value, document.getElementById(`desc-${user.id}`).value)} />
                                <input type="text" id={`desc-${user.id}`} placeholder="Nature" style={{width: '120px', margin: 0}} defaultValue={contrib.description || ''} onBlur={e => handleSaveContribution(user.id, user, document.querySelector(`input[defaultValue='${contrib.montant || ''}']`).value, e.target.value)} />
                                {contrib.dateContribution && <FaCheck style={{color: colors.vertMb}} title="A contribué" />}
                            </div>
                        </DeleteUserItem>
                     )
                 })}
            </DeleteListContainer>
            <div className="FormButtons"><button className="BtnCancel" onClick={() => setView('list')}>Retour</button></div>
        </FormContainer>
    );

    return (
        <FormContainer>
            <h3><FaHeartBroken /> Gestion des Deuils</h3>
            <ActionButton onClick={() => setView('create')} style={{width: '100%', marginBottom: '20px'}}><FaPlusCircle /> Créer un événement de deuil</ActionButton>
            <DeleteListContainer>
                {loadingDeuils ? <div className="LoadingList"><FaSpinner className="spin"/></div> :
                 deuils.map(d => (
                    <DeleteUserItem key={d.id} style={{cursor: 'pointer'}} onClick={() => { setActiveDeuil(d); setView('manage'); }}>
                        <div className="UserInfo"><span className="UserName">{d.titre}</span><span className="UserMeta">Créé le: {new Date(d.dateCreation?.toDate()).toLocaleDateString()} - Statut: {d.statut}</span></div>
                        <FaEdit />
                    </DeleteUserItem>
                 ))}
            </DeleteListContainer>
            <div className="FormButtons"><button className="BtnCancel" onClick={onClose}><FaTimesCircle /> Fermer</button></div>
        </FormContainer>
    );
};

// -- Admin : UNIQUE pour AJOUTER (Boulet ou Ancien) --
const FormAjouterUtilisateur = ({ type, nom, setNom, origine, setOrigine, codeBarre, setCodeBarre, onSubmit, loading, onClose }) => (
    <FormContainer>
      <h3><FaPlusCircle /> Ajouter un {type === 'boulet' ? 'Nouveau Boulet' : 'Ancien'}</h3>
      <p>Remplissez l'identité complète. Il apparaîtra directement dans le menu correspondant.</p>
      <input type="text" placeholder="Nom complet..." value={nom} onChange={(e) => setNom(e.target.value)} />
      <input type="text" placeholder={type === 'boulet' ? 'Origine (Ville)...' : 'Promotion (ex: 2018-2021)...'} value={origine} onChange={(e) => setOrigine(e.target.value)} />
      
      <div className="InputWithIcon">
          <FaQrcode className="InputIcon" />
          <input type="text" placeholder="Code barre de la carte (unique)..." value={codeBarre} onChange={(e) => setCodeBarre(e.target.value)} />
      </div>
  
      <div className="FormButtons">
        <button className="BtnSave" onClick={onSubmit} disabled={loading}>
          {loading ? <FaSpinner className="spin" /> : <FaSave />} Enregistrer
        </button>
        <button className="BtnCancel" onClick={onClose} disabled={loading}><FaTimesCircle /> Annuler</button>
      </div>
    </FormContainer>
);

// -- Admin : Nouveau Formulaire de Suppression Centralisé (Recherche + Liste + Cocher) --
const FormChasserGens = ({ search, setSearch, users, loadingUsers, selected, onCheck, onSubmit, loading, onClose }) => (
    <FormContainer>
      <h3 className="DangerText"><FaUserSlash /> Chasser / Supprimer les gens (Définitif)</h3>
      <p>Recherchez et cochez les personnes (Anciens ou Boulets) à supprimer définitivement de la base de données.</p>
      
      {/* Zone de recherche Premium */}
      <div className="SearchBox Delete">
          <FaSearch className="SearchIcon" />
          <input 
              type="text" 
              placeholder="Rechercher par nom ou matricule..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
      </div>
  
      {/* Liste des utilisateurs avec cases à cocher */}
      <DeleteListContainer>
          {loadingUsers ? (
              <div className="LoadingList"><FaSpinner className="spin" /> Chargement...</div>
          ) : users.length > 0 ? (
              users.map(user => (
                  <DeleteUserItem key={user.id} className={user.type === 'boulet' ? 'isBoulet' : 'isAncien'}>
                      <input 
                          type="checkbox" 
                          checked={selected[user.id] || false} 
                          onChange={() => onCheck(user.id)} 
                      />
                      <div className="UserInfo">
                          <span className="UserName">{user.nomComplet}</span>
                          <span className="UserMeta">{user.matricule} - {user.type === 'boulet' ? 'Nouveau' : 'Ancien'}</span>
                      </div>
                  </DeleteUserItem>
              ))
          ) : (
              <div className="NoResultList">Aucun utilisateur trouvé pour "{search}".</div>
          )}
      </DeleteListContainer>
  
      <p className="DangerWarn">Attention, cette action est irréversible. Ils disparaîtront des annuaires.</p>
      
      <div className="FormButtons">
        <button className="BtnDanger" onClick={onSubmit} disabled={loading || loadingUsers}>
          {loading ? <FaSpinner className="spin" /> : <FaTrash />} Confirmer la suppression
        </button>
        <button className="BtnCancel" onClick={onClose} disabled={loading}><FaTimesCircle /> Annuler</button>
      </div>
    </FormContainer>
);

// --- NOUVEAU FORMULAIRE : Modifier Enregistrement (Anciens / Nouveaux) ---
const FormModifierEnregistrement = ({ onClose }) => {
    const [subTab, setSubTab] = useState('anciens'); // 'anciens' ou 'nouveaux'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // L'utilisateur en cours de modification
    const [editForm, setEditForm] = useState({}); // Données du formulaire

    // Chargement des données en temps réel
    useEffect(() => {
        setLoading(true);
        // On écoute la collection 'utilisateurs'
        const unsubscribe = onSnapshot(collection(db, "utilisateurs"), (snapshot) => {
            const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Filtrage local selon l'onglet (ancien ou boulet)
            const typeFilter = subTab === 'anciens' ? 'ancien' : 'boulet';
            const filtered = allUsers.filter(u => u.type === typeFilter);
            setUsers(filtered);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [subTab]);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm(user); // Pré-remplir le formulaire
    };

    const handleSave = async () => {
        if (!editingUser) return;
        try {
            await updateDoc(doc(db, "utilisateurs", editingUser.id), editForm);
            toast.success("Modifications enregistrées avec succès !");
            setEditingUser(null); // Fermer le modal
        } catch (e) {
            console.error(e);
            toast.error("Erreur lors de la modification.");
        }
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    return (
        <FormContainer>
            <h3><FaEdit /> Modifier un enregistrement</h3>
            
            {/* Onglets */}
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <ActionButton onClick={() => setSubTab('anciens')} style={{flex: 1, background: subTab === 'anciens' ? colors.vertMb : 'white', color: subTab === 'anciens' ? 'white' : '#555', borderColor: colors.vertMb}}>
                    <FaUsers /> Anciens
                </ActionButton>
                <ActionButton onClick={() => setSubTab('nouveaux')} style={{flex: 1, background: subTab === 'nouveaux' ? colors.vertMb : 'white', color: subTab === 'nouveaux' ? 'white' : '#555', borderColor: colors.vertMb}}>
                    <FaUserAstronaut /> Nouveaux
                </ActionButton>
            </div>

            {/* Liste */}
            <DeleteListContainer>
                {loading ? <div className="LoadingList"><FaSpinner className="spin"/> Chargement...</div> : 
                 users.map(user => (
                    <DeleteUserItem key={user.id} style={{borderLeft: `4px solid ${subTab === 'anciens' ? colors.vertMb : '#f0ad4e'}`}}>
                        <div className="UserInfo">
                            <span className="UserName">{user.nomComplet}</span>
                            <span className="UserMeta">{user.originePromotion} - {user.matricule}</span>
                        </div>
                        <BtnIcon onClick={() => handleEditClick(user)} title="Modifier"><FaEdit /></BtnIcon>
                    </DeleteUserItem>
                 ))}
            </DeleteListContainer>

            {/* MODAL DE MODIFICATION */}
            {editingUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', zIndex: 2000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
                }}>
                    <div style={{
                        background: 'white', padding: '25px', borderRadius: '12px',
                        width: '100%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        animation: 'fadeInForm 0.3s ease-out'
                    }}>
                        <h3 style={{marginTop: 0, color: colors.vertMb, borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                            Modifier {subTab === 'anciens' ? "l'Ancien" : "le Nouveau"}
                        </h3>
                        
                        <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px'}}>Nom Complet</label>
                        <input name="nomComplet" value={editForm.nomComplet || ''} onChange={handleChange} style={{width:'100%', padding:'10px', marginBottom:'15px', border:'1px solid #ddd', borderRadius:'5px'}} />
                        
                        <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px'}}>Promotion / Origine</label>
                        <input name="originePromotion" value={editForm.originePromotion || ''} onChange={handleChange} style={{width:'100%', padding:'10px', marginBottom:'15px', border:'1px solid #ddd', borderRadius:'5px'}} />
                        
                        <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px'}}>Matricule / Code Barre</label>
                        <input name="matricule" value={editForm.matricule || ''} onChange={handleChange} style={{width:'100%', padding:'10px', marginBottom:'15px', border:'1px solid #ddd', borderRadius:'5px'}} />

                        <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px'}}>Chambre (Optionnel)</label>
                        <input name="chambre" value={editForm.chambre || ''} onChange={handleChange} placeholder="Numéro de chambre" style={{width:'100%', padding:'10px', marginBottom:'15px', border:'1px solid #ddd', borderRadius:'5px'}} />

                        <div className="FormButtons" style={{marginTop: '20px'}}>
                            <button className="BtnSave" onClick={handleSave}><FaSave /> Enregistrer</button>
                            <button className="BtnCancel" onClick={() => setEditingUser(null)}><FaTimesCircle /> Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="FormButtons">
                <button className="BtnCancel" onClick={onClose}><FaTimesCircle /> Fermer</button>
            </div>
        </FormContainer>
    );
};

// --- NOUVEAU FORMULAIRE : Publier Horaire Assainissement (Relié à HoraireAssainisseur.jsx) ---
const FormPublierHoraire = ({ date, setDate, boulets, setBoulets, onSubmit, loading, onClose }) => {
    const updateBoulet = (index, field, value) => {
        const newBoulets = [...boulets];
        newBoulets[index][field] = value;
        setBoulets(newBoulets);
    };

    return (
        <FormContainer>
            <h3><FaBroom /> Publier l'Horaire d'Assainissement</h3>
            <p>Définissez l'équipe de propreté qui apparaîtra dans le menu "Horaires".</p>
            
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ marginBottom: '15px' }} />
            
            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
                {boulets.map((boulet, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', width: '25px', color: '#777' }}>#{index + 1}</span>
                        <input type="text" placeholder="Nom du boulet..." value={boulet.nom} onChange={(e) => updateBoulet(index, 'nom', e.target.value)} style={{ margin: 0, flex: 1 }} />
                        <input type="text" placeholder="Tâche (ex: Douche)..." value={boulet.tache} onChange={(e) => updateBoulet(index, 'tache', e.target.value)} style={{ margin: 0, flex: 1 }} />
                    </div>
                ))}
            </div>

            <div className="FormButtons">
                <button className="BtnSave" onClick={onSubmit} disabled={loading}>
                    {loading ? <FaSpinner className="spin" /> : <FaSave />} Publier l'Horaire
                </button>
                <button className="BtnCancel" onClick={onClose} disabled={loading}><FaTimesCircle /> Annuler</button>
            </div>
        </FormContainer>
    );
};

// -- Modules non implémentés (Placeholder) --
const FormDefault = ({ moduleName, onClose }) => (
    <FormContainer>
      <h3>Module : {moduleName}</h3>
      <p>Le formulaire correspondant à cette action ({moduleName}) est en cours de développement.</p>
      <div className="FormButtons">
        <button className="BtnCancel" onClick={onClose}><FaTimesCircle /> Fermer</button>
      </div>
    </FormContainer>
);
// =========================================================================


// =========================================================================
// 2. COMPOSANT INTERNE : AdminModuleManager (Cerveau Logique)
// Son rôle : Gérer les états et les fonctions Firebase
// =========================================================================
const AdminModuleManager = ({ activeModule, onClose, userName }) => {
  // ÉTAT DE CHARGEMENT
  const [loading, setLoading] = useState(false);

  // ÉTATS DES FORMULAIRES (Partagés ou spécifiques)
  // -- Communs : Titre + Texte long (Communiqué, Règlement, Fête, Travaux) --
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState(''); // description, contenu, motif

  // -- Admin : Ajouter Boulet / Ancien (Identité) --
  const [userNom, setUserNom] = useState('');
  const [userOrigine, setUserOrigine] = useState('');
  const [userCodeBarre, setUserCodeBarre] = useState('');

  // -- Publier Horaire Assainissement (Nouveau) --
  const [horaireDate, setHoraireDate] = useState(new Date().toISOString().split('T')[0]);
  const [horaireBoulets, setHoraireBoulets] = useState([
      { nom: '', tache: 'Nettoyage Couloir', matricule: '---' },
      { nom: '', tache: 'Nettoyage Douche', matricule: '---' },
      { nom: '', tache: 'Nettoyage Toilettes', matricule: '---' },
      { nom: '', tache: 'Vider Poubelles', matricule: '---' },
      { nom: '', tache: 'Eau', matricule: '---' },
      { nom: '', tache: 'Autre', matricule: '---' }
  ]);

  // -- Admin : Suppression centralisée (États de recherche/liste) --
  const [allUsers, setAllUsers] = useState([]); // Stocke tous les utilisateurs (anciens + boulets)
  const [searchDelete, setSearchDelete] = useState(''); // Terme de recherche
  const [selectedUsers, setSelectedUsers] = useState({}); // Stocke les ID cochés {id: true, ...}
  const [loadingUsers, setLoadingUsers] = useState(false); // Chargement de la liste


  // =======================================================================
  // LOGIQUE FIREBASE : Lecture Temps Réel (onSnapshot)
  // =======================================================================

  // EFFET : Charger tous les utilisateurs pour le module de suppression
  useEffect(() => {
    if (activeModule === 'ChasserGens') {
      setLoadingUsers(true);
      // Référence à la collection "utilisateurs"
      const usersCollection = collection(db, "utilisateurs");
      
      // Écouteur en temps réel
      const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllUsers(list);
        setLoadingUsers(false);
      }, (error) => {
        console.error(error);
        toast.error("Erreur lors du chargement des utilisateurs.");
        setLoadingUsers(false);
      });

      return () => unsubscribe(); // Nettoyage
    }
  }, [activeModule]);


  // =======================================================================
  // FONCTIONS DE SOUMISSION VERS FIREBASE (addDoc)
  // =======================================================================

  // 1. Soumettre Communiqué (collection "communiques")
  const submitCommuniqué = async () => {
    if (!titre || !contenu) {
      toast.error("Veuillez remplir tous les champs du communiqué.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "communiques"), {
        titre: titre,
        contenu: contenu,
        auteur: userName,
        dateCreation: serverTimestamp(),
        type: 'public'
      });
      toast.success("Communiqué publié avec succès !");
      setTitre(''); setContenu(''); // Reset
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Soumettre Règlement (collection "reglements")
  const submitRèglement = async () => {
    if (!titre || !contenu) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "reglements"), {
        titre: titre,
        contenu: contenu,
        auteur: userName,
        datePublication: serverTimestamp(),
      });
      toast.success("Règlement enregistré au R.O.I. !");
      setTitre(''); setContenu(''); // Reset
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Erreur d'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Soumettre Nouvel Utilisateur (collection "utilisateurs", type: 'boulet' ou 'ancien')
  const submitAjouterUtilisateur = async (type) => {
    if (!userNom || !userOrigine || !userCodeBarre) {
      toast.error("Veuillez remplir tous les champs d'identité.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "utilisateurs"), {
        nomComplet: userNom,
        originePromotion: userOrigine, // Servira d'origine pour boulet, de promo pour ancien
        matricule: userCodeBarre, // Utilisation du code barre comme matricule unique
        type: type, // 'boulet' ou 'ancien'
        ajoutePar: userName,
        dateEnregistrement: serverTimestamp(),
        statut: 'actif'
      });
      toast.success(`Nouveau ${type === 'boulet' ? 'Boulet' : 'Ancien'} enregistré !`);
      setUserNom(''); setUserOrigine(''); setUserCodeBarre(''); // Reset
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'enregistrement. Vérifiez le code barre (unique).");
    } finally {
      setLoading(false);
    }
  };

  // 6. Soumettre Horaire Assainissement (collection "horaires_assainissement")
  const submitHoraire = async () => {
    if (!horaireDate) {
        toast.error("Veuillez choisir une date.");
        return;
    }
    // On ne garde que les lignes où un nom est entré
    const activeBoulets = horaireBoulets.filter(b => b.nom.trim() !== "");
    if (activeBoulets.length === 0) {
        toast.error("Veuillez assigner au moins un boulet.");
        return;
    }

    setLoading(true);
    try {
        await addDoc(collection(db, "horaires_assainissement"), {
            dateValidite: horaireDate,
            superviseur: userName,
            statut: 'confirme',
            boulets: activeBoulets,
            dateCreation: serverTimestamp()
        });
        toast.success("L'horaire a été publié et est visible dans le menu !");
        onClose();
    } catch (e) {
        console.error(e);
        toast.error("Erreur lors de la publication.");
    } finally {
        setLoading(false);
    }
  };


  // =======================================================================
  // LOGIQUE DE SUPPRESSION (deleteDoc)
  // =======================================================================

  // L1 : Gestion de la recherche
  const usersToDisplay = allUsers.filter(user =>
    user.nomComplet.toLowerCase().includes(searchDelete.toLowerCase()) ||
    user.matricule.toLowerCase().includes(searchDelete.toLowerCase())
  );

  // L2 : Gestion du cochage
  const handleCheckUser = (id) => {
    setSelectedUsers(prev => ({
      ...prev,
      [id]: !prev[id] // Inverse la valeur (coche/décoche)
    }));
  };

  // L3 : Supprimer définitivement les utilisateurs cochés
  const submitDeleteSelected = async () => {
    // Récupère la liste des ID cochés
    const idsToDelete = Object.keys(selectedUsers).filter(id => selectedUsers[id]);

    if (idsToDelete.length === 0) {
      toast.info("Veuillez sélectionner au moins une personne à supprimer.");
      return;
    }

    if (!window.confirm(`Confirmez-vous la suppression DÉFINITIVE de ces ${idsToDelete.length} personnes ? Cette action est irréversible.`)) {
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    // Suppression en boucle (plus simple que les batched writes pour commencer)
    for (const id of idsToDelete) {
      try {
        const userDocRef = doc(db, "utilisateurs", id);
        await deleteDoc(userDocRef); // Suppression vraie dans Firebase
        successCount++;
      } catch (e) {
        console.error(`Erreur suppression ${id}:`, e);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} personnes supprimées avec succès.`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} erreurs lors de la suppression.`);
    }

    setSelectedUsers({}); // Réinitialise la sélection
    setSearchDelete(''); // Réinitialise la recherche
    setLoading(false);
    onClose();
  };


  // =======================================================================
  // LOGIQUE DE SÉLECTION : Le "Switch" qui dessine le bon formulaire
  // =======================================================================
  switch (activeModule) {
    // --- MODULES COMMUNS ---
    case 'PublierCommuniqué':
      return <FormPublierCommuniqué titre={titre} setTitre={setTitre} contenu={contenu} setContenu={setContenu} onSubmit={submitCommuniqué} loading={loading} onClose={onClose} />;
    
    case 'NouveauRèglement':
      return <FormLancerRèglement titre={titre} setTitre={setTitre} contenu={contenu} setContenu={setContenu} onSubmit={submitRèglement} loading={loading} onClose={onClose} />;
    
    case 'PublierHoraire':
      return (
        <FormPublierHoraire 
            date={horaireDate} setDate={setHoraireDate} 
            boulets={horaireBoulets} setBoulets={setHoraireBoulets} 
            onSubmit={submitHoraire} loading={loading} onClose={onClose} 
        />
      );
    
    // --- MODULES RÉSERVÉS (Maire & Vice-Maire) ---
    case 'NouveauBoulet':
      return (
        <FormAjouterUtilisateur 
          type="boulet" nom={userNom} setNom={setUserNom}
          origine={userOrigine} setOrigine={setUserOrigine}
          codeBarre={userCodeBarre} setCodeBarre={setUserCodeBarre}
          onSubmit={() => submitAjouterUtilisateur('boulet')} loading={loading} onClose={onClose}
        />
      );
    case 'GererAnciens':
      return (
        <FormAjouterUtilisateur 
          type="ancien" nom={userNom} setNom={setUserNom}
          origine={userOrigine} setOrigine={setUserOrigine}
          codeBarre={userCodeBarre} setCodeBarre={setUserCodeBarre}
          onSubmit={() => submitAjouterUtilisateur('ancien')} loading={loading} onClose={onClose}
        />
      );
    case 'ChasserGens':
      return (
        <FormChasserGens 
          search={searchDelete} setSearch={setSearchDelete}
          users={usersToDisplay} loadingUsers={loadingUsers}
          selected={selectedUsers} onCheck={handleCheckUser}
          onSubmit={submitDeleteSelected} loading={loading} onClose={onClose}
        />
      );
    case 'OrganiserFete':
      // Utilisation du formulaire complet (Liste + Ajout)
      return <FormGererFetes onClose={onClose} userName={userName} />;

    case 'ModifierEnregistrement':
      return <FormModifierEnregistrement onClose={onClose} />;
    
    default: return <FormDefault moduleName={activeModule} onClose={onClose} />;
  }
};
// =========================================================================


// =========================================================================
// 3. COMPOSANT PRINCIPAL : AdminGouvernement
// =========================================================================
export default function AdminGouvernement() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Référence pour l'upload d'image caché

  // ÉTATS DE LA PAGE
  const [session, setSession] = useState(null); // Stocke les infos de connexion si valides
  const [activeModule, setActiveModule] = useState(null); // Module actuellement affiché
  const [profilePic, setProfilePic] = useState(null); // Photo de profil (base64)

  // --- EFFET : Sécurisation de la page (Vérification session) ---
  useEffect(() => {
    const storedSession = JSON.parse(localStorage.getItem('govSession'));
    if (!storedSession || !storedSession.connected) {
      console.warn("Accès refusé. Redirection.");
      navigate('/App/Accueil'); 
    } else {
      setSession(storedSession);
      // Récupération photo profil locale
      const storedPic = localStorage.getItem(`govProfilePic_${storedSession.role}`);
      if (storedPic) setProfilePic(storedPic);
    }
  }, [navigate]);

  // LOGIQUE : Photo de profil
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String); // Affiche l'image
        localStorage.setItem(`govProfilePic_${session.role}`, base64String);
      };
      reader.readAsDataURL(file); // Convertit l'image en chaîne base64
    } else {
      alert("Voulez-vous sélectionner un fichier image valide ?");
    }
  };

  // LOGIQUE : Déconnexion
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vous déconnecter de l'espace gouvernement ?")) {
      localStorage.removeItem('govSession'); // Efface la session
      navigate('/App/Accueil'); // Redirige
    }
  };

  // LOGIQUE : Vérification des permissions Admin
  const isAdmin = () => {
    return session && session.permission === PERMISSIONS.ADMIN;
  };

  // RENDU DE SÉCURITÉ : Si la session n'est pas encore chargée, on n'affiche rien
  if (!session) return null;

  // RENDU NORMAL (JSX)
  return (
    <AdminContainer>
      
      {/* HEADER DE PROFIL : Photo, Nom, Rôle */}
      <ProfileHeader>
        <div className="InfoUser">
          <div className="AvatarWrapper" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            {profilePic ? (
              <img src={profilePic} alt="Profil" className="ProfilePic" />
            ) : (
              <div className="DefaultAvatar"><FaUserShield /></div>
            )}
            <div className="OverlayCamera" title="Changer la photo"><FaCamera /></div>
            <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" style={{ display: 'none' }} />
          </div>
          <div className="TextUser">
            <h2>Bienvenue, {session.nom}</h2> {/* Affiche le nom (Maire MB / Vice-Maire MB) */}
            <p className="RoleBadge">{session.role}</p> {/* Affiche le rôle (Maire / Vice-Maire) */}
          </div>
        </div>
        <button className="LogoutButton" onClick={handleLogout} title="Déconnexion"><FaDoorOpen /> Déconnexion</button>
      </ProfileHeader>

      {/* ZONE D'ACTIONS : Tableau de bord des fonctionnalités avec permissions */}
      <DashboardActions>
        <h3><FaTools /> Tableau de bord de gestion MBlanche</h3>
        <p className="Instruct">Sélectionnez une action ci-dessous.</p>
        
        <ButtonGroup>
          {/* --- GROUPE 1 : ACTIONS COMMUNES --- */}
          <span className="GroupLabel Commun">Commun</span>
          
          <ActionButton onClick={() => setActiveModule('PublierCommuniqué')}>
            <FaBullhorn /> Publier un communiqué (Public)
          </ActionButton>
          <ActionButton onClick={() => setActiveModule('PublierHoraire')}>
            <FaBroom /> Publier l'Horaire Assainissement
          </ActionButton>
          <ActionButton onClick={() => setActiveModule('NouveauRèglement')}>
            <FaBook /> Lancer de nouveaux règlements
          </ActionButton>
          <ActionButton onClick={() => setActiveModule('ModifierEnregistrement')}>
            <FaEdit /> Modifier un enregistrement mal écrit
          </ActionButton>
          
          {/* --- GROUPE 2 : ACTIONS RÉSERVÉES --- */}
          <span className="GroupLabel Reserve">Maire / Vice-Maire</span>
          
          <ActionButton className="AdminOnly" disabled={!isAdmin()} onClick={() => setActiveModule('NouveauBoulet')}>
            <FaPlusCircle /> Ajouter nouveau boulet
          </ActionButton>
          
          <ActionButton className="AdminOnly" disabled={!isAdmin()} onClick={() => setActiveModule('GererAnciens')}>
            <FaUsers /> Gérer les anciens
          </ActionButton>
          
          <ActionButton className="AdminOnly" disabled={!isAdmin()} onClick={() => setActiveModule('OrganiserFete')}>
            <FaGlassCheers /> Organiser fête du home (effet Kuma, Intég)
          </ActionButton>
          
          <ActionButton className="AdminOnly Danger" disabled={!isAdmin()} onClick={() => setActiveModule('ChasserGens')}>
            <FaUserSlash /> Chasser / Supprimer les gens du home
          </ActionButton>
        
        </ButtonGroup>
      </DashboardActions>

      {/* ZONE DE CONTENU DYNAMIQUE : Où s'afficheront les formulaires */}
      <DynamicContent>
        {activeModule ? (
          <div className="ModuleWrapper">
            <AdminModuleManager 
              activeModule={activeModule} 
              onClose={() => setActiveModule(null)} 
              userName={session.nom} 
            />
          </div>
        ) : (
          <div className="Placeholder">
            <FaTools className="IconLarge" />
            <p>Sélectionnez une action pour afficher le formulaire de gestion ici.</p>
          </div>
        )}
      </DynamicContent>

      {/* Container pour les notifications Toastify */}
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored" />

    </AdminContainer>
  );
}

// --- STYLE (Styled-Components) : Premium & Professionnel ---

// scColors : Définition locale pour Styled-Components (Corrections des erreurs précédentes)
const scColors = { 
    vertMb: "#266706",
    vertMbClair: "#e9f0e6", // Ajouté pour corriger l'erreurcolors_fete' is not defined
    grisMb: "#D6D6D6",
};
const colors_fete = scColors;
const AdminContainer = styled.div`
  padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px;
  min-height: 100vh; background-color: #f4f7f6; font-family: 'Poppins', sans-serif;
  animation: fadeInPage 0.5s ease-out;
  @keyframes fadeInPage { from { opacity: 0; } to { opacity: 1; } }
`;

const ProfileHeader = styled.div`
  width: 100%; max-width: 900px; background: white; padding: 20px 30px; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 15px;
  .InfoUser { display: flex; align-items: center; gap: 20px; }
  .AvatarWrapper {
    position: relative; width: 80px; height: 80px; border-radius: 50%; cursor: pointer;
    overflow: hidden; border: 4px solid #eee; transition: transform 0.3s ease;
    &:hover { transform: scale(1.05); }
    .ProfilePic { width: 100%; height: 100%; object-fit: cover; }
    .DefaultAvatar { width: 100%; height: 100%; background-color: ${scColors.grisMb}; color: ${scColors.vertMb}; display: flex; justify-content: center; align-items: center; font-size: 35px; }
    .OverlayCamera { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); color: white; display: flex; justify-content: center; align-items: center; font-size: 20px; opacity: 0; transition: opacity 0.3s; }
    &:hover .OverlayCamera { opacity: 1; }
  }
  .TextUser { h2 { margin: 0; font-size: 20px; color: #333; font-weight: 700; text-transform: uppercase; } .RoleBadge { margin: 5px 0 0 0; display: inline-block; padding: 5px 12px; background-color: ${scColors.vertMb}; color: white; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; } }
  .LogoutButton { background: none; border: 2px solid #fee; color: #d9534f; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s; &:hover { background-color: #fdf2f2; border-color: #fcc; } }
`;

const DashboardActions = styled.div`
  width: 100%; max-width: 900px; background: white; padding: 25px 30px; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); h3 { margin-top: 0; color: ${scColors.vertMb}; display: flex; align-items: center; gap: 10px; } .Instruct { margin-top: 7px; margin-bottom: 25px; color: #777; font-size: 14px; }
`;

const ButtonGroup = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px;
  .GroupLabel { grid-column: 1 / -1; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-top: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee; &.Commun { color: #888; } &.Reserve { color: ${scColors.vertMb}; } }
`;

const ActionButton = styled.button`
  background-color: white; border: 1px solid #ddd; padding: 15px; border-radius: 8px; color: #555; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; transition: all 0.2s ease; font-family: inherit;
  svg { font-size: 20px; color: ${scColors.vertMb}; transition: color 0.2s; }
  &:hover:not(:disabled) { background-color: ${scColors.vertMb}; color: white; border-color: ${scColors.vertMb}; transform: translateY(-2px); box-shadow: 0 3px 8px rgba(0,0,0,0.1); svg { color: white; } }
  &:disabled { cursor: not-allowed; opacity: 0.5; color: #aaa; svg { color: #aaa; } }
  &.AdminOnly { border-color: rgba(38, 103, 6, 0.2); } &.Danger:hover:not(:disabled) { background-color: #d9534f; border-color: #d9534f; }
`;

const BtnIcon = styled.button`
  background: none; border: none; padding: 8px; color: ${scColors.vertMb}; cursor: pointer; font-size: 16px; min-width: auto; transition: transform 0.2s;
  &:hover { transform: scale(1.2); color: #1a4d04; background: none; box-shadow: none; }
`;
const BtnIconDanger = styled(BtnIcon)`
  color: #d9534f; &:hover { color: #c9302c; }
`;

const DynamicContent = styled.div`
  width: 100%; max-width: 900px; min-height: 200px; background: white; padding: 30px;
  border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; justify-content: center; align-items: center;
  .Placeholder { text-align: center; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 15px; .IconLarge { font-size: 40px; } p { margin: 0; font-size: 14px; } }
  .ModuleWrapper { width: 100%; animation: fadeInModule 0.3s ease-out; }
  @keyframes fadeInModule { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const FormContainer = styled.div`
  width: 100%; animation: fadeInForm 0.3s ease-out;
  h3 { margin-top: 0; color: ${scColors.vertMb}; font-size: 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; &.DangerText { color: #d9534f; } }
  p { color: #666; font-size: 13.5px; margin-top: 0; margin-bottom: 15px; }
  .DangerWarn { color: #d9534f; font-weight: 500; font-style: italic; margin-top: 5px; }
  input, textarea { width: 100%; margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit; box-sizing: border-box; &:focus { outline: none; border-color: ${scColors.vertMb}; } }
  textarea { resize: vertical; }
  .FormButtons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
  button { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; min-width: 120px; transition: all 0.2s; &:disabled { opacity: 0.7; cursor: not-allowed; } }
  .InputWithIcon { position: relative; width: 100%; input { padding-left: 45px; } .InputIcon { position: absolute; top: 12px; left: 15px; color: #bbb; font-size: 18px; } }
  .BtnSave { background-color: ${scColors.vertMb}; color: white; &:hover { background-color: #1a4d04; } }
  .BtnCancel { background-color: #f5f5f5; color: #666; &:hover { background-color: #eee; } }
  .BtnDanger { background-color: #d9534f; color: white; &:hover { background-color: #c9302c; } }
  .spin { animation: fa-spin 1s infinite linear; }
  @keyframes fa-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

// -- STYLE SPÉCIFIQUE POUR LA SUPPRESSION CENTRALISÉE --
const DeleteListContainer = styled.div`
    width: 100%; max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; background-color: #fafafa;
    .LoadingList, .NoResultList { padding: 20px; text-align: center; color: #aaa; font-size: 14px; font-style: italic; }
`;

const DeleteUserItem = styled.div`
    display: flex; align-items: center; gap: 15px; padding: 12px 15px; border-bottom: 1px solid #eee; transition: background 0.2s;
    &:last-child { border-bottom: none; }
    &:hover { background-color: white; }
    input[type="checkbox"] { width: 18px; height: 18px; margin: 0; cursor: pointer; accent-color: ${scColors.vertMb}; }
    .UserInfo { display: flex; flex-direction: column; flex-grow: 1; .UserName { font-size: 14px; font-weight: 500; color: #333; } .UserMeta { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; } }
    &.isBoulet { border-left: 3px solid #f0ad4e; }
    &.isAncien { border-left: 3px solid ${scColors.vertMb}; }
`;