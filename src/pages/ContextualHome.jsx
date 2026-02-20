/**
 * ContextualHome - Page d'accueil d'une section contextuelle
 * 
 * EXPLICATION :
 * Page d'accueil listant toutes les sous-sections disponibles
 * (communes pour élections, événements pour événements, etc.)
 * 
 * USAGE :
 * <ContextualHome context="elections" />
 * 
 * AFFICHE :
 * - Liste des sous-sections (communes, événements)
 * - Optionnel : Articles récents de toutes les sous-sections
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchContextualPages } from '../services/wordpress.js';
import ContextualMenu from '../components/ContextualMenu.jsx';
import logger from '../lib/logger.js';
import './ContextualHome.css';
import '../styles/contextual-theme.css';

export default function ContextualHome({ context }) {
  // ====================================
  // ÉTATS REACT
  // ====================================

  /**
   * Pages contextuelles (sous-sections)
   */
  const [contextPages, setContextPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Menu hamburger
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ====================================
  // CHARGEMENT DES PAGES CONTEXTUELLES
  // ====================================

  useEffect(() => {
    async function loadContextPages() {
      try {
        logger.log(`[ContextualHome] Loading pages for context: ${context}`);
        setLoading(true);
        setError(null);

        const pages = await fetchContextualPages(context);
        setContextPages(pages);

        setLoading(false);
        logger.log(`[ContextualHome] Loaded ${pages.length} pages`);

      } catch (err) {
        logger.error('[ContextualHome] Error loading pages:', err);
        setError(err.message || 'Erreur lors du chargement');
        setLoading(false);
      }
    }

    loadContextPages();
  }, [context]);

  // ====================================
  // HELPERS
  // ====================================

  /**
   * Libellé du contexte
   */
  const getContextLabel = () => {
    switch(context) {
      case 'elections': return 'Élections';
      case 'evenements': return 'Événements';
      case 'quartiers': return 'Quartiers';
      case 'sports': return 'Sports';      case 'patrimoine': return 'Patrimoine & Découverte';      default: return context.charAt(0).toUpperCase() + context.slice(1);
    }
  };

  /**
   * Icône du contexte
   */
  const getContextIcon = () => {
    switch(context) {
      case 'elections': return '🗳️';
      case 'evenements': return '🎉';
      case 'quartiers': return '🏘️';
      case 'sports': return '⚽';
      case 'patrimoine': return '🏛️';
      default: return '📁';
    }
  };

  /**
   * Description du contexte
   */
  const getContextDescription = () => {
    switch(context) {
      case 'elections':
        return 'Retrouvez toutes les actualités électorales par commune.';
      case 'evenements':
        return 'Suivez l\'actualité de nos événements spéciaux.';
      case 'quartiers':
        return 'L\'actualité de votre quartier au quotidien.';
      case 'sports':
        return 'Toute l\'actualité sportive locale.';
      case 'patrimoine':
        return 'Découvrez le patrimoine et les richesses locales par commune.';
      default:
        return 'Sélectionnez une section ci-dessous.';
    }
  };

  // ====================================
  // HANDLERS
  // ====================================

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ====================================
  // RENDU
  // ====================================

  return (
    <div className={`contextual-home context-${context}`}>
      {/* Menu hamburger */}
      <ContextualMenu
        context={context}
        pages={contextPages}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* En-tête */}
      <div className="contextual-home-header">
        <button 
          className="contextual-menu-toggle"
          onClick={toggleMenu}
          aria-label="Ouvrir le menu"
        >
          <span className="hamburger-icon">☰</span>
        </button>

        <div className="contextual-home-title">
          <div className="contextual-home-icon" aria-hidden="true">
            {getContextIcon()}
          </div>
          <h1>{getContextLabel()}</h1>
          <p className="contextual-home-description">{getContextDescription()}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="contextual-home-content">
        {/* État de chargement */}
        {loading && (
          <div className="contextual-home-loading">
            <p>Chargement...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <div className="contextual-home-error">
            <p>❌ Erreur : {error}</p>
            <p>Impossible de charger les sections pour le moment.</p>
          </div>
        )}

        {/* Liste des sous-sections */}
        {!loading && !error && (
          <>
            {contextPages.length > 0 ? (
              <div className="contextual-home-grid">
                {contextPages.map((page) => (
                  <Link
                    key={page.slug}
                    to={`/${context}/${page.slug}`}
                    className="contextual-home-card"
                  >
                    <div className="contextual-home-card-content">
                      <h2 className="contextual-home-card-title">{page.title}</h2>
                      <p className="contextual-home-card-link">
                        Voir les articles →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="contextual-home-empty">
                <p>Aucune section disponible pour le moment.</p>
                <p>Les sections seront ajoutées prochainement.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
