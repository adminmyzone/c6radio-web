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
   * EXCLUSION CATÉGORIES
   * - Bannières (ID 32) : bannières publicitaires
   * - Catégories contextuelles : élections, événements, quartiers
   */
  const BANNERS_CATEGORY_ID = '32';

  /**
   * Liste des catégories WordPress (pour le dropdown)
   */
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  /**
   * IDs des catégories contextuelles à exclure (calculés dynamiquement)
   */
  const [excludedCategoryIds, setExcludedCategoryIds] = useState(BANNERS_CATEGORY_ID);

  /**
   * Hook pour récupérer les articles avec filtres
   * IMPORTANT : Le hook refetch automatiquement quand les filtres changent !
   * EXCLUSION : Bannières + catégories contextuelles
   */
  const { posts, loading, error, refetch } = useWordPressPosts({
    search: searchTerm || undefined,      // Undefined si vide (ignore le filtre)
    categories: selectedCategory || undefined,
    categories_exclude: excludedCategoryIds, // Bannières + catégories contextuelles
    per_page: 20,                         // Augmenté à 20 pour avoir plus de résultats
  });

  /**
   * Refetch articles quand les IDs exclus changent
   * (Pour forcer rechargement après calcul catégories)
   */
  useEffect(() => {
    if (excludedCategoryIds !== BANNERS_CATEGORY_ID && !categoriesLoading) {
      logger.log(`[News] Categories exclusion updated, refetching posts with IDs: ${excludedCategoryIds}`);
      refetch();
    }
  }, [excludedCategoryIds, categoriesLoading, refetch]);

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
        
        // IMPORTANT : Filtrer les catégories à exclure
        // 1. Catégorie "bannieres" (ID 32) - bannières publicitaires
        // 2. Catégories contextuelles (élections, événements) - sections dédiées
        const CONTEXTUAL_PREFIXES = ['election-', 'elections-', 'event-', 'evenement-', 'evenements-', 'quartier-', 'quartiers-', 'sport-', 'sports-'];
        
        // Séparer les catégories normales et contextuelles
        const normalCats = [];
        const contextualCatIds = [32]; // Commencer avec bannières (ID 32)
        
        cats.forEach(cat => {
          // Vérifier si bannière
          const isBanner = cat.id === 32 || 
                          cat.slug === 'bannieres' || 
                          cat.name.toLowerCase().includes('bannière') ||
                          cat.name.toLowerCase().includes('banniere');
          
          // Vérifier si catégorie contextuelle (avec préfixes)
          const isContextual = CONTEXTUAL_PREFIXES.some(prefix => cat.slug.startsWith(prefix));
          
          if (isBanner || isContextual) {
            // Ajouter à la liste d'exclusion
            contextualCatIds.push(cat.id);
          } else {
            // Garder pour le dropdown
            normalCats.push(cat);
          }
        });
        
        setCategories(normalCats);
        
        // Construire la chaîne d'IDs à exclure (ex: "32,45,46,47")
        const excludeIds = [...new Set(contextualCatIds)].join(',');
        setExcludedCategoryIds(excludeIds);

        logger.log(`[News] Loaded ${normalCats.length} categories (excluded ${contextualCatIds.length} contextual)`);
        logger.log(`[News] Excluded category IDs: ${excludeIds}`);
      } catch (err) {
        logger.error('[News] Error loading categories:', err);
        // En cas d'erreur, garder tableau vide (= pas de filtre catégorie)
        setCategories([]);
        setExcludedCategoryIds(BANNERS_CATEGORY_ID); // Au minimum exclure bannières
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

