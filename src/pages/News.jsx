/**
 * Page News - Liste des actualités
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Cette page affiche la liste de toutes les actualités
 * sous forme de grille de cartes.
 *
 * FONCTIONNALITÉS :
 * - Affichage grille responsive (1/2/3 colonnes)
 * - Loading spinner pendant chargement
 * - Message d'erreur si problème
 * - Message "aucune actualité" si vide
 *
 * PHASE 6 : Les bannières publicitaires sont maintenant gérées system-wide dans App.jsx
 */

import { useWordPressPosts } from '../hooks/useWordPressPosts.js';
import NewsCard from '../components/NewsCard.jsx';
import './News.css';

export default function News() {
  // Hook personnalisé pour récupérer les posts
  const { posts, loading, error } = useWordPressPosts();

  return (
    <div className="news-page">
      {/* En-tête */}
      <header className="news-header">
        <h1 className="news-title">Actualités C6Radio</h1>
        <p className="news-subtitle">
          Découvrez les dernières nouvelles, événements et coulisses de la radio
        </p>
      </header>


      {/* Contenu principal */}
      <main className="news-content">

        {/* État : Chargement */}
        {loading && (
          <div className="news-loading">
            <div className="spinner"></div>
            <p>Chargement des actualités...</p>
          </div>
        )}

        {/* État : Erreur */}
        {error && !loading && (
          <div className="news-error">
            <p className="news-error__message">❌ {error}</p>
            <p className="news-error__help">
              Vérifiez votre connexion internet ou réessayez plus tard.
            </p>
          </div>
        )}

        {/* État : Aucun article */}
        {!loading && !error && posts.length === 0 && (
          <div className="news-empty">
            <p className="news-empty__message">
              📭 Aucune actualité pour le moment
            </p>
            <p className="news-empty__help">
              Revenez bientôt pour découvrir nos dernières nouvelles !
            </p>
          </div>
        )}

        {/* État : Articles chargés */}
        {!loading && !error && posts.length > 0 && (
          <div className="news-grid">
            {posts.map(post => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

