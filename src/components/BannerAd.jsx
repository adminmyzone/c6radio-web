/**
 * Composant BannerAd - Affichage d'une bannière publicitaire
 *
 * PHASE 6 - BANNIÈRES PUBLICITAIRES
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche une bannière publicitaire avec :
 * - Rotation automatique si plusieurs bannières
 * - Lien cliquable (s'ouvre dans nouvel onglet)
 * - Animation de transition fluide
 * - Indicateurs de pagination (dots)
 * - Contrôles navigation optionnels (prev/next)
 * - État loading pendant chargement
 *
 * UTILISATION :
 * ```jsx
 * <BannerAd
 *   position="header"
 *   rotationInterval={5000}
 *   showControls={true}
 *   showIndicators={true}
 * />
 * ```
 *
 * PROPS :
 * - position: Position des bannières à afficher (header, footer, sidebar, all)
 * - rotationInterval: Intervalle de rotation en ms (défaut: 5000)
 * - showControls: Afficher les boutons prev/next (défaut: false)
 * - showIndicators: Afficher les dots de pagination (défaut: true)
 * - className: Classes CSS additionnelles
 * - height: Hauteur de la bannière (défaut: auto)
 */

import React, { useState } from 'react';
import { useBanners } from '../hooks/useBanners.js';
import './BannerAd.css';

export function BannerAd({
  position = 'all',
  rotationInterval = 5000,
  showControls = false,
  showIndicators = true,
  className = '',
  height = 'auto',
}) {
  const {
    currentBanner,
    banners,
    currentIndex,
    isLoading,
    hasBanners,
    nextBanner,
    previousBanner,
    goToBanner,
  } = useBanners(position, rotationInterval);

  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * Gérer le clic sur la bannière
   */
  const handleClick = (e) => {
    if (currentBanner?.link) {
      // Le lien est géré par la balise <a>, ne rien faire ici
      // Mais on peut logger pour analytics
      console.log('[BannerAd] Click on banner:', currentBanner.title);
    } else {
      // Si pas de lien, empêcher le comportement par défaut
      e.preventDefault();
    }
  };

  /**
   * Gérer le chargement de l'image
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  /**
   * Reset imageLoaded quand la bannière change
   */
  React.useEffect(() => {
    setImageLoaded(false);
  }, [currentBanner?.id]);

  // Ne rien afficher si pas de bannières
  if (!hasBanners) {
    return null;
  }

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className={`banner-ad ${className}`} style={{ height }}>
        <div className="banner-loading">
          <div className="banner-spinner"></div>
        </div>
      </div>
    );
  }

  // Afficher la bannière courante
  const banner = currentBanner;
  const hasMultipleBanners = banners.length > 1;

  return (
    <div className={`banner-ad ${className}`} style={{ height }}>
      {/* Bannière cliquable */}
      {banner.link ? (
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="banner-link"
          onClick={handleClick}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className={`banner-image ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </a>
      ) : (
        <div className="banner-link">
          <img
            src={banner.image}
            alt={banner.title}
            className={`banner-image ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </div>
      )}

      {/* Contrôles de navigation (optionnels) */}
      {showControls && hasMultipleBanners && (
        <div className="banner-controls">
          <button
            className="banner-control banner-prev"
            onClick={previousBanner}
            aria-label="Bannière précédente"
          >
            ‹
          </button>
          <button
            className="banner-control banner-next"
            onClick={nextBanner}
            aria-label="Bannière suivante"
          >
            ›
          </button>
        </div>
      )}

      {/* Indicateurs de pagination (dots) */}
      {showIndicators && hasMultipleBanners && (
        <div className="banner-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToBanner(index)}
              aria-label={`Aller à la bannière ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Compteur de bannières (optionnel, pour debug) */}
      {hasMultipleBanners && process.env.NODE_ENV === 'development' && (
        <div className="banner-counter">
          {currentIndex + 1} / {banners.length}
        </div>
      )}
    </div>
  );
}

export default BannerAd;

