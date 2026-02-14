// ============================================
// HOOK REACT - Interface simple pour utiliser l'audio
// ============================================

import { useState, useEffect } from 'react';
import * as audioPlayer from '../services/audioPlayer';

/**
 * Hook personnalisé pour utiliser le player audio
 * Retourne l'état et les fonctions de contrôle
 * 
 * Usage dans un composant :
 * const { state, source, playLive, stop } = useAudioPlayer();
 */
export function useAudioPlayer() {
  // État local React synchronisé avec le service audio
  const [state, setState] = useState(audioPlayer.getState());
  const [source, setSource] = useState(audioPlayer.getSource());
  const [podcastUrl, setPodcastUrl] = useState(audioPlayer.getPodcastUrl());

  // useEffect : s'exécute au montage du composant
  useEffect(() => {
    // S'abonner aux changements du service audio
    const unsubscribe = audioPlayer.subscribe((audioState) => {
      // Quand le service notifie un changement, on met à jour le state React
      setState(audioState.state);
      setSource(audioState.source);
      setPodcastUrl(audioState.podcastUrl);
    });

    // Cleanup : se désabonner quand le composant est détruit
    // IMPORTANT pour éviter les fuites mémoire
    return unsubscribe;
  }, []); // [] = s'exécute une seule fois au montage

  // Retourne un objet avec tout ce dont l'UI a besoin
  return {
    // État actuel
    state,        // 'stopped' | 'playing' | 'paused' | 'loading' | 'error'
    source,       // 'live' | 'podcast' | null
    podcastUrl,   // URL du podcast si applicable
    
    // Propriétés dérivées (calculées)
    isPlaying: state === 'playing',
    isPaused: state === 'paused',
    isStopped: state === 'stopped',
    isLive: source === 'live',
    isPodcast: source === 'podcast',
    
    // Fonctions de contrôle - Live
    playLive: audioPlayer.playLiveStream,
    stopLive: audioPlayer.stopLiveStream,
    
    // Fonctions de contrôle - Podcast
    playPodcast: audioPlayer.playPodcast,
    pausePodcast: audioPlayer.pausePodcast,
    resumePodcast: audioPlayer.resumePodcast,
    stopPodcast: audioPlayer.stopPodcast,
    
    // Fonction universelle
    stop: audioPlayer.stop,
  };
}
