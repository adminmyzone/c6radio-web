// ============================================
// SERVICE NOW PLAYING API
// Récupère les infos "en cours de lecture" depuis Libretime
// ============================================

import logger from "../lib/logger";
import { NOW_PLAYING_URL } from '../config/constants.js';

const FETCH_TIMEOUT = 5000; // 5 secondes max

// ============================================
// DONNÉES PAR DÉFAUT (fallback)
// ============================================

const DEFAULT_NOW_PLAYING = {
  title: 'C6Radio',
  artist: 'En direct',
  artwork: null,
  startTime: null,
};

// ============================================
// FONCTION FETCH AVEC TIMEOUT
// ============================================

/**
 * Fetch avec timeout pour éviter requêtes infinies
 * @param {string} url - URL à fetcher
 * @param {number} timeout - Timeout en ms
 * @returns {Promise<Response>}
 */
function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// ============================================
// API PUBLIQUE
// ============================================

/**
 * Récupère les infos "now playing" depuis l'API Libretime
 * @returns {Promise<Object>} Objet avec title, artist, artwork, startTime
 */
export async function fetchNowPlaying() {
  try {
    // Fetch avec timeout de 5 secondes
    const response = await fetchWithTimeout(NOW_PLAYING_URL, FETCH_TIMEOUT);
    
    // Vérifier si la réponse est OK
    if (!response.ok) {
      logger.warn(`API Now Playing erreur: ${response.status}`);
      return DEFAULT_NOW_PLAYING;
    }

    // Parser le JSON
    const data = await response.json();
    
    // Log pour debug (à retirer en prod si souhaité)
    logger.info('Now Playing data:', data);

    // Vérifier que la structure attendue existe
    if (!data.current || !data.current.metadata) {
      logger.warn('Structure API inattendue, utilisation fallback');
      return DEFAULT_NOW_PLAYING;
    }

    // Extraire les données depuis current.metadata
    const metadata = data.current.metadata;
    
    // Nettoyer le titre (retirer extension .wav, .mp3, etc.)
    let title = metadata.track_title || data.current.name || DEFAULT_NOW_PLAYING.title;
    title = title.replace(/\.(wav|mp3|flac|ogg|aac)$/i, ''); // Retire l'extension
    
    // Artist peut être null dans l'API
    const artist = metadata.artist_name || DEFAULT_NOW_PLAYING.artist;
    
    // Artwork URL si disponible
    const artwork = metadata.artwork_url || null;
    
    // Heure de début
    const startTime = data.current.starts || null;

    const nowPlaying = {
      title,
      artist,
      artwork,
      startTime,
    };

    // Si titre ET artiste sont vides, utiliser le fallback complet
    if (!nowPlaying.title && !nowPlaying.artist) {
      return DEFAULT_NOW_PLAYING;
    }

    return nowPlaying;

  } catch (error) {
    // Log l'erreur pour debug
    logger.error('Erreur fetch now playing:', error.message);
    
    // Retourner les données par défaut
    return DEFAULT_NOW_PLAYING;
  }
}

/**
 * Retourne les données par défaut (fallback)
 * Utile quand le live ne joue pas
 * @returns {Object}
 */
export function getDefaultNowPlaying() {
  logger.info('Retour des données Now Playing par défaut');
  return { ...DEFAULT_NOW_PLAYING };
}
