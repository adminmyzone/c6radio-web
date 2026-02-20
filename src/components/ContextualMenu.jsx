/**
 * ContextualMenu - Menu hamburger pour sections contextuelles
 * 
 * EXPLICATION :
 * Menu dédié aux sections contextuelles (Élections, Événements, etc.)
 * Affiche la liste des sous-sections (communes, événements) avec navigation.
 * 
 * USAGE :
 * <ContextualMenu 
 *   context="elections" 
 *   pages={[{slug: 'beaumont', title: 'Beaumont'}, ...]}
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 * />
 * 
 * COMPORTEMENT :
 * - Slide-in depuis la gauche (comme menu principal)
 * - Clic lien → Ferme menu automatiquement
 * - État persisté dans localStorage
 * - Responsive mobile-first
 */

import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './ContextualMenu.css';

export default function ContextualMenu({ context, pages, isOpen, onClose }) {
  /**
   * Effet : Gérer scroll body quand menu ouvert
   * Empêche le scroll de la page quand le menu est ouvert
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup : restaurer scroll au démontage
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /**
   * Gérer fermeture au clic sur backdrop
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Gérer fermeture au clic sur un lien
   */
  const handleLinkClick = () => {
    onClose();
  };

  /**
   * Icône selon contexte
   */
  const getContextIcon = (ctx) => {
    switch(ctx) {
      case 'elections': return '🗳️';
      case 'evenements': return '🎉';
      case 'quartiers': return '🏘️';
      case 'sports': return '⚽';
      default: return '📁';
    }
  };

  /**
   * Label selon contexte
   */
  const getContextLabel = (ctx) => {
    switch(ctx) {
      case 'elections': return 'Élections';
      case 'evenements': return 'Événements';
      case 'quartiers': return 'Quartiers';
      case 'sports': return 'Sports';
      default: return ctx.charAt(0).toUpperCase() + ctx.slice(1);
    }
  };

  return (
    <>
      {/* Backdrop (fond sombre) */}
      <div 
        className={`contextual-menu-backdrop ${isOpen ? 'active' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Menu coulissant */}
      <aside 
        className={`contextual-menu ${isOpen ? 'open' : ''}`}
        aria-label={`Menu ${getContextLabel(context)}`}
      >
        <div className="contextual-menu-header">
          <div className="contextual-menu-title">
            <span className="contextual-menu-icon" aria-hidden="true">
              {getContextIcon(context)}
            </span>
            <h2>{getContextLabel(context)}</h2>
          </div>
          
          {/* Bouton fermer */}
          <button 
            className="contextual-menu-close"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        <nav className="contextual-menu-nav">
          {/* Lien retour à la page d'accueil de la section */}
          <div className="contextual-menu-section">
            <Link 
              to={`/${context}`}
              className="contextual-menu-home"
              onClick={handleLinkClick}
            >
              ← Toutes les {getContextLabel(context).toLowerCase()}
            </Link>
          </div>

          {/* Liste des sous-sections */}
          {pages.length > 0 ? (
            <ul className="contextual-menu-list">
              {pages.map((page) => (
                <li key={page.slug}>
                  <NavLink
                    to={`/${context}/${page.slug}`}
                    className={({ isActive }) => 
                      isActive ? 'contextual-menu-link active' : 'contextual-menu-link'
                    }
                    onClick={handleLinkClick}
                  >
                    {page.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <div className="contextual-menu-empty">
              <p>Aucune sous-section disponible pour le moment.</p>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
