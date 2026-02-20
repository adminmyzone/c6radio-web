/**
 * GlobalAudioContext - Gestion centralisée de tous les lecteurs audio/vidéo
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce Context React permet de gérer la règle "UN SEUL AUDIO À LA FOIS".
 *
 * PROBLÈME RÉSOLU :
 * Sans ce context, plusieurs sources audio peuvent jouer simultanément :
 * - Live stream (useAudioPlayer)
 * - Vidéos WordPress (dans pages dynamiques)
 * - Audio WordPress (dans pages dynamiques)
 * - Podcasts (futur)
 *
 * SOLUTION :
 * Quand un lecteur démarre, il "s'enregistre" ici.
 * Le context met automatiquement en pause tous les AUTRES lecteurs.
 *
 * TYPES DE LECTEURS :
 * - 'live' : Stream radio en direct
 * - 'podcast' : Épisode podcast
 * - 'wordpress-video' : Vidéo dans une page WordPress
 * - 'wordpress-audio' : Audio dans une page WordPress
 */

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import logger from '../lib/logger.js';

// Créer le Context
const GlobalAudioContext = createContext(null);

/**
 * Provider - À wrapper autour de toute l'app dans main.jsx
 */
export function GlobalAudioProvider({ children }) {
  // Lecteur actuellement actif
  const [activePlayer, setActivePlayer] = useState(null);

  // Références vers les éléments audio/vidéo WordPress
  // Pour pouvoir les mettre en pause depuis l'extérieur
  const wordpressMediaElements = useRef(new Set());

  // Référence vers le callback de pause du lecteur principal (live/podcast)
  const mainPlayerPauseCallback = useRef(null);

  /**
   * Mettre en pause tous les médias WordPress (vidéos + audio)
   */
  const pauseWordPressMedia = useCallback(() => {
    logger.log(`[GlobalAudio] Pausing all WordPress media (${wordpressMediaElements.current.size} elements)`);

    wordpressMediaElements.current.forEach(mediaElement => {
      if (mediaElement && !mediaElement.paused) {
        mediaElement.pause();
      }
    });
  }, []);

  /**
   * Enregistrer un lecteur comme actif
   * Tous les autres lecteurs seront automatiquement mis en pause
   *
   * @param {string} playerType - Type : 'live' | 'podcast' | 'wordpress-video' | 'wordpress-audio'
   * @param {Object} options - Options supplémentaires
   * @param {HTMLMediaElement} options.mediaElement - L'élément vidéo/audio (pour WordPress)
   * @param {Function} options.pauseCallback - Fonction pour mettre en pause (pour live/podcast)
   */
  const registerPlayer = useCallback((playerType, options = {}) => {
    logger.log(`[GlobalAudio] Registering player: ${playerType}`);

    setActivePlayer((prevActivePlayer) => {
      // Si c'est déjà le lecteur actif, ne rien faire
      if (prevActivePlayer === playerType) {
        logger.log(`[GlobalAudio] ${playerType} already active, skipping`);
        return prevActivePlayer;
      }

      // ÉTAPE 1 : Mettre en pause l'ancien lecteur actif
      if (prevActivePlayer) {
        logger.log(`[GlobalAudio] Pausing previous player: ${prevActivePlayer}`);

        if (prevActivePlayer.startsWith('wordpress-')) {
          // Mettre en pause tous les médias WordPress
          pauseWordPressMedia();
        } else if (prevActivePlayer === 'live' || prevActivePlayer === 'podcast') {
          // Mettre en pause le lecteur principal via callback
          if (mainPlayerPauseCallback.current) {
            mainPlayerPauseCallback.current();
          }
        }
      }

      // ÉTAPE 2 : Enregistrer les références si besoin
      if (playerType.startsWith('wordpress-') && options.mediaElement) {
        wordpressMediaElements.current.add(options.mediaElement);
      } else if ((playerType === 'live' || playerType === 'podcast') && options.pauseCallback) {
        mainPlayerPauseCallback.current = options.pauseCallback;
      }

      // ÉTAPE 3 : Retourner le nouveau lecteur actif
      return playerType;
    });
  }, [pauseWordPressMedia]);

  /**
   * Désenregistrer un élément média WordPress quand il est détruit
   * Important pour éviter les fuites mémoire !
   */
  const unregisterWordPressMedia = useCallback((mediaElement) => {
    wordpressMediaElements.current.delete(mediaElement);
  }, []);

  /**
   * Reset - Aucun lecteur actif
   * Appelé quand un lecteur est complètement arrêté (stop, pas pause)
   */
  const resetActivePlayer = useCallback(() => {
    logger.log('[GlobalAudio] Resetting active player');
    setActivePlayer(null);
  }, []);

  // Valeur du Context exposée à tous les composants
  const contextValue = {
    activePlayer,
    registerPlayer,
    resetActivePlayer,
    pauseWordPressMedia,
    unregisterWordPressMedia,
  };

  return (
    <GlobalAudioContext.Provider value={contextValue}>
      {children}
    </GlobalAudioContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le GlobalAudioContext
 * Usage dans un composant :
 * const { registerPlayer, activePlayer } = useGlobalAudio();
 */
export function useGlobalAudio() {
  const context = useContext(GlobalAudioContext);

  if (!context) {
    throw new Error('useGlobalAudio doit être utilisé dans un GlobalAudioProvider');
  }

  return context;
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 *
 * useCallback :
 * Mémorise les fonctions pour éviter de les recréer à chaque render.
 * Important pour la performance et éviter les re-renders inutiles.
 *
 * useRef :
 * Stocke des valeurs qui persistent entre les renders SANS causer de re-render.
 * Parfait pour stocker des références vers des éléments DOM ou des callbacks.
 *
 * Set() :
 * Structure de données qui stocke des valeurs uniques.
 * Parfait pour stocker plusieurs éléments média sans doublons.
 *
 * Context API :
 * Permet de partager des données à travers l'arbre React SANS props drilling.
 * Au lieu de passer props à travers 10 composants, on utilise useContext().
 *
 * FLOW D'UTILISATION :
 * 1. User clique "Play" sur live → useAudioPlayer appelle registerPlayer('live')
 * 2. Context détecte qu'une vidéo WordPress joue → pause automatiquement
 * 3. User lance vidéo page → DynamicPage appelle registerPlayer('wordpress-video')
 * 4. Context détecte que live joue → appelle pauseCallback du live
 * 5. Résultat : UN SEUL audio à la fois ! ✅
 */

