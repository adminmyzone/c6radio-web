// ============================================
// COMPOSANT DE TEST
// Démontre qu'un seul audio joue à la fois (live OU podcast)
// ============================================

import { useAudioPlayer } from '../hooks/useAudioPlayer';
import NowPlaying from './NowPlaying';
import './AudioTest.css';

export default function AudioTest() {
  const { 
    state,
    source, 
    isPlaying,
    isPaused,
    isLive,
    isPodcast,
    playLive, 
    playPodcast,
    pausePodcast,
    resumePodcast,
    stop 
  } = useAudioPlayer();

  // URL de test d'un podcast MP3 (exemple)
  const testPodcastUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="audio-test">
      <h1>Test Audio Player</h1>
      
      {/* Affichage de l'état actuel */}
      <div className="test-section">
        <h2>État Actuel</h2>
        <div className="test-info">
          <p><strong>État:</strong> <span className="test-state">{state}</span></p>
          <p><strong>Source:</strong> <span className="test-source">{source || 'aucune'}</span></p>
          <p><strong>Joue actuellement:</strong> {isPlaying ? '✅ Oui' : '❌ Non'}</p>
        </div>
      </div>

      {/* Now Playing (polling actif uniquement si live joue) */}
      <div className="test-section now-playing">
        <h2>🎵 Now Playing</h2>
        <p className="description">
          Mis à jour automatiquement toutes les 12 secondes (uniquement si live actif)
        </p>
        <NowPlaying shouldPoll={isLive && isPlaying} />
      </div>

      {/* Section Live */}
      <div className="test-section live">
        <h2>📻 Live Stream</h2>
        <p className="description">C6Radio - Stream en direct</p>
        
        <div className="test-controls">
          <button 
            onClick={playLive}
            disabled={isLive && isPlaying}
            className="test-btn test-btn-live-play"
          >
            ▶ Play Live
          </button>
          
          {isLive && (
            <button 
              onClick={stop}
              className="test-btn test-btn-live-stop"
            >
              ⏹ Stop Live
            </button>
          )}
        </div>
        
        {isLive && (
          <p className="test-status live-active">
            ✅ Live en cours de lecture...
          </p>
        )}
      </div>

      {/* Section Podcast */}
      <div className="test-section podcast">
        <h2>🎙️ Podcast Test</h2>
        <p className="description">Podcast de test (musique libre)</p>
        
        <div className="test-controls">
          <button 
            onClick={() => playPodcast(testPodcastUrl)}
            disabled={isPodcast && isPlaying}
            className="test-btn test-btn-podcast-play"
          >
            ▶ Play Podcast
          </button>
          
          {isPodcast && isPlaying && (
            <button 
              onClick={pausePodcast}
              className="test-btn test-btn-podcast-pause"
            >
              ⏸ Pause
            </button>
          )}
          
          {isPodcast && isPaused && (
            <button 
              onClick={resumePodcast}
              className="test-btn test-btn-podcast-resume"
            >
              ▶ Reprendre
            </button>
          )}
          
          {isPodcast && (
            <button 
              onClick={stop}
              className="test-btn test-btn-podcast-stop"
            >
              ⏹ Stop Podcast
            </button>
          )}
        </div>
        
        {isPodcast && (
          <p className="test-status podcast-active">
            ✅ Podcast en cours de lecture...
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="test-instructions">
        <h3>🧪 Tests à effectuer</h3>
        <ol>
          <li>Cliquez <strong>Play Live</strong> → vérifiez que le stream C6Radio joue</li>
          <li>Sans arrêter, cliquez <strong>Play Podcast</strong> → le live s'arrête automatiquement</li>
          <li>Le podcast joue → testez <strong>Pause</strong> puis <strong>Reprendre</strong></li>
          <li>Sans arrêter le podcast, cliquez <strong>Play Live</strong> → le podcast s'arrête automatiquement</li>
          <li>Vérifiez que <strong>UN SEUL audio joue à la fois</strong> ✅</li>
        </ol>
      </div>
    </div>
  );
}
