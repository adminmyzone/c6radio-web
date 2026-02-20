// ============================================
// MEDIA SESSION MANAGER
// Gère l'affichage dans les contrôles natifs du navigateur/téléphone
// ============================================

// ============================================
// EXPLICATION PRINCIPE (pour débutants)
// ============================================
/*
  Qu'est-ce que Media Session API ?
  
  C'est une fonctionnalité des navigateurs modernes qui permet :
  
  1. Sur ORDINATEUR :
     - Afficher titre/artiste/image dans la barre de notification du navigateur
     - Contrôler la lecture avec les touches média du clavier
     - Afficher les contrôles dans les widgets (Chrome, Edge, Firefox)
  
  2. Sur TÉLÉPHONE :
     - Afficher les infos sur l'écran verrouillé
     - Contrôles dans la barre de notification (Android)
     - Control Center (iOS Safari)
     - Contrôles sur les écouteurs Bluetooth
  
  Comment ça marche ?
  - On donne au navigateur : titre, artiste, image
  - On lui dit quoi faire quand on clique Play/Pause/Stop
  - Le navigateur s'occupe d'afficher tout ça joliment !
  
  Compatibilité :
  - ✅ Chrome/Edge (desktop + mobile)
  - ✅ Firefox (desktop + Android)
  - ✅ Safari (iOS/macOS)
  - ⚠️ Non supporté : anciens navigateurs (graceful degradation)
*/

import logger from "../lib/logger";

// ============================================
// VARIABLES
// ============================================

// Callbacks pour contrôler l'audio (fournis par audioPlayer.js)
let playCallback = null;
let stopCallback = null;

// Métadonnées actuelles (titre, artiste, image)
let currentMetadata = {
  title: 'C6Radio',
  artist: 'En direct',
  artwork: null
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Vérifie si Media Session API est disponible dans ce navigateur
 * @returns {boolean} true si supporté, false sinon
 */
function isMediaSessionSupported() {
  // Vérifie si l'objet existe dans le navigateur
  return 'mediaSession' in navigator;
}

/**
 * Formate l'URL de l'artwork pour l'API Media Session
 * L'API nécessite un tableau d'objets avec src, sizes, type
 * 
 * @param {string|null} artworkUrl - URL de l'image ou null
 * @returns {Array} Tableau formaté pour l'API
 */
function formatArtwork(artworkUrl) {
  // Si pas d'artwork, utiliser logo par défaut
  if (!artworkUrl) {
    artworkUrl = '/logo-c6radio.png';
  }
  
  // Format requis par l'API Media Session
  return [
    {
      src: artworkUrl,
      sizes: '512x512',  // Taille recommandée
      type: 'image/png'  // Type MIME
    }
  ];
}

// ============================================
// FONCTIONS PUBLIQUES
// ============================================

/**
 * Configure le Media Session Manager avec les callbacks de contrôle
 * À appeler une seule fois au démarrage de l'app
 * 
 * Note : Pas de callback pause car on force le stop pour le live
 * (pas de pause sur live stream, et pour les podcasts on utilise aussi stop)
 * 
 * @param {Function} onPlay - Fonction appelée quand on clique Play
 * @param {Function} onStop - Fonction appelée quand on clique Pause/Stop
 * 
 * Exemple d'utilisation :
 * setupMediaSession(
 *   () => playLiveStream(),
 *   () => stop()
 * );
 */
export function setupMediaSession(onPlay, onStop) {
  // Vérifier si l'API est disponible
  if (!isMediaSessionSupported()) {
    logger.warn('Media Session API non supportée sur ce navigateur');
    return;
  }
  
  // Sauvegarder les callbacks
  playCallback = onPlay;
  stopCallback = onStop;
  
  // Configurer les gestionnaires d'action
  // Ces fonctions sont appelées quand l'utilisateur clique dans les contrôles natifs
  
  // Bouton Play
  navigator.mediaSession.setActionHandler('play', () => {
    logger.info('Media Session: Play déclenché');
    if (playCallback) {
      playCallback();
    }
  });
  
  // Bouton Pause
  // Pour le live → on force un stop (pas de pause sur live stream)
  // Pour les podcasts → la logique dans audioPlayer.js gère la pause
  navigator.mediaSession.setActionHandler('pause', () => {
    logger.info('Media Session: Pause déclenché');
    if (stopCallback) {
      stopCallback(); // Force stop pour live, arrête aussi podcast si en cours
    }
  });
  
  // Bouton Stop (pas toujours affiché, dépend du navigateur)
  navigator.mediaSession.setActionHandler('stop', () => {
    logger.info('Media Session: Stop déclenché');
    if (stopCallback) {
      stopCallback();
    }
  });
  
  // Bouton Précédent (optionnel, désactivé pour radio live)
  navigator.mediaSession.setActionHandler('previoustrack', null);
  
  // Bouton Suivant (optionnel, désactivé pour radio live)
  navigator.mediaSession.setActionHandler('nexttrack', null);
  
  logger.info('Media Session configuré avec succès');
}

/**
 * Met à jour les métadonnées affichées (titre, artiste, image)
 * Appeler cette fonction chaque fois que le titre change
 * 
 * @param {Object} metadata - Objet avec title, artist, artwork
 * @param {string} metadata.title - Titre du morceau
 * @param {string} metadata.artist - Nom de l'artiste
 * @param {string|null} metadata.artwork - URL de l'image (optionnel)
 * 
 * Exemple :
 * updateMetadata({
 *   title: 'Bohemian Rhapsody',
 *   artist: 'Queen',
 *   artwork: 'https://example.com/album.jpg'
 * });
 */
export function updateMetadata(metadata) {
  // Vérifier si l'API est disponible
  if (!isMediaSessionSupported()) {
    return;
  }
  
  // Sauvegarder les nouvelles métadonnées
  currentMetadata = {
    title: metadata.title || 'C6Radio',
    artist: metadata.artist || 'En direct',
    artwork: metadata.artwork || null
  };
  
  // Mettre à jour l'API Media Session
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentMetadata.title,
      artist: currentMetadata.artist,
      album: 'C6Radio Live',  // Nom de l'album (optionnel)
      artwork: formatArtwork(currentMetadata.artwork)
    });
    
    logger.info('Métadonnées Media Session mises à jour:', currentMetadata);
  } catch (error) {
    logger.error('Erreur mise à jour métadonnées:', error);
  }
}

