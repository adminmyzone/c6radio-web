/**
 * Page NewsDetail - Détail d'une actualité
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Cette page affiche le contenu complet d'un article.
 *
 * ROUTE DYNAMIQUE :
 * URL : /news/:slug (ex: /news/concert-ce-weekend)
 * Le paramètre "slug" est extrait de l'URL avec useParams()
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPostBySlug } from '../services/wordpress.js';
import PodcastPlayer from '../components/PodcastPlayer.jsx';
import logger from '../lib/logger.js';
import './NewsDetail.css';

/**
 * Formater la date en français
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

export default function NewsDetail() {
  // Extraire le slug de l'URL
  const { slug } = useParams();
  const navigate = useNavigate();

  // États
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'article au montage et quand le slug change
  useEffect(() => {
    async function loadPost() {
      try {
        logger.log('[NewsDetail] Loading post:', slug);
        setLoading(true);
        setError(null);

        const fetchedPost = await fetchPostBySlug(slug);

        if (!fetchedPost) {
          // Article non trouvé
          setError('Article non trouvé');
          setPost(null);
        } else {
          setPost(fetchedPost);
        }

      } catch (err) {
        logger.error('[NewsDetail] Error loading post:', err);
        setError('Impossible de charger l\'article');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  // État : Chargement
  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-loading">
          <div className="spinner"></div>
          <p>Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  // État : Erreur ou article non trouvé
  if (error || !post) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-error">
          <h1>😕 {error || 'Article non trouvé'}</h1>
          <p>L'article que vous cherchez n'existe pas ou a été supprimé.</p>
          <Link to="/news" className="news-detail-back-button">
            ← Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  // Article chargé : afficher le contenu
  return (
    <div className="news-detail-page">
      <article className="news-detail">

        {/* Bouton retour */}
        <button
          onClick={() => navigate('/news')}
          className="news-detail-back"
        >
          ← Retour aux actualités
        </button>

        {/* Image à la une */}
        {post.featuredImage && (
          <div className="news-detail-image-wrapper">
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              className="news-detail-image"
            />
          </div>
        )}

        {/* En-tête */}
        <header className="news-detail-header">
          <h1 className="news-detail-title">{post.title}</h1>

          {/* Métadonnées */}
          <div className="news-detail-meta">
            <time className="news-detail-date" dateTime={post.date}>
              📅 {formatDate(post.date)}
            </time>

            {/* Catégories */}
            {post.categories && post.categories.length > 0 && (
              <div className="news-detail-categories">
                {post.categories.map(cat => (
                  <span key={cat.id} className="news-detail-category">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* PHASE 5 - PODCASTS : Lecteur audio si l'article a un podcast */}
        {post.podcastAudioUrl && (
          <PodcastPlayer
            key={post.podcastAudioUrl}
            audioUrl={post.podcastAudioUrl}
            title={post.title}
            artwork={post.featuredImage?.url || '/logo-c6radio.png'}
          />
        )}

        {/* Contenu HTML de WordPress */}
        <div
          className="news-detail-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bouton retour bas de page */}
        <footer className="news-detail-footer">
          <Link to="/news" className="news-detail-back-button">
            ← Retour aux actualités
          </Link>
        </footer>
      </article>
    </div>
  );
}

