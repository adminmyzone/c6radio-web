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

import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchPageBySlug } from '../services/wordpress.js';
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

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="dynamic-page">
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
    <div className="dynamic-page">
      <div className="page-container">
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
      </div>
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
 * dangerouslySetInnerHTML :
 * Permet d'injecter du HTML depuis une string.
 * Nom "dangerous" car risque d'injection XSS si le HTML n'est pas sécurisé.
 * Ici, c'est safe car WordPress assainit automatiquement le HTML.
 * 
 * Navigate :
 * Composant React Router pour rediriger vers une autre page.
 * "replace" = remplace l'historique (pas de retour arrière possible)
 * 
 * document.title :
 * Change le titre de l'onglet du navigateur.
 * Important pour SEO et expérience utilisateur !
 * 
 * SÉCURITÉ :
 * WordPress utilise wp_kses() pour assainir le HTML côté serveur.
 * Le HTML reçu via .rendered est déjà sécurisé.
 */