/**
 * Définit l'état de lecture dans Media Session
 * Ça change l'icône du bouton Play/Pause dans les contrôles natifs
 * 
 * @param {string} state - 'playing' ou 'paused' ou 'none'
 * 
 * Exemple :
 * setPlaybackState('playing');  // Affiche l'icône Pause
 * setPlaybackState('paused');   // Affiche l'icône Play
 */
export function setPlaybackState(state) {
  // Vérifier si l'API est disponible
  if (!isMediaSessionSupported()) {
    return;
  }
  
  // États possibles : 'none' | 'paused' | 'playing'
  try {
    navigator.mediaSession.playbackState = state;
    logger.info('État lecture Media Session:', state);
  } catch (error) {
    logger.error('Erreur définition état lecture:', error);
  }
}

/**
 * Réinitialise Media Session (efface tout)
 * Appeler quand l'audio est arrêté complètement
 */
export function clearMediaSession() {
  // Vérifier si l'API est disponible
  if (!isMediaSessionSupported()) {
    return;
  }
  
  try {
    // Effacer les métadonnées
    navigator.mediaSession.metadata = null;
    
    // État : aucune lecture
    navigator.mediaSession.playbackState = 'none';
    
    logger.info('Media Session réinitialisé');
  } catch (error) {
    logger.error('Erreur réinitialisation Media Session:', error);
  }
}

/**
 * Retourne les métadonnées actuelles (pour debug)
 * @returns {Object} Métadonnées avec title, artist, artwork
 */
export function getCurrentMetadata() {
  return { ...currentMetadata };
}

// ============================================
// NOTES POUR LE FUTUR
// ============================================
/*
  Améliorations possibles (pas nécessaires pour MVP) :
  
  1. Position de lecture (pour podcasts) :
     - navigator.mediaSession.setPositionState()
     - Affiche un scrubber (barre de progression)
     - Permet de naviguer dans le podcast
  
  2. Actions avancées :
     - seekbackward : reculer de 10s
     - seekforward : avancer de 10s
     - seekto : aller à une position précise
  
  3. Chapitres (pour podcasts) :
     - Metadata avec 'chapter' pour diviser un podcast
     - Navigation par chapitre
  
  4. Notifications enrichies :
     - Boutons personnalisés (partager, favoris)
     - Intégration avec Web Share API
  
  Ressources :
  - Doc MDN : https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
  - Exemples : https://googlechrome.github.io/samples/media-session/
*/
