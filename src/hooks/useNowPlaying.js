// ============================================
// HOOK NOW PLAYING
// Polling automatique toutes les 12 secondes quand live joue
// ============================================

import { useState, useEffect } from 'react';
import * as nowPlayingAPI from '../services/nowPlaying';
import { getSource, getState, updateNowPlayingMetadata } from '../services/audioPlayer';
import logger from '../lib/logger';

const POLLING_INTERVAL = 12000; // 12 secondes

/**
 * Hook pour récupérer et afficher le "now playing"
 * Polling actif uniquement quand le live stream joue
 * 
 * @param {boolean} shouldPoll - Active/désactive le polling (optionnel)
 * @returns {Object} { title, artist, artwork, isLoading, error }
 */
export function useNowPlaying(shouldPoll = true) {
  // État des données now playing
  const [nowPlaying, setNowPlaying] = useState(
    nowPlayingAPI.getDefaultNowPlaying()
  );
  
  // État de chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // État d'erreur
  const [error, setError] = useState(null);
  
  // Compteur d'erreurs consécutives
  const [errorCount, setErrorCount] = useState(0);

  // Fonction qui fetch les données
  const fetchData = async () => {
    // Vérifier si on doit vraiment fetch
    // Polling uniquement si live stream actif
    const currentSource = getSource();
    const currentState = getState();
    
    if (currentSource !== 'live' || currentState !== 'playing') {
      // Si pas en live, utiliser les données par défaut
      setNowPlaying(nowPlayingAPI.getDefaultNowPlaying());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await nowPlayingAPI.fetchNowPlaying();
      setNowPlaying(data);
      setErrorCount(0); // Reset compteur erreurs si succès
      
    } catch (err) {
      logger.error('Erreur useNowPlaying:', err);
      setError(err.message);
      setErrorCount(prev => prev + 1);
      
      // Si 3 erreurs consécutives, repasser au fallback
      if (errorCount >= 2) {
        logger.warn('3 erreurs consécutives, utilisation fallback');
        setNowPlaying(nowPlayingAPI.getDefaultNowPlaying());
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  // Effect : Polling automatique
  useEffect(() => {
    // Si polling désactivé, ne rien faire
    if (!shouldPoll) {
      return;
    }

    // Fetch immédiat au montage
    fetchData();

    // Setup polling toutes les 12 secondes
    const intervalId = setInterval(() => {
      fetchData();
    }, POLLING_INTERVAL);

    // Cleanup : arrêter le polling au démontage
    return () => {
      clearInterval(intervalId);
    };
  }, [shouldPoll]); // Re-run si shouldPoll change

  // Effect : Fetch immédiat si la source ou l'état change
  useEffect(() => {
    const currentSource = getSource();
    const currentState = getState();
    
    // Si on passe en mode live, fetch immédiatement
    if (currentSource === 'live' && currentState === 'playing' && shouldPoll) {
      fetchData();
    }
    
    // Si on quitte le live, reset aux données par défaut
    if (currentSource !== 'live') {
      setNowPlaying(nowPlayingAPI.getDefaultNowPlaying());
    }
  }, [getSource(), getState(), shouldPoll]);

  // Effect : Mettre à jour Media Session automatiquement
  // Dès que les données now playing changent, on met à jour les contrôles natifs
  useEffect(() => {
    const currentSource = getSource();
    const currentState = getState();
    
    // Mettre à jour Media Session uniquement si live joue
    if (currentSource === 'live' && currentState === 'playing') {
      updateNowPlayingMetadata({
        title: nowPlaying.title,
        artist: nowPlaying.artist,
        artwork: nowPlaying.artwork
      });
      
      logger.info('📻 Media Session mis à jour:', nowPlaying.title, '-', nowPlaying.artist);
    }
  }, [nowPlaying]); // Se déclenche quand nowPlaying change

  return {
    // Données
    title: nowPlaying.title,
    artist: nowPlaying.artist,
    artwork: nowPlaying.artwork,
    startTime: nowPlaying.startTime,
    
    // État du hook
    isLoading,
    error,
    errorCount,
    
    // Fonction pour forcer un refresh manuel
    refresh: fetchData,
  };
}
