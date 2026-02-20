# Phase 3 : Pages & Navigation - C6Radio

> **Documentation de suivi pour la Phase 3**  
> **Date de début :** 14 février 2026  
> **Durée estimée :** 7-9 jours (36 heures)  
> **Statut :** 🚀 Phase 3A Complétée | Phase 3B À démarrer

---

## 🎯 Approche Progressive : 3A → 3B

### 📌 Pourquoi 2 Sous-Phases ?

**Phase 3A (Fondations Simples)** : Tu apprends React Router avec du code simple hardcodé  
**Phase 3B (WordPress Dynamique)** : Tu ajoutes la modularité WordPress (conforme FR36.1 du PRD)

Cette approche progressive te permet de :
- ✅ Maîtriser les bases avant d'ajouter la complexité WordPress
- ✅ Avoir un site fonctionnel rapidement
- ✅ Debugger facilement (isolation des problèmes)
- ✅ Avancer même si WordPress n'est pas prêt
- ✅ Apprendre étape par étape (code reste simple)

---

## 📊 Vue d'Ensemble Phase 3A (Semaine 1) - ✅ COMPLÉTÉE

### 🎯 Objectif Phase 3A
Créer la structure de base avec **pages hardcodées** et navigation React Router

### 🎁 Livrables Phase 3A
- ✅ React Router configuré
- ✅ Header + navigation responsive (liens fixes)
- ✅ 3 pages React : Home, About, Contact
- ✅ Footer statique
- ✅ Menu mobile hamburger
- ✅ SEO basique + robots.txt

### 📈 Progression Phase 3A

**Avancement :** 100% (7/7 tâches complétées) ✅

```
Phase 3A: [██████████████████████████████████████] 100% ✅
Phase 3B: [                                        ] 0%
Global:   [███████████████████                     ] 50%
```

**Date de complétion :** 14 février 2026

---

## 📊 Vue d'Ensemble Phase 3B (Semaine 2) - ✅ COMPLÉTÉE

### 🎯 Objectif Phase 3B
Rendre les pages **modulaires via WordPress** (FR36.1 du PRD)

### 🎁 Livrables Phase 3B
- ✅ Client API WordPress pour pages
- ✅ Navigation dynamique (fetch pages depuis WordPress)
- ✅ Composant `DynamicPage.jsx` générique
- ✅ Route catch-all pour pages WordPress
- ✅ Menu géré par l'équipe éditoriale
- ✅ Page 404 stylisée
- ✅ Fallback si WordPress down

### 📈 Progression Phase 3B

**Avancement :** 100% (5/5 tâches complétées) ✅

```
Phase 3A: [██████████████████████████████████████] 100% ✅
Phase 3B: [██████████████████████████████████████] 100% ✅
Global:   [██████████████████████████████████████] 100% ✅
```

**Date de complétion :** 14 février 2026

### 🔑 Conformité PRD
**FR36.1** : ✅ L'équipe éditoriale choisit quelles pages sont affichées dans le menu  
**FR38.1** : ✅ Synchronisation automatique WordPress sans rebuild

---

## 🏗️ PHASE 3A : FONDATIONS SIMPLES (Semaine 1)

> **Objectif :** Maîtriser React Router avec du code simple  
> **Durée :** 4-5 jours (22 heures)  
> **Pages :** Hardcodées en React (Home, About, Contact)

---

## ✅ Liste des Tâches Phase 3A

### Tâche 3.1 : Setup React Router ⏳
- **Durée estimée :** 2 heures
- **Priorité :** 🔴 CRITIQUE (bloquant pour toutes les autres tâches)
- **Statut :** ⏳ À faire
- **Dépendances :** Aucune

#### Objectif
Installer et configurer React Router v6+ pour gérer la navigation entre les pages

#### Actions à Réaliser

1. **Installer React Router**
   ```bash
   npm install react-router-dom
   ```

2. **Créer le fichier de routes** `src/router.jsx`
   ```javascript
   import { createBrowserRouter } from 'react-router-dom';
   import App from './App';
   import Home from './pages/Home';
   import About from './pages/About';
   // Import autres pages...

   export const router = createBrowserRouter([
     {
       path: '/',
       element: <App />,
       children: [
         { index: true, element: <Home /> },
         { path: 'about', element: <About /> },
         // Autres routes...
       ],
     },
   ]);
   ```

3. **Modifier `main.jsx`**
   ```javascript
   import { RouterProvider } from 'react-router-dom';
   import { router } from './router';

   createRoot(document.getElementById('root')).render(
     <StrictMode>
       <ErrorBoundary>
         <RouterProvider router={router} />
       </ErrorBoundary>
     </StrictMode>
   );
   ```

4. **Modifier `App.jsx`** pour utiliser Outlet
   ```javascript
   import { Outlet } from 'react-router-dom';
   import PlayerBar from './components/PlayerBar';

   function App() {
     return (
       <>
         <Outlet /> {/* Les pages s'affichent ici */}
         <PlayerBar /> {/* Toujours visible */}
       </>
     );
   }
   ```

#### Critères de Validation
- [ ] `npm install react-router-dom` exécuté avec succès
- [ ] Fichier `src/router.jsx` créé
- [ ] `main.jsx` modifié pour utiliser RouterProvider
- [ ] `App.jsx` modifié pour utiliser Outlet
- [ ] Navigation entre pages fonctionne (ex: `/` et `/about`)
- [ ] Aucune erreur console
- [ ] `npm run build` compile sans erreur

#### Fichiers Créés/Modifiés
- ✅ `src/router.jsx` (nouveau)
- ✅ `src/main.jsx` (modifié)
- ✅ `src/App.jsx` (modifié)
- ✅ `package.json` (react-router-dom ajouté)

---

### Tâche 3.2 : Composant Header ⏳
- **Durée estimée :** 3 heures
- **Priorité :** 🔴 CRITIQUE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.1 (React Router)

#### Objectif
Créer un header responsive avec logo et navigation principale

#### Actions à Réaliser

1. **Créer la structure des dossiers**
   ```
   src/components/layout/
   ├── Header.jsx
   └── Header.css
   ```

2. **Créer `Header.jsx`**
   ```javascript
   import { Link } from 'react-router-dom';
   import './Header.css';

   export default function Header() {
     return (
       <header className="header">
         <div className="header-container">
           {/* Logo */}
           <Link to="/" className="header-logo">
             <img src="/logo-c6radio.png" alt="C6Radio" />
             <span>C6Radio</span>
           </Link>

           {/* Navigation desktop */}
           <nav className="header-nav">
             <Link to="/" className="nav-link">Accueil</Link>
             <Link to="/about" className="nav-link">À propos</Link>
             <Link to="/contact" className="nav-link">Contact</Link>
           </nav>

           {/* Bouton hamburger mobile (Tâche 3.7) */}
           <button className="header-hamburger">
             <span></span>
             <span></span>
             <span></span>
           </button>
         </div>
       </header>
     );
   }
   ```

3. **Créer `Header.css`**
   - Position sticky ou fixed
   - Palette cohérente (vert C6Radio)
   - Responsive breakpoint ~768px
   - Z-index supérieur à PlayerBar

4. **Intégrer dans App.jsx**
   ```javascript
   import Header from './components/layout/Header';
   import { Outlet } from 'react-router-dom';

   function App() {
     return (
       <>
         <Header />
         <main className="main-content">
           <Outlet />
         </main>
         <PlayerBar />
       </>
     );
   }
   ```

