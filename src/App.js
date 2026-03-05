// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom"
import Mobile from './Pages/Mobile/Mobile';
import Accueil from './Pages/Accueil/Accueil';
import Album from './Pages/AlbumPhoto/Album';
import Ancien from './Pages/Anciens/Anciens';
import Chanson from './Pages/Chansons/Chanson';
import Dictionnaire from './Pages/Dictionnaire/Dictionnaire';
import Reglements from './Pages/Reglements/Reglements';
import LoadingScreen from './Pages/Loading/LoadingScreen';
import UsCoutumes from './Pages/UsCoutumes/UsCoutumes';
import Apropos from './Pages/Apropos/Apropos';
import AdminGouvernement from './Pages/Admin/AdminGouvernement'; 
import NouveauBoulet from './Pages/NouveauBoulet/NouveauBoulet';
import Communiques from './Pages/Communiques/Communiques';
import AdminLogin from './Pages/AdminLogin/AdminLogin'; 
// --- AJOUTEZ CETTE LIGNE ICI ---
import HoraireAssainisseur from "./Pages/HoraireAssainisseur/HoraireAssainisseur";
import Fetes from './Pages/Fetes/Fetes';
// -------------------------------
import Contact from './Pages/Contact/Contact'; 
// ---------------------------------

function App() {
  return (
    <div className="App">
        <Routes>
           {/* Route de chargement initiale */}
           <Route path='/' element={<LoadingScreen/>}/>
           
           <Route path='/AdminLogin' element={<AdminLogin/>}/>
           {/* Routes parentes /App (Sidebar/Header commune) */}
           <Route path='/App' element={<Mobile/>}>
            <Route path='/App/Accueil' element={<Accueil/>}/>
            <Route path="/App/HoraireAssainisseur" element={<HoraireAssainisseur />} />
            <Route path="/App/Fetes" element={<Fetes />} />
            <Route path='/App/Chansons' element={<Chanson/>}/>
            <Route path='/App/Dictionnaire' element={<Dictionnaire/>}/>
            <Route path='/App/Album' element={<Album/>}/>
            <Route path='/App/Reglements' element={<Reglements/>}/>
            <Route path='/App/UsCoutumes' element={<UsCoutumes/>}/>
            <Route path='/App/Anciens' element={<Ancien/>}/>
            <Route path='/App/Apropos' element={<Apropos/>}/>
            <Route path='/App/Communiques' element={<Communiques/>}/>
            
            <Route path='/App/AdminGouvernement' element={<AdminGouvernement/>}/>
            <Route path='/App/NouveauBoulet' element={<NouveauBoulet/>}/>
            
            {/* --- 2. AJOUTEZ CETTE LIGNE ICI --- */}
            {/* Déclaration de la route pour la page Contact */}
            <Route path='/App/Contact' element={<Contact/>}/>
            {/* ---------------------------------- */}
            
          </Route>
        </Routes>    
    </div>
  );
}

export default App;