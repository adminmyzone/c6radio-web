# Phase 4 : Intégration WordPress - Actualités

**Date de début :** 15 février 2026  
**Durée estimée :** 5-6 jours  
**Objectif :** Afficher les actualités provenant de WordPress avec filtres et recherche

---

## 📋 Vue d'Ensemble

### Qu'est-ce qu'on va créer ?

Une section "Actualités" qui affiche les articles (posts) depuis WordPress :
- **Liste des actualités** : Grille responsive avec cartes
- **Détail d'une actualité** : Page complète avec contenu, image, date
- **Filtres** : Par catégorie (Actus, Événements, etc.)
- **Recherche** : Recherche en temps réel dans les titres
- **Performance** : Cache localStorage pour éviter requêtes inutiles

### Pourquoi WordPress pour les actualités ?

✅ **L'équipe éditoriale** peut ajouter/modifier des actualités sans toucher au code  
✅ **Gestion images** : WordPress héberge et optimise les images  
✅ **Catégories** : Organisation automatique du contenu  
✅ **SEO** : WordPress génère les méta-données automatiquement

---

## 🏗️ Architecture Technique

### API WordPress Posts

WordPress expose automatiquement ses articles via :
```
https://c6radio.com/wp-json/wp/v2/posts
```

**Données retournées par l'API :**
```javascript
{
  id: 123,
  title: { rendered: "Nouveau concert ce weekend" },
  excerpt: { rendered: "<p>Court résumé...</p>" },
  content: { rendered: "<p>Contenu complet HTML...</p>" },
  date: "2026-02-15T10:30:00",
  categories: [5, 12],  // IDs des catégories
  featured_media: 456,  // ID de l'image mise en avant
  _embedded: {          // Si on ajoute ?_embed=true
    "wp:featuredmedia": [{
      source_url: "https://...image.jpg",
      alt_text: "Description image"
    }],
    "wp:term": [[        // Catégories complètes
      { id: 5, name: "Actus", slug: "actus" }
    ]]
  }
}
```

### Structure des fichiers à créer

```
src/
├── services/
│   └── wordpress.js          ← DÉJÀ EXISTE (on ajoute fetchPosts)
│
├── hooks/
│   └── useWordPressPosts.js  ← Nouveau : logique fetch + cache
│
├── pages/
│   ├── News.jsx              ← Nouveau : Liste des actualités
│   ├── News.css              ← Nouveau : Styles liste
│   ├── NewsDetail.jsx        ← Nouveau : Page détail actualité
│   └── NewsDetail.css        ← Nouveau : Styles détail
│
├── components/
│   ├── NewsCard.jsx          ← Nouveau : Carte actualité
│   ├── NewsCard.css          ← Nouveau : Styles carte
│   ├── NewsFilters.jsx       ← Nouveau : Filtres catégories
│   ├── NewsFilters.css       ← Nouveau : Styles filtres
│   ├── SearchBar.jsx         ← Nouveau : Barre de recherche
│   └── SearchBar.css         ← Nouveau : Styles recherche
│
└── router.jsx                ← MODIFIER : Ajouter routes /news
```

---

## 📝 Plan d'Implémentation

### Étape 1 : Service WordPress - Fonction fetchPosts (1h)

**Objectif :** Ajouter la fonction pour récupérer les articles WordPress

**Fichier :** `src/services/wordpress.js`

**Ce qu'on va faire :**
```javascript
export async function fetchPosts(options = {}) {
  // Paramètres :
  // - per_page : nombre d'articles (défaut 10)
  // - page : numéro de page (pagination)
  // - categories : filtrer par catégorie
  // - search : recherche texte
  // - _embed : inclure images et catégories
}
```

**Pourquoi ?**
- Centraliser toute la logique API WordPress dans un seul fichier
- Réutilisable pour différentes pages
- Gestion erreurs unifiée

---

### Étape 2 : Hook useWordPressPosts (1h30)

**Objectif :** Hook React qui gère le fetch + cache + loading

