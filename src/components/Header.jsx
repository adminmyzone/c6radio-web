/**
 * Header - Barre de navigation principale
 * 
 * PHASE 3B - NAVIGATION DYNAMIQUE WORDPRESS :
 * -------------------------------------------
 * Le Header charge maintenant la liste des pages depuis WordPress !
 * 
 * AVANT (Phase 3A) :
 * Les liens étaient hardcodés : About, Contact, etc.
 * 
 * MAINTENANT (Phase 3B) :
 * - Au chargement, on fetch les pages depuis WordPress
 * - Les liens se créent automatiquement
 * - L'équipe éditoriale contrôle le menu depuis WordPress
 * 
 * FALLBACK :
 * Si WordPress est down, on affiche About + Contact par défaut.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchMenuPages } from '../services/wordpress.js';
import logger from '../lib/logger.js';
import './Header.css';

function Header() {
  // État pour gérer l'ouverture/fermeture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // État pour les pages du menu (chargées depuis WordPress)
  const [menuPages, setMenuPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);

  // Charger les pages du menu depuis WordPress au montage du composant
  useEffect(() => {
    async function loadMenu() {
      logger.log('[Header] Loading menu from WordPress...');
      
      const pages = await fetchMenuPages();
      
      logger.log(`[Header] Loaded ${pages.length} menu pages`);
      setMenuPages(pages);
      setLoadingPages(false);
    }

    loadMenu();
  }, []); // [] = exécuter une seule fois au montage

  // Fonction pour basculer le menu (ouvrir si fermé, fermer si ouvert)
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fonction pour fermer le menu quand on clique sur un lien
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo / Nom du site */}
        <div className="header-logo">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <h1>C6Radio</h1>
          </Link>
        </div>

        {/* Bouton hamburger (visible sur mobile uniquement) */}
        <button 
          className={`hamburger-button ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menu de navigation"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation principale */}
        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            {/* Lien Accueil (toujours présent) */}
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
                end
              >
                Accueil
              </NavLink>
            </li>

            {/* Lien Actualités (toujours présent) */}
            <li>
              <NavLink
                to="/news"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Actualités
              </NavLink>
            </li>

            {/* Lien Élections (section contextuelle) */}
            <li>
              <NavLink
                to="/elections"
                className={({ isActive }) => isActive ? 'nav-link active nav-link-elections' : 'nav-link nav-link-elections'}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon" aria-hidden="true">🗳️</span>
                Élections
              </NavLink>
            </li>

            {/* Pages WordPress dynamiques */}
            {loadingPages ? (
              // Afficher un message pendant le chargement
              <li className="nav-loading">
                <span>Chargement...</span>
              </li>
            ) : (
              // Afficher les pages chargées depuis WordPress
              menuPages.map(page => (
                <li key={page.id}>
                  <NavLink 
                    to={`/${page.slug}`}
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    onClick={closeMobileMenu}
                  >
                    {page.menuLabel}
                  </NavLink>
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * CHARGEMENT DYNAMIQUE :
 * useEffect(() => { ... }, []) charge les pages au montage du composant.
 * Le tableau vide [] signifie "exécuter une seule fois".
 * 
 * ÉTAT loadingPages :
 * Permet d'afficher "Chargement..." pendant le fetch.
 * Important pour UX (l'utilisateur sait que ça charge).
 * 
 * FALLBACK AUTOMATIQUE :
 * Si WordPress est down, fetchMenuPages() retourne About + Contact par défaut.
 * Le menu reste fonctionnel même si WordPress ne répond pas !
 * 
 * MAP POUR GÉNÉRER LES LIENS :
 * menuPages.map() crée un <NavLink> pour chaque page.
 * C'est comme une boucle : pour chaque page, créer un lien.
 * 
 * KEY PROP :
 * key={page.id} est obligatoire dans React pour les listes.
 * Aide React à savoir quel élément a changé.
 * 
 * AVANTAGES PHASE 3B :
 * ✅ Pas besoin de modifier le code pour ajouter une page
 * ✅ L'équipe éditoriale gère le menu depuis WordPress
 * ✅ Menu se met à jour automatiquement
 * ✅ Fallback si WordPress down
 */
