/**
 * Composant NewsCard - Carte visuelle pour une actualité
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche une "carte" pour chaque actualité.
 * C'est comme une vignette cliquable.
 */

import { Link } from 'react-router-dom';
import './NewsCard.css';

/**
 * Formater la date en français
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

/**
 * Nettoyer l'extrait HTML
 */
function cleanExcerpt(html, maxLength = 150) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || '';

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }

  return text;
}

/**
 * Composant NewsCard
 */
export default function NewsCard({ post }) {
  const { slug, title, excerpt, featuredImage, date, categories = [] } = post;
  const detailUrl = `/news/${slug}`;
  const imageUrl = featuredImage?.url || '/logo-c6radio.png';
  const imageAlt = featuredImage?.alt || title;

  return (
    <article className="news-card">
      <Link to={detailUrl} className="news-card__link">
        <div className="news-card__image-wrapper">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="news-card__image"
            loading="lazy"
          />
        </div>

        <div className="news-card__content">
          <h3 className="news-card__title">{title}</h3>
          <p className="news-card__excerpt">{cleanExcerpt(excerpt)}</p>

          <div className="news-card__footer">
            <time className="news-card__date" dateTime={date}>
              📅 {formatDate(date)}
            </time>

            {categories.length > 0 && (
              <div className="news-card__categories">
                {categories.map(cat => (
                  <span key={cat.id} className="news-card__category">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