**Fichier :** `src/hooks/useWordPressPosts.js`

**Ce qu'on va créer :**
```javascript
export function useWordPressPosts(filters = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cache localStorage pour éviter requêtes inutiles
  // Rafraîchissement tous les 5 minutes
  
  return { posts, loading, error, refetch };
}
```

**Pourquoi un hook ?**
- Encapsule la logique complexe (fetch, cache, erreurs)
- Réutilisable dans plusieurs composants
- Facile à tester et maintenir

---

### Étape 3 : Composant NewsCard (1h30)

**Objectif :** Carte visuelle pour afficher une actualité

**Fichiers :** 
- `src/components/NewsCard.jsx`
- `src/components/NewsCard.css`

**Ce qu'on va créer :**
```
┌─────────────────────────┐
│   [Image à la une]      │
│                         │
├─────────────────────────┤
│ Titre de l'actualité    │
│                         │
│ Court extrait du        │
│ contenu...              │
│                         │
│ 📅 15 fév 2026          │
│ 🏷️ Actus, Événements   │
└─────────────────────────┘
```

**Fonctionnalités :**
- Image lazy-loading (chargement au scroll)
- Extrait limité à 150 caractères
- Catégories affichées comme badges
- Lien vers page détail

---

### Étape 4 : Page News - Liste (2h)

**Objectif :** Page qui affiche la grille d'actualités

**Fichiers :** 
- `src/pages/News.jsx`
- `src/pages/News.css`

**Layout responsive :**
- **Mobile (< 768px)** : 1 colonne
- **Tablette (768-1024px)** : 2 colonnes
- **Desktop (> 1024px)** : 3 colonnes

**Éléments :**
- Titre H1 "Actualités C6Radio"
- Barre de recherche
- Filtres par catégorie
- Grille de NewsCard
- Message "Aucune actualité trouvée" si vide
- Loading spinner pendant chargement

---

### Étape 5 : Page NewsDetail (2h)

**Objectif :** Page complète pour lire une actualité

**Fichiers :** 
- `src/pages/NewsDetail.jsx`
- `src/pages/NewsDetail.css`

**Structure :**
```
┌────────────────────────────────────┐
│ [Grande image à la une]            │
└────────────────────────────────────┘

Titre de l'actualité
📅 Publié le 15 février 2026
🏷️ Actus, Événements

────────────────────────────────────

Contenu HTML complet de l'article
avec paragraphes, images, vidéos...

────────────────────────────────────

[Bouton Retour aux actualités]
```

**Fonctionnalités :**
- Route dynamique : `/news/:slug`
- Récupération post par slug WordPress
- Rendu sécurisé du HTML WordPress
- Support images, vidéos, embeds
- 404 si article n'existe pas
- Bouton retour

---

### Étape 6 : Filtres par Catégorie (1h30)

**Objectif :** Permettre filtrage par catégorie

**Fichiers :** 
- `src/components/NewsFilters.jsx`
- `src/components/NewsFilters.css`

**Interface :**
```
[Toutes] [Actus] [Événements] [Émissions]
  ↑
 actif
```

**Logique :**
- Fetch catégories depuis WordPress
- Boutons cliquables pour filtrer
- Style actif pour catégorie sélectionnée
- "Toutes" affiche tous les articles
- Mise à jour instantanée de la liste

---

### Étape 7 : Barre de Recherche (1h30)

**Objectif :** Recherche en temps réel dans les titres

**Fichiers :** 
- `src/components/SearchBar.jsx`
- `src/components/SearchBar.css`

**Interface :**
```
┌─────────────────────────────┐
│ 🔍  Rechercher...          │
└─────────────────────────────┘
```

**Fonctionnalités :**
- Input texte avec icône recherche
- Recherche côté client (filtrage rapide)
- Recherche dans titre + extrait
- Debounce 300ms (éviter trop de rendus)
- Bouton clear (×) pour réinitialiser

---

### Étape 8 : Cache localStorage (1h)

**Objectif :** Améliorer performances avec cache navigateur

