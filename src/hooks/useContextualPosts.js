/**
 * Hook React pour gérer les articles contextuels
 *
 * EXPLICATION :
 * Hook similaire à useWordPressPosts mais pour les sections contextuelles.
 * Charge les articles d'une sous-section (commune, événement, etc.)
 *
 * USAGE :
 * const { posts, loading, error, refetch } = useContextualPosts('elections', 'beaumont', {
 *   search: 'vote',
 *   per_page: 20
 * });
 *
 * DIFFÉRENCE avec useWordPressPosts :
 * - Utilise fetchPostsByContext() au lieu de fetchPosts()
 * - Cache par context/subcategory (ex: "elections-beaumont")
 * - Pas de cache localStorage (les données sont plus dynamiques)
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchPostsByContext } from '../services/wordpress.js';
import logger from '../lib/logger.js';

/**
 * Hook pour articles contextuels
 *
 * @param {string} context - Le contexte (ex: "elections", "evenements")
 * @param {string} subcategory - La sous-catégorie (ex: "beaumont", "clermont")
 * @param {Object} options - Options de fetch (search, per_page, page)
 * @returns {Object} { posts, loading, error, refetch }
 */
export function useContextualPosts(context, subcategory, options = {}) {
  // ====================================
  // ÉTATS REACT
  // ====================================

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ====================================
  // FONCTION FETCH
  // ====================================

  /**
   * Fonction pour charger les articles
   * useCallback : mémorise la fonction pour éviter recréations inutiles
   */
  const loadPosts = useCallback(async () => {
    try {
      logger.log(`[useContextualPosts] Loading posts for ${context}/${subcategory}`, options);
      setLoading(true);
      setError(null);

      // Fetch depuis WordPress
      const fetchedPosts = await fetchPostsByContext(context, subcategory, options);

      setPosts(fetchedPosts);
      setLoading(false);

      logger.log(`[useContextualPosts] Loaded ${fetchedPosts.length} posts`);

    } catch (err) {
      logger.error('[useContextualPosts] Error loading posts:', err);
      setError(err.message || 'Erreur lors du chargement des articles');
      setPosts([]);
      setLoading(false);
    }
  }, [context, subcategory, options.search, options.per_page, options.page]);

  // ====================================
  // EFFET : Charger au montage et quand les paramètres changent
  // ====================================

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // ====================================
  // FONCTION REFETCH (pour forcer un rechargement)
  // ====================================

  const refetch = useCallback(() => {
    logger.log('[useContextualPosts] Manual refetch triggered');
    loadPosts();
  }, [loadPosts]);

  // ====================================
  // RETOUR
  // ====================================

  return {
    posts,        // Articles chargés
    loading,      // true pendant le chargement
    error,        // Message d'erreur ou null
    refetch,      // Fonction pour recharger manuellement
  };
}
