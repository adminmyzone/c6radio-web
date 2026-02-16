/**
 * Hook useBanners - Gestion des bannières publicitaires
 *
 * PHASE 6 - BANNIÈRES PUBLICITAIRES
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce hook gère :
 * - Le chargement des bannières depuis WordPress
 * - La rotation automatique (change toutes les X secondes)
 * - Le cache local pour éviter trop de requêtes
 * - Les états loading/error
 *
 * UTILISATION :
 * ```jsx
 * const { currentBanner, banners, isLoading, error } = useBanners('header', 5000);
 * ```
 *
 * @param {string} position - Position des bannières (header, footer, sidebar, all)
 * @param {number} rotationInterval - Intervalle de rotation en ms (défaut: 5000 = 5 secondes)
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchBanners } from '../services/wordpress.js';
import logger from '../lib/logger.js';

// Cache des bannières par position
const bannersCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useBanners(position = 'all', rotationInterval = 5000) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charger les bannières depuis WordPress (avec cache)
   */
  const loadBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier le cache
      const cacheKey = position;
      const cached = bannersCache.get(cacheKey);
      const now = Date.now();

      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        logger.log(`[useBanners] Using cached banners for position: ${position}`);
        setBanners(cached.data);
        setIsLoading(false);
        return;
      }

      // Fetch depuis WordPress
      logger.log(`[useBanners] Fetching banners from WordPress for position: ${position}`);
      const data = await fetchBanners(position);

      // Mettre en cache
      bannersCache.set(cacheKey, {
        data,
        timestamp: now,
      });

      setBanners(data);
      setIsLoading(false);

    } catch (err) {
      logger.error('[useBanners] Error loading banners:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [position]);

  /**
   * Charger les bannières au mount
   */
  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  /**
   * Rotation automatique des bannières
   */
  useEffect(() => {
    // Ne pas démarrer la rotation si pas de bannières ou une seule
    if (banners.length <= 1) {
      return;
    }

    logger.log(`[useBanners] Starting banner rotation (${rotationInterval}ms)`);

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        logger.log(`[useBanners] Rotating to banner ${nextIndex + 1}/${banners.length}`);
        return nextIndex;
      });
    }, rotationInterval);

    // Cleanup
    return () => {
      logger.log('[useBanners] Stopping banner rotation');
      clearInterval(intervalId);
    };
  }, [banners.length, rotationInterval]);

  /**
   * Fonction pour forcer le prochain banner
   */
  const nextBanner = useCallback(() => {
    if (banners.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  /**
   * Fonction pour aller au banner précédent
   */
  const previousBanner = useCallback(() => {
    if (banners.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  }, [banners.length]);

  /**
   * Fonction pour aller à un banner spécifique
   */
  const goToBanner = useCallback((index) => {
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  }, [banners.length]);

  /**
   * Fonction pour rafraîchir les bannières
   */
  const refresh = useCallback(() => {
    // Invalider le cache
    bannersCache.delete(position);
    loadBanners();
  }, [position, loadBanners]);

  return {
    // Bannière courante
    currentBanner: banners[currentIndex] || null,

    // Toutes les bannières
    banners,

    // Index courant
    currentIndex,

    // États
    isLoading,
    error,
    hasBanners: banners.length > 0,

    // Actions
    nextBanner,
    previousBanner,
    goToBanner,
    refresh,
  };
}

export default useBanners;

