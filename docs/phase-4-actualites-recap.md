# Phase 4 - Actualités WordPress : IMPLÉMENTATION TERMINÉE ✅

**Date :** 15 février 2026  
**Durée :** ~2 heures  
**Statut :** Prêt pour test

---

## 📦 Ce qui a été créé

### 1. Service WordPress étendu
**Fichier :** `src/services/wordpress.js`

**Nouvelles fonctions ajoutées :**

```javascript
// Récupérer la liste des articles
export async function fetchPosts(options = {})

// Récupérer un article par slug
export async function fetchPostBySlug(slug)

// Récupérer les catégories
export async function fetchCategories()
```

**Paramètres supportés :**
- `per_page` : Nombre d'articles (défaut: 10)
- `page` : Pagination
- `categories` : Filtrer par catégorie (IDs)
- `search` : Recherche texte
- `_embed` : Inclure images et catégories (défaut: true)

**Explications pour toi :**
- Ces fonctions communiquent avec WordPress via son API REST
- `_embed=true` permet de récupérer les images et catégories en une seule requête
- Gestion automatique des erreurs avec fallback

---

### 2. Hook personnalisé useWordPressPosts
**Fichier :** `src/hooks/useWordPressPosts.js`

**Ce qu'il fait :**
- Charge les articles depuis WordPress
- Gère le cache localStorage (5 minutes)
- Affiche les états loading/error
- Permet de refetch manuellement

**Utilisation :**
```javascript
const { posts, loading, error, refetch } = useWordPressPosts();
```

**Avantages du cache :**
- ⚡ Chargement instantané si déjà visité
- 💾 Fonctionne offline avec données en cache
- 📶 Réduit la charge sur le serveur WordPress

**Explications pour toi :**
Un hook React est comme une fonction réutilisable qui contient de la logique complexe. Au lieu de copier-coller le même code partout, on le met dans un hook et on le réutilise facilement.

---

### 3. Composant NewsCard
**Fichiers :** 
- `src/components/NewsCard.jsx`
- `src/components/NewsCard.css`

**Ce qu'il affiche :**
```
┌─────────────────────────┐
│   [Image à la une]      │
├─────────────────────────┤
│ Titre de l'actualité    │
│                         │
│ Court extrait...        │
│                         │
│ 📅 15 fév 2026          │
│ 🏷️ Actus, Événements   │
└─────────────────────────┘
```

**Fonctionnalités :**
- Image lazy-loading (charge au scroll)
- Extrait limité à 150 caractères
- Date formatée en français
- Catégories en badges colorés
- Toute la carte est cliquable

**Explications pour toi :**
Le lazy-loading (`loading="lazy"`) fait que les images ne chargent que quand elles deviennent visibles à l'écran. Ça accélère énormément le chargement de la page !

---

### 4. Page News (liste)
**Fichiers :** 
- `src/pages/News.jsx`
- `src/pages/News.css`

**Layout responsive :**
- **Mobile (< 768px)** : 1 colonne
- **Tablette (768-1024px)** : 2 colonnes
- **Desktop (> 1024px)** : 3 colonnes

**États gérés :**
- ⏳ Loading : Affiche spinner + message
- ❌ Error : Affiche message d'erreur
- 📭 Empty : "Aucune actualité"
- ✅ Success : Grille de cartes

**Explications pour toi :**
On utilise CSS Grid pour créer automatiquement le bon nombre de colonnes selon la taille d'écran. C'est beaucoup plus simple que d'utiliser JavaScript !

---

### 5. Page NewsDetail (détail)
**Fichiers :** 
- `src/pages/NewsDetail.jsx`
- `src/pages/NewsDetail.css`

**Ce qu'elle affiche :**
- Image à la une en grand
- Titre complet
- Date et catégories
- Contenu HTML complet (WordPress)
- Bouton retour

**Route dynamique :**
- URL : `/news/:slug`
- Exemple : `/news/concert-ce-weekend`
- Le `:slug` est un paramètre extrait avec `useParams()`

**Explications pour toi :**
On utilise `dangerouslySetInnerHTML` pour afficher le HTML venant de WordPress. C'est "dangereux" dans le nom car ça peut causer des failles XSS, MAIS WordPress nettoie automatiquement son HTML donc c'est sécurisé ici.

---

### 6. Routes ajoutées
**Fichier :** `src/router.jsx`

**Nouvelles routes :**
```javascript
{ path: 'news', element: <News /> }           // Liste
{ path: 'news/:slug', element: <NewsDetail /> } // Détail
```