**Fichier :** `src/hooks/useWordPressPosts.js` (amélioration)

**Stratégie :**
```javascript
{
  "wp_posts_cache": {
    "data": [...],           // Articles
    "timestamp": 1708012800, // Timestamp du cache
    "expiresIn": 300000      // Expiration 5 minutes
  }
}
```

**Logique :**
1. Vérifier si cache existe et est valide
2. Si valide → Utiliser cache (instantané)
3. Si expiré → Fetch WordPress + sauvegarder nouveau cache
4. Si erreur réseau → Utiliser cache même expiré (fallback)

**Avantages :**
- ⚡ Chargement instantané pages déjà visitées
- 📶 Fonctionne offline avec données en cache
- 💰 Réduit requêtes serveur WordPress

---

### Étape 9 : Routes React Router (30min)

**Objectif :** Ajouter routes pour les pages actualités

**Fichier :** `src/router.jsx`

**Routes à ajouter :**
```javascript
{
  path: '/news',
  element: <News />
}
{
  path: '/news/:slug',
  element: <NewsDetail />
}
```

**Navigation :**
- Header : Lien "Actualités" → `/news`
- NewsCard : Clic carte → `/news/titre-article`
- NewsDetail : Bouton retour → `/news`

---

### Étape 10 : Gestion Erreurs (1h)

**Objectif :** Affichage gracieux en cas de problème

**Scénarios :**
1. **WordPress API down** → Message "Actualités temporairement indisponibles"
2. **Aucun article trouvé** → Message "Aucune actualité pour le moment"
3. **Article inexistant (404)** → Message "Article non trouvé"
4. **Timeout réseau** → Retry automatique + message
5. **Image manquante** → Image placeholder par défaut

**Composants d'erreur :**
```jsx
<ErrorMessage 
  type="api-down" 
  message="Impossible de charger les actualités"
  retry={() => refetch()}
/>
```

---

## ✅ Checklist de Validation

### Tests Fonctionnels

- [ ] Liste actualités affiche au moins 3 articles
- [ ] Images lazy-load correctement (scroll)
- [ ] Clic sur carte → Navigation vers détail
- [ ] Page détail affiche contenu complet
- [ ] Bouton retour fonctionne
- [ ] Filtres catégories filtrent correctement
- [ ] Recherche filtre en temps réel
- [ ] Cache fonctionne (2ème visite instantanée)
- [ ] Erreur API affiche message gracieux

### Tests Responsive

- [ ] Mobile 320px → Layout 1 colonne
- [ ] Tablette 768px → Layout 2 colonnes  
- [ ] Desktop 1200px → Layout 3 colonnes
- [ ] Images responsive (srcset)
- [ ] Textes lisibles sur tous écrans
- [ ] Boutons cliquables (touch targets 44px min)

### Tests Performance

- [ ] Lighthouse Performance > 80
- [ ] Images optimisées (WebP si possible)
- [ ] Pas de requêtes inutiles (cache)
- [ ] Rendu < 2s sur 3G
- [ ] Pas de fuite mémoire (long scroll)

### Tests Navigateur

- [ ] Chrome Desktop ✓
- [ ] Safari Desktop ✓
- [ ] Firefox Desktop ✓
- [ ] Chrome Mobile ✓
- [ ] Safari iOS ✓

---

## 📚 Documentation pour Débutants

### Concept 1 : API REST

**C'est quoi ?**
Une API REST permet à deux applications de communiquer.
Ici : React (frontend) ↔ WordPress (backend)

**Comment ça marche ?**
```
React envoie requête HTTP
        ↓
https://c6radio.com/wp-json/wp/v2/posts
        ↓
WordPress répond avec JSON
        ↓
React affiche les données
```

### Concept 2 : Custom Hook React

**C'est quoi ?**
Une fonction réutilisable qui encapsule de la logique React.

**Exemple :**
```javascript
// Au lieu d'écrire ça dans chaque composant :
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => { fetch... }, []);

// On crée un hook :
const { data, loading } = useWordPressPosts();
```

