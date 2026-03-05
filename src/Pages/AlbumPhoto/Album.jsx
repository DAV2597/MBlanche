import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { FaImages, FaInfoCircle, FaHeart, FaRegHeart, FaComment, FaShare, FaCamera, FaPaperPlane, FaThumbsUp, FaRegThumbsUp, FaCommentAlt, FaSpinner, FaCloudUploadAlt, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

// Importation des anciennes photos (Archives)
import img1 from "./Assets/img1.jpg"
import img5 from "./Assets/img5.jpg"
import img6 from "./Assets/img6.jpg"
import img8 from "./Assets/img8.jpeg"
import img10 from "./Assets/img10.jpeg"
import img16 from "./Assets/img16.jpeg"
import img9 from "./Assets/img9.jpeg"
import img13 from "./Assets/img13.jpeg"
import img17 from "./Assets/img17.jpg"

// Définition des couleurs pour la cohérence
const colors = {
  vertMb: "#266706",
  vertMbClair: "#e9f0e6",
};

// Données statiques (Archives)
const staticPosts = [
    { id: 'static_1', media: img1, description: "Lors de la célébration d'anniversaire de Naza", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_2', media: img5, description: "Lors de la célébration d'anniversaire de Naza", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_3', media: img6, description: "Lors de la célébration d'anniversaire de Naza", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_4', media: img8, description: "Légende Allain Ndakali", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_5', media: img16, description: "Monsieur Labani Sesa en train de préparer la viande qui sera consommée à la kermesse", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_6', media: img10, description: "Le comité Organisateur de la kermesse 2022 Maison Blanche", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_7', media: img17, description: "La vue aérienne du Home Maison Blanche", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_8', media: img9, description: "Monsieur Patrick Mushombe le plus beau", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' },
    { id: 'static_9', media: img13, description: "Légende Deyong Josué", type: 'image', likes: [], comments: [], createdAt: null, auteur: 'Archive' }
];

const Album = () => {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [desc, setDesc] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editDesc, setEditDesc] = useState('');
    
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

        const q = query(collection(db, "albums"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
        return () => unsubscribe();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setMediaFile(e.target.files[0]);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!mediaFile) return;

        setIsUploading(true);
        
        // Conversion en Base64 (Stockage direct dans Firestore sans Storage)
        const reader = new FileReader();
        reader.readAsDataURL(mediaFile);
        
        reader.onloadend = async () => {
            try {
                await addDoc(collection(db, "albums"), {
                    description: desc,
                    media: reader.result, // L'image est stockée ici sous forme de texte
                    type: 'image', // On force le type image car vidéo impossible en Base64
                    likes: [],
                    comments: [],
                    createdAt: serverTimestamp(),
                    auteur: currentUser.nom
                });
                
                setDesc('');
                setMediaFile(null);
                setShowForm(false);
            } catch (error) {
                console.error("Erreur publication:", error);
                alert("Erreur lors de la publication. L'image est peut-être trop lourde (Max 1Mo conseillé).");
            } finally {
                setIsUploading(false);
            }
        };
    };

    const handleLike = async (id, likes) => {
        if (id.toString().startsWith('static_')) return; // Pas d'interaction sur les archives statiques
        const userId = currentUser.id;
        const docRef = doc(db, "albums", id);
        const currentLikes = likes || [];

        if (currentLikes.includes(userId)) {
            await updateDoc(docRef, { likes: arrayRemove(userId) });
        } else {
            await updateDoc(docRef, { likes: arrayUnion(userId) });
        }
    };

    const handleSendComment = async (e, albumId) => {
        e.preventDefault();
        if (albumId.toString().startsWith('static_')) return;
        if (!commentText.trim()) return;

        const newComment = {
            auteur: currentUser.nom,
            texte: commentText,
            date: new Date().toISOString()
        };

        const ref = doc(db, "albums", albumId);
        await updateDoc(ref, { comments: arrayUnion(newComment) });
        setCommentText('');
    };

    const handleShare = async (post) => {
        const shareData = {
            title: 'Album Maison Blanche',
            text: post.description || 'Regarde ce souvenir du Home !',
            url: window.location.href
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (e) { console.log("Partage annulé"); }
        } else {
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert("Lien copié dans le presse-papier !");
        }
    };

    const handleDelete = async (id) => {
        if (id.toString().startsWith('static_')) return;
        if (window.confirm("Voulez-vous vraiment supprimer cette publication ?")) {
            try {
                await deleteDoc(doc(db, "albums", id));
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const startEdit = (post) => {
        setEditingPost(post);
        setEditDesc(post.description);
    };

    const handleUpdate = async () => {
        if (!editingPost) return;
        try {
            await updateDoc(doc(db, "albums", editingPost.id), { description: editDesc });
            setEditingPost(null);
            setEditDesc('');
        } catch (error) {
            console.error("Erreur modification:", error);
            alert("Erreur lors de la modification.");
        }
    };

    const formatLikes = (count) => {
        if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
        return count;
    };

    // Fusionner les posts dynamiques (Firestore) et statiques (Archives)
    const allPosts = [...posts, ...staticPosts];

    return (
        <AlbumPageContainer>
            
            {/* EN-TÊTE DE LA PAGE */}
            <PageHeader>
              <div className="HeaderContent">
                <FaImages className="HeaderIcon" />
                <div className="TextTitle">
                  <h1>ALBUM PHOTOS</h1>
                  <p className="Subtitle">Revivez les moments forts et l'histoire de la Maison Blanche</p>
                </div>
              </div>
            </PageHeader>

            {/* CRÉATEUR DE POST (Visible par tous ou restreint selon besoin) */}
            <PostCreator>
                <div className="trigger" onClick={() => setShowForm(!showForm)}>
                    <div className="avatar">MB</div>
                    <div className="input">Quoi de neuf à la Maison Blanche ?</div>
                    <FaCamera color="#266706" size={20} />
                </div>
                {showForm && (
                    <Form onSubmit={handlePost}>
                        <textarea 
                            placeholder="Description de l'événement..." 
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                        
                        <FileInputLabel>
                            <FaCloudUploadAlt /> {mediaFile ? mediaFile.name : "Choisir une photo"}
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </FileInputLabel>

                        <button type="submit" disabled={isUploading}>
                            {isUploading ? <><FaSpinner className="spin" /> Envoi...</> : "Publier"}
                        </button>
                    </Form>
                )}
            </PostCreator>

            {/* GRILLE DE PHOTOS PREMIUM */}
            <PhotoGrid>
                {
                    allPosts.map((post) => (
                        <PhotoCard key={post.id}>
                            <div className="CardHeader">
                                <div className="avatar">MB</div>
                                <div className="info">
                                    <h4>Gouvernement MB</h4>
                                    <span>{post.createdAt ? post.createdAt.toDate().toLocaleDateString() : "Archive"}</span>
                                </div>
                                {post.auteur === currentUser.nom && !post.id.toString().startsWith('static_') && (
                                    <div className="actions">
                                        <button onClick={() => startEdit(post)} title="Modifier"><FaEdit /></button>
                                        <button onClick={() => handleDelete(post.id)} className="delete" title="Supprimer"><FaTrash /></button>
                                    </div>
                                )}
                            </div>

                            <div className="ImageWrapper">
                                {post.type === 'video' ? (
                                    <video controls src={post.media} />
                                ) : (
                                    <img src={post.media} alt="Post content" loading="lazy" />
                                )}
                            </div>
                            
                            <div className="CardInfo">
                                <p>{post.description}</p>
                            </div>

                            <div className="PostStats">
                                <div className="likes-count">
                                    <FaThumbsUp color="#266706" /> {formatLikes(post.likes?.length || 0)}
                                </div>
                                <div className="comments-count" onClick={() => setActiveCommentsId(activeCommentsId === post.id ? null : post.id)}>
                                    {post.comments?.length || 0} commentaires
                                </div>
                            </div>

                            <div className="CardActions">
                                <ActionButton onClick={() => handleLike(post.id, post.likes)}>
                                    {post.likes?.includes(currentUser.id) ? <FaThumbsUp color="#266706" /> : <FaRegThumbsUp />} J'aime
                                </ActionButton>
                                <ActionButton onClick={() => setActiveCommentsId(activeCommentsId === post.id ? null : post.id)}>
                                    <FaCommentAlt /> Commenter
                                </ActionButton>
                                <ActionButton onClick={() => handleShare(post)}>
                                    <FaShare /> Partager
                                </ActionButton>
                            </div>

                            {/* SECTION COMMENTAIRES */}
                            {activeCommentsId === post.id && (
                                <CommentSection>
                                    <CommentList>
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((com, idx) => (
                                                <CommentItem key={idx}>
                                                    <strong>{com.auteur}</strong>
                                                    <p>{com.texte}</p>
                                                </CommentItem>
                                            ))
                                        ) : (
                                            <p className="no-com">Soyez le premier à commenter !</p>
                                        )}
                                    </CommentList>
                                    <CommentForm onSubmit={(e) => handleSendComment(e, post.id)}>
                                        <input 
                                            placeholder="Votre commentaire..." 
                                            value={commentText} 
                                            onChange={(e) => setCommentText(e.target.value)} 
                                        />
                                        <button type="submit"><FaPaperPlane /></button>
                                    </CommentForm>
                                </CommentSection>
                            )}
                        </PhotoCard>
                    ))
                }
            </PhotoGrid>

            {/* MODAL DE MODIFICATION */}
            {editingPost && (
                <ModalOverlay>
                    <ModalContent>
                        <div className="modal-header"><h3>Modifier la publication</h3><button onClick={() => setEditingPost(null)}><FaTimes /></button></div>
                        <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows="4" />
                        <div className="modal-actions">
                            <button onClick={handleUpdate}>Enregistrer</button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AlbumPageContainer>
    );
}

export default Album;

// --- STYLE (Styled-Components) : Premium, Moderne & Responsive ---

const AlbumPageContainer = styled.div`
  min-height: 100vh;
  padding: 30px;
  background-color: #f4f7f6; /* Fond très léger pour le contraste */
  font-family: 'Poppins', 'Segoe UI', sans-serif; /* Assurez-vous d'avoir chargé Poppins */
  
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// 1. STYLE DE L'EN-TÊTE
const PageHeader = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 30px auto;
  background: white;
  border-radius: 12px;
  padding: 25px 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid ${colors.vertMb}; /* Accent vert premium */

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
      h1 { margin: 0; font-size: 22px; color: #333; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
      .Subtitle { margin: 5px 0 0 0; color: #777; font-size: 14px; font-weight: 400; }
    }
  }
`;

const ModalOverlay = styled.div`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const ModalContent = styled.div`background: white; padding: 20px; border-radius: 10px; width: 90%; max-width: 500px; .modal-header { display: flex; justify-content: space-between; margin-bottom: 15px; h3 { margin: 0; color: ${colors.vertMb}; } button { background: none; border: none; font-size: 1.2em; cursor: pointer; } } textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px; resize: vertical; } .modal-actions { text-align: right; button { background: ${colors.vertMb}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; } }`;


// STYLE DU CRÉATEUR DE POST
const PostCreator = styled.div`
    background: white; max-width: 1100px; margin: 0 auto 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 15px;
    .trigger { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .avatar { width: 40px; height: 40px; background: #266706; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8em; }
    .input { background: #f0f2f5; padding: 10px 15px; border-radius: 20px; flex-grow: 1; color: #65676b; }
`;
const Form = styled.form`
    margin-top: 15px; display: flex; flex-direction: column; gap: 10px;
    textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: none; }
    button { background: #266706; color: white; border: none; padding: 10px; border-radius: 5px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; &:disabled { opacity: 0.7; cursor: not-allowed; } }
    .spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
`;

const FileInputLabel = styled.label`
    display: flex; align-items: center; gap: 10px; padding: 12px; border: 2px dashed #ddd; border-radius: 5px; cursor: pointer; color: #777; font-size: 0.9em;
    &:hover { border-color: ${colors.vertMb}; color: ${colors.vertMb}; }
    input { display: none; }
    svg { font-size: 1.2em; }
`;

// 2. ZONE DE GRILLE DES PHOTOS (Masonry-like)
const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Grille responsive */
  gap: 25px;
  max-width: 1100px;
  margin: 0 auto;
`;

// 3. STYLE DE LA CARTE PHOTO (Premium Card Design)
const PhotoCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden; /* Pour que l'image respecte l'arrondi */
  box-shadow: 0 3px 10px rgba(0,0,0,0.06);
  transition: all 0.3s ease-out;
  border: 1px solid transparent;

  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    border-color: ${colors.vertMbClair};
  }

  .CardHeader {
    padding: 12px 16px; display: flex; align-items: center; gap: 10px;
    .avatar { width: 35px; height: 35px; background: #266706; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8em; }
    .info h4 { margin: 0; font-size: 0.9em; color: #050505; } .info span { font-size: 0.75em; color: #65676b; }
    .actions { margin-left: auto; display: flex; gap: 8px; 
        button { background: none; border: none; cursor: pointer; color: #65676b; transition: color 0.2s; font-size: 1em; padding: 4px;
            &:hover { color: ${colors.vertMb}; }
            &.delete:hover { color: #d9534f; }
        }
    }
  }

  /* Conteneur de l'image pour gérer le zoom */
  .ImageWrapper {
    width: 100%;
    max-height: 400px; /* Hauteur max */
    overflow: hidden;

    img, video {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Recadre l'image pour remplir le conteneur */
    }
  }

  /* Zone d'information sous la photo */
  .CardInfo {
    padding: 10px 16px;
    p { 
        margin: 0; 
        font-size: 14px; 
        color: #677483; /* Votre couleur de texte d'origine */
        font-weight: 400; 
        line-height: 1.4; 
    }
  }

  .PostStats {
    padding: 0 16px 10px; border-bottom: 1px solid #f0f2f5; display: flex; justify-content: space-between; font-size: 0.9em; color: #65676b;
    .likes-count { display: flex; align-items: center; gap: 5px; }
    .comments-count { cursor: pointer; &:hover { text-decoration: underline; } }
  }

  .CardActions { display: flex; padding: 4px; }
`;

const ActionButton = styled.button`flex: 1; background: none; border: none; padding: 8px; border-radius: 4px; color: #65676b; font-weight: 600; font-size: 0.9em; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; &:hover { background: #f0f2f5; }`;

// Styles Commentaires
const CommentSection = styled.div`background: #f8f9fa; padding: 15px; border-top: 1px solid #eee; animation: fadeIn 0.3s; @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
const CommentList = styled.div`max-height: 200px; overflow-y: auto; margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px; .no-com { color: #999; font-style: italic; font-size: 0.9em; text-align: center; }`;
const CommentItem = styled.div`background: white; padding: 8px 12px; border-radius: 12px; font-size: 0.9em; box-shadow: 0 1px 2px rgba(0,0,0,0.05); strong { color: #266706; font-size: 0.85em; display: block; margin-bottom: 2px; } p { margin: 0; color: #333; }`;
const CommentForm = styled.form`display: flex; gap: 10px; input { flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 0.9em; &:focus { border-color: #266706; } } button { background: #266706; color: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; &:hover { transform: scale(1.1); } }`;