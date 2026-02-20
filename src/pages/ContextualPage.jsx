/**
 * ContextualPage - Page d'affichage articles d'une sous-section contextuelle
 * 
 * EXPLICATION :
 * Composant pour afficher les articles d'une sous-section spécifique
 * (commune, événement, etc.) avec recherche et filtres.
 * 
 * USAGE :
 * <ContextualPage 
 *   context="elections" 
 *   subcategory="beaumont" 
 *   title="Beaumont"
 * />
 * 
 * SIMILAIRE À :
 * Page News.jsx mais pour une sous-section contextuelle spécifique
 * Réutilise NewsCard, NewsFilters
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContextualPosts } from '../hooks/useContextualPosts.js';
import { fetchContextualPages } from '../services/wordpress.js';
import NewsCard from '../components/NewsCard.jsx';
import NewsFilters from '../components/NewsFilters.jsx';
import ContextualMenu from '../components/ContextualMenu.jsx';
import logger from '../lib/logger.js';
import './ContextualPage.css';
import '../styles/contextual-theme.css';

export default function ContextualPage({ context }) {
  // ====================================
  // PARAMÈTRES URL
  // ====================================

  // Récupérer la sous-catégorie depuis l'URL (ex: /elections/beaumont → "beaumont")
  const { subcategory } = useParams();

  // ====================================
  // ÉTATS REACT
  // ====================================

  /**
   * Filtres de recherche
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Menu hamburger
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Pages contextuelles (pour le menu)
   */
  const [contextPages, setContextPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);

  /**
   * Titre de la page (trouvé depuis les pages contextuelles)
   */
  const [pageTitle, setPageTitle] = useState('');

  // ====================================
  // CHARGEMENT DES PAGES CONTEXTUELLES
  // ====================================

  useEffect(() => {
    async function loadContextPages() {
      try {
        logger.log(`[ContextualPage] Loading contextual pages for: ${context}`);
        setLoadingPages(true);

        const pages = await fetchContextualPages(context);
        setContextPages(pages);

        // Trouver le titre de la page actuelle
        const currentPage = pages.find(p => p.slug === subcategory);
        if (currentPage) {
          setPageTitle(currentPage.title);
        } else {
          setPageTitle(subcategory); // Fallback: utiliser slug
        }

        setLoadingPages(false);
        logger.log(`[ContextualPage] Loaded ${pages.length} pages for context "${context}"`);

      } catch (err) {
        logger.error('[ContextualPage] Error loading contextual pages:', err);
        setLoadingPages(false);
      }
    }

    loadContextPages();
  }, [context, subcategory]);

  // ====================================
  // CHARGEMENT DES ARTICLES
  // ====================================

  /**
   * Hook pour récupérer les articles de cette sous-section
   * Refetch automatiquement quand searchTerm change
   */
  const { posts, loading, error } = useContextualPosts(context, subcategory, {
    search: searchTerm || undefined,
    per_page: 20,
  });

  // ====================================
  // HANDLERS
  // ====================================

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ====================================
  // RENDU
  // ====================================

  return (
    <div className={`contextual-page context-${context}`}>
      {/* Menu hamburger */}
      <ContextualMenu
        context={context}
        pages={contextPages}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* En-tête */}
      <div className="contextual-page-header">
        <button 
          className="contextual-menu-toggle"
          onClick={toggleMenu}
          aria-label="Ouvrir le menu"
        >
          <span className="hamburger-icon">☰</span>
        </button>

        <div className="contextual-page-title">
          <h1>{pageTitle}</h1>
          <p className="contextual-page-breadcrumb">
            <span className="breadcrumb-context">
              {context === 'elections' && 'Élections'}
              {context === 'evenements' && 'Événements'}
              {context === 'quartiers' && 'Quartiers'}
            </span>
            {' / '}
            <span className="breadcrumb-current">{pageTitle}</span>
          </p>
        </div>
      </div>

      {/* Filtres de recherche */}
      <div className="contextual-page-filters">
        <NewsFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={null}
          onCategoryChange={() => {}} // Pas de filtre catégorie ici (déjà filtré par context)
          categories={[]} // Pas de dropdown catégories
        />
      </div>

      {/* Contenu principal */}
      <div className="contextual-page-content">
        {/* État de chargement */}
        {loading && (
          <div className="contextual-page-loading">
            <p>Chargement des articles...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <div className="contextual-page-error">
            <p>❌ Erreur : {error}</p>
            <p>Impossible de charger les articles pour le moment.</p>
          </div>
        )}

        {/* Articles */}
        {!loading && !error && (
          <>
            {posts.length > 0 ? (
              <div className="contextual-page-grid">
                {posts.map(post => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="contextual-page-empty">
                {searchTerm ? (
                  <>
                    <p>Aucun article trouvé pour "{searchTerm}"</p>
                    <p>Essayez avec d'autres termes de recherche.</p>
                  </>
                ) : (
                  <>
                    <p>Aucun article disponible pour le moment.</p>
                    <p>Les articles seront publiés prochainement.</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
