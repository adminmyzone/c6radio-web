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
          <Link to="/" className="logo-link">
            <h1>C6Radio</h1>
          </Link>
        </div>

        {/* ─────────────────────────────────────────────────
            LIENS PRIMAIRES - Toujours visibles inline
            (cachés sur mobile, le hamburger prend le relais)
            ───────────────────────────────────────────────── */}
        <ul className="nav-primary">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              end
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/news"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Actualités
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/elections"
              className={({ isActive }) => isActive ? 'nav-link active nav-link-elections' : 'nav-link nav-link-elections'}
            >
              <span className="nav-icon" aria-hidden="true">🗳️</span>
              Élections
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/evenements"
              className={({ isActive }) => isActive ? 'nav-link active nav-link-evenements' : 'nav-link nav-link-evenements'}
            >
              <span className="nav-icon" aria-hidden="true">🎉</span>
              Événements
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patrimoine"
              className={({ isActive }) => isActive ? 'nav-link active nav-link-patrimoine' : 'nav-link nav-link-patrimoine'}
            >
              <span className="nav-icon" aria-hidden="true">🏛️</span>
              Patrimoine
            </NavLink>
          </li>
        </ul>

        {/* ─────────────────────────────────────────────────
            BOUTON HAMBURGER
            Toujours visible (desktop + mobile)
            Ouvre le panneau avec tous les liens
            ───────────────────────────────────────────────── */}
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

        {/* Overlay sombre derrière le menu quand ouvert */}
        {isMobileMenuOpen && (
          <div className="header-overlay" onClick={closeMobileMenu} aria-hidden="true" />
        )}

        {/* ─────────────────────────────────────────────────
            PANNEAU HAMBURGER
            Contient TOUS les liens du site.
            Se glisse depuis la droite quand le hamburger est cliqué.
            ───────────────────────────────────────────────── */}
        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu} end>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
                Actualités
              </NavLink>
            </li>
            <li>
              <NavLink to="/elections" className={({ isActive }) => isActive ? 'nav-link active nav-link-elections' : 'nav-link nav-link-elections'} onClick={closeMobileMenu}>
                <span className="nav-icon" aria-hidden="true">🗳️</span> Élections
              </NavLink>
            </li>
            <li>
              <NavLink to="/evenements" className={({ isActive }) => isActive ? 'nav-link active nav-link-evenements' : 'nav-link nav-link-evenements'} onClick={closeMobileMenu}>
                <span className="nav-icon" aria-hidden="true">🎉</span> Événements
              </NavLink>
            </li>
            <li>
              <NavLink to="/patrimoine" className={({ isActive }) => isActive ? 'nav-link active nav-link-patrimoine' : 'nav-link nav-link-patrimoine'} onClick={closeMobileMenu}>
                <span className="nav-icon" aria-hidden="true">🏛️</span> Patrimoine
              </NavLink>
            </li>

            {/* Séparateur visuel */}
            <li className="nav-separator" aria-hidden="true" />

            <li>
              <NavLink to="/partenaires" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
                Nos Partenaires
              </NavLink>
            </li>
            <li>
              <NavLink to="/prestations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
                Nos Prestations
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
                Contact
              </NavLink>
            </li>

            {/* Appli : cachée sur mobile (desktop uniquement) */}
            <li className="nav-item--desktop-only">
              <NavLink to="/appli" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                📱 Appli
              </NavLink>
            </li>

            {/* Séparateur + pages WordPress dynamiques */}
            {!loadingPages && menuPages.length > 0 && (
              <li className="nav-separator" aria-hidden="true" />
            )}
            {loadingPages ? (
              <li className="nav-loading"><span>Chargement...</span></li>
            ) : (
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
