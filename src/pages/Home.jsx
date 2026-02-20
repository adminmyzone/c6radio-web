/**
 * Page d'accueil - C6Radio
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Cette page charge des articles depuis WordPress et les affiche en deux sections :
 *
 * 1. "À la une" - UN article mis en avant (grand format, image en fond)
 *    - Si l'admin a épinglé un article dans WordPress (sticky)
 *      → cet article s'affiche en priorité
 *    - Sinon → on prend simplement le dernier article publié
 *
 * 2. "Dernières actualités" - 6 articles en grille (3 colonnes sur desktop)
 *    - Les NewsCard réutilisées depuis la page /news
 *
 * COMMENT ÉPINGLE-T-ON UN ARTICLE DANS WORDPRESS ?
 * Admin WP → Modifier un article → Panneau "Statut" → cocher "Mis en avant" (Sticky)
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, fetchContextualCategoryIds } from '../services/wordpress.js';
import NewsCard from '../components/NewsCard.jsx';
import './Home.css';

/**
 * ID de la catégorie bannières (évite une dépendance circulaire si WP est down)
 */
const BANNERS_CATEGORY_ID = '32';

/**
 * Formater la date en français
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Nettoyer le texte d'un extrait HTML et le tronquer
 */
function cleanExcerpt(html, maxLength = 200) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export default function Home() {
  /**
   * ÉTATS REACT :
   * - featuredPost : l'article "à la une" (grand format)
   * - recentPosts  : les 6 articles suivants (grille)
   * - loading      : true pendant le chargement initial
   * - error        : message si le chargement échoue
   */
  const [featuredPost, setFeaturedPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Chargement des articles au démarrage (une seule fois grâce à [])
     *
     * STRATÉGIE EN 2 REQUÊTES PARALLÈLES :
     * 1. On cherche les articles épinglés (sticky=true) → article "À la une"
     * 2. On charge les 7 plus récents → grille "Dernières actualités"
     *
     * Promise.all = lance les 2 requêtes EN MÊME TEMPS, attend que les deux
     * soient finies avant de continuer (plus rapide que l'une après l'autre)
     */
    async function loadHome() {
      try {
        setLoading(true);
        setError(null);

        // Récupérer dynamiquement les IDs à exclure
        // (bannières + toutes catégories contextuelles : élections, événements, patrimoine...)
        const excludedIds = await fetchContextualCategoryIds();
        const excludeStr = excludedIds.join(',');

        const [stickyPosts, recentAll] = await Promise.all([
          fetchPosts({
            sticky: true,
            per_page: 1,
            categories_exclude: excludeStr,
          }),
          fetchPosts({
            per_page: 7,
            categories_exclude: excludeStr,
          }),
        ]);

        if (stickyPosts.length > 0) {
          // Un article est épinglé dans WordPress → il prend la place "À la une"
          setFeaturedPost(stickyPosts[0]);
          setRecentPosts(recentAll.slice(0, 6));
        } else {
          // Pas d'épinglé → le plus récent est "À la une", les 6 suivants en grille
          setFeaturedPost(recentAll[0] || null);
          setRecentPosts(recentAll.slice(1, 7));
        }
      } catch (err) {
        setError('Impossible de charger les actualités. Réessaie plus tard.');
      } finally {
        // finally = s'exécute toujours, que ca ait réussi ou échoué
        setLoading(false);
      }
    }

    loadHome();
  }, []); // [] = exécuter une seule fois au montage

  // ─── AFFICHAGE PENDANT LE CHARGEMENT ───────────────────────────────────────
  if (loading) {
    return (
      <div className="home-page">
        <div className="home-loading">
          <div className="home-spinner" aria-label="Chargement..." />
          <p>Chargement des actualités…</p>
        </div>
      </div>
    );
  }

  // ─── AFFICHAGE ERREUR ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="home-page">
        <div className="home-error">
          <p>{error}</p>
          <Link to="/news" className="home-btn-all">Voir toutes les actualités</Link>
        </div>
      </div>
    );
  }

  // ─── AFFICHAGE PRINCIPAL ────────────────────────────────────────────────────
  return (
    <div className="home-page">

      {/* ══════════════════════════════════════════
          SECTION 1 : À LA UNE
          Grand article mis en avant
          ══════════════════════════════════════════ */}
      {featuredPost && (
        <section className="home-featured">
          <h2 className="home-section-title">À la une</h2>

          <Link to={`/news/${featuredPost.slug}`} className="home-featured__card">
            {/* Image de fond + overlay sombre pour lisibilité du texte */}
            <div
              className="home-featured__bg"
              style={{
                backgroundImage: `url(${
                  featuredPost.featuredImage?.url || '/logo-c6radio.png'
                })`,
              }}
            >
              <div className="home-featured__overlay" />
            </div>

            {/* Texte par-dessus l'image */}
            <div className="home-featured__body">
              {/* Badges catégories */}
              {featuredPost.categories.length > 0 && (
                <div className="home-featured__cats">
                  {featuredPost.categories.slice(0, 2).map((cat) => (
                    <span key={cat.id} className="home-featured__cat">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Titre de l'article */}
              <h3 className="home-featured__title">{featuredPost.title}</h3>

              {/* Extrait (résumé) */}
              <p className="home-featured__excerpt">
                {cleanExcerpt(featuredPost.excerpt)}
              </p>

              {/* Date + lien */}
              <div className="home-featured__meta">
                <time className="home-featured__date">
                  {formatDate(featuredPost.date)}
                </time>
                <span className="home-featured__cta">Lire l'article →</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ══════════════════════════════════════════
          SECTION 2 : DERNIÈRES ACTUALITÉS
          Grille de 6 articles récents
          ══════════════════════════════════════════ */}
      {recentPosts.length > 0 && (
        <section className="home-recent">
          <h2 className="home-section-title">Dernières actualités</h2>

          {/* Grille - réutilise le composant NewsCard de la page /news */}
          <div className="home-recent__grid">
            {recentPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          BOUTON "TOUTES LES ACTUALITÉS"
          ══════════════════════════════════════════ */}
      <div className="home-all-news">
        <Link to="/news" className="home-btn-all">
          Toutes les actualités
        </Link>
      </div>

    </div>
  );
}
