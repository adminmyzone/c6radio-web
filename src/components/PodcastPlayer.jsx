/**
 * Composant PodcastPlayer - Lecteur audio intégré pour podcasts
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche un petit lecteur audio pour écouter un podcast MP3.
 * Il s'affiche uniquement si un article a un fichier audio attaché.
 *
 * FONCTIONNALITÉS :
 * - Bouton Play/Pause/Stop
 * - Barre de progression visuelle
 * - Durée actuelle / durée totale
 * - Intégration GlobalAudioContext (règle "un seul audio")
 *
 * GLOBALAUDIOCONTEXT :
 * Quand l'utilisateur lance ce podcast, on enregistre 'podcast' comme
 * lecteur actif. Ça met automatiquement en pause :
 * - Le live stream radio
 * - Les vidéos WordPress
 * - Les autres podcasts
 *
 * USEAUDIOPLAYER :
 * On réutilise le hook existant qui gère déjà :
 * - playPodcast() : lecture MP3
 * - stop() : arrêt
 * - Machine à états (idle, loading, playing, stopped, error)
 */

import { useEffect } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer.js';
import { useGlobalAudio } from '../contexts/GlobalAudioContext.jsx';
import './PodcastPlayer.css';

/**
 * Formater le temps en MM:SS
 * Exemple : 125 secondes → "02:05"
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === 0) {
    return '00:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Composant PodcastPlayer
 *
 * @param {Object} props
 * @param {string} props.audioUrl - URL du fichier MP3
 * @param {string} props.title - Titre du podcast (pour Media Session API)
 * @param {string} props.artwork - URL image (pour Media Session API)
 */
export default function PodcastPlayer({ audioUrl, title, artwork }) {
  // Hook audio player
  const { playPodcast, stop, state, currentTime, duration } = useAudioPlayer();

  // GlobalAudioContext
  const { registerPlayer, activePlayer } = useGlobalAudio();

  /**
   * Cleanup : Arrêter le podcast quand le composant est démonté
   *
   * EXPLICATION POUR DÉBUTANTS :
   * Quand l'utilisateur navigue vers un autre article, React détruit
   * ce composant (grâce à la key unique). On profite de ce moment
   * pour arrêter proprement l'audio en cours.
   *
   * Sans ça, l'audio continuerait de jouer en arrière-plan même
   * si le lecteur n'est plus visible. */

  useEffect(() => {
    // Fonction de cleanup exécutée quand le composant est détruit
    return () => {
      // Si ce podcast est en train de jouer, l'arrêter
      if (activePlayer === 'podcast' && state === 'playing') {
        stop();
      }
    };
  }, [activePlayer, state, stop]);

  /**
   * Gestion du clic sur PLAY
   *
   * EXPLICATION :
   * 1. On enregistre 'podcast' comme lecteur actif dans GlobalAudioContext
   * 2. GlobalAudioContext met automatiquement en pause les autres lecteurs
   * 3. On lance la lecture du MP3
   */
  const handlePlay = () => {
    // Enregistrer comme lecteur actif
    registerPlayer('podcast', {
      pauseCallback: stop,
    });

    // Lancer la lecture avec métadonnées
    playPodcast(audioUrl, {
      title: title || 'Podcast C6Radio',
      artist: 'C6Radio',
      artwork: artwork || '/logo-c6radio.png',
    });
  };

  /**
   * Gestion du clic sur STOP
   */
  const handleStop = () => {
    stop();
  };

  // Vérifier si CE podcast est en cours de lecture
  const isThisPodcastPlaying = state === 'playing' && activePlayer === 'podcast';
  const isLoading = state === 'loading' && activePlayer === 'podcast';
  const hasError = state === 'error' && activePlayer === 'podcast';

  // Calculer le pourcentage de progression
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="podcast-player">
      <div className="podcast-player__header">
        <span className="podcast-player__icon">🎙️</span>
        <h3 className="podcast-player__title">Podcast audio</h3>
      </div>

      <div className="podcast-player__controls">
        {/* Bouton Play/Stop */}
        {isThisPodcastPlaying ? (
          <button
            className="podcast-player__btn podcast-player__btn--stop"
            onClick={handleStop}
            title="Arrêter"
          >
            ⏹️ Stop
          </button>
        ) : isLoading ? (
          <button
            className="podcast-player__btn podcast-player__btn--loading"
            disabled
            title="Chargement..."
          >
            ⏳ Chargement...
          </button>
        ) : (
          <button
            className="podcast-player__btn podcast-player__btn--play"
            onClick={handlePlay}
            title="Écouter le podcast"
          >
            ▶️ Écouter
          </button>
        )}

        {/* Durée */}
        <div className="podcast-player__time">
          <span className="podcast-player__time-current">
            {formatTime(currentTime)}
          </span>
          <span className="podcast-player__time-separator">/</span>
          <span className="podcast-player__time-total">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="podcast-player__progress-container">
        <div
          className="podcast-player__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Message d'erreur si problème */}
      {hasError && (
        <div className="podcast-player__error">
          ⚠️ Erreur de lecture. Vérifiez votre connexion.
        </div>
      )}

      {/* Info : règle "un seul audio" */}
      {!isThisPodcastPlaying && activePlayer && activePlayer !== 'podcast' && (
        <div className="podcast-player__info">
          💡 Un autre média est en lecture. Ce podcast s'arrêtera automatiquement si vous lancez un autre audio.
        </div>
      )}
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 *
 * GLOBALAUDIOCONTEXT :
 * - registerPlayer('podcast', { pauseCallback: stop })
 * - Met automatiquement en pause le live stream et autres médias
 * - activePlayer permet de savoir quel lecteur est actif
 *
 * USEAUDIOPLAYER :
 * - playPodcast(url, metadata) : lance lecture MP3
 * - stop() : arrête complètement
 * - state : 'idle' | 'loading' | 'playing' | 'stopped' | 'error'
 * - currentTime : position actuelle en secondes
 * - duration : durée totale en secondes
 *
 * ÉTATS DU BOUTON :
 * - ▶️ Écouter : si idle ou stopped
 * - ⏳ Chargement : pendant chargement MP3
 * - ⏹️ Stop : si en lecture
 *
 * BARRE DE PROGRESSION :
 * - Calculée avec (currentTime / duration) * 100
 * - Mise à jour automatique via useAudioPlayer
 * - Visuelle uniquement (pas interactive pour MVP)
 *
 * FORMATAGE TEMPS :
 * - formatTime() convertit secondes en MM:SS
 * - Exemple : 125s → "02:05"
 * - padStart(2, '0') ajoute zéro devant si < 10
 *
 * MEDIA SESSION API :
 * - Les métadonnées (title, artist, artwork) sont passées à playPodcast()
 * - useAudioPlayer les transmet à la Media Session API
 * - Affichage sur lockscreen et notifications système
 *
 * AMÉLIORATION FUTURE (Phase 6+) :
 * - Barre de progression interactive (seek)
 * - Bouton pause séparé de stop
 * - Vitesse de lecture (1x, 1.5x, 2x)
 * - Téléchargement du fichier MP3
 */

