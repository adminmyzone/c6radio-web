/**
 * SplashScreen - Écran de démarrage animé
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant est affiché AU-DESSUS de toute l'application au lancement.
 * Il montre le logo avec une animation, puis disparaît automatiquement.
 *
 * COMMENT ÇA MARCHE :
 * 1. On démarre en phase "visible" → le logo entre en scène
 * 2. Après `duration` millisecondes, on passe en phase "fading"
 * 3. L'animation CSS de disparition se joue (0.5s)
 * 4. Quand l'animation CSS est terminée, `onComplete()` est appelé
 * 5. App.jsx supprime le SplashScreen de l'affichage
 *
 * JINGLE AUDIO :
 * Pour ajouter un jingle, lis les commentaires dans le useEffect ci-dessous.
 *
 * PROPS :
 * - onComplete  : fonction appelée quand le splash se termine (obligatoire)
 * - duration    : durée d'affichage en millisecondes, défaut = 2500ms
 */

import { useEffect, useState } from 'react';
import './SplashScreen.css';

function SplashScreen({ onComplete, duration = 2500 }) {
  /**
   * `phase` peut valoir :
   * - 'visible' : l'overlay est visible (animation d'entrée du logo)
   * - 'fading'  : l'overlay est en train de disparaître
   */
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    // ─── OPTIONNEL : JINGLE AUDIO ───────────────────────────────────────────
    // Pour jouer un son au lancement :
    // 1. Dépose ton fichier audio ici : /public/jingle.mp3
    // 2. Décommente les 3 lignes ci-dessous :
    //
    // const audio = new Audio('/jingle.mp3');
    // audio.volume = 0.7;
    // audio.play().catch(() => {}); // .catch() au cas où le navigateur bloque l'autoplay
    // ────────────────────────────────────────────────────────────────────────

    // Après `duration` ms → lancer l'animation de sortie
    const timer = setTimeout(() => {
      setPhase('fading');
    }, duration);

    // Nettoyage : annuler le timer si le composant est démonté avant la fin
    return () => clearTimeout(timer);
  }, [duration]);

  /**
   * `onAnimationEnd` est appelé automatiquement par le navigateur
   * quand une animation CSS se termine sur cet élément.
   * On s'en sert pour savoir quand l'animation de disparition est finie.
   */
  const handleAnimationEnd = () => {
    if (phase === 'fading') {
      onComplete?.(); // Le ?. signifie "appelle si la fonction existe"
    }
  };

  return (
    <div
      className={`splash-screen splash-${phase}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="splash-content">
        {/* Logo C6 Radio */}
        <img
          src="/splash_logo.png"
          alt="C6 Radio"
          className="splash-logo"
        />

        {/* Spinner (anneau qui tourne) */}
        <div className="splash-spinner" aria-label="Chargement..." />
      </div>
    </div>
  );
}

export default SplashScreen;
