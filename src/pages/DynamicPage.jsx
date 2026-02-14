/**
 * DynamicPage - Composant générique pour pages WordPress
 * 
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant est "intelligent" : il récupère automatiquement
 * le contenu d'une page WordPress en fonction de l'URL.
 * 
 * EXEMPLE :
 * - User va sur /about → Ce composant charge la page "about" depuis WordPress
 * - User va sur /contact → Ce composant charge la page "contact" depuis WordPress
 * 
 * C'est un composant GÉNÉRIQUE = il fonctionne pour toutes les pages !
 * Plus besoin de créer un composant par page.
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchPageBySlug } from '../services/wordpress.js';
import { useGlobalAudio } from '../contexts/GlobalAudioContext.jsx';
import logger from '../lib/logger.js';
import './DynamicPage.css';

function DynamicPage() {
  // Récupérer le "slug" depuis l'URL
  // Exemple: si URL = /about, alors slug = "about"
  const { slug } = useParams();

  // États du composant
  const [page, setPage] = useState(null);       // Contenu de la page
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null);     // Erreur éventuelle

  // GlobalAudioContext pour gérer la règle "un seul audio à la fois"
  const { registerPlayer, unregisterWordPressMedia } = useGlobalAudio();

  // Référence pour tracker les éléments média de cette page
  const mediaElementsRef = useRef([]);

  // Charger la page depuis WordPress quand le slug change
  useEffect(() => {
    async function loadPage() {
      logger.log(`[DynamicPage] Loading page: ${slug}`);
      
      setLoading(true);
      setError(null);

      // Fetch depuis WordPress
      const pageData = await fetchPageBySlug(slug);

      if (pageData) {
        // Page trouvée !
        setPage(pageData);
        setLoading(false);
        
        // Mettre à jour le titre de la page (onglet navigateur)
        document.title = `${pageData.title} - C6Radio`;
      } else {
        // Page non trouvée (404)
        setError('Page non trouvée');
        setLoading(false);
      }
    }

    loadPage();
  }, [slug]); // Recharger si le slug change

  // Gérer les médias WordPress (vidéos + audio) après le rendu
  useEffect(() => {
    if (!page) return;

    // ÉTAPE 1 : Trouver tous les éléments vidéo et audio dans le contenu
    const videos = document.querySelectorAll('.page-content video');
    const audios = document.querySelectorAll('.page-content audio');
    const allMedia = [...videos, ...audios];

    if (allMedia.length === 0) {
      logger.log('[DynamicPage] No media elements found on page');
      return;
    }

    logger.log(`[DynamicPage] Found ${videos.length} videos and ${audios.length} audio elements`);

    // Stocker les références
    mediaElementsRef.current = allMedia;

    // ÉTAPE 2 : Lazy loading pour les vidéos (performance)
    // Les vidéos ne se chargent que quand elles deviennent visibles
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;

          if (entry.isIntersecting) {
            // Vidéo visible → Charger si pas déjà fait
            if (!video.dataset.loaded) {
              logger.log('[DynamicPage] Video entering viewport, loading...');
              video.load(); // Force le chargement
              video.dataset.loaded = 'true';
            }
          }
        });
      },
      {
        rootMargin: '50px', // Charger 50px avant que la vidéo soit visible
        threshold: 0.1,
      }
    );

    // Observer toutes les vidéos
    videos.forEach(video => {
      // Optimiser les performances : ne pas précharger automatiquement
      video.preload = 'metadata'; // Charge seulement les métadonnées (durée, dimensions)
      videoObserver.observe(video);
    });

    // ÉTAPE 3 : Écouter l'événement 'play' sur tous les médias
    const handlePlay = (event) => {
      const mediaElement = event.target;
      const isVideo = mediaElement.tagName === 'VIDEO';
      const playerType = isVideo ? 'wordpress-video' : 'wordpress-audio';

      logger.log(`[DynamicPage] ${playerType} started playing`);

      // Enregistrer dans GlobalAudioContext
      // Cela va automatiquement mettre en pause le live/podcast si actif
      registerPlayer(playerType, { mediaElement });
    };

    // Attacher les listeners
    allMedia.forEach(media => {
      media.addEventListener('play', handlePlay);
    });

    // ÉTAPE 4 : Cleanup - Important pour éviter fuites mémoire !
    return () => {
      // Désactiver l'observer
      videos.forEach(video => {
        videoObserver.unobserve(video);
      });
      videoObserver.disconnect();

      // Retirer les event listeners
      allMedia.forEach(media => {
        media.removeEventListener('play', handlePlay);
        // Désenregistrer du GlobalAudioContext
        unregisterWordPressMedia(media);
      });

      // Vider la référence
      mediaElementsRef.current = [];
    };
  }, [page, registerPlayer, unregisterWordPressMedia]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="page-container dynamic-page">
        <div className="page-loading">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Page non trouvée → Rediriger vers 404
  if (error || !page) {
    logger.log(`[DynamicPage] Page not found: ${slug}`);
    return <Navigate to="/404" replace />;
  }

  // Afficher le contenu de la page
  return (
    <div className="page-container dynamic-page">
      <main className="page-container">
        {/* Titre de la page */}
        <h1 className="page-title">{page.title}</h1>

        {/* Contenu HTML de WordPress */}
        {/* 
          dangerouslySetInnerHTML permet d'afficher du HTML depuis une string
          "dangerous" car risque XSS, mais WordPress assainit le HTML
        */}
        <div 
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Date de dernière modification (optionnel) */}
        {page.modified && (
          <div className="page-meta">
            <p>Dernière mise à jour : {new Date(page.modified).toLocaleDateString('fr-FR')}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DynamicPage;

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * useParams() :
 * Hook React Router qui récupère les paramètres de l'URL.
 * Exemple: route "/:slug" → useParams() retourne { slug: "about" }
 * 
 * IntersectionObserver :
 * API native du navigateur qui détecte quand un élément devient visible.
 * Parfait pour le lazy loading : charger les vidéos seulement quand visibles.
 *
 * dangerouslySetInnerHTML :
 * Permet d'injecter du HTML depuis une string.
 * Nom "dangerous" car risque d'injection XSS si le HTML n'est pas sécurisé.
 * Ici, c'est safe, car WordPress assainit automatiquement le HTML.
 * 
 * Navigate :
 * Composant React Router pour rediriger vers une autre page.
 * "replace" = remplace l'historique (pas de retour arrière possible)
 * 
 * document.title :
 * Change le titre de l'onglet du navigateur.
 * Important pour SEO et expérience utilisateur !
 * 
 * video.preload = 'metadata' :
 * Optimisation performance - charge seulement les métadonnées (durée, taille)
 * au lieu de tout le fichier vidéo. Le chargement complet se fait au play.
 *
 * SÉCURITÉ :
 * WordPress utilise wp_kses() pour assainir le HTML côté serveur.
 * Le HTML reçu via .rendered est déjà sécurisé.
 */
