// ============================================
// SERVICE AUDIO CENTRAL
// Un seul objet Audio pour TOUT (live + podcast)
// ============================================

// Imports des services de gestion avancée
import * as reconnectionManager from './reconnectionManager.js';
import * as mediaSession from './mediaSession.js';
import logger from '../lib/logger.js';

const STREAM_URL = 'https://radio.c6media.fr:8443/main';

// ============================================
// VARIABLES GLOBALES (partagées dans tout le module)
// ============================================

// L'objet Audio unique - partagé entre live et podcast
let audioElement = null;

// État actuel : 'stopped' | 'playing' | 'paused' | 'loading' | 'error'
let currentState = 'stopped';

// Source active : 'live' | 'podcast' | null
let currentSource = null;

// URL du podcast en cours (si podcast actif)
let currentPodcastUrl = null;

// Listeners pour notifier les composants React des changements
let stateChangeListeners = [];

// Flag pour savoir si les services sont initialisés
let isInitialized = false;

// ============================================
// FONCTIONS INTERNES (privées)
// ============================================

/**
 * Notifie tous les listeners qu'un changement d'état a eu lieu
 * Les composants React s'abonnent à ces changements
 */
function notifyStateChange() {
  stateChangeListeners.forEach(listener => {
    listener({
      state: currentState,
      source: currentSource,
      podcastUrl: currentPodcastUrl
    });
  });
}

/**
 * Arrête et détruit complètement l'audio actuel
 * CRITIQUE : vide le buffer pour éviter lecture en retard
 */
function destroyAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = ''; // Vide la source = clear buffer
    audioElement.load(); // Force le nettoyage
    audioElement = null;
  }
}

/**
 * Crée un nouvel objet Audio avec l'URL donnée
 * @param {string} url - URL du stream ou podcast
 */
function createAudio(url) {
  // Toujours détruire l'ancien avant de créer le nouveau
  destroyAudio();
  
  audioElement = new Audio(url);
  
  // Événements natifs du HTML5 Audio
  audioElement.addEventListener('playing', () => {
    currentState = 'playing';
    notifyStateChange();
    
    // Audio joue avec succès → réinitialiser le compteur de reconnexion
    reconnectionManager.reset();
    
    // Mettre à jour Media Session (affiche bouton Pause dans contrôles natifs)
    mediaSession.setPlaybackState('playing');
  });
  
  audioElement.addEventListener('pause', () => {
    // Si on est en podcast, on passe en pause
    // Si on est en live, on reste en playing (pas de pause sur live)
    if (currentSource === 'podcast') {
      currentState = 'paused';
      notifyStateChange();
      
      // Mettre à jour Media Session (affiche bouton Play dans contrôles natifs)
      mediaSession.setPlaybackState('paused');
    }
  });
  
  audioElement.addEventListener('error', (e) => {
    logger.error('Erreur audio:', e);
    currentState = 'error';
    notifyStateChange();
    
    // Si c'est le live qui a planté, essayer de reconnecter
    if (currentSource === 'live') {
      logger.info('Erreur sur live stream → Démarrage reconnexion automatique');
      reconnectionManager.startReconnection();
    }
  });
  
  return audioElement;
}

// ============================================
// API PUBLIQUE - CONTRÔLES LIVE
// ============================================

/**
 * Démarre le stream live
 * Si un podcast joue, il sera arrêté automatiquement
 */
export function playLiveStream() {
  // Si on joue déjà le live, ne rien faire
  if (currentSource === 'live' && currentState === 'playing') {
    logger.info('Live déjà en cours');
    return;
  }
  
  // Si un podcast joue, on l'arrête d'abord
  if (currentSource === 'podcast') {
    logger.info('Arrêt du podcast pour lancer le live');
    destroyAudio();
  }
  
  // Créer nouvel audio avec l'URL du stream
  createAudio(STREAM_URL);
  currentSource = 'live';
  currentPodcastUrl = null;
  currentState = 'loading';
  notifyStateChange();
  
  // Lancer la lecture
  audioElement.play().catch(err => {
    logger.error('Erreur play live:', err);
    currentState = 'error';
    notifyStateChange();
  });
}

/**
 * Arrête complètement le live
 * Clear le buffer pour éviter décalage
 */
export function stopLiveStream() {
  if (currentSource !== 'live') {
    logger.info('Aucun live en cours');
    return;
  }
  
  // Annuler toute reconnexion en cours
  reconnectionManager.cancelReconnection();
  
  destroyAudio();
  currentState = 'stopped';
  currentSource = null;
  notifyStateChange();
  
  // Effacer Media Session
  mediaSession.clearMediaSession();
}

// ============================================
// API PUBLIQUE - CONTRÔLES PODCAST
// ============================================

/**
 * Démarre un podcast
 * Si le live joue, il sera arrêté automatiquement
 * @param {string} url - URL du fichier audio du podcast
 */
export function playPodcast(url) {
  if (!url) {
    logger.error('URL podcast manquante');
    return;
  }
  
  // Si on joue déjà ce podcast, ne rien faire
  if (currentSource === 'podcast' && currentPodcastUrl === url && currentState === 'playing') {
    logger.info('Podcast déjà en cours');
    return;
  }
  
  // Si le live joue ou un autre podcast, on l'arrête
  if (currentSource === 'live' || (currentSource === 'podcast' && currentPodcastUrl !== url)) {
    logger.info(`Arrêt ${currentSource} pour lancer le podcast`);
    destroyAudio();
  }
  
  // Créer nouvel audio avec l'URL du podcast
  createAudio(url);
  currentSource = 'podcast';
  currentPodcastUrl = url;
  currentState = 'loading';
  notifyStateChange();
  
  // Lancer la lecture
  audioElement.play().catch(err => {
    logger.error('Erreur play podcast:', err);
    currentState = 'error';
    notifyStateChange();
  });
}

