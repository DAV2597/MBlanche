// c:\Users\HP\Desktop\MbApp-main\src\Pages\Chansons\Chanson.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, arrayUnion, arrayRemove, serverTimestamp, query } from 'firebase/firestore';
import { FaMusic, FaAlignLeft, FaHeart, FaRegHeart, FaComment, FaPlayCircle, FaPaperPlane, FaSpinner, FaCloudUploadAlt, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Chanson = () => {
    const [activeTab, setActiveTab] = useState('lyrics');
    const [chansons, setChansons] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [audioFile, setAudioFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // États pour l'édition
    const [editingItem, setEditingItem] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    
    // États pour les commentaires et l'utilisateur
    const [activeCommentsId, setActiveCommentsId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [currentUser, setCurrentUser] = useState({ id: 'guest', nom: 'Invité' });

    useEffect(() => {
        // Gestion session sécurisée
        try {
            const session = JSON.parse(localStorage.getItem('govSession'));
            if (session) {
                setCurrentUser({ id: session.nom, nom: session.nom });
            } else {
                setCurrentUser({ id: 'guest_' + Math.floor(Math.random() * 1000), nom: 'Invité' });
            }
        } catch (e) {
            console.log("Erreur session", e);
        }

        // CORRECTION : Suppression temporaire de orderBy pour éviter les erreurs d'index manquant
        const q = query(collection(db, "chansons"));
        
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
            setChansons(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
            },
            (error) => {
                console.error("Erreur chargement chansons:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        
        if (activeTab === 'lyrics') {
            if (!newTitle || !newContent) return;
            await addDoc(collection(db, "chansons"), {
                titre: newTitle,
                contenu: newContent,
                type: 'lyrics',
                likes: [],
                comments: [],
                dateAjout: serverTimestamp(),
                auteur: currentUser.nom
            });
            setNewTitle('');
            setNewContent('');
            setIsAdding(false);
        } else {
            if (!newTitle || !audioFile) return;
            setIsUploading(true);
            const reader = new FileReader();
            reader.readAsDataURL(audioFile);
            reader.onloadend = async () => {
                try {
                    await addDoc(collection(db, "chansons"), {
                        titre: newTitle,
                        contenu: reader.result,
                        type: 'audio',
                        likes: [],
                        comments: [],
                        dateAjout: serverTimestamp(),
                        auteur: currentUser.nom
                    });
                    setNewTitle('');
                    setAudioFile(null);
                    setIsAdding(false);
                } catch (error) {
                    console.error("Erreur publication:", error);
                    alert("Erreur lors de la publication. Le fichier est peut-être trop lourd.");
                } finally {
                    setIsUploading(false);
                }
            };
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette publication ?")) {
            await deleteDoc(doc(db, "chansons", id));
        }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setEditTitle(item.titre);
        setEditContent(item.contenu || item.paroles || '');
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        const updateData = { titre: editTitle };
        
        // On ne modifie le contenu que si c'est des paroles (pour l'audio, c'est trop lourd de réuploader ici)
        if (editingItem.type === 'lyrics') {
            updateData.contenu = editContent;
        }
        await updateDoc(doc(db, "chansons", editingItem.id), updateData);
        setEditingItem(null);
    };

    const handleLike = async (id, likes) => {
        const userId = currentUser.id;
        const docRef = doc(db, "chansons", id);
        const currentLikes = Array.isArray(likes) ? likes : []; 

        if (currentLikes.includes(userId)) {
            await updateDoc(docRef, { likes: arrayRemove(userId) });
        } else {
            await updateDoc(docRef, { likes: arrayUnion(userId) });
        }
    };

    const handleSendComment = async (e, chansonId) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment = {
            auteur: currentUser.nom,
            texte: commentText,
            date: new Date().toISOString()
        };

        const ref = doc(db, "chansons", chansonId);
        await updateDoc(ref, { comments: arrayUnion(newComment) });
        setCommentText('');
    };

    const filteredChansons = chansons.filter(c => {
        if (activeTab === 'lyrics') {
            return c.type === 'lyrics' || c.paroles;
        } else {
            return c.type === 'audio' || c.audioUrl;
        }
    });

    return (
        <PageContainer>
            <Header>
                <h1>Chansons du Home</h1>
                <p>La culture musicale de la Maison Blanche</p>
            </Header>

            <Tabs>
                <Tab active={activeTab === 'lyrics'} onClick={() => setActiveTab('lyrics')}>
                    <FaAlignLeft /> Paroles
                </Tab>
                <Tab active={activeTab === 'audio'} onClick={() => setActiveTab('audio')}>
                    <FaMusic /> Audio
                </Tab>
            </Tabs>

            <AddSection>
                {!isAdding ? (
                    <button className="add-btn" onClick={() => setIsAdding(true)}>
                        Publier {activeTab === 'lyrics' ? 'une parole' : 'un audio'}
                    </button>
                ) : (
                    <PublishForm onSubmit={handlePublish}>
                        <input 
                            placeholder="Titre de la chanson" 
                            value={newTitle} 
                            onChange={e => setNewTitle(e.target.value)} 
                        />
                        {activeTab === 'lyrics' ? (
                            <textarea 
                                placeholder="Écrivez les paroles ici..." 
                                value={newContent} 
                                onChange={e => setNewContent(e.target.value)} 
                            />
                        ) : (
                            <FileInputLabel>
                                <FaCloudUploadAlt /> {audioFile ? audioFile.name : "Choisir un fichier audio (MP3, WAV...)"}
                                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
                            </FileInputLabel>
                        )}
                        <div className="actions">
                            <button type="button" onClick={() => setIsAdding(false)}>Annuler</button>
                            <button type="submit" className="submit" disabled={isUploading}>
                                {isUploading ? <><FaSpinner className="spin" /> Envoi...</> : "Publier"}
                            </button>
                        </div>
                    </PublishForm>
                )}
            </AddSection>

            <Feed>
                {loading && <div style={{textAlign: 'center', padding: '20px', color: '#777'}}><FaSpinner className="spin" /> Chargement...</div>}
                
                {!loading && filteredChansons.length === 0 && (
                    <div style={{textAlign: 'center', padding: '20px', color: '#777'}}>
                        Aucune chanson trouvée dans cette catégorie.
                    </div>
                )}

                {filteredChansons.map(item => (
                    <Card key={item.id}>
                        <CardHeader>
                            <div className="avatar">MB</div>
                            <div className="meta">
                                <h4>{item.titre}</h4>
                                <span>Publié récemment</span>
                            </div>
                            {item.auteur === currentUser.nom && (
                                <div className="actions">
                                    <button onClick={() => openEdit(item)} title="Modifier"><FaEdit /></button>
                                    <button onClick={() => handleDelete(item.id)} className="delete" title="Supprimer"><FaTrash /></button>
                                </div>
                            )}
                        </CardHeader>
                        
                        <CardContent>
                            {(activeTab === 'lyrics') ? (
                                <pre>{item.contenu || item.paroles}</pre>
                            ) : (
                                <AudioPlayer>
                                    <FaPlayCircle className="play-icon" />
                                    <div className="track-info">
                                        <span>Audio: {item.titre}</span>
                                        <audio controls src={item.contenu || item.audioUrl} style={{width: '100%', marginTop: '5px'}} />
                                    </div>
                                </AudioPlayer>
                            )}
                        </CardContent>

                        <CardActions>
                            <ActionButton onClick={() => handleLike(item.id, item.likes)}>
                                {Array.isArray(item.likes) && item.likes.includes(currentUser.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                                <span>{Array.isArray(item.likes) ? item.likes.length : (item.likes || 0)} Likes</span>
                            </ActionButton>
                            <ActionButton onClick={() => setActiveCommentsId(activeCommentsId === item.id ? null : item.id)}>
                                <FaComment />
                                <span>{Array.isArray(item.comments) ? item.comments.length : (item.commentaires || 0)} Commentaires</span>
                            </ActionButton>
                        </CardActions>

                        {/* SECTION COMMENTAIRES */}
                        {activeCommentsId === item.id && (
                            <CommentSection>
                                <CommentList>
                                    {Array.isArray(item.comments) && item.comments.length > 0 ? (
                                        item.comments.map((com, idx) => (
                                            <CommentItem key={idx}>
                                                <strong>{com.auteur}</strong>
                                                <p>{com.texte}</p>
                                            </CommentItem>
                                        ))
                                    ) : (
                                        <p className="no-com">Soyez le premier à commenter !</p>
                                    )}
                                </CommentList>
                                <CommentForm onSubmit={(e) => handleSendComment(e, item.id)}>
                                    <input 
                                        placeholder="Votre commentaire..." 
                                        value={commentText} 
                                        onChange={(e) => setCommentText(e.target.value)} 
                                    />
                                    <button type="submit"><FaPaperPlane /></button>
                                </CommentForm>
                            </CommentSection>
                        )}
                    </Card>
                ))}
            </Feed>

            {/* MODAL DE MODIFICATION */}
            {editingItem && (
                <ModalOverlay>
                    <ModalContent>
                        <div className="modal-header">
                            <h3>Modifier la chanson</h3>
                            <button onClick={() => setEditingItem(null)}><FaTimes /></button>
                        </div>
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Titre" />
                        {editingItem.type === 'lyrics' && (
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows="6" placeholder="Paroles..." />
                        )}
                        <button className="save-btn" onClick={handleUpdate}>Enregistrer</button>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
};

export default Chanson;

// STYLES
const PageContainer = styled.div`
    padding: 20px;
    background: #f0f2f5;
    min-height: 100vh;
    .spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 20px;
    h1 { color: #266706; margin: 0; }
    p { color: #666; }
`;

const Tabs = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
`;

const Tab = styled.div`
    padding: 10px 25px;
    background: ${props => props.active ? '#266706' : 'white'};
    color: ${props => props.active ? 'white' : '#555'};
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s;
    &:hover { transform: scale(1.05); }
`;

const AddSection = styled.div`
    max-width: 600px;
    margin: 0 auto 20px;
    .add-btn {
        width: 100%;
        padding: 15px;
        background: white;
        border: 2px dashed #ccc;
        color: #777;
        font-weight: bold;
        cursor: pointer;
        border-radius: 10px;
        &:hover { border-color: #266706; color: #266706; }
    }
`;

const PublishForm = styled.form`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;

    input, textarea {
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 5px;
        font-family: inherit;
    }
    textarea { min-height: 100px; resize: vertical; }
    
    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        button {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .submit { background: #266706; color: white; display: flex; align-items: center; gap: 5px; &:disabled { opacity: 0.7; cursor: not-allowed; } }
    }
`;

const FileInputLabel = styled.label`
    display: flex; align-items: center; gap: 10px; padding: 12px; border: 2px dashed #ddd; border-radius: 5px; cursor: pointer; color: #777; font-size: 0.9em; background: #fafafa;
    &:hover { border-color: #266706; color: #266706; }
    input { display: none; }
    svg { font-size: 1.2em; }
`;

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
`;

const ModalContent = styled.div`
    background: white; padding: 20px; border-radius: 10px; width: 90%; max-width: 500px; display: flex; flex-direction: column; gap: 15px;
    .modal-header { display: flex; justify-content: space-between; align-items: center; h3 { margin: 0; color: #266706; } button { background: none; border: none; font-size: 1.2em; cursor: pointer; } }
    input, textarea { padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit; }
    .save-btn { background: #266706; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; align-self: flex-end; }
`;

const Feed = styled.div`
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Card = styled.div`
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
`;

const CardHeader = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #f0f0f0;
    
    .avatar {
        width: 40px; height: 40px;
        background: #266706; color: white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold;
    }
    .meta h4 { margin: 0; font-size: 1em; }
    .meta span { font-size: 0.8em; color: #999; }
    .actions {
        margin-left: auto; display: flex; gap: 8px;
        button { background: none; border: none; cursor: pointer; color: #65676b; font-size: 1em; padding: 5px; transition: color 0.2s;
            &:hover { color: #266706; }
            &.delete:hover { color: #d9534f; }
        }
    }
`;

const CardContent = styled.div`
    padding: 20px;
    pre {
        white-space: pre-wrap;
        font-family: 'Poppins', sans-serif;
        color: #333;
        margin: 0;
    }
`;

const AudioPlayer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    
    .play-icon { font-size: 3em; color: #266706; margin-bottom: 10px; }
    .track-info { width: 100%; text-align: center; }
`;

const CardActions = styled.div`
    padding: 10px 20px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 20px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #65676b;
    font-weight: 600;
    cursor: pointer;
    &:hover { color: #266706; }
`;

// Styles Commentaires
const CommentSection = styled.div`
    background: #f8f9fa;
    padding: 15px;
    border-top: 1px solid #eee;
    animation: fadeIn 0.3s;
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const CommentList = styled.div`
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .no-com { color: #999; font-style: italic; font-size: 0.9em; text-align: center; }
`;

const CommentItem = styled.div`
    background: white;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 0.9em;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    strong { color: #266706; font-size: 0.85em; display: block; margin-bottom: 2px; }
    p { margin: 0; color: #333; }
`;

const CommentForm = styled.form`
    display: flex;
    gap: 10px;
    input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-size: 0.9em;
        &:focus { border-color: #266706; }
    }
    button {
        background: #266706;
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        &:hover { transform: scale(1.1); }
    }
`;
