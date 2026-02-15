/**
 * Hook React pour gérer les articles WordPress
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Un "custom hook" est une fonction React réutilisable qui encapsule
 * de la logique complexe (fetch, cache, états loading/error).
 *
 * AVANTAGE :
 * Au lieu d'écrire tout ce code dans chaque composant, on l'écrit
 * une fois ici et on le réutilise partout avec :
 *
 * const { posts, loading, error, refetch } = useWordPressPosts();
 *
 * POURQUOI "use" AU DÉBUT ?
 * Convention React : tous les hooks commencent par "use".
 * Ça indique que la fonction utilise les features React (useState, useEffect, etc.)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPosts } from '../services/wordpress.js';
import logger from '../lib/logger.js';

/**
 * Clé du cache dans localStorage
 */
const CACHE_KEY = 'wp_posts_cache';

/**
 * Durée de validité du cache (5 minutes = 300000 ms)
 * Après 5 minutes, on refetch les données depuis WordPress
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Vérifie si le cache est encore valide
 *
 * @returns {Object|null} Données cachées ou null si expiré
 */
function getCachedPosts() {
  try {
    // Récupérer le cache depuis localStorage
    const cached = localStorage.getItem(CACHE_KEY);

    if (!cached) {
      logger.log('[useWordPressPosts] No cache found');
      return null;
    }

    // Parser le JSON
    const { data, timestamp } = JSON.parse(cached);

    // Vérifier si le cache est encore valide
    const now = Date.now();
    const isExpired = (now - timestamp) > CACHE_DURATION;

    if (isExpired) {
      logger.log('[useWordPressPosts] Cache expired');
      return null;
    }

    logger.log('[useWordPressPosts] Using cached posts', {
      count: data.length,
      age: Math.round((now - timestamp) / 1000) + 's'
    });

    return data;

  } catch (error) {
    logger.error('[useWordPressPosts] Error reading cache:', error);
    return null;
  }
}

/**
 * Sauvegarde les posts dans le cache
 *
 * @param {Array} posts - Articles à sauvegarder
 */
function setCachedPosts(posts) {
  try {
    const cacheData = {
      data: posts,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    logger.log('[useWordPressPosts] Posts cached', { count: posts.length });

  } catch (error) {
    // localStorage peut être plein ou désactivé (mode privé)
    logger.error('[useWordPressPosts] Error writing cache:', error);
  }
}

/**
 * Hook pour récupérer les articles WordPress
 *
 * PARAMÈTRES :
 * @param {Object} filters - Options de filtrage
 * @param {number} filters.per_page - Nombre d'articles (défaut: 10)
 * @param {string} filters.categories - IDs catégories (ex: "5,12")
 * @param {string} filters.search - Terme de recherche
 * @param {boolean} enableCache - Activer le cache localStorage (défaut: true)
 *
 * RETOUR :
 * @returns {Object} { posts, loading, error, refetch }
 * - posts : Array des articles
 * - loading : Boolean (true pendant chargement)
 * - error : String (message d'erreur ou null)
 * - refetch : Function (pour recharger manuellement)
 */
export function useWordPressPosts(filters = {}, enableCache = true) {
  // États React
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref pour éviter les chargements multiples
  const hasLoadedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Sérialiser les filtres pour comparaison stable
  const filtersKey = JSON.stringify(filters);

  /**
   * Fonction pour charger les posts
   * useCallback évite de recréer la fonction à chaque render
   */
  const loadPosts = useCallback(async () => {
    // Parser les filtres depuis la clé JSON
    const currentFilters = JSON.parse(filtersKey);

    // Si déjà chargé, ne pas recharger
    if (hasLoadedRef.current && !currentFilters.search && !currentFilters.categories) {
      return;
    }

    try {
      logger.log('[useWordPressPosts] Loading posts...', currentFilters);
      setLoading(true);
      setError(null);

      // 1. Vérifier le cache (seulement si aucun filtre et cache activé)
      const hasFilters = currentFilters.categories || currentFilters.search;
      if (enableCache && !hasFilters) {
        const cached = getCachedPosts();
        if (cached) {
          if (isMountedRef.current) {
            setPosts(cached);
            setLoading(false);
            hasLoadedRef.current = true;
          }
          return; // Utiliser le cache, pas besoin de fetch
        }
      }

      // 2. Fetch depuis WordPress
      const fetchedPosts = await fetchPosts(currentFilters);

      // 3. Mettre à jour l'état seulement si le composant est encore monté
      if (isMountedRef.current) {
        setPosts(fetchedPosts);
        hasLoadedRef.current = true;

        // 4. Sauvegarder dans le cache (seulement si pas de filtre)
        if (enableCache && !hasFilters) {
          setCachedPosts(fetchedPosts);
        }
      }

    } catch (err) {
      logger.error('[useWordPressPosts] Error loading posts:', err);

      if (isMountedRef.current) {
        setError('Impossible de charger les actualités');

        // En cas d'erreur, essayer d'utiliser le cache même expiré
        if (enableCache) {
          try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
              const { data } = JSON.parse(cached);
              setPosts(data);
              logger.log('[useWordPressPosts] Using expired cache as fallback');
            }
          } catch {
            // Si même le cache échoue, garder tableau vide
            setPosts([]);
          }
        }
      }

    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filtersKey, enableCache]);

  /**
   * useEffect : Charger les posts au montage du composant
   * et à chaque changement de filtres
   */
  useEffect(() => {
    isMountedRef.current = true;
    loadPosts();

    // Cleanup : marquer comme démonté
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPosts]);

  /**
   * Fonction refetch pour recharger manuellement
   * Utile pour un bouton "Rafraîchir" ou après une erreur
   */
  const refetch = useCallback(() => {
    logger.log('[useWordPressPosts] Manual refetch triggered');
    loadPosts();
  }, [loadPosts]);

  // Retourner l'état et les fonctions
  return {
    posts,      // Array des articles
    loading,    // Boolean
    error,      // String ou null
    refetch,    // Function
  };
}

/**
 * EXEMPLE D'UTILISATION DANS UN COMPOSANT :
 * ==========================================
 *
 * import { useWordPressPosts } from '../hooks/useWordPressPosts.js';
 *
 * function News() {
 *   // Sans filtres (tous les articles, cache activé)
 *   const { posts, loading, error, refetch } = useWordPressPosts();
 *
 *   // Avec filtres
 *   const { posts, loading } = useWordPressPosts({
 *     categories: '5',
 *     per_page: 20
 *   });
 *
 *   // Avec recherche
 *   const { posts, loading } = useWordPressPosts({
 *     search: 'concert'
 *   });
 *
 *   if (loading) return <p>Chargement...</p>;
 *   if (error) return <p>{error}</p>;
 *
 *   return (
 *     <div>
 *       {posts.map(post => (
 *         <article key={post.id}>
 *           <h2>{post.title}</h2>
 *         </article>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * NOTES TECHNIQUES :
 * ==================
 *
 * CACHE :
 * - Activé par défaut pour la liste complète des articles
 * - Désactivé automatiquement si filtres/recherche
 * - Durée de vie : 5 minutes
 * - Fallback si erreur réseau (utilise cache expiré)
 *
 * PERFORMANCE :
 * - useCallback évite recréation fonctions
 * - Cache localStorage = chargement instantané
 * - Pas de requête inutile si données déjà en mémoire
 *
 * GESTION ERREURS :
 * - Try/catch autour du fetch
 * - Fallback vers cache expiré si erreur
 * - Message utilisateur friendly
 * - Logs détaillés pour debug
 */