/**
 * Met en pause le podcast
 * UNIQUEMENT pour podcast (pas de pause sur live)
 */
export function pausePodcast() {
  if (currentSource !== 'podcast') {
    logger.info('Pause uniquement disponible pour podcast');
    return;
  }
  
  if (audioElement && currentState === 'playing') {
    audioElement.pause();
    // Le listener 'pause' mettra à jour l'état
  }
}

/**
 * Reprend la lecture du podcast en pause
 */
export function resumePodcast() {
  if (currentSource !== 'podcast') {
    logger.info('Resume uniquement disponible pour podcast');
    return;
  }
  
  if (audioElement && currentState === 'paused') {
    audioElement.play().catch(err => {
      logger.error('Erreur resume podcast:', err);
      currentState = 'error';
      notifyStateChange();
    });
  }
}

/**
 * Arrête complètement le podcast
 */
export function stopPodcast() {
  if (currentSource !== 'podcast') {
    logger.info('Aucun podcast en cours');
    return;
  }
  
  destroyAudio();
  currentState = 'stopped';
  currentSource = null;
  currentPodcastUrl = null;
  notifyStateChange();
  
  // Effacer Media Session
  mediaSession.clearMediaSession();
}

// ============================================
// API PUBLIQUE - CONTRÔLE UNIFIÉ
// ============================================

/**
 * Arrête tout (live ou podcast)
 * Fonction universelle de stop
 */
export function stop() {
  if (currentSource === 'live') {
    stopLiveStream();
  } else if (currentSource === 'podcast') {
    stopPodcast();
  }
}

// ============================================
// API PUBLIQUE - GETTERS
// ============================================

/**
 * Retourne l'état actuel
 * @returns {string} 'stopped' | 'playing' | 'paused' | 'loading' | 'error'
 */
export function getState() {
  return currentState;
}

/**
 * Retourne la source active
 * @returns {string|null} 'live' | 'podcast' | null
 */
export function getSource() {
  return currentSource;
}

/**
 * Retourne l'URL du podcast actuel (si applicable)
 * @returns {string|null}
 */
export function getPodcastUrl() {
  return currentPodcastUrl;
}

/**
 * Retourne si quelque chose joue actuellement
 * @returns {boolean}
 */
export function isPlaying() {
  return currentState === 'playing';
}

// ============================================
// API PUBLIQUE - ABONNEMENT AUX CHANGEMENTS
// ============================================

/**
 * S'abonne aux changements d'état
 * Les composants React utilisent ça pour se mettre à jour
 * @param {Function} listener - Fonction appelée à chaque changement
 * @returns {Function} Fonction de désabonnement (cleanup)
 */
export function subscribe(listener) {
  stateChangeListeners.push(listener);
  
  // Retourne une fonction pour se désabonner
  return () => {
    stateChangeListeners = stateChangeListeners.filter(l => l !== listener);
  };
}

// ============================================
// INITIALISATION DES SERVICES (à appeler au démarrage)
// ============================================

/**
 * Initialise les services de reconnexion et media session
 * À appeler UNE SEULE FOIS au démarrage de l'application
 * 
 * Cette fonction configure :
 * 1. Reconnexion automatique en cas d'erreur
 * 2. Media Session pour contrôles natifs
 * 
 * Exemple d'utilisation (dans main.jsx ou App.jsx) :
 * import { initializeAudioPlayer } from './services/audioPlayer';
 * initializeAudioPlayer();
 */
export function initializeAudioPlayer() {
  // Éviter double initialisation
  if (isInitialized) {
    logger.info('Audio Player déjà initialisé');
    return;
  }
  
  logger.info('🎵 Initialisation Audio Player...');
  
  // 1. Configurer la reconnexion automatique
  reconnectionManager.setupReconnection(
    // Callback: fonction appelée pour réessayer
    () => {
      logger.info('Tentative de reconnexion...');
      playLiveStream();
    },
    // Callback: fonction appelée si échec total
    () => {
      logger.error('Impossible de se connecter au stream après plusieurs tentatives');
      currentState = 'error';
      notifyStateChange();
      // Afficher message simple
      alert('Impossible de se connecter au stream. Veuillez réessayer plus tard.');
    }
  );
  
  // 2. Configurer Media Session pour contrôles natifs
  mediaSession.setupMediaSession(
    // Callback Play: relancer le stream
    () => {
      logger.info('Media Session: Play déclenché');
      if (currentSource === 'live') {
        playLiveStream();
      } else if (currentSource === 'podcast') {
        resumePodcast();
      } else {
        playLiveStream(); // Par défaut, lancer le live
      }
    },
    // Callback Stop: arrêter tout (géré par bouton Pause ET Stop)
    () => {
      logger.info('Media Session: Stop déclenché');
      stop();
    }
  );
  
  isInitialized = true;
  logger.info('✅ Audio Player initialisé avec succès');
}

/**
 * Met à jour les métadonnées Media Session (titre, artiste, image)
 * Appeler cette fonction quand les infos du Now Playing changent
 * 
 * @param {Object} metadata - Objet avec title, artist, artwork
 * @param {string} metadata.title - Titre du morceau
 * @param {string} metadata.artist - Nom de l'artiste  
 * @param {string|null} metadata.artwork - URL de l'image (optionnel)
 * 
 * Exemple :
 * updateNowPlayingMetadata({
 *   title: 'Bohemian Rhapsody',
 *   artist: 'Queen',
 *   artwork: 'https://example.com/album.jpg'
 * });
 */
export function updateNowPlayingMetadata(metadata) {
  mediaSession.updateMetadata(metadata);
}