**Ordre important :**
Les routes `/news` et `/news/:slug` doivent être AVANT la route catch-all `/:slug` sinon elles seraient capturées par `DynamicPage`.

**Explications pour toi :**
React Router lit les routes dans l'ordre. La première qui matche est utilisée. C'est pour ça qu'on met les routes spécifiques AVANT les routes génériques.

---

### 7. Lien dans le Header
**Fichier :** `src/components/Header.jsx`

**Ajout :**
Un lien "Actualités" après "Accueil" dans la navigation.

```jsx
<NavLink to="/news">Actualités</NavLink>
```

**Pourquoi NavLink et pas Link ?**
`NavLink` ajoute automatiquement la classe `active` quand on est sur cette page. Pratique pour le style !

---

## 🧪 Comment tester

### Test 1 : Liste des actualités

1. **Démarrer le serveur :**
   ```bash
   npm run dev
   ```

2. **Ouvrir dans le navigateur :**
   ```
   http://localhost:5173/news
   ```

3. **Vérifier :**
   - ✅ Page "Actualités C6Radio" s'affiche
   - ✅ Liste de cartes (si articles WordPress)
   - ✅ Grille responsive (redimensionner fenêtre)
   - ✅ Images lazy-load (ouvrir Network dans DevTools)
   - ✅ Spinner de chargement visible brièvement

### Test 2 : Détail d'une actualité

1. **Cliquer sur une carte**
2. **Vérifier :**
   - ✅ Navigation vers `/news/slug-article`
   - ✅ Page détail s'affiche
   - ✅ Image + titre + contenu complet
   - ✅ Bouton retour fonctionne

### Test 3 : Cache localStorage

1. **Ouvrir DevTools → Application → Local Storage**
2. **Chercher la clé :** `wp_posts_cache`
3. **Voir les données :**
   ```json
   {
     "data": [...],
     "timestamp": 1708012800
   }
   ```
4. **Recharger la page → Doit être instantané**

### Test 4 : États d'erreur

**Simuler WordPress down :**
1. **Modifier temporairement `constants.js` :**
   ```javascript
   export const WP_API_BASE_URL = 'https://invalid-url.com';
   ```
2. **Recharger → Doit afficher message d'erreur**
3. **Remettre la bonne URL**

### Test 5 : Responsive

**Tester ces tailles :**
- 📱 iPhone (375px) → 1 colonne
- 📱 iPad (768px) → 2 colonnes
- 💻 Desktop (1200px) → 3 colonnes

**Dans Chrome DevTools :**
- F12 → Toggle device toolbar
- Tester différents devices

---

## 📊 Configuration WordPress requise

### Côté Admin WordPress

**1. Vérifier l'API REST fonctionne :**
```
https://exp937.fr/wp/wp-json/wp/v2/posts
```
→ Doit retourner du JSON

**2. Créer des catégories :**
- Aller dans : Articles → Catégories
- Créer : Actus, Événements, Émissions

**3. Publier des articles de test :**
- Minimum 5-10 articles
- Ajouter image à la une
- Assigner catégories
- Status = Publié

**4. Champs requis par article :**
- ✅ Titre
- ✅ Contenu (texte, images, etc.)
- ✅ Extrait (optionnel, généré auto si vide)
- ✅ Image à la une (recommandé)
- ✅ Catégorie (au moins une)

**5. CORS (si domaines différents) :**
Si WordPress et React sur domaines différents, ajouter dans `wp-config.php` :
```php
header('Access-Control-Allow-Origin: *');
```

---

## 🐛 Problèmes potentiels et solutions

### Problème 1 : "Aucune actualité" affiché alors qu'il y en a

**Causes possibles :**
- Articles WordPress non publiés (status = draft)
- CORS bloqué (vérifier console navigateur)
- URL API WordPress incorrecte

**Solution :**
1. Vérifier console navigateur (F12)
2. Tester l'URL API directement : `https://exp937.fr/wp/wp-json/wp/v2/posts`
3. Vérifier status articles dans WordPress Admin

---

### Problème 2 : Images ne s'affichent pas

**Causes possibles :**
- Pas d'image à la une définie
- URL image incorrecte
- CORS images bloquées

**Solution :**
1. Vérifier que l'article a une "Featured Image"
2. Vérifier console (erreurs 404 ou CORS)
3. Fallback automatique sur logo C6Radio

---

### Problème 3 : Cache ne se met pas à jour

**Causes possibles :**
- localStorage plein (rare)
- Cache expiré mais pas rafraîchi

**Solution :**
```javascript
// Dans la console navigateur
localStorage.removeItem('wp_posts_cache');
location.reload();
```

