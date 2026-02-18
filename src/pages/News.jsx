/**
 * Page News - Liste des actualités avec recherche et filtre
 *
 * PHASE 8 : RECHERCHE ET TRI
 * ---------------------------
 * Ajout de deux fonctionnalités :
 * 1. Barre de recherche textuelle
 * 2. Filtre par catégorie
 *
 * COMMENT ÇA MARCHE ?
 * - On stocke les filtres dans l'état React (useState)
 * - On passe ces filtres au hook useWordPressPosts()
 * - Le hook refetch automatiquement les articles filtrés
 * - On affiche le composant NewsFilters pour l'interface
 */

import { useState, useEffect } from 'react';
import { useWordPressPosts } from '../hooks/useWordPressPosts.js';
import { fetchCategories } from '../services/wordpress.js';
import NewsCard from '../components/NewsCard.jsx';
import NewsFilters from '../components/NewsFilters.jsx';
import logger from '../lib/logger.js';
import './News.css';

export default function News() {
  // ====================================
  // ÉTATS REACT
  // ====================================

  /**
   * Filtres de recherche et tri
   */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  /**
   * EXCLUSION CATÉGORIE "BANNIERES"
   * Cette catégorie (ID 32) sert uniquement pour les bannières publicitaires
   * et ne doit jamais apparaître dans les actualités
   */
  const BANNERS_CATEGORY_ID = '32';

  /**
   * Liste des catégories WordPress
   */
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  /**
   * Hook pour récupérer les articles avec filtres
   * IMPORTANT : Le hook refetch automatiquement quand les filtres changent !
   * EXCLUSION BANNIÈRES : On exclut TOUJOURS la catégorie ID 32 des résultats
   */
  const { posts, loading, error } = useWordPressPosts({
    search: searchTerm || undefined,      // Undefined si vide (ignore le filtre)
    categories: selectedCategory || undefined,
    categories_exclude: BANNERS_CATEGORY_ID, // Toujours exclure les bannières (ID 32)
    per_page: 20,                         // Augmenté à 20 pour avoir plus de résultats
  });

  // ====================================
  // CHARGEMENT DES CATÉGORIES
  // ====================================

  /**
   * useEffect : Charger les catégories au montage du composant
   * Une seule fois (tableau de dépendances vide [])
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        logger.log('[News] Loading categories...');
        setCategoriesLoading(true);

        const cats = await fetchCategories();
        
        // IMPORTANT : Filtrer la catégorie "bannieres" (ID 32) du dropdown
        // Elle sert uniquement pour les bannières publicitaires
        const filteredCats = cats.filter(cat => {
          const isBanner = cat.id === 32 || 
                          cat.slug === 'bannieres' || 
                          cat.name.toLowerCase().includes('bannière') ||
                          cat.name.toLowerCase().includes('banniere');
          return !isBanner; // Exclure les bannières du dropdown
        });
        
        setCategories(filteredCats);

        logger.log(`[News] Loaded ${filteredCats.length} categories (excluded banners)`);
      } catch (err) {
        logger.error('[News] Error loading categories:', err);
        // En cas d'erreur, garder tableau vide (= pas de filtre catégorie)
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []); // [] = exécuter une seule fois au montage

  // ====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // ====================================

  /**
   * Appelé quand l'utilisateur tape dans la barre de recherche
   */
  const handleSearchChange = (newSearchTerm) => {
    logger.log('[News] Search term changed:', newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  /**
   * Appelé quand l'utilisateur change de catégorie
   */
  const handleCategoryChange = (categoryId) => {
    logger.log('[News] Category changed:', categoryId);
    setSelectedCategory(categoryId);
  };

  // ====================================
  // RENDU
  // ====================================

  return (
    <div className="news-page">
      {/* En-tête */}
      <header className="news-header">
        <h1 className="news-title">Actualités C6Radio</h1>
        <p className="news-subtitle">
          Découvrez les dernières nouvelles, événements et coulisses de la radio
        </p>
      </header>

      {/* Filtres de recherche et tri */}
      {!categoriesLoading && (
        <NewsFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      )}

      {/* Contenu principal */}
      <main className="news-content">

        {/* État : Chargement */}
        {loading && (
          <div className="news-loading">
            <div className="spinner"></div>
            <p>Chargement des actualités...</p>
          </div>
        )}

        {/* État : Erreur */}
        {error && !loading && (
          <div className="news-error">
            <p className="news-error__message">❌ {error}</p>
            <p className="news-error__help">
              Vérifiez votre connexion internet ou réessayez plus tard.
            </p>
          </div>
        )}

        {/* État : Aucun article trouvé */}
        {!loading && !error && posts.length === 0 && (
          <div className="news-empty">
            {searchTerm || selectedCategory ? (
              // Message spécifique si filtres actifs
              <>
                <p className="news-empty__message">
                  🔍 Aucun article trouvé
                </p>
                <p className="news-empty__help">
                  Essayez d'autres mots-clés ou changez de catégorie
                </p>
              </>
            ) : (
              // Message par défaut si aucun filtre
              <>
                <p className="news-empty__message">
                  📭 Aucune actualité pour le moment
                </p>
                <p className="news-empty__help">
                  Revenez bientôt pour découvrir nos dernières nouvelles !
                </p>
              </>
            )}
          </div>
        )}

        {/* État : Articles chargés */}
        {!loading && !error && posts.length > 0 && (
          <>
            {/* Compteur de résultats (si filtres actifs) */}
            {(searchTerm || selectedCategory) && (
              <div className="news-results-count">
                <p>
                  <strong>{posts.length}</strong> article{posts.length > 1 ? 's' : ''} trouvé{posts.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Grille d'articles */}
            <div className="news-grid">
              {posts.map(post => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * RÉACTIVITÉ DES FILTRES :
 * - Quand searchTerm ou selectedCategory change, le hook refetch automatiquement
 * - C'est magique ! useWordPressPosts surveille les changements de filtres
 * 
 * DEBOUNCING :
 * - Implémenté dans NewsFilters.jsx
 * - Évite de faire 10 requêtes si on tape "concert" (1 requête seulement)
 * 
 * PERFORMANCE :
 * - Les catégories sont chargées une seule fois (useEffect avec [])
 * - Le cache du hook fonctionne toujours (5 min pour requêtes sans filtre)
 * 
 * FILTRE BANNIÈRES :
 * - La catégorie "bannieres" est exclue de la liste
 * - Elle sert uniquement pour les bannières publicitaires
 * 
 * ACCESSIBILITÉ :
 * - Messages adaptés selon contexte (filtres actifs ou non)
 * - Compteur de résultats pour feedback utilisateur
 * - Loading states clairs
 */

