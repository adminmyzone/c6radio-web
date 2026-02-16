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
