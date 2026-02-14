// ============================================
// COMPOSANT PLAYER BUTTON
// Utilise le hook useAudioPlayer pour contrôler l'audio
// ============================================

import { useAudioPlayer } from '../hooks/useAudioPlayer';
import './PlayerButton.css';

export default function PlayerButton() {
  // On utilise notre hook personnalisé
  // Il nous donne tout ce dont on a besoin
  const { isPlaying, playLive, stop } = useAudioPlayer();
  
  // Plus besoin de gérer l'état local !
  // Le hook s'en occupe automatiquement

  return (
    <div className="player-button-demo">
      <h1>C6Radio</h1>
      
      {isPlaying ? (
        <button 
          onClick={stop}
          className="btn-stop"
        >
          ⏹ Stop
        </button>
      ) : (
        <button 
          onClick={playLive}
          className="btn-play"
        >
          ▶ Play Live
        </button>
      )}
    </div>
  );
}