# 📤 PHASE 9 : Partage Social des Articles

**Date** : 18 février 2026  
**Difficulté** : ⭐ Très Facile  
**Temps estimé** : 20-30 minutes

---

## 🎯 OBJECTIF

Ajouter des boutons de partage social sur les pages d'articles pour permettre aux utilisateurs de partager facilement sur :
1. **Facebook**
2. **Twitter / X**
3. **WhatsApp**
4. **LinkedIn**
5. **Copier le lien** (clipboard)

---

## 📚 EXPLICATION POUR DÉBUTANTS

### Comment fonctionne le partage social ?

Chaque réseau social fournit une **URL spéciale** qui ouvre une fenêtre de partage.

**Exemples :**

```
Facebook : https://www.facebook.com/sharer/sharer.php?u=URL_ARTICLE
Twitter  : https://twitter.com/intent/tweet?url=URL_ARTICLE&text=TITRE
WhatsApp : https://wa.me/?text=TITRE URL_ARTICLE
LinkedIn : https://www.linkedin.com/sharing/share-offsite/?url=URL_ARTICLE
```

**Notre stratégie :**
1. Créer un composant `SocialShare.jsx` avec des boutons
2. Chaque bouton ouvre une URL de partage dans une nouvelle fenêtre
3. Ajouter le composant dans `NewsDetail.jsx` (page d'un article)
4. Bonus : Bouton "Copier le lien" pour partager ailleurs

**C'est tout !** Pas besoin d'API, pas de configuration complexe.

---

## 📝 ÉTAPE 1 : Créer le Composant SocialShare

### Fichier : `src/components/SocialShare.jsx`

Crée ce nouveau fichier avec le code suivant :

```jsx
/**
 * Composant SocialShare - Boutons de partage social
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche des boutons pour partager un article
 * sur les réseaux sociaux (Facebook, Twitter, WhatsApp, LinkedIn)
 * + un bouton pour copier le lien.
 *
 * PROPS :
 * - url : L'URL complète de l'article à partager
 * - title : Le titre de l'article
 *
 * COMMENT ÇA MARCHE ?
 * Chaque bouton ouvre une URL spéciale du réseau social
 * avec les paramètres pré-remplis (URL + titre).
 */

import { useState } from 'react';
import './SocialShare.css';

export default function SocialShare({ url, title }) {
  // État pour le feedback "Copié !" du bouton clipboard
  const [copied, setCopied] = useState(false);

  /**
   * Encode l'URL et le titre pour les passer dans les URLs de partage
   * 
   * POURQUOI ENCODER ?
   * Les URLs ne peuvent pas contenir d'espaces ou caractères spéciaux.
   * encodeURIComponent() transforme "Hello World!" en "Hello%20World%21"
   */
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  /**
   * URLS DE PARTAGE SOCIAL
   * 
   * Chaque réseau social a sa propre URL avec paramètres :
   * - Facebook : ?u= (URL)
   * - Twitter : ?url= et &text= (URL + texte)
   * - WhatsApp : ?text= (texte + URL combinés)
   * - LinkedIn : ?url= (URL)
   */
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  /**
   * Ouvre une fenêtre popup pour partager
   * 
   * PARAMÈTRES window.open :
   * - URL : L'URL à ouvrir
   * - target : '_blank' = nouvelle fenêtre
   * - features : Taille et position de la popup
   */
  const handleShare = (platform) => {
    const shareUrl = shareUrls[platform];
    
    // Ouvrir popup centrée (600x400 pixels)
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      shareUrl,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  /**
   * Copie le lien dans le presse-papiers
   * 
   * EXPLICATION :
   * navigator.clipboard.writeText() est une API moderne du navigateur
   * qui permet de copier du texte dans le presse-papiers.
   */
  const handleCopyLink = async () => {
    try {
      // Copier l'URL dans le presse-papiers
      await navigator.clipboard.writeText(url);
      
      // Afficher "Copié !" pendant 2 secondes
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
    } catch (err) {
      console.error('Erreur lors de la copie du lien:', err);
      // Fallback si clipboard API non disponible : sélectionner le texte
      alert(`Copiez ce lien : ${url}`);
    }
  };

  return (
    <div className="social-share">
      <h3 className="social-share__title">Partager cet article</h3>
      
      <div className="social-share__buttons">
        {/* Bouton Facebook */}
        <button
          className="social-share__button social-share__button--facebook"
          onClick={() => handleShare('facebook')}
          aria-label="Partager sur Facebook"
          type="button"
        >
          <span className="social-share__icon">📘</span>
          <span className="social-share__label">Facebook</span>
        </button>

        {/* Bouton Twitter */}
        <button
          className="social-share__button social-share__button--twitter"
          onClick={() => handleShare('twitter')}
          aria-label="Partager sur Twitter"
          type="button"
        >
          <span className="social-share__icon">🐦</span>
          <span className="social-share__label">Twitter</span>
        </button>

        {/* Bouton WhatsApp */}
        <button
          className="social-share__button social-share__button--whatsapp"
          onClick={() => handleShare('whatsapp')}
          aria-label="Partager sur WhatsApp"
          type="button"
        >
          <span className="social-share__icon">💬</span>
          <span className="social-share__label">WhatsApp</span>
        </button>

        {/* Bouton LinkedIn */}
        <button
          className="social-share__button social-share__button--linkedin"
          onClick={() => handleShare('linkedin')}
          aria-label="Partager sur LinkedIn"
          type="button"
        >
          <span className="social-share__icon">💼</span>
          <span className="social-share__label">LinkedIn</span>
        </button>

        {/* Bouton Copier le lien */}
        <button
          className="social-share__button social-share__button--copy"
          onClick={handleCopyLink}
          aria-label="Copier le lien"
          type="button"
        >
          <span className="social-share__icon">🔗</span>
          <span className="social-share__label">
            {copied ? 'Copié !' : 'Copier le lien'}
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * URLS DE PARTAGE :
 * - Ces URLs sont officielles et documentées par chaque plateforme
 * - Elles ouvrent l'interface de partage native du réseau social
 * - Pas besoin de SDK ou d'authentification
 * 
 * POPUP vs NOUVEL ONGLET :
 * - window.open() avec dimensions = popup centrée
 * - Plus UX-friendly qu'un nouvel onglet plein écran
 * - L'utilisateur reste sur notre site après partage
 * 
 * CLIPBOARD API :
 * - Moderne et sécurisée (nécessite HTTPS en production)
 * - Fallback avec alert() si non disponible
 * - Feedback visuel "Copié !" pour confirmer l'action
 * 
 * ACCESSIBILITÉ :
 * - aria-label pour screen readers
 * - type="button" pour éviter submit de form
 * - Icônes + labels texte pour clarté
 */
```

---

## 🎨 ÉTAPE 2 : Créer le CSS du Composant

### Fichier : `src/components/SocialShare.css`

Crée ce nouveau fichier pour styliser les boutons :

```css
/**
 * Styles pour SocialShare
 * Design coloré avec icônes et hover effects
 */

.social-share {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* ============================================
   TITRE
   ============================================ */

.social-share__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 1rem 0;
  text-align: center;
}

/* ============================================
   GRILLE DE BOUTONS
   ============================================ */

.social-share__buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

/* ============================================
   BOUTONS
   ============================================ */

.social-share__button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  color: #495057;
}

.social-share__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-share__button:active {
  transform: translateY(0);
}

.social-share__icon {
  font-size: 1.5rem;
  line-height: 1;
}

.social-share__label {
  font-size: 0.9rem;
}

/* ============================================
   COULEURS PAR PLATEFORME
   ============================================ */

/* Facebook - Bleu */
.social-share__button--facebook {
  border-color: #1877f2;
}

.social-share__button--facebook:hover {
  background: #1877f2;
  color: white;
}

/* Twitter - Bleu ciel */
.social-share__button--twitter {
  border-color: #1da1f2;
}

.social-share__button--twitter:hover {
  background: #1da1f2;
  color: white;
}

/* WhatsApp - Vert */
.social-share__button--whatsapp {
  border-color: #25d366;
}

.social-share__button--whatsapp:hover {
  background: #25d366;
  color: white;
}

/* LinkedIn - Bleu professionnel */
.social-share__button--linkedin {
  border-color: #0a66c2;
}

.social-share__button--linkedin:hover {
  background: #0a66c2;
  color: white;
}

/* Copier le lien - Gris */
.social-share__button--copy {
  border-color: #6c757d;
}

.social-share__button--copy:hover {
  background: #6c757d;
  color: white;
}

/* État "Copié !" */
.social-share__button--copy:hover .social-share__label::after {
  content: ' ✓';
}

/* ============================================
   RESPONSIVE MOBILE
   ============================================ */

@media (max-width: 768px) {
  .social-share {
    padding: 1rem;
  }

  .social-share__buttons {
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes sur mobile */
    gap: 0.5rem;
  }

  .social-share__button {
    padding: 0.65rem 0.75rem;
    font-size: 0.85rem;
  }

  .social-share__icon {
    font-size: 1.25rem;
  }

  .social-share__label {
    font-size: 0.85rem;
  }
}

/* Très petit mobile : 1 colonne */
@media (max-width: 480px) {
  .social-share__buttons {
    grid-template-columns: 1fr; /* 1 colonne */
  }
}

/* ============================================
   MODE SOMBRE (OPTIONNEL)
   ============================================ */

/* Décommenter quand mode sombre implémenté
@media (prefers-color-scheme: dark) {
  .social-share {
    background: #212529;
    border-color: #495057;
  }

  .social-share__title {
    color: #dee2e6;
  }

  .social-share__button {
    background: #343a40;
    color: #dee2e6;
  }
}
*/
```

---

## 🔧 ÉTAPE 3 : Ajouter le Composant dans NewsDetail

### Fichier : `src/pages/NewsDetail.jsx`

**Ajoute** l'import et le composant dans la page de détail d'un article :

```jsx
// EN HAUT DU FICHIER, ajoute cet import :
import SocialShare from '../components/SocialShare.jsx';

// DANS LE RETURN, après le contenu de l'article, ajoute :
{/* Boutons de partage social */}
<SocialShare
  url={window.location.href}
  title={post.title}
/>
```

### Code complet de NewsDetail.jsx :

Voici où placer le composant dans la structure complète :

```jsx
/**
 * Page NewsDetail - Détail d'un article
 * 
 * PHASE 9 : Ajout du partage social
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostBySlug } from '../services/wordpress.js';
import PodcastPlayer from '../components/PodcastPlayer.jsx';
import SocialShare from '../components/SocialShare.jsx';  // ← NOUVEAU
import logger from '../lib/logger.js';
import './NewsDetail.css';

export default function NewsDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        logger.log(`[NewsDetail] Loading post: ${slug}`);
        setLoading(true);
        setError(null);

        const fetchedPost = await fetchPostBySlug(slug);

        if (!fetchedPost) {
          setError('Article non trouvé');
          setPost(null);
        } else {
          setPost(fetchedPost);
        }

      } catch (err) {
        logger.error('[NewsDetail] Error loading post:', err);
        setError('Erreur lors du chargement de l\'article');
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  // États de chargement et erreur
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

  if (error || !post) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-error">
          <p className="news-detail-error__message">❌ {error || 'Article non trouvé'}</p>
          <Link to="/news" className="news-detail-error__back">
            ← Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  // Format de la date lisible
  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="news-detail-page">
      <article className="news-detail">
        {/* Image à la une */}
        {post.featuredImage && (
          <div className="news-detail__image">
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              loading="lazy"
            />
          </div>
        )}

        {/* En-tête */}
        <header className="news-detail__header">
          <h1 className="news-detail__title">{post.title}</h1>
          
          <div className="news-detail__meta">
            <time className="news-detail__date" dateTime={post.date}>
              📅 {formattedDate}
            </time>

            {post.categories && post.categories.length > 0 && (
              <div className="news-detail__categories">
                {post.categories.map(cat => (
                  <span key={cat.id} className="news-detail__category">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Podcast si disponible */}
        {post.podcastAudioUrl && (
          <div className="news-detail__podcast">
            <PodcastPlayer
              audioUrl={post.podcastAudioUrl}
              title={post.title}
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <div
          className="news-detail__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* NOUVEAU : Boutons de partage social */}
        <SocialShare
          url={window.location.href}
          title={post.title}
        />

        {/* Bouton retour */}
        <div className="news-detail__back">
          <Link to="/news" className="news-detail__back-button">
            ← Retour aux actualités
          </Link>
        </div>
      </article>
    </div>
  );
}
```

---

## ✅ ÉTAPE 4 : Tester !

### 1. Va sur une page d'article

```
http://localhost:5173/news/[slug-article]
```

### 2. Teste chaque bouton

**Facebook** :
- Clique sur le bouton bleu "Facebook"
- Une popup s'ouvre avec l'interface de partage Facebook
- L'URL de l'article est pré-remplie

**Twitter** :
- Clique sur le bouton bleu ciel "Twitter"
- Une popup s'ouvre avec l'interface de tweet
- Le titre + URL sont pré-remplis

**WhatsApp** :
- Clique sur le bouton vert "WhatsApp"
- S'ouvre dans WhatsApp Web ou l'app mobile
- Le message contient le titre + URL

**LinkedIn** :
- Clique sur le bouton bleu "LinkedIn"
- Une popup s'ouvre avec l'interface de partage LinkedIn
- L'URL de l'article est pré-remplie

**Copier le lien** :
- Clique sur le bouton gris "Copier le lien"
- Le texte change en "Copié !" pendant 2 secondes
- L'URL est dans ton presse-papiers (Ctrl+V pour coller)

### 3. Teste sur mobile

- Les boutons s'adaptent en 2 colonnes
- Sur très petit écran : 1 colonne
- Les popups s'ouvrent correctement

---

## 🎓 EXPLICATION DU CODE

### Comment fonctionnent les URLs de partage ?

```javascript
// Facebook attend l'URL dans le paramètre "u"
https://www.facebook.com/sharer/sharer.php?u=https://exp937.fr/news/article

// Twitter attend "url" et "text"
https://twitter.com/intent/tweet?url=URL&text=TITRE

// WhatsApp combine texte et URL dans "text"
https://wa.me/?text=TITRE URL

// LinkedIn attend "url"
https://www.linkedin.com/sharing/share-offsite/?url=URL
```

### Pourquoi encodeURIComponent() ?

Les URLs ne peuvent pas contenir certains caractères (espaces, accents, etc.)

```javascript
// Sans encodage (❌ ERREUR)
"Hello World!" → casse l'URL

// Avec encodage (✅ OK)
encodeURIComponent("Hello World!") → "Hello%20World%21"
```

### Comment fonctionne window.open() ?

```javascript
window.open(
  url,        // L'URL à ouvrir
  '_blank',   // '_blank' = nouvelle fenêtre
  'width=600,height=400' // Dimensions de la popup
);
```

### Comment fonctionne navigator.clipboard ?

```javascript
// API moderne du navigateur (nécessite HTTPS)
await navigator.clipboard.writeText(texte);

// Le texte est copié dans le presse-papiers
// L'utilisateur peut faire Ctrl+V pour coller
```

---

## 🔍 VÉRIFICATION : Fichiers Créés/Modifiés

### ✅ Nouveaux fichiers :
```
src/components/SocialShare.jsx  ← Composant de partage
src/components/SocialShare.css  ← Styles des boutons
```

### ✅ Fichiers modifiés :
```
src/pages/NewsDetail.jsx        ← Ajout du composant SocialShare
```

### ✅ Fichiers utilisés (déjà existants) :
```
(Aucun - composant totalement autonome)
```

---

## 🐛 TROUBLESHOOTING

### Problème : "La popup est bloquée par le navigateur"

**Solution** : Les navigateurs bloquent les popups non sollicitées.
C'est normal si tu testes sans cliquer sur le bouton.
L'utilisateur doit **cliquer** pour que la popup s'ouvre.

### Problème : "Copier le lien ne fonctionne pas"

**Solution** :
1. La Clipboard API nécessite **HTTPS** en production
2. En développement (localhost), ça fonctionne
3. Si erreur, un fallback avec `alert()` s'affiche

### Problème : "Les icônes emoji ne s'affichent pas"

**Solution** :
- Les emojis dépendent du système d'exploitation
- Tu peux remplacer par des icônes SVG si besoin
- Ou utiliser Font Awesome / Material Icons

---

## 🚀 AMÉLIORATIONS FUTURES (OPTIONNEL)

### 1. Ajouter des icônes SVG professionnelles

Au lieu d'emojis, utiliser des vraies icônes :

```bash
npm install react-icons
```

```jsx
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaLink } from 'react-icons/fa';

// Remplacer les emojis par :
<FaFacebook size={24} />
```

### 2. Ajouter un compteur de partages

Utiliser une API comme ShareThis ou AddThis pour tracker les partages.

### 3. Ajouter d'autres plateformes

```jsx
// Pinterest
pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,

// Reddit
reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,

// Email
email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
```

### 4. Ajouter le partage natif mobile

```jsx
// API Web Share (mobile uniquement)
if (navigator.share) {
  await navigator.share({
    title: title,
    url: url
  });
}
```

---

## 📊 RÉSUMÉ POUR DÉBUTANT

### Ce qu'on a fait :

1. **Créé SocialShare.jsx** : Composant avec 5 boutons de partage
2. **Créé SocialShare.css** : Styles colorés et responsive
3. **Modifié NewsDetail.jsx** : Ajout du composant sous l'article

### Concepts React utilisés :

- **useState** : Gérer l'état "Copié !" du bouton clipboard
- **Props** : Passer url et title au composant
- **Event handlers** : onClick pour ouvrir les partages

### Techniques JavaScript :

- **encodeURIComponent()** : Encoder les URLs
- **window.open()** : Ouvrir des popups
- **navigator.clipboard** : Copier dans le presse-papiers
- **setTimeout()** : Afficher "Copié !" pendant 2 secondes

### APIs Web utilisées :

- **Clipboard API** : Pour copier le lien
- **Window.open()** : Pour ouvrir les popups de partage

---

## 🎉 FÉLICITATIONS !

Tu as implémenté avec succès le partage social ! 🚀

**Avantages :**
- ✅ Augmente la visibilité des articles
- ✅ Facile pour les utilisateurs de partager
- ✅ Aucune API tierce nécessaire
- ✅ Fonctionne sur mobile et desktop

**Prochaines étapes suggérées :**
- Tester le partage réel sur les réseaux sociaux
- Ajouter des icônes SVG professionnelles
- Implémenter le partage natif mobile (bonus)

---

**📝 Documentation créée avec ❤️ pour les débutants**