**Avantages :**
- Code plus propre
- Réutilisable partout
- Plus facile à tester

### Concept 3 : localStorage

**C'est quoi ?**
Espace de stockage dans le navigateur (comme des cookies).

**Utilisation :**
```javascript
// Sauvegarder
localStorage.setItem('key', JSON.stringify(data));

// Récupérer
const data = JSON.parse(localStorage.getItem('key'));

// Supprimer
localStorage.removeItem('key');
```

**Limites :**
- Max 5-10 MB par domaine
- Données non chiffrées (pas de données sensibles !)
- Synchrone (peut ralentir si gros volumes)

### Concept 4 : Lazy Loading Images

**C'est quoi ?**
Les images se chargent seulement quand elles deviennent visibles.

**Avantage :**
- ⚡ Page charge plus vite
- 💰 Économise bande passante
- 📱 Essentiel sur mobile

**Implémentation native HTML5 :**
```html
<img src="image.jpg" loading="lazy" alt="Description" />
```

---

## 🔧 Configuration WordPress Requise

### Côté WordPress Admin

**1. Activer API REST :**
- Généralement activée par défaut
- Vérifier : https://votre-site.com/wp-json/wp/v2/posts

**2. Créer Catégories :**
- Aller dans "Articles" → "Catégories"
- Créer : Actus, Événements, Émissions, etc.

**3. Publier Articles de Test :**
- Au moins 5-10 articles
- Ajouter image à la une (featured image)
- Assigner catégories
- Publier (status = publish)

**4. CORS (si domaine différent) :**
Si WordPress sur domaine différent de React :
```php
// wp-config.php ou plugin
header('Access-Control-Allow-Origin: *');
```

**5. Plugin ACF (optionnel) :**
Pour champs personnalisés :
- Durée de lecture estimée
- Auteur custom
- Tags spéciaux

---

## 📊 Estimation Temps Total

| Étape | Tâche | Durée |
|-------|-------|-------|
| 1 | Service fetchPosts | 1h |
| 2 | Hook useWordPressPosts | 1h30 |
| 3 | Composant NewsCard | 1h30 |
| 4 | Page News (liste) | 2h |
| 5 | Page NewsDetail | 2h |
| 6 | Filtres catégories | 1h30 |
| 7 | Barre recherche | 1h30 |
| 8 | Cache localStorage | 1h |
| 9 | Routes React Router | 30min |
| 10 | Gestion erreurs | 1h |
| **Tests & Debug** | - | **2h** |
| **Documentation** | - | **1h** |

**TOTAL : 16 heures (2 jours intensifs ou 4 jours à mi-temps)**

---

## 🚀 Prochaines Étapes

Après validation de ce plan :

1. **Étape 1** : Ajouter `fetchPosts()` dans `wordpress.js`
2. **Étape 2** : Créer hook `useWordPressPosts.js`
3. **Étape 3** : Créer composant `NewsCard`
4. **Étape 4** : Créer page `News`
5. **Continuer séquentiellement...**

Chaque étape sera expliquée en détail avec :
- ✅ Code commenté ligne par ligne
- ✅ Explication des concepts
- ✅ Tests de validation
- ✅ Screenshots si besoin

---

## 📞 Questions Fréquentes

**Q : Pourquoi ne pas tout mettre dans un seul fichier ?**
R : Séparation des responsabilités = code maintenable. Chaque fichier a un rôle précis.

**Q : Pourquoi utiliser localStorage et pas Redux ?**
R : localStorage suffit pour cache simple. Redux serait surdimensionné pour ce besoin.

**Q : Les actualités fonctionneront offline ?**
R : Oui, grâce au cache localStorage. Les données déjà chargées restent accessibles.

**Q : Comment gérer 1000+ articles ?**
R : Pagination WordPress côté serveur + Infinite scroll côté React (Phase future).

**Q : Et si WordPress change de structure ?**
R : Toute la logique est dans `wordpress.js`, un seul fichier à modifier.

---

**Prêt à commencer ? 🚀**

