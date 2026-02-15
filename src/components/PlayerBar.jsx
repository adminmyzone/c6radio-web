// ============================================
// COMPOSANT PLAYER BAR
// Barre sticky footer avec contrôles audio + Now Playing
// Visible uniquement quand un audio est actif
// ============================================

import { useAudioPlayer } from "../hooks/useAudioPlayer";
import NowPlaying from "./NowPlaying";
import "./PlayerBar.css";

export default function PlayerBar() {
  const {
    state,
    isPlaying,
    isPaused,
    isLive,
    isPodcast,
    playLive,
    pausePodcast,
    resumePodcast,
    stop,
  } = useAudioPlayer();

  // Ne rien afficher si aucun audio n'est actif
  // (state === 'idle' signifie aucun audio chargé)
  if (state === "idle") {
    return null;
  }

  return (
    <div className="player-bar">
      <div className="player-bar-container">
        <div className="player-bar-content">
          {/* Section gauche : Now Playing (mode compact) */}
          <div className="player-bar-info">
            {isLive ? (
              <NowPlaying shouldPoll={isPlaying} compact={false} />
            ) : isPodcast ? (
              <div className="player-bar-podcast">
                <span>🎙️ Podcast</span>
                <span className="player-bar-podcast-text">
                  En cours de lecture...
                </span>
              </div>
            ) : (
              <div>Audio chargé</div>
            )}
          </div>

          {/* Section droite : Contrôles */}
          <div className="player-bar-controls">
            {/* Bouton Play/Pause (uniquement pour podcast) */}
            {isPodcast && (
              <>
                {isPlaying && (
                  <button
                    onClick={pausePodcast}
                    className="player-btn player-btn-round player-btn-pause"
                    title="Pause"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {isPaused && (
                  <button
                    onClick={resumePodcast}
                    className="player-btn player-btn-round player-btn-play"
                    title="Reprendre"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* Bouton Play Live (si idle ou podcast arrêté) */}
            {!isLive && !isPlaying && (
              <button
                onClick={playLive}
                className="player-btn player-btn-text player-btn-play"
                title="Écouter le direct"
              >
                ▶ Live
              </button>
            )}

            {/* Bouton Stop (toujours visible si audio actif) */}
            {(isPlaying || isPaused) && (
              <button
                onClick={stop}
                className="player-btn player-btn-round player-btn-stop"
                title="Arrêter"
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