#### Critères de Validation
- [ ] Header affiché en haut de page
- [ ] Logo C6Radio visible et cliquable (retour home)
- [ ] Navigation desktop avec 4 liens minimum
- [ ] Links React Router fonctionnels
- [ ] Responsive : nav desktop visible > 768px
- [ ] Bouton hamburger visible < 768px (non fonctionnel pour l'instant)
- [ ] Styles cohérents avec PlayerBar
- [ ] Active link style (optionnel mais recommandé)

#### Fichiers Créés/Modifiés
- ✅ `src/components/layout/Header.jsx` (nouveau)
- ✅ `src/components/layout/Header.css` (nouveau)
- ✅ `src/App.jsx` (modifié)

#### Notes
- Utiliser `NavLink` au lieu de `Link` pour styling automatique lien actif
- Z-index recommandé : 1000 (PlayerBar = 999)

---

### Tâche 3.3 : Page Home ⏳
- **Durée estimée :** 4 heures
- **Priorité :** 🟡 HAUTE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.1 (React Router)

#### Objectif
Créer la page d'accueil avec hero section, présentation du player et intro

#### Actions à Réaliser

1. **Créer la structure**
   ```
   src/pages/
   ├── Home.jsx
   └── Home.css
   ```

2. **Créer `Home.jsx`**
   ```javascript
   import { useAudioPlayer } from '../hooks/useAudioPlayer';
   import NowPlaying from '../components/NowPlaying';
   import './Home.css';

   export default function Home() {
     const { isPlaying, playLive, stop } = useAudioPlayer();

     return (
       <div className="home">
         {/* Hero Section */}
         <section className="hero">
           <div className="hero-content">
             <h1>C6Radio</h1>
             <p className="hero-subtitle">
               Votre radio en ligne 24/7
             </p>
             
             {/* CTA Écouter (Tâche 3.4) */}
             <button 
               onClick={isPlaying ? stop : playLive}
               className={`hero-cta ${isPlaying ? 'playing' : ''}`}
             >
               {isPlaying ? '⏸ Pause' : '▶ Écouter en direct'}
             </button>
           </div>

           {/* Image de fond optionnelle */}
           <div className="hero-background"></div>
         </section>

         {/* Section Now Playing */}
         <section className="now-playing-section">
           <h2>En ce moment sur C6Radio</h2>
           <NowPlaying compact={false} />
         </section>

         {/* Section Intro */}
         <section className="intro">
           <h2>Bienvenue sur C6Radio</h2>
           <p>
             Découvrez notre radio en ligne 24h/24, 7j/7.
             Musique, actus, podcasts et bien plus encore !
           </p>
         </section>

         {/* Section Actus récentes (Phase 4) - Placeholder */}
         <section className="recent-actus">
           <h2>Dernières actualités</h2>
           <p className="placeholder">À venir : liste des dernières actus</p>
         </section>
       </div>
     );
   }
   ```

3. **Créer `Home.css`**
   - Hero fullscreen ou 70vh minimum
   - Background image/gradient
   - Button CTA bien visible
   - Sections espacées
   - Responsive mobile-first

#### Critères de Validation
- [ ] Page Home accessible sur `/`
- [ ] Hero section avec titre + CTA visible
- [ ] Bouton "Écouter en direct" déclenche playLive
- [ ] Section Now Playing intégrée
- [ ] Section intro avec texte explicatif
- [ ] Placeholder actus (à compléter Phase 4)
- [ ] Responsive mobile + desktop
- [ ] Padding bottom pour ne pas cacher PlayerBar

#### Fichiers Créés/Modifiés
- ✅ `src/pages/Home.jsx` (nouveau)
- ✅ `src/pages/Home.css` (nouveau)

---

### Tâche 3.4 : Section Hero avec CTA ⏳
- **Durée estimée :** 3 heures
- **Priorité :** 🟡 HAUTE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.3 (Page Home)

#### Objectif
Créer une hero section impactante avec bouton "Écouter en direct" bien visible

#### Actions à Réaliser

1. **Améliorer le HTML de la hero dans `Home.jsx`**
   ```javascript
   <section className="hero">
     {/* Background avec overlay */}
     <div className="hero-background">
       <div className="hero-overlay"></div>
     </div>

     {/* Contenu centré */}
     <div className="hero-content">
       <h1 className="hero-title">
         <span className="hero-logo">🎵</span>
         C6Radio
       </h1>
       
       <p className="hero-subtitle">
         La radio qui vous accompagne 24h/24
       </p>

       {/* CTA Play/Pause */}
       <button 
         onClick={isPlaying ? stop : playLive}
         className={`hero-cta ${isPlaying ? 'cta-playing' : 'cta-stopped'}`}
       >
         <span className="cta-icon">
           {isPlaying ? '⏹' : '▶'}
         </span>
         <span className="cta-text">
           {isPlaying ? 'Arrêter' : 'Écouter en direct'}
         </span>
       </button>

       {/* Indicateur "En direct" si playing */}
       {isPlaying && (
         <div className="live-indicator">
           <span className="live-dot"></span>
           <span>EN DIRECT</span>
         </div>
       )}
     </div>

     {/* Scroll indicator (optionnel) */}
     <div className="hero-scroll-indicator">
       <span>Défiler vers le bas</span>
       <span className="arrow-down">↓</span>
     </div>
   </section>
   ```

2. **Styliser la hero dans `Home.css`**
   ```css
   .hero {
     position: relative;
     min-height: 100vh;
     display: flex;
     align-items: center;
     justify-content: center;
     overflow: hidden;
   }

   .hero-background {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
     /* Ou image de fond */
   }

   .hero-overlay {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0, 0.3);
   }

   .hero-content {
     position: relative;
     z-index: 1;
     text-align: center;
     color: white;
     padding: 2rem;
     max-width: 800px;
   }

   .hero-title {
     font-size: 4rem;
     font-weight: 900;
     margin-bottom: 1rem;
     text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
   }

   .hero-subtitle {
     font-size: 1.5rem;
     margin-bottom: 2rem;
     opacity: 0.95;
   }

   .hero-cta {
     display: inline-flex;
     align-items: center;
     gap: 0.75rem;
     padding: 1.25rem 2.5rem;
     font-size: 1.25rem;
     font-weight: 700;
     border: none;
     border-radius: 50px;
     cursor: pointer;
     transition: all 0.3s ease;
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
   }

   .cta-stopped {
     background: #16a34a;
     color: white;
   }

   .cta-stopped:hover {
     background: #15803d;
     transform: scale(1.05);
   }

   .cta-playing {
     background: #dc2626;
     color: white;
   }

   .live-indicator {
     margin-top: 1.5rem;
     display: flex;
     align-items: center;
     justify-content: center;
     gap: 0.5rem;
     font-weight: 600;
   }

   .live-dot {
     width: 12px;
     height: 12px;
     background: #ef4444;
     border-radius: 50%;
     animation: pulse 1.5s infinite;
   }

   @keyframes pulse {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.4; }
   }

   /* Responsive */
   @media (max-width: 768px) {
     .hero-title {
       font-size: 2.5rem;
     }
     .hero-subtitle {
       font-size: 1.125rem;
     }
     .hero-cta {
       font-size: 1rem;
       padding: 1rem 2rem;
     }
   }
   ```

3. **Ajouter animation scroll indicator (optionnel)**

#### Critères de Validation
- [ ] Hero section fullscreen (100vh)
- [ ] Titre + subtitle bien lisibles
- [ ] Bouton CTA très visible
- [ ] Bouton change d'apparence si playing
- [ ] Indicateur "EN DIRECT" affiché si playing
- [ ] Hover effect sur bouton CTA
- [ ] Responsive mobile excellent
- [ ] Transition smooth entre états

#### Fichiers Créés/Modifiés
- ✅ `src/pages/Home.jsx` (modifié)
- ✅ `src/pages/Home.css` (modifié)

#### Notes
- Utiliser une vraie image de fond si disponible
- Animation du dot "EN DIRECT" pour effet pulsant

---

### Tâche 3.5 : Pages About + Contact ⏳
- **Durée estimée :** 3 heures
- **Priorité :** 🟢 MOYENNE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.1 (React Router)

#### Objectif
Créer 2 pages statiques simples : "À propos" et "Contact"

#### Actions à Réaliser

1. **Créer `src/pages/About.jsx`**
   ```javascript
   import './About.css';

   export default function About() {
     return (
       <div className="about-page">
         <div className="about-container">
           {/* Header section */}
           <section className="about-header">
             <h1>À propos de C6Radio</h1>
             <p className="about-intro">
               Découvrez l'histoire et la mission de votre radio préférée
             </p>
           </section>

           {/* Section Mission */}
           <section className="about-section">
             <h2>Notre Mission</h2>
             <p>
               [CONTENU À FOURNIR PAR CLIENT]
               C6Radio a pour mission de...
             </p>
           </section>

           {/* Section Équipe */}
           <section className="about-section">
             <h2>L'Équipe</h2>
             <p>
               [CONTENU À FOURNIR PAR CLIENT]
               Présentation de l'équipe...
             </p>
           </section>

           {/* Section Contact */}
           <section className="about-section">
             <h2>Contact</h2>
             <div className="contact-info">
               <p><strong>Email :</strong> contact@c6radio.fr</p>
               <p><strong>Téléphone :</strong> +33 X XX XX XX XX</p>
               <p><strong>Adresse :</strong> [À compléter]</p>
             </div>
           </section>

           {/* Réseaux sociaux (optionnel) */}
           <section className="about-section">
             <h2>Suivez-nous</h2>
             <div className="social-links">
               <a href="#" className="social-link">Facebook</a>
               <a href="#" className="social-link">Twitter</a>
               <a href="#" className="social-link">Instagram</a>
             </div>
           </section>
         </div>
       </div>
     );
   }
   ```

2. **Créer `src/pages/About.css`**
   ```css
   .about-page {
     min-height: calc(100vh - 200px);
     padding: 2rem 1rem 8rem 1rem;
     background: #f9fafb;
   }

   .about-container {
     max-width: 800px;
     margin: 0 auto;
     background: white;
     padding: 3rem;
     border-radius: 8px;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
   }

   .about-header {
     text-align: center;
     margin-bottom: 3rem;
   }

   .about-header h1 {
     font-size: 2.5rem;
     color: #16a34a;
     margin-bottom: 1rem;
   }

   .about-intro {
     font-size: 1.25rem;
     color: #6b7280;
   }

   .about-section {
     margin-bottom: 2.5rem;
   }

   .about-section h2 {
     font-size: 1.75rem;
     color: #1f2937;
     margin-bottom: 1rem;
     border-bottom: 2px solid #16a34a;
     padding-bottom: 0.5rem;
   }

   .about-section p {
     font-size: 1.125rem;
     line-height: 1.7;
     color: #374151;
   }

   .contact-info {
     background: #f9fafb;
     padding: 1.5rem;
     border-radius: 8px;
   }

   .contact-info p {
     margin-bottom: 0.75rem;
   }

   .social-links {
     display: flex;
     gap: 1rem;
     flex-wrap: wrap;
   }

   .social-link {
     padding: 0.75rem 1.5rem;
     background: #16a34a;
     color: white;
     text-decoration: none;
     border-radius: 6px;
     transition: background 0.3s;
   }

   .social-link:hover {
     background: #15803d;
   }

   /* Responsive */
   @media (max-width: 768px) {
     .about-container {
       padding: 2rem 1.5rem;
     }
     .about-header h1 {
       font-size: 2rem;
     }
   }
   ```

3. **Créer `src/pages/Contact.jsx`**
   ```javascript
   import './Contact.css';

   export default function Contact() {
     return (
       <div className="contact-page">
         <div className="contact-container">
           {/* Header */}
           <section className="contact-header">
             <h1>Contactez-nous</h1>
             <p className="contact-intro">
               Une question ? Une suggestion ? N'hésitez pas à nous contacter !
             </p>
           </section>

           {/* Informations de contact */}
           <section className="contact-info-section">
             <h2>Nos Coordonnées</h2>
             <div className="contact-details">
               <div className="contact-item">
                 <h3>📧 Email</h3>
                 <p><a href="mailto:contact@c6radio.fr">contact@c6radio.fr</a></p>
               </div>
               <div className="contact-item">
                 <h3>📱 Téléphone</h3>
                 <p>[À FOURNIR PAR CLIENT]</p>
               </div>
               <div className="contact-item">
                 <h3>📍 Adresse</h3>
                 <p>[À FOURNIR PAR CLIENT]</p>
               </div>
             </div>
           </section>

           {/* Réseaux sociaux */}
           <section className="contact-social">
             <h2>Suivez-nous</h2>
             <div className="social-links">
               <a href="#" className="social-link">Facebook</a>
               <a href="#" className="social-link">Twitter</a>
               <a href="#" className="social-link">Instagram</a>
             </div>
           </section>
         </div>
       </div>
     );
   }
   ```

4. **Créer `src/pages/Contact.css`** (styles similaires à About.css)

5. **Ajouter les routes dans `router.jsx`**
   ```javascript
   import About from './pages/About';
   import Contact from './pages/Contact';

   export const router = createBrowserRouter([
     {
       path: '/',
       element: <App />,
       children: [
         { index: true, element: <Home /> },
         { path: 'about', element: <About /> },
         { path: 'contact', element: <Contact /> },
       ],
     },
   ]);
   ```

#### Critères de Validation
- [ ] Page About accessible sur `/about`
- [ ] Page Contact accessible sur `/contact`
- [ ] Structure sections bien définie sur les 2 pages
- [ ] Contenu placeholder présent (à remplacer)
- [ ] Styles cohérents avec le reste du site
- [ ] Responsive mobile
- [ ] Liens sociaux (même si non fonctionnels)
- [ ] Padding bottom pour PlayerBar
- [ ] Routes configurées dans React Router

#### Fichiers Créés/Modifiés
- ✅ `src/pages/About.jsx` (nouveau)
- ✅ `src/pages/About.css` (nouveau)
- ✅ `src/pages/Contact.jsx` (nouveau)
- ✅ `src/pages/Contact.css` (nouveau)
- ✅ `src/router.jsx` (modifié)

#### Contenu Requis du Client
- [ ] Texte mission de C6Radio
- [ ] Présentation équipe
- [ ] Téléphone + Adresse
- [ ] Liens réseaux sociaux

---

### Tâche 3.6 : Footer Statique ⏳
- **Durée estimée :** 2 heures
- **Priorité :** 🟢 MOYENNE
- **Statut :** ⏳ À faire
- **Dépendances :** Aucune

#### Objectif
Créer un footer statique avec liens légaux (séparé de PlayerBar)

#### Actions à Réaliser

1. **Créer `src/components/layout/Footer.jsx`**
   ```javascript
   import { Link } from 'react-router-dom';
   import './Footer.css';

   export default function Footer() {
     return (
       <footer className="site-footer">
         <div className="footer-container">
           {/* Section liens */}
           <div className="footer-section">
             <h3>Navigation</h3>
             <nav className="footer-nav">
               <Link to="/">Accueil</Link>
               <Link to="/actus">Actualités</Link>
               <Link to="/podcasts">Podcasts</Link>
               <Link to="/about">À propos</Link>
             </nav>
           </div>

           {/* Section légal */}
           <div className="footer-section">
             <h3>Légal</h3>
             <nav className="footer-nav">
               <Link to="/mentions-legales">Mentions légales</Link>
               <Link to="/politique-confidentialite">Confidentialité</Link>
               <Link to="/cgu">CGU</Link>
             </nav>
           </div>

           {/* Section contact */}
           <div className="footer-section">
             <h3>Contact</h3>
             <p>Email: contact@c6radio.fr</p>
             <div className="footer-social">
               <a href="#" aria-label="Facebook">FB</a>
               <a href="#" aria-label="Twitter">TW</a>
               <a href="#" aria-label="Instagram">IG</a>
             </div>
           </div>
         </div>

         {/* Copyright */}
         <div className="footer-bottom">
           <p>&copy; 2026 C6Radio. Tous droits réservés.</p>
         </div>
       </footer>
     );
   }
   ```

2. **Créer `src/components/layout/Footer.css`**
   ```css
   .site-footer {
     background: #1f2937;
     color: #d1d5db;
     padding: 3rem 1rem 6rem 1rem; /* 6rem bottom pour PlayerBar */
     margin-top: 4rem;
   }

   .footer-container {
     max-width: 1200px;
     margin: 0 auto;
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     gap: 2rem;
   }

   .footer-section h3 {
     color: #16a34a;
     font-size: 1.125rem;
     margin-bottom: 1rem;
   }

   .footer-nav {
     display: flex;
     flex-direction: column;
     gap: 0.5rem;
   }

   .footer-nav a {
     color: #d1d5db;
     text-decoration: none;
     transition: color 0.3s;
   }

   .footer-nav a:hover {
     color: #16a34a;
   }

   .footer-social {
     display: flex;
     gap: 1rem;
     margin-top: 1rem;
   }

   .footer-social a {
     width: 40px;
     height: 40px;
     display: flex;
     align-items: center;
     justify-content: center;
     background: #374151;
     color: white;
     border-radius: 50%;
     text-decoration: none;
     transition: background 0.3s;
   }

   .footer-social a:hover {
     background: #16a34a;
   }

   .footer-bottom {
     text-align: center;
     margin-top: 2rem;
     padding-top: 2rem;
     border-top: 1px solid #374151;
   }

   /* Responsive */
   @media (max-width: 768px) {
     .footer-container {
       grid-template-columns: 1fr;
     }
   }
   ```

3. **Intégrer dans `App.jsx`**
   ```javascript
   import Footer from './components/layout/Footer';

   function App() {
     return (
       <>
         <Header />
         <main className="main-content">
           <Outlet />
         </main>
         <Footer />
         <PlayerBar />
       </>
     );
   }
   ```

#### Critères de Validation
- [ ] Footer affiché en bas de toutes les pages
- [ ] Liens navigation fonctionnels
- [ ] Liens légaux présents (même si pages non créées)
- [ ] Section contact avec email
- [ ] Réseaux sociaux stylisés
- [ ] Copyright 2026
- [ ] Padding bottom suffisant pour PlayerBar
- [ ] Responsive mobile

#### Fichiers Créés/Modifiés
- ✅ `src/components/layout/Footer.jsx` (nouveau)
- ✅ `src/components/layout/Footer.css` (nouveau)
- ✅ `src/App.jsx` (modifié)

#### Notes
- Les pages légales (Mentions, CGU, etc.) seront créées plus tard
- Footer STATIQUE, PlayerBar reste STICKY

---

### Tâche 3.7 : Navigation Mobile (Hamburger Menu) ⏳
- **Durée estimée :** 4 heures
- **Priorité :** 🟡 HAUTE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.2 (Header)

#### Objectif
Implémenter un menu hamburger responsive pour mobile avec transition smooth

#### Actions à Réaliser

1. **Modifier `Header.jsx` pour ajouter la logique**
   ```javascript
   import { Link, NavLink } from 'react-router-dom';
   import { useState } from 'react';
   import './Header.css';

   export default function Header() {
     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

     const toggleMobileMenu = () => {
       setMobileMenuOpen(!mobileMenuOpen);
     };

     const closeMobileMenu = () => {
       setMobileMenuOpen(false);
     };

     return (
       <header className="header">
         <div className="header-container">
           {/* Logo */}
           <Link to="/" className="header-logo" onClick={closeMobileMenu}>
             <img src="/logo-c6radio.png" alt="C6Radio" />
             <span>C6Radio</span>
           </Link>

           {/* Navigation desktop */}
           <nav className="header-nav desktop-nav">
             <NavLink to="/" className="nav-link">Accueil</NavLink>
             <NavLink to="/about" className="nav-link">À propos</NavLink>
             <NavLink to="/contact" className="nav-link">Contact</NavLink>
           </nav>

           {/* Bouton hamburger mobile */}
           <button 
             className={`header-hamburger ${mobileMenuOpen ? 'open' : ''}`}
             onClick={toggleMobileMenu}
             aria-label="Menu"
           >
             <span></span>
             <span></span>
             <span></span>
           </button>
         </div>

         {/* Menu mobile */}
         <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
           <NavLink to="/" onClick={closeMobileMenu}>Accueil</NavLink>
           <NavLink to="/about" onClick={closeMobileMenu}>À propos</NavLink>
           <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
         </nav>

         {/* Overlay pour fermer menu */}
         {mobileMenuOpen && (
           <div 
             className="mobile-overlay" 
             onClick={closeMobileMenu}
           />
         )}
       </header>
     );
   }
   ```

2. **Mettre à jour `Header.css`**
   ```css
   /* Bouton hamburger */
   .header-hamburger {
     display: none;
     flex-direction: column;
     gap: 4px;
     background: none;
     border: none;
     cursor: pointer;
     padding: 8px;
   }

   .header-hamburger span {
     width: 25px;
     height: 3px;
     background: #16a34a;
     transition: all 0.3s ease;
   }

   .header-hamburger.open span:nth-child(1) {
     transform: rotate(45deg) translate(5px, 5px);
   }

   .header-hamburger.open span:nth-child(2) {
     opacity: 0;
   }

   .header-hamburger.open span:nth-child(3) {
     transform: rotate(-45deg) translate(7px, -6px);
   }

   /* Navigation mobile */
   .mobile-nav {
     display: none;
     position: fixed;
     top: 70px; /* Hauteur du header */
     right: -100%;
     width: 80%;
     max-width: 300px;
     height: calc(100vh - 70px);
     background: white;
     box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
     transition: right 0.3s ease;
     z-index: 998;
     padding: 2rem 1rem;
     flex-direction: column;
     gap: 1rem;
   }

   .mobile-nav.open {
     right: 0;
   }

   .mobile-nav a {
     padding: 1rem;
     color: #1f2937;
     text-decoration: none;
     font-size: 1.125rem;
     font-weight: 600;
     border-bottom: 1px solid #e5e7eb;
     transition: color 0.3s;
   }

   .mobile-nav a:hover,
   .mobile-nav a.active {
     color: #16a34a;
     background: #f0fdf4;
   }

   /* Overlay */
   .mobile-overlay {
     display: none;
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0, 0.5);
     z-index: 997;
   }

   /* Responsive */
   @media (max-width: 768px) {
     .desktop-nav {
       display: none;
     }

     .header-hamburger {
       display: flex;
     }

     .mobile-nav {
       display: flex;
     }

     .mobile-overlay {
       display: block;
     }
   }

   @media (min-width: 769px) {
     .header-hamburger {
       display: none;
     }

     .mobile-nav {
       display: none !important;
     }
   }
   ```

#### Critères de Validation
- [ ] Bouton hamburger visible uniquement < 768px
- [ ] Clic sur hamburger ouvre menu latéral
- [ ] Animation hamburger → X
- [ ] Menu slide depuis la droite
- [ ] Overlay sombre en background
- [ ] Clic sur overlay ferme menu
- [ ] Clic sur lien ferme menu
- [ ] Active link stylisé en vert
- [ ] Navigation desktop visible > 768px

#### Fichiers Créés/Modifiés
- ✅ `src/components/layout/Header.jsx` (modifié)
- ✅ `src/components/layout/Header.css` (modifié)

#### Notes
- Animation smooth 0.3s
- Z-index : overlay 997, mobile-nav 998, header 1000

---

### Tâche 3.8 : Transitions Pages Smooth ⏳
- **Durée estimée :** 2 heures
- **Priorité :** 🟢 BASSE (nice-to-have)
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.1 (React Router)

#### Objectif
Ajouter des transitions fluides entre les pages et smooth scroll

#### Actions à Réaliser

1. **Ajouter smooth scroll global dans `index.css`**
   ```css
   html {
     scroll-behavior: smooth;
   }

   /* Transition fade pour pages */
   .page-enter {
     opacity: 0;
     transform: translateY(20px);
   }

   .page-enter-active {
     opacity: 1;
     transform: translateY(0);
     transition: opacity 0.3s, transform 0.3s;
   }

   .page-exit {
     opacity: 1;
   }

   .page-exit-active {
     opacity: 0;
     transition: opacity 0.3s;
   }
   ```

2. **Scroll to top lors changement de page**
   Créer `src/components/ScrollToTop.jsx` :
   ```javascript
   import { useEffect } from 'react';
   import { useLocation } from 'react-router-dom';

   export default function ScrollToTop() {
     const { pathname } = useLocation();

     useEffect(() => {
       window.scrollTo(0, 0);
     }, [pathname]);

     return null;
   }
   ```

3. **Intégrer dans App.jsx**
   ```javascript
   import ScrollToTop from './components/ScrollToTop';

   function App() {
     return (
       <>
         <ScrollToTop />
         <Header />
         <main className="main-content">
           <Outlet />
         </main>
         <Footer />
         <PlayerBar />
       </>
     );
   }
   ```

4. **(Optionnel) Transitions avancées avec Framer Motion**
   ```bash
   npm install framer-motion
   ```

#### Critères de Validation
- [ ] Scroll to top automatique lors changement page
- [ ] Smooth scroll sur ancres (#section)
- [ ] Transition fade optionnelle entre pages
- [ ] Aucun lag lors navigation
- [ ] Compatible mobile/desktop

#### Fichiers Créés/Modifiés
- ✅ `src/components/ScrollToTop.jsx` (nouveau)
- ✅ `src/index.css` (modifié)
- ✅ `src/App.jsx` (modifié)

#### Notes
- Framer Motion optionnel pour MVP (peut ajouter V1.1)

---

### Tâche 3.9 : SEO Basique (Meta Tags) ⏳
- **Durée estimée :** 3 heures
- **Priorité :** 🟡 MOYENNE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3.1, 3.3, 3.5

#### Objectif
Ajouter metadata SEO pour Google et réseaux sociaux

#### Actions à Réaliser

1. **Installer react-helmet-async**
   ```bash
   npm install react-helmet-async
   ```

2. **Setup HelmetProvider dans `main.jsx`**
   ```javascript
   import { HelmetProvider } from 'react-helmet-async';

   createRoot(document.getElementById('root')).render(
     <StrictMode>
       <ErrorBoundary>
         <HelmetProvider>
           <RouterProvider router={router} />
         </HelmetProvider>
       </ErrorBoundary>
     </StrictMode>
   );
   ```

3. **Créer composant SEO `src/components/SEO.jsx`**
   ```javascript
   import { Helmet } from 'react-helmet-async';

   export default function SEO({ 
     title = 'C6Radio - Radio en ligne 24/7',
     description = 'Écoutez C6Radio en direct. Musique, actus, podcasts et bien plus encore.',
     keywords = 'radio, c6radio, radio en ligne, direct, podcast, musique',
     image = '/logo-c6radio.png',
     url = 'https://radio.c6media.fr'
   }) {
     return (
       <Helmet>
         {/* Meta basiques */}
         <title>{title}</title>
         <meta name="description" content={description} />
         <meta name="keywords" content={keywords} />

         {/* Open Graph (Facebook) */}
         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:image" content={image} />
         <meta property="og:url" content={url} />
         <meta property="og:type" content="website" />

         {/* Twitter Card */}
         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:title" content={title} />
         <meta name="twitter:description" content={description} />
         <meta name="twitter:image" content={image} />

         {/* Autres */}
         <meta name="author" content="C6Radio" />
         <link rel="canonical" href={url} />
       </Helmet>
     );
   }
   ```

4. **Utiliser dans chaque page**
   ```javascript
   // Home.jsx
   import SEO from '../components/SEO';

   export default function Home() {
     return (
       <>
         <SEO 
           title="C6Radio - Accueil"
           description="Écoutez C6Radio en direct 24/7. Votre radio préférée en ligne."
         />
         <div className="home">
           {/* Contenu page */}
         </div>
       </>
     );
   }

   // About.jsx
   export default function About() {
     return (
       <>
         <SEO 
           title="À propos - C6Radio"
           description="Découvrez l'histoire et la mission de C6Radio."
         />
         <div className="about-page">
           {/* Contenu page */}
         </div>
       </>
     );
   }
   ```

5. **Modifier `index.html`** (meta par défaut)
   ```html
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/png" href="/logo-c6radio.png" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="theme-color" content="#16a34a" />
     <meta name="description" content="C6Radio - Radio en ligne 24/7" />
     <title>C6Radio</title>
   </head>
   ```

#### Critères de Validation
- [ ] `react-helmet-async` installé
- [ ] Composant SEO créé
- [ ] SEO utilisé sur Home et About
- [ ] Meta title/description dynamiques
- [ ] Open Graph tags présents
- [ ] Twitter Card tags présents
- [ ] Favicon configuré
- [ ] Theme color défini

#### Fichiers Créés/Modifiés
- ✅ `src/components/SEO.jsx` (nouveau)
- ✅ `src/main.jsx` (modifié)
- ✅ `src/pages/Home.jsx` (modifié)
- ✅ `src/pages/About.jsx` (modifié)
- ✅ `index.html` (modifié)

#### Notes
- URLs absolues pour Open Graph (ex: https://radio.c6media.fr)
- Image OG recommandée : 1200x630px

---

### Tâche 3.10 : Favicon + PWA Manifest ⏳
- **Durée estimée :** 2 heures
- **Priorité :** 🟢 MOYENNE
- **Statut :** ⏳ À faire
- **Dépendances :** Aucune

#### Objectif
Ajouter favicon multi-tailles et PWA manifest basique

#### Actions à Réaliser

1. **Générer favicons**
   - Utiliser le logo C6Radio 512x512px
   - Générer avec https://realfavicongenerator.net/
   - Formats : 16x16, 32x32, 180x180 (Apple), 192x192, 512x512

2. **Placer les favicons dans `public/`**
   ```
   public/
   ├── favicon.ico
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   ├── android-chrome-192x192.png
   └── android-chrome-512x512.png
   ```

3. **Créer `public/manifest.json`**
   ```json
   {
     "name": "C6Radio - Radio en ligne",
     "short_name": "C6Radio",
     "description": "Écoutez C6Radio en direct 24/7",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#16a34a",
     "orientation": "portrait-primary",
     "icons": [
       {
         "src": "/android-chrome-192x192.png",
         "sizes": "192x192",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/android-chrome-512x512.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "any maskable"
       }
     ]
   }
   ```

4. **Mettre à jour `index.html`**
   ```html
   <head>
     <!-- Favicons -->
     <link rel="icon" type="image/x-icon" href="/favicon.ico" />
     <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
     <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
     <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
     
     <!-- PWA Manifest -->
     <link rel="manifest" href="/manifest.json" />
     
     <!-- Theme color -->
     <meta name="theme-color" content="#16a34a" />
     <meta name="apple-mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-status-bar-style" content="default" />
   </head>
   ```

5. **(Optionnel) Service Worker basique**
   Créer `public/sw.js` pour cache offline :
   ```javascript
   // Service worker basique - Version MVP
   const CACHE_NAME = 'c6radio-v1';
   const urlsToCache = [
     '/',
     '/index.html',
     '/logo-c6radio.png'
   ];

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then((cache) => cache.addAll(urlsToCache))
     );
   });

   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request)
         .then((response) => response || fetch(event.request))
     );
   });
   ```

   Enregistrer dans `main.jsx` :
   ```javascript
   // Enregistrer service worker
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js')
         .then(reg => console.log('SW registered'))
         .catch(err => console.log('SW error', err));
     });
   }
   ```

#### Critères de Validation
- [ ] Favicons générés (tous formats)
- [ ] Favicons placés dans public/
- [ ] manifest.json créé avec bon theme_color
- [ ] Liens favicon dans index.html
- [ ] Test mobile : icône visible si "Add to Home Screen"
- [ ] Test manifest : Chrome DevTools → Application → Manifest
- [ ] Service Worker optionnel enregistré (vérifier console)

#### Fichiers Créés/Modifiés
- ✅ `public/favicon.ico` (nouveau)
- ✅ `public/favicon-*.png` (nouveaux)
- ✅ `public/manifest.json` (nouveau)
- ✅ `public/sw.js` (optionnel)
- ✅ `index.html` (modifié)
- ✅ `src/main.jsx` (modifié si SW)

#### Notes
- PWA complet sera fait Phase 8+
- Service Worker optionnel pour Phase 3A

---

## 🏗️ PHASE 3B : WORDPRESS DYNAMIQUE (Semaine 2)

> **Objectif :** Rendre les pages modulaires via WordPress (FR36.1)  
> **Durée :** 3-4 jours (14 heures)  
> **Pages :** Gérées par l'équipe éditoriale dans WordPress

---

## 🎯 Conformité PRD

### FR36.1 : Pages Modulaires
> **CRITIQUE - L'équipe éditoriale choisit quelles pages sont affichées sur l'appli**  
> Les pages sélectionnées par l'équipe doivent être affichées dans le menu hamburger/navigation

### FR38.1 : Synchronisation Automatique
> **CRITIQUE - Synchronisation automatique WordPress sans rebuild**  
> Le contenu WordPress se synchronise automatiquement sur le site web sans rebuild manuel

---

## ✅ Liste des Tâches Phase 3B

### Tâche 3B.1 : Configuration WordPress Pages ⏳
- **Durée estimée :** 2 heures
- **Priorité :** 🔴 CRITIQUE
- **Statut :** ⏳ À faire
- **Dépendances :** Accès WordPress + permissions

#### Objectif
Configurer WordPress pour exposer les pages via REST API avec options de menu

#### Actions à Réaliser

1. **Créer des pages de test dans WordPress**
   - À propos
   - Contact
   - Mentions légales
   - Politique de confidentialité

2. **Ajouter champs personnalisés ACF (optionnel mais recommandé)**
   ```
   Groupe de champs : "Options Menu"
   
   Champs :
   - show_in_menu (Vrai/Faux) : Afficher dans le menu
   - menu_order (Nombre) : Ordre d'affichage
   - menu_label (Texte) : Libellé custom (optionnel)
   ```

3. **Alternative sans ACF : Utiliser champs natifs WordPress**
   - Ordre : Attribut de page (Order)
   - Menu : Cocher "Ajouter aux menus"

4. **Tester endpoint API**
   ```bash
   # Tester dans le navigateur
   https://wordpress.c6media.fr/wp-json/wp/v2/pages
   ```

5. **Vérifier réponse JSON**
   ```json
   [
     {
       "id": 123,
       "slug": "about",
       "title": { "rendered": "À propos" },
       "content": { "rendered": "<p>Contenu...</p>" },
       "menu_order": 1,
       "acf": {
         "show_in_menu": true,
         "menu_label": "À propos"
       }
     }
   ]
   ```

#### Critères de Validation
- [ ] Au moins 3-4 pages créées dans WordPress
- [ ] Pages accessibles via REST API
- [ ] Champs ACF configurés (ou attributs natifs)
- [ ] Endpoint retourne du JSON valide
- [ ] Permissions CORS configurées si nécessaire

#### Fichiers WordPress Modifiés
- ✅ Pages créées dans admin WordPress
- ✅ ACF configuré (optionnel)

#### Notes
- ACF recommandé mais pas obligatoire
- Champs natifs WordPress suffisants pour MVP

---

### Tâche 3B.2 : Client API WordPress ⏳
- **Durée estimée :** 3 heures
- **Priorité :** 🔴 CRITIQUE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3B.1

#### Objectif
Créer un client JavaScript pour fetcher les pages WordPress

#### Actions à Réaliser

1. **Créer `src/lib/api/wordpress.js`**
   ```javascript
   // URL de base WordPress
   const WP_BASE_URL = 'https://wordpress.c6media.fr/wp-json/wp/v2';
   
   /**
    * Fetch toutes les pages WordPress pour le menu
    * Filtre : show_in_menu = true
    * Tri : par menu_order
    */
   export async function fetchMenuPages() {
     try {
       const response = await fetch(`${WP_BASE_URL}/pages?per_page=20&orderby=menu_order&order=asc`);
       
       if (!response.ok) {
         throw new Error(`WordPress API error: ${response.status}`);
       }
       
       const pages = await response.json();
       
       // Filtrer pages à afficher dans le menu
       // Si ACF : filter par acf.show_in_menu
       // Sinon : toutes les pages publiées
       return pages.map(page => ({
         id: page.id,
         slug: page.slug,
         title: page.title.rendered,
         menuLabel: page.acf?.menu_label || page.title.rendered,
         menuOrder: page.menu_order || 0,
         showInMenu: page.acf?.show_in_menu !== false, // true par défaut
       })).filter(page => page.showInMenu);
       
     } catch (error) {
       console.error('Erreur fetch menu pages:', error);
       // Fallback : retourner pages par défaut
       return [
         { slug: 'about', title: 'À propos', menuLabel: 'À propos', menuOrder: 1 },
         { slug: 'contact', title: 'Contact', menuLabel: 'Contact', menuOrder: 2 },
       ];
     }
   }
   
   /**
    * Fetch une page WordPress par slug
    * @param {string} slug - Le slug de la page
    */
   export async function fetchPageBySlug(slug) {
     try {
       const response = await fetch(`${WP_BASE_URL}/pages?slug=${slug}`);
       
       if (!response.ok) {
         throw new Error(`WordPress API error: ${response.status}`);
       }
       
       const pages = await response.json();
       
       if (pages.length === 0) {
         return null; // Page non trouvée
       }
       
       const page = pages[0];
       
       return {
         id: page.id,
         slug: page.slug,
         title: page.title.rendered,
         content: page.content.rendered,
         excerpt: page.excerpt.rendered,
       };
       
     } catch (error) {
       console.error(`Erreur fetch page ${slug}:`, error);
       return null;
     }
   }
   ```

2. **Créer `src/lib/constants.js` (externaliser URLs)**
   ```javascript
   // URLs configuration
   export const WP_API_URL = 'https://wordpress.c6media.fr/wp-json/wp/v2';
   export const STREAM_URL = 'https://radio.c6media.fr:8443/main';
   export const NOW_PLAYING_URL = 'https://radio.c6media.fr/api/live-info';
   ```

#### Critères de Validation
- [ ] Fichier `wordpress.js` créé
- [ ] Fonction `fetchMenuPages()` retourne liste pages
- [ ] Fonction `fetchPageBySlug()` retourne contenu page
- [ ] Gestion erreurs avec fallback
- [ ] Test dans console navigateur fonctionne
- [ ] URLs externalisées dans constants.js

#### Fichiers Créés/Modifiés
- ✅ `src/lib/api/wordpress.js` (nouveau)
- ✅ `src/lib/constants.js` (nouveau)

#### Notes
- Fallback pages hardcodées si WordPress down
- Cache local possible (Phase 4)

---

### Tâche 3B.3 : Navigation Dynamique (Header) ⏳
- **Durée estimée :** 3 heures
- **Priorité :** 🔴 CRITIQUE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3B.2

#### Objectif
Remplacer la navigation hardcodée par un fetch WordPress dynamique

#### Actions à Réaliser

1. **Modifier `Header.jsx`**
   ```javascript
   import { Link, NavLink } from 'react-router-dom';
   import { useState, useEffect } from 'react';
   import { fetchMenuPages } from '../../lib/api/wordpress';
   import './Header.css';

   export default function Header() {
     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
     const [menuPages, setMenuPages] = useState([]);
     const [loading, setLoading] = useState(true);

     // Fetch pages menu au montage
     useEffect(() => {
       async function loadMenuPages() {
         const pages = await fetchMenuPages();
         setMenuPages(pages);
         setLoading(false);
       }
       loadMenuPages();
     }, []);

     const toggleMobileMenu = () => {
       setMobileMenuOpen(!mobileMenuOpen);
     };

     const closeMobileMenu = () => {
       setMobileMenuOpen(false);
     };

     return (
       <header className="header">
         <div className="header-container">
           {/* Logo */}
           <Link to="/" className="header-logo" onClick={closeMobileMenu}>
             <img src="/logo-c6radio.png" alt="C6Radio" />
             <span>C6Radio</span>
           </Link>

           {/* Navigation desktop */}
           <nav className="header-nav desktop-nav">
             <NavLink to="/" className="nav-link">Accueil</NavLink>
             
             {/* Pages WordPress dynamiques */}
             {loading ? (
               <span className="nav-loading">Chargement...</span>
             ) : (
               menuPages.map(page => (
                 <NavLink 
                   key={page.id} 
                   to={`/${page.slug}`} 
                   className="nav-link"
                 >
                   {page.menuLabel}
                 </NavLink>
               ))
             )}
           </nav>

           {/* Bouton hamburger mobile */}
           <button 
             className={`header-hamburger ${mobileMenuOpen ? 'open' : ''}`}
             onClick={toggleMobileMenu}
             aria-label="Menu"
           >
             <span></span>
             <span></span>
             <span></span>
           </button>
         </div>

         {/* Menu mobile */}
         <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
           <NavLink to="/" onClick={closeMobileMenu}>Accueil</NavLink>
           
           {/* Pages WordPress dynamiques */}
           {menuPages.map(page => (
             <NavLink 
               key={page.id} 
               to={`/${page.slug}`} 
               onClick={closeMobileMenu}
             >
               {page.menuLabel}
             </NavLink>
           ))}
         </nav>

         {/* Overlay */}
         {mobileMenuOpen && (
           <div 
             className="mobile-overlay" 
             onClick={closeMobileMenu}
           />
         )}
       </header>
     );
   }
   ```

2. **Ajouter styles loading dans `Header.css`**
   ```css
   .nav-loading {
     color: #9ca3af;
     font-size: 0.875rem;
     font-style: italic;
   }
   ```

#### Critères de Validation
- [ ] Header fetch pages WordPress au montage
- [ ] Liens menu générés dynamiquement
- [ ] Indicateur "Chargement..." si fetch en cours
- [ ] Fallback si WordPress down (pages par défaut)
- [ ] Menu mobile aussi dynamique
- [ ] Active link style fonctionne toujours
- [ ] Aucune erreur console
- [ ] Performance OK (fetch 1x pas à chaque render)

#### Fichiers Créés/Modifiés
- ✅ `src/components/layout/Header.jsx` (modifié)
- ✅ `src/components/layout/Header.css` (modifié)

#### Notes
- useEffect avec [] pour fetch 1 seule fois
- Cache possible avec localStorage (Phase 4)

---

### Tâche 3B.4 : Page Dynamique Générique ⏳
- **Durée estimée :** 4 heures
- **Priorité :** 🔴 CRITIQUE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3B.2

#### Objectif
Créer un composant générique qui affiche n'importe quelle page WordPress

#### Actions à Réaliser

1. **Créer `src/pages/DynamicPage.jsx`**
   ```javascript
   import { useEffect, useState } from 'react';
   import { useParams, Navigate } from 'react-router-dom';
   import { fetchPageBySlug } from '../lib/api/wordpress';
   import SEO from '../components/SEO';
   import './DynamicPage.css';

   export default function DynamicPage() {
     const { slug } = useParams(); // Récupère le slug depuis l'URL
     const [page, setPage] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(false);

     useEffect(() => {
       async function loadPage() {
         setLoading(true);
         setError(false);
         
         const pageData = await fetchPageBySlug(slug);
         
         if (pageData) {
           setPage(pageData);
         } else {
           setError(true);
         }
         
         setLoading(false);
       }
       
       loadPage();
     }, [slug]); // Re-fetch si slug change

     // État loading
     if (loading) {
       return (
         <div className="dynamic-page loading">
           <div className="loading-spinner">
             <div className="spinner"></div>
             <p>Chargement...</p>
           </div>
         </div>
       );
     }

     // État erreur (page non trouvée)
     if (error || !page) {
       return <Navigate to="/404" replace />;
     }

     // Affichage page
     return (
       <>
         <SEO 
           title={`${page.title} - C6Radio`}
           description={page.excerpt}
         />
         
         <div className="dynamic-page">
           <div className="dynamic-page-container">
             <h1 className="page-title">{page.title}</h1>
             
             {/* Contenu HTML de WordPress */}
             <div 
               className="page-content"
               dangerouslySetInnerHTML={{ __html: page.content }}
             />
           </div>
         </div>
       </>
     );
   }
   ```

2. **Créer `src/pages/DynamicPage.css`**
   ```css
   .dynamic-page {
     min-height: calc(100vh - 200px);
     padding: 2rem 1rem 8rem 1rem;
     background: #f9fafb;
   }

   .dynamic-page-container {
     max-width: 800px;
     margin: 0 auto;
     background: white;
     padding: 3rem;
     border-radius: 8px;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
   }

   .page-title {
     font-size: 2.5rem;
     color: #16a34a;
     margin-bottom: 2rem;
   }

   .page-content {
     font-size: 1.125rem;
     line-height: 1.7;
     color: #374151;
   }

   /* Styles pour contenu WordPress */
   .page-content h2 {
     font-size: 1.75rem;
     color: #1f2937;
     margin-top: 2rem;
     margin-bottom: 1rem;
     border-bottom: 2px solid #16a34a;
     padding-bottom: 0.5rem;
   }

   .page-content h3 {
     font-size: 1.5rem;
     color: #1f2937;
     margin-top: 1.5rem;
     margin-bottom: 0.75rem;
   }

   .page-content p {
     margin-bottom: 1rem;
   }

   .page-content ul, .page-content ol {
     margin-left: 1.5rem;
     margin-bottom: 1rem;
   }

   .page-content a {
     color: #16a34a;
     text-decoration: underline;
   }

   .page-content img {
     max-width: 100%;
     height: auto;
     border-radius: 8px;
     margin: 1.5rem 0;
   }

   /* Loading spinner */
   .dynamic-page.loading {
     display: flex;
     justify-content: center;
     align-items: center;
     min-height: 50vh;
   }

   .loading-spinner {
     text-align: center;
   }

   .spinner {
     width: 50px;
     height: 50px;
     border: 4px solid #e5e7eb;
     border-top-color: #16a34a;
     border-radius: 50%;
     animation: spin 1s linear infinite;
     margin: 0 auto 1rem;
   }

   @keyframes spin {
     to { transform: rotate(360deg); }
   }

   /* Responsive */
   @media (max-width: 768px) {
     .dynamic-page-container {
       padding: 2rem 1.5rem;
     }
     .page-title {
       font-size: 2rem;
     }
   }
   ```

3. **Modifier `router.jsx` : Ajouter route catch-all**
   ```javascript
   import DynamicPage from './pages/DynamicPage';
   import NotFound from './pages/NotFound'; // À créer

   export const router = createBrowserRouter([
     {
       path: '/',
       element: <App />,
       children: [
         { index: true, element: <Home /> },
         
         // Route catch-all pour pages WordPress
         // IMPORTANT : Doit être APRÈS les routes fixes
         { path: ':slug', element: <DynamicPage /> },
         
         // 404
         { path: '*', element: <NotFound /> },
       ],
     },
   ]);
   ```

4. **Créer page 404 simple `src/pages/NotFound.jsx`**
   ```javascript
   import { Link } from 'react-router-dom';
   import './NotFound.css';

   export default function NotFound() {
     return (
       <div className="not-found">
         <h1>404</h1>
         <p>Page non trouvée</p>
         <Link to="/" className="back-home">Retour à l'accueil</Link>
       </div>
     );
   }
   ```

#### Critères de Validation
- [ ] DynamicPage.jsx créé et fonctionnel
- [ ] Page fetch contenu depuis WordPress par slug
- [ ] Contenu HTML WordPress affiché correctement
- [ ] Spinner loading pendant fetch
- [ ] Redirection 404 si page inexistante
- [ ] Styles WordPress (h2, h3, p, img) appliqués
- [ ] Route catch-all configurée dans router
- [ ] SEO tags dynamiques (title, description)
- [ ] Aucune faille XSS (dangerouslySetInnerHTML OK pour WordPress)

#### Fichiers Créés/Modifiés
- ✅ `src/pages/DynamicPage.jsx` (nouveau)
- ✅ `src/pages/DynamicPage.css` (nouveau)
- ✅ `src/pages/NotFound.jsx` (nouveau)
- ✅ `src/pages/NotFound.css` (nouveau)
- ✅ `src/router.jsx` (modifié)

#### Notes
- `dangerouslySetInnerHTML` sécurisé si contenu WordPress de confiance
- Sanitization HTML avec DOMPurify possible (Phase 4)
- Route catch-all APRÈS routes fixes importantes

---

### Tâche 3B.5 : Supprimer Pages Hardcodées ⏳
- **Durée estimée :** 2 heures
- **Priorité :** 🟡 MOYENNE
- **Statut :** ⏳ À faire
- **Dépendances :** Tâche 3B.4

#### Objectif
Nettoyer le code : supprimer About.jsx et Contact.jsx (remplacées par DynamicPage)

#### Actions à Réaliser

1. **Supprimer fichiers obsolètes**
   ```bash
   # Supprimer
   src/pages/About.jsx
   src/pages/About.css
   src/pages/Contact.jsx
   src/pages/Contact.css
   ```

2. **Nettoyer imports dans `router.jsx`**
   ```javascript
   // ❌ Supprimer ces imports
   // import About from './pages/About';
   // import Contact from './pages/Contact';
   
   // ✅ Garder seulement
   import Home from './pages/Home';
   import DynamicPage from './pages/DynamicPage';
   import NotFound from './pages/NotFound';
   ```

3. **Vérifier routes**
   ```javascript
   export const router = createBrowserRouter([
     {
       path: '/',
       element: <App />,
       children: [
         { index: true, element: <Home /> },
         { path: ':slug', element: <DynamicPage /> }, // Gère about, contact, etc.
         { path: '*', element: <NotFound /> },
       ],
     },
   ]);
   ```

4. **Tester navigation**
   - `/` → Home ✅
   - `/about` → DynamicPage (WordPress) ✅
   - `/contact` → DynamicPage (WordPress) ✅
   - `/inexistant` → NotFound 404 ✅

#### Critères de Validation
- [ ] Fichiers About/Contact supprimés
- [ ] Imports nettoyés
- [ ] Navigation fonctionne via DynamicPage
- [ ] Aucune erreur console
- [ ] Build production réussit

#### Fichiers Supprimés
- ❌ `src/pages/About.jsx`
- ❌ `src/pages/About.css`
- ❌ `src/pages/Contact.jsx`
- ❌ `src/pages/Contact.css`

#### Fichiers Modifiés
- ✅ `src/router.jsx` (nettoyé)

#### Notes
- Home.jsx reste hardcodée (cas spécial avec hero + player)
- Toutes les autres pages viennent de WordPress

---

## 📝 Notes de Session Phase 3B

### Session Phase 3B - [Date]
**Tâches complétées :**
- [ ] 3B.1 - Configuration WordPress
- [ ] 3B.2 - Client API
- [ ] 3B.3 - Navigation dynamique
- [ ] 3B.4 - DynamicPage
- [ ] 3B.5 - Nettoyage

**Problèmes rencontrés :**
- ...

**Décisions prises :**
- ...

---

## 📝 Notes de Session Phase 3A
**Tâches complétées :**
- [ ] ...

**Problèmes rencontrés :**
- ...

**Décisions prises :**
- ...

---

### Session 2 - [Date]
**Tâches complétées :**
- [ ] ...

**Problèmes rencontrés :**
- ...

---

### Session 3 - [Date]
**Tâches complétées :**
- [ ] ...

---

## 📋 Checklist Progression Phase 3 Complète

### Phase 3A : Fondations Simples (10 tâches)
- [ ] **3.1** - React Router Setup (3h)
- [ ] **3.2** - Header + Navigation Desktop (3h)
- [ ] **3.3** - Page Home avec Hero (4h)
- [ ] **3.4** - Footer Statique (2h)
- [ ] **3.5** - Pages About + Contact (3h)
- [ ] **3.6** - Menu Hamburger Mobile (3h)
- [ ] **3.7** - Animations & Transitions (2h)
- [ ] **3.8** - SEO Component (2h)
- [ ] **3.9** - Favicon + Manifest PWA (2h)
- [ ] **3.10** - Service Worker (optionnel) (2h)

**Progression Phase 3A :** 0/10 ✅

---

### Phase 3B : WordPress Dynamique (5 tâches)
- [ ] **3B.1** - Configuration WordPress Pages (2h) 🔴 CRITIQUE
- [ ] **3B.2** - Client API WordPress (3h) 🔴 CRITIQUE
- [ ] **3B.3** - Navigation Dynamique Header (3h) 🔴 CRITIQUE
- [ ] **3B.4** - Page Dynamique Générique (4h) 🔴 CRITIQUE
- [ ] **3B.5** - Supprimer Pages Hardcodées (2h)

**Progression Phase 3B :** 0/5 ✅

---

### Progression Globale Phase 3

```
Phase 3A : [▁▁▁▁▁▁▁▁▁▁] 0% (0/10)
Phase 3B : [▁▁▁▁▁] 0% (0/5)
─────────────────────────────────
TOTAL    : [▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁] 0% (0/15)
```

**Temps estimé restant :** 36 heures (7-9 jours)

---

## 🎯 Checklist Finale Phase 3

### Tests Fonctionnels Phase 3A
- [ ] Navigation entre toutes les pages fonctionne
- [ ] Header visible sur toutes les pages
- [ ] Footer visible sur toutes les pages
- [ ] PlayerBar reste sticky en bas
- [ ] Menu hamburger fonctionne sur mobile
- [ ] Bouton "Écouter en direct" sur Home déclenche play
- [ ] Now Playing s'affiche sur Home
- [ ] Responsive testé : 320px, 768px, 1920px
- [ ] Aucune erreur console
- [ ] Build production fonctionne : `npm run build`

### Tests Fonctionnels Phase 3B (WordPress)
- [ ] Pages WordPress affichées dans navigation
- [ ] Clic sur lien menu charge page WordPress
- [ ] Contenu HTML WordPress rendu correctement
- [ ] Spinner loading pendant fetch
- [ ] 404 si page WordPress inexistante
- [ ] Navigation dynamique met à jour si pages WordPress changent
- [ ] Fallback pages par défaut si WordPress down
- [ ] Aucune erreur console avec WordPress API

### Tests Multi-Navigateurs
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

### SEO & Meta
- [ ] Meta title unique par page
- [ ] Meta description unique par page
- [ ] Open Graph tags présents
- [ ] Favicon visible onglet
- [ ] Manifest PWA valide (Chrome DevTools)

### Performance
- [ ] Lighthouse Score > 90 (Performance)
- [ ] Lighthouse Score > 90 (Accessibility)
- [ ] Lighthouse Score > 90 (Best Practices)
- [ ] Lighthouse Score > 90 (SEO)

---

## 📦 Livrables Phase 3

### Fichiers Créés Phase 3A
- [ ] `src/router.jsx`
- [ ] `src/components/layout/Header.jsx` + `.css`
- [ ] `src/components/layout/Footer.jsx` + `.css`
- [ ] `src/components/SEO.jsx`
- [ ] `src/components/ScrollToTop.jsx`
- [ ] `src/pages/Home.jsx` + `.css`
- [ ] `src/pages/About.jsx` + `.css` (temporaire, supprimé en 3B)
- [ ] `src/pages/Contact.jsx` + `.css` (temporaire, supprimé en 3B)
- [ ] `public/manifest.json`
- [ ] `public/favicon*` (tous formats)
- [ ] `public/sw.js` (optionnel)

### Fichiers Créés Phase 3B
- [ ] `src/lib/api/wordpress.js` (client API)
- [ ] `src/lib/constants.js` (URLs externalisées)
- [ ] `src/pages/DynamicPage.jsx` + `.css` (page générique WordPress)
- [ ] `src/pages/NotFound.jsx` + `.css` (page 404)

### Fichiers Supprimés Phase 3B
- [ ] ❌ `src/pages/About.jsx` + `.css` (remplacé par DynamicPage)
- [ ] ❌ `src/pages/Contact.jsx` + `.css` (remplacé par DynamicPage)

### Fichiers Modifiés Phase 3A
- [ ] `src/main.jsx` (RouterProvider + HelmetProvider)
- [ ] `src/App.jsx` (Header + Footer + Outlet)
- [ ] `index.html` (favicons + manifest)
- [ ] `package.json` (react-router-dom + react-helmet-async)

### Fichiers Modifiés Phase 3B
- [ ] `src/components/layout/Header.jsx` (navigation dynamique WordPress)
- [ ] `src/router.jsx` (route catch-all `:slug` pour DynamicPage)

### Documentation
- [ ] Ce fichier mis à jour avec notes de sessions
- [ ] Screenshots des pages (Home, About)
- [ ] Décisions techniques documentées

---

## 🚀 Passage à la Phase 4

**Critères pour démarrer Phase 4 :**
- ✅ Toutes les tâches Phase 3A complétées (10 tâches)
- ✅ Toutes les tâches Phase 3B complétées (5 tâches)
- ✅ Tests fonctionnels Phase 3A validés (hardcoded)
- ✅ Tests fonctionnels Phase 3B validés (WordPress dynamique)
- ✅ Build production réussit
- ✅ Responsive OK mobile/desktop
- ✅ Navigation dynamique WordPress fonctionne
- ✅ FR36.1 conforme : Pages modulaires via WordPress ✅

**Phase 4 : Intégration WordPress - Actus**
- Durée : 5-6 jours
- Client API WordPress (articles custom post type)
- Liste actus + détail article
- Filtres + recherche
- Pagination

**Note importante :**  
Phase 3B doit être 100% complète avant Phase 4 car la Phase 4 réutilise le client API WordPress créé en Phase 3B.

---

## 📧 Support

**Questions sur Phase 3 :**
Consulter [implementation-plan.md](implementation-plan.md) section Phase 3

**Bugs rencontrés :**
Noter dans section "Notes de Session Phase 3A" ou "Notes de Session Phase 3B"

**Aide React Router :**
https://reactrouter.com/en/main

**Aide WordPress REST API :**
https://developer.wordpress.org/rest-api/

---

**Dernière mise à jour :** 14 février 2026  
**Créé par :** GitHub Copilot Assistant  
**Version :** 2.0 (Approche Progressive 3A → 3B)
