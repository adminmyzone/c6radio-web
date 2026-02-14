// ============================================
// RECONNECTION MANAGER
// Gère la reconnexion automatique du stream si erreur
// ============================================

// ============================================
// EXPLICATION PRINCIPE (pour débutants)
// ============================================
/*
  Problème : Le stream audio peut couper pour plusieurs raisons :
  - Connexion internet instable
  - Serveur radio temporairement indisponible
  - Passage en tunnel (mobile)
  
  Solution : Backoff exponentiel
  - Tentative 1 : attendre 3 secondes
  - Tentative 2 : attendre 10 secondes
  - Tentative 3 : attendre 30 secondes
  - Tentative 4+ : abandonner et afficher message utilisateur
  
  Pourquoi attendre plus longtemps à chaque tentative ?
  - Éviter de surcharger le serveur avec trop de requêtes
  - La plupart des coupures courtes se résolvent en 3-10s
  - Les coupures longues nécessitent plus de temps
*/

import logger from "../lib/logger";

// ============================================
// CONFIGURATION
// ============================================

// Délais d'attente entre chaque tentative (en millisecondes)
// 1000ms = 1 seconde
const RETRY_DELAYS = [
  3000,   // 1ère tentative : après 3 secondes
  10000,  // 2ème tentative : après 10 secondes
  30000   // 3ème tentative : après 30 secondes
];

// Nombre maximum de tentatives avant d'abandonner
const MAX_RETRIES = RETRY_DELAYS.length;

// ============================================
// VARIABLES D'ÉTAT
// ============================================

// Compteur : combien de fois on a déjà essayé
let retryCount = 0;

// ID du timer de reconnexion (pour pouvoir l'annuler si besoin)
let reconnectTimer = null;

// Fonction à appeler pour réessayer la connexion
// Elle sera fournie par audioPlayer.js
let retryCallback = null;

// Fonction à appeler quand toutes les tentatives ont échoué
let failureCallback = null;

// ============================================
// FONCTIONS PUBLIQUES
// ============================================

/**
 * Configure le manager avec les fonctions de callback
 * À appeler une seule fois au démarrage de l'app
 * 
 * @param {Function} onRetry - Fonction appelée pour chaque tentative de reconnexion
 * @param {Function} onFailure - Fonction appelée après l'échec de toutes les tentatives
 * 
 * Exemple d'utilisation :
 * setupReconnection(
 *   () => playLiveStream(),  // On relance le stream
 *   () => alert('Impossible de se connecter')  // Message erreur
 * );
 */
export function setupReconnection(onRetry, onFailure) {
  retryCallback = onRetry;
  failureCallback = onFailure;
  
  logger.info('Reconnection Manager configuré');
}

/**
 * Démarre le processus de reconnexion
 * Appelée automatiquement quand une erreur audio survient
 */
export function startReconnection() {
  // Si on est déjà en train d'essayer de reconnecter, ne rien faire
  if (reconnectTimer !== null) {
    logger.info('Reconnexion déjà en cours...');
    return;
  }
  
  // Si on a dépassé le nombre max de tentatives, abandonner
  if (retryCount >= MAX_RETRIES) {
    logger.error(`Échec après ${MAX_RETRIES} tentatives de reconnexion`);
    
    // Appeler la fonction d'échec si elle existe
    if (failureCallback) {
      failureCallback();
    }
    
    // Réinitialiser le compteur pour la prochaine fois
    reset();
    return;
  }
  
  // Récupérer le délai d'attente pour cette tentative
  const delay = RETRY_DELAYS[retryCount];
  
  logger.info(`Tentative de reconnexion ${retryCount + 1}/${MAX_RETRIES} dans ${delay / 1000}s...`);
  
  // Timer : attendre le délai, puis réessayer
  reconnectTimer = setTimeout(() => {
    logger.info(`Reconnexion tentative ${retryCount + 1}...`);
    
    // Incrémenter le compteur pour la prochaine fois
    retryCount++;
    
    // Réinitialiser le timer
    reconnectTimer = null;
    
    // Appeler la fonction de retry (fournie par audioPlayer.js)
    if (retryCallback) {
      retryCallback();
    }
  }, delay);
}

/**
 * Annule le processus de reconnexion en cours
 * Utilisé quand l'utilisateur arrête manuellement le stream
 */
export function cancelReconnection() {
  // Si un timer est actif, l'annuler
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
    logger.info('Reconnexion annulée');
  }
  
  // Réinitialiser le compteur
  reset();
}

/**
 * Réinitialise le manager après une reconnexion réussie
 * Appeler cette fonction dès que l'audio joue à nouveau
 */
export function reset() {
  retryCount = 0;
  
  // Annuler le timer si actif
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  
  logger.info('Reconnection Manager réinitialisé');
}

/**
 * Retourne l'état actuel du manager (pour debug)
 * @returns {Object} État avec compteur et statut
 */
export function getReconnectionState() {
  return {
    isReconnecting: reconnectTimer !== null,
    retryCount,
    maxRetries: MAX_RETRIES
  };
}

// ============================================
// NOTES POUR LE FUTUR
// ============================================
/*
  Améliorations possibles (pas nécessaires pour MVP) :
  
  1. Détection type d'erreur :
     - Erreur réseau → réessayer
     - Erreur 404 (stream inexistant) → ne pas réessayer
  
  2. Stratégie adaptative :
     - Si échecs fréquents → augmenter les délais
     - Si succès rapide → réduire les délais
  
  3. Notification utilisateur :
     - Toast "Reconnexion en cours..." pendant l'attente
     - Progress bar pour montrer le délai restant
  
  4. Persistance :
     - Sauvegarder dans localStorage si reconnexion active
     - Continuer après rafraîchissement de page
*/