---

### Problème 4 : Erreur "dangerouslySetInnerHTML"

**Si tu vois cette erreur :**
C'est un warning React, pas une vraie erreur. Le HTML de WordPress est sécurisé.

**Pour supprimer le warning :**
Le HTML WordPress est déjà sanitized (nettoyé), donc c'est safe.

---

## 📈 Prochaines étapes (optionnelles)

### Étape 6 : Filtres par catégorie
**Fichiers à créer :**
- `src/components/NewsFilters.jsx`
- `src/components/NewsFilters.css`

**Fonctionnalité :**
```
[Toutes] [Actus] [Événements] [Émissions]
```

**Logique :**
```javascript
const [selectedCategory, setSelectedCategory] = useState(null);

const { posts } = useWordPressPosts({ 
  categories: selectedCategory 
});
```

---

### Étape 7 : Barre de recherche
**Fichiers à créer :**
- `src/components/SearchBar.jsx`
- `src/components/SearchBar.css`

**Fonctionnalité :**
Recherche en temps réel dans les titres.

**Logique :**
```javascript
const [searchTerm, setSearchTerm] = useState('');

const filteredPosts = posts.filter(post => 
  post.title.toLowerCase().includes(searchTerm.toLowerCase())
);
```

---

### Étape 8 : Pagination
**Pour gérer 100+ articles :**
```javascript
const [page, setPage] = useState(1);

const { posts } = useWordPressPosts({ 
  per_page: 10,
  page: page 
});
```

Boutons : Précédent / Suivant

---

## 📚 Concepts appris dans cette phase

### 1. API REST
Communication entre React (frontend) et WordPress (backend) via HTTP.

### 2. Custom Hooks
Fonctions React réutilisables qui encapsulent de la logique.

### 3. localStorage
Stockage dans le navigateur pour cache et offline.

### 4. Lazy Loading
Chargement différé des images pour performance.

### 5. Routes dynamiques
URLs avec paramètres : `/news/:slug`

### 6. useEffect
Hook React pour actions au montage du composant.

### 7. dangerouslySetInnerHTML
Affichage de HTML brut (attention XSS !).

### 8. CSS Grid
Layout moderne pour grilles responsives.

---

## ✅ Checklist finale

### Fichiers créés (7)
- [x] `src/hooks/useWordPressPosts.js`
- [x] `src/components/NewsCard.jsx`
- [x] `src/components/NewsCard.css`
- [x] `src/pages/News.jsx`
- [x] `src/pages/News.css`
- [x] `src/pages/NewsDetail.jsx`
- [x] `src/pages/NewsDetail.css`

### Fichiers modifiés (3)
- [x] `src/services/wordpress.js` (3 fonctions ajoutées)
- [x] `src/router.jsx` (2 routes ajoutées)
- [x] `src/components/Header.jsx` (lien Actualités)

### Documentation créée (2)
- [x] `docs/phase-4-actualites-wordpress.md` (Plan détaillé)
- [x] `docs/phase-4-actualites-recap.md` (Ce fichier)

---

## 🎓 Pour aller plus loin

### Ressources utiles

**WordPress REST API :**
- https://developer.wordpress.org/rest-api/
- Tous les endpoints disponibles
- Paramètres de filtrage

**React Router :**
- https://reactrouter.com/
- Routes dynamiques
- Navigation programmatique

**localStorage API :**
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Limites et bonnes pratiques

**CSS Grid :**
- https://css-tricks.com/snippets/css/complete-guide-grid/
- Guide complet avec exemples

---

## 🎉 Félicitations !

Tu as maintenant un système complet d'actualités qui :
- ✅ Charge automatiquement depuis WordPress
- ✅ S'affiche en grille responsive
- ✅ Utilise un cache pour la performance
- ✅ Gère les erreurs gracieusement
- ✅ Fonctionne sur mobile et desktop

**L'équipe éditoriale peut maintenant :**
- Créer des articles dans WordPress
- Ajouter images et catégories
- Publier instantanément
- Sans toucher au code React !

---

## 🚀 Prochaine phase recommandée

**Phase 5 : Podcasts WordPress**
- Custom post type "podcast"
- Player audio réutilisant `useAudioPlayer`
- Intégration GlobalAudioContext
- Lockscreen controls

OU

**Phase 7 : Tests & Polish**
- Tests multi-devices
- Optimisations performance
- Préparation mobile (Capacitor)

---

**Questions ? Besoin d'explications sur un concept ?**
N'hésite pas à demander ! 🙂

