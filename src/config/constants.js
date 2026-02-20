/**
 * Configuration des URLs - C6Radio
 * 
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce fichier centralise toutes les URLs de l'application.
 * 
 * POURQUOI ?
 * - Facile à modifier (un seul endroit)
 * - Différentes URLs dev/prod possibles
 * - Code plus propre (pas d'URLs éparpillées)
 * 
 * Plus tard, on pourra mettre ces URLs dans un fichier .env
 * pour avoir des configs différentes par environnement.
 */

// ===================================
// URLS WORDPRESS
// ===================================

/**
 * URL de base de l'API WordPress
 * WordPress expose automatiquement une REST API sur /wp-json/wp/v2/
 *
 * DETECTION AUTOMATIQUE :
 * - Si on est sur exp937.fr → utiliser exp937.fr/wp
 * - Sinon → utiliser exp937.fr/wp (fallback)
 */
const getWordPressBaseUrl = () => {
  // Récupérer le hostname actuel
  const hostname = window.location.hostname;

  // Si on est en local dev
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://exp937.fr/wp/wp-json/wp/v2';
  }

  // Si on est sur exp937.fr (production)
  if (hostname === 'exp937.fr' || hostname === 'www.exp937.fr') {
    return 'https://exp937.fr/wp/wp-json/wp/v2';
  }

  // Fallback
  return 'https://exp937.fr/wp/wp-json/wp/v2';
};

export const WP_API_BASE_URL = getWordPressBaseUrl();

/**
 * Endpoints WordPress spécifiques
 */
export const WP_ENDPOINTS = {
  pages: `${WP_API_BASE_URL}/pages`,      // Liste des pages
  posts: `${WP_API_BASE_URL}/posts`,      // Articles de blog
  media: `${WP_API_BASE_URL}/media`,      // Images/fichiers
  categories: `${WP_API_BASE_URL}/categories`,
};

/**
 * Endpoint du plugin WordPress C6Radio (notifications push, tokens)
 * Format : /wp-json/c6radio/v1/...
 */
export const WP_PLUGIN_URL = WP_API_BASE_URL.replace('/wp/v2', '/c6radio/v1');

// ===================================
// URLS STREAMING AUDIO
// ===================================

/**
 * URL du flux audio en direct
 */
export const STREAM_URL = 'https://radio.c6media.fr:8443/main';

/**
 * URL de l'API Now Playing (métadonnées en temps réel)
 */
export const NOW_PLAYING_URL = 'https://radio.c6media.fr/api/live-info';

// ===================================
// PARAMÈTRES PAR DÉFAUT
// ===================================

/**
 * Intervalle de mise à jour du Now Playing (en millisecondes)
 */
export const NOW_PLAYING_INTERVAL = 12000; // 12 secondes

/**
 * Nombre maximum de pages à charger depuis WordPress
 */
export const MAX_MENU_PAGES = 20;

/**
 * Timeout pour les requêtes API (en millisecondes)
 */
export const API_TIMEOUT = 10000; // 10 secondes

// ===================================
// CATÉGORIES CONTEXTUELLES
// ===================================

/**
 * Préfixes des slugs de catégories contextuelles
 * 
 * EXPLICATION :
 * Ces catégories WP sont dédiées aux sections contextuelles (Élections,
 * Événements, Patrimoine...). On les exclut de la page Actualités générales
 * et de la page d'accueil pour éviter les doublons.
 * 
 * CONVENTION WORDPRESS :
 * Créer les catégories avec le préfixe correct :
 *   - elections-le-haillan, elections-merignac, ...
 *   - evenements-bordeaux, evenements-talence, ...
 *   - patrimoine-gradignan, ...
 */
export const CONTEXTUAL_CATEGORY_PREFIXES = [
  'election-',
  'elections-',
  'event-',
  'evenement-',
  'evenements-',
  'quartier-',
  'quartiers-',
  'sport-',
  'sports-',
  'patrimoine-',
];

// ===================================
// NOTES POUR PLUS TARD
// ===================================

/**
 * TODO Phase Production :
 * -----------------------
 * Déplacer ces configs dans des variables d'environnement (.env)
 * 
 * Exemple avec Vite :
 * 
 * Fichier .env.development :
 * VITE_WP_API_URL=http://localhost:8000/wp-json/wp/v2
 * VITE_STREAM_URL=http://localhost:8443/main
 * 
 * Fichier .env.production :
 * VITE_WP_API_URL=https://radio.c6media.fr/wp-json/wp/v2
 * VITE_STREAM_URL=https://radio.c6media.fr:8443/main
 * 
 * Dans le code :
 * export const WP_API_BASE_URL = import.meta.env.VITE_WP_API_URL;
 */
