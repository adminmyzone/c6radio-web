// ============================================
// COMPOSANT NOW PLAYING
// Affiche titre/artiste/artwork en cours de lecture
// ============================================

import { useNowPlaying } from '../hooks/useNowPlaying';
import './NowPlaying.css';

export default function NowPlaying({ shouldPoll = true, compact = false }) {
  const { title, artist, isLoading } = useNowPlaying(shouldPoll);

  // Mode compact : juste titre/artiste en ligne
  if (compact) {
    return (
      <div className="now-playing-compact">
        <span className="title">{title}</span>
        {artist && artist !== 'En direct' && (
          <>
            <span className="separator">•</span>
            <span className="artist">{artist}</span>
          </>
        )}
      </div>
    );
  }

  // Mode complet : avec artwork
  return (
    <div className="now-playing-full">
      {/* Artwork */}
      <div className="now-playing-artwork">
        <img
          src={'/logo-c6radio.png'}
          alt="Now playing"
        />
        {isLoading && (
          <div className="now-playing-loading">
            <div className="now-playing-spinner"></div>
          </div>
        )}
      </div>

      {/* Infos texte */}
      <div className="now-playing-info">
        <span className="title">{title}</span>
        <span className="artist">{artist}</span>
      </div>
    </div>
  );
}
