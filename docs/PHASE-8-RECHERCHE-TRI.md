# 📋 PHASE 8 : Recherche et Tri des Articles

**Date** : 18 février 2026  
**Difficulté** : ⭐⭐ Facile  
**Temps estimé** : 30-45 minutes

---

## 🎯 OBJECTIF

Ajouter deux fonctionnalités à la page "Actualités" :
1. **Barre de recherche** : Chercher des articles par mot-clé
2. **Filtre par catégorie** : Afficher seulement les articles d'une catégorie

---

## 📚 EXPLICATION POUR DÉBUTANTS

### Comment ça fonctionne ?

Actuellement, la page News affiche **TOUS** les articles. Mais WordPress nous permet de **filtrer** les articles avec des paramètres :

```
https://exp937.fr/wp-json/wp/v2/posts              ← Tous les articles
https://exp937.fr/wp-json/wp/v2/posts?search=radio ← Articles contenant "radio"
https://exp937.fr/wp-json/wp/v2/posts?categories=5 ← Articles de la catégorie 5
```

**Notre stratégie :**
1. Créer un composant `NewsFilters.jsx` avec une barre de recherche et un menu déroulant
2. Quand l'utilisateur tape/sélectionne, on met à jour l'état React
3. On passe ces filtres au hook `useWordPressPosts()` qui existe déjà
4. Le hook refetch automatiquement les articles filtrés

**C'est tout !** Le hook fait le travail difficile, on a juste besoin d'une interface.

---

## 📝 ÉTAPE 1 : Créer le Composant NewsFilters

### Fichier : `src/components/NewsFilters.jsx`

Crée ce nouveau fichier avec le code suivant :

```jsx
/**
 * Composant NewsFilters - Barre de recherche et filtre catégorie
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche :
 * 1. Une barre de recherche (input texte)
 * 2. Un menu déroulant de catégories (select)
 *
 * PROPS :
 * - searchTerm : Le mot recherché actuellement (string)
 * - onSearchChange : Fonction appelée quand on tape dans la recherche
 * - selectedCategory : L'ID de catégorie sélectionnée (string ou null)
 * - onCategoryChange : Fonction appelée quand on change de catégorie
 * - categories : Liste des catégories disponibles (array)
 *
 * COMMENT ÇA MARCHE ?
 * Parent (News.jsx) → passe les valeurs et fonctions via props
 * NewsFilters → affiche les inputs et appelle les fonctions au changement
 * Parent → reçoit les nouveaux filtres et refetch les articles
 */

import { useState, useEffect } from 'react';
import './NewsFilters.css';

export default function NewsFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = []
}) {
  // État local pour la barre de recherche (debouncing)
  const [inputValue, setInputValue] = useState(searchTerm || '');

  /**
   * DEBOUNCING : Technique pour éviter trop de requêtes API
   * 
   * PROBLÈME :
   * Si on appelle onSearchChange à chaque lettre tapée,
   * on envoie une requête API pour "r", "ra", "rad", "radi", "radio"
   * = 5 requêtes inutiles !
   * 
   * SOLUTION :
   * On attend 500ms après que l'utilisateur arrête de taper
   * avant d'envoyer la requête.
   */
  useEffect(() => {
    // Timer de 500ms
    const timer = setTimeout(() => {
      // Après 500ms sans changement, on déclenche la recherche
      if (inputValue !== searchTerm) {
        onSearchChange(inputValue);
      }
    }, 500);

    // Cleanup : Si l'utilisateur tape à nouveau, on annule le timer précédent
    return () => clearTimeout(timer);
  }, [inputValue, searchTerm, onSearchChange]);

  /**
   * Gestion du changement dans l'input de recherche
   */
  const handleSearchInput = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Gestion du changement de catégorie
   */
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    // Si "all" est sélectionné, passer null (= toutes les catégories)
    onCategoryChange(value === 'all' ? null : value);
  };

  /**
   * Bouton pour effacer la recherche
   */
  const handleClearSearch = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className="news-filters">
      {/* Barre de recherche */}
      <div className="news-filters__search">
        <div className="search-input-wrapper">
          {/* Icône loupe */}
          <span className="search-icon">🔍</span>
          
          {/* Input de recherche */}
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un article..."
            value={inputValue}
            onChange={handleSearchInput}
            aria-label="Rechercher dans les articles"
          />
          
          {/* Bouton pour effacer (visible seulement si texte saisi) */}
          {inputValue && (
            <button
              className="search-clear"
              onClick={handleClearSearch}
              aria-label="Effacer la recherche"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtre par catégorie */}
      <div className="news-filters__category">
        <label htmlFor="category-select" className="category-label">
          Catégorie :
        </label>
        
        <select
          id="category-select"
          className="category-select"
          value={selectedCategory || 'all'}
          onChange={handleCategoryChange}
        >
          {/* Option par défaut : Toutes les catégories */}
          <option value="all">Toutes les catégories</option>
          
          {/* Liste dynamique des catégories depuis WordPress */}
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * DEBOUNCING :
 * - Sans debouncing : 1 requête par lettre tapée
 * - Avec debouncing (500ms) : 1 requête seulement quand on arrête de taper
 * - Économise de la bande passante et améliore la performance
 * 
 * ACCESSIBILITÉ :
 * - aria-label pour screen readers
 * - <label> associé au <select> avec htmlFor/id
 * - Bouton effacer avec type="button" (évite submit de form)
 * 
 * REACT PROPS :
 * - Ce composant est "contrôlé" par le parent (News.jsx)
 * - Il ne fait que afficher les valeurs et signaler les changements
 * - Le parent décide quoi faire avec ces changements (refetch articles)
 */
```

---

## 🎨 ÉTAPE 2 : Créer le CSS du Composant

### Fichier : `src/components/NewsFilters.css`

Crée ce nouveau fichier pour styliser les filtres :

```css
/**
 * Styles pour NewsFilters
 * Design simple et responsive
 */

.news-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap; /* Responsive : passe à la ligne sur mobile */
}

/* ============================================
   BARRE DE RECHERCHE
   ============================================ */

.news-filters__search {
  flex: 1;
  min-width: 250px; /* Largeur minimum */
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 1.2rem;
  color: #6c757d;
  pointer-events: none; /* Pas cliquable */
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem; /* Espace pour icônes */
  font-size: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-input::placeholder {
  color: #adb5bd;
}

.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.search-clear:hover {
  background-color: #e9ecef;
  color: #495057;
}

/* ============================================
   FILTRE CATÉGORIE
   ============================================ */

.news-filters__category {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}

.category-label {
  font-weight: 600;
  color: #495057;
  white-space: nowrap; /* Pas de retour ligne */
}

.category-select {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.category-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.category-select:hover {
  border-color: #adb5bd;
}

/* ============================================
   RESPONSIVE MOBILE
   ============================================ */

@media (max-width: 768px) {
  .news-filters {
    flex-direction: column; /* Empile verticalement */
    gap: 1rem;
  }

  .news-filters__search,
  .news-filters__category {
    width: 100%;
    min-width: unset;
  }

  .news-filters__category {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-select {
    width: 100%;
  }
}

/* ============================================
   MODE SOMBRE (OPTIONNEL - À ACTIVER PLUS TARD)
   ============================================ */

/* Décommenter quand mode sombre implémenté
@media (prefers-color-scheme: dark) {
  .news-filters {
    background: #212529;
  }

  .search-input,
  .category-select {
    background-color: #343a40;
    border-color: #495057;
    color: white;
  }

  .search-input::placeholder {
    color: #6c757d;
  }

  .category-label {
    color: #dee2e6;
  }
}
*/
```

---

## 🔧 ÉTAPE 3 : Modifier la Page News

### Fichier : `src/pages/News.jsx`

**Remplace tout le contenu** par ce nouveau code :

```jsx
/**
 * Page News - Liste des actualités avec recherche et filtre
 *
 * PHASE 8 : RECHERCHE ET TRI
 * ---------------------------
 * Ajout de deux fonctionnalités :
 * 1. Barre de recherche textuelle
 * 2. Filtre par catégorie
 *
 * COMMENT ÇA MARCHE ?
 * - On stocke les filtres dans l'état React (useState)
 * - On passe ces filtres au hook useWordPressPosts()
 * - Le hook refetch automatiquement les articles filtrés
 * - On affiche le composant NewsFilters pour l'interface
 */

import { useState, useEffect } from 'react';
import { useWordPressPosts } from '../hooks/useWordPressPosts.js';
import { fetchCategories } from '../services/wordpress.js';
import NewsCard from '../components/NewsCard.jsx';
import NewsFilters from '../components/NewsFilters.jsx';
import logger from '../lib/logger.js';
import './News.css';

export default function News() {
  // ====================================
  // ÉTATS REACT
  // ====================================

  /**
   * Filtres de recherche et tri
   */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  /**
   * Liste des catégories WordPress
   */
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  /**
   * Hook pour récupérer les articles avec filtres
   * IMPORTANT : Le hook refetch automatiquement quand les filtres changent !
   */
  const { posts, loading, error } = useWordPressPosts({
    search: searchTerm || undefined,      // Undefined si vide (ignore le filtre)
    categories: selectedCategory || undefined,
    per_page: 20,                         // Augmenté à 20 pour avoir plus de résultats
  });

  // ====================================
  // CHARGEMENT DES CATÉGORIES
  // ====================================

  /**
   * useEffect : Charger les catégories au montage du composant
   * Une seule fois (tableau de dépendances vide [])
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        logger.log('[News] Loading categories...');
        setCategoriesLoading(true);

        const cats = await fetchCategories();
        setCategories(cats);

        logger.log(`[News] Loaded ${cats.length} categories`);
      } catch (err) {
        logger.error('[News] Error loading categories:', err);
        // En cas d'erreur, garder tableau vide (= pas de filtre catégorie)
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []); // [] = exécuter une seule fois au montage

  // ====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // ====================================

  /**
   * Appelé quand l'utilisateur tape dans la barre de recherche
   */
  const handleSearchChange = (newSearchTerm) => {
    logger.log('[News] Search term changed:', newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  /**
   * Appelé quand l'utilisateur change de catégorie
   */
  const handleCategoryChange = (categoryId) => {
    logger.log('[News] Category changed:', categoryId);
    setSelectedCategory(categoryId);
  };

  // ====================================
  // RENDU
  // ====================================

  return (
    <div className="news-page">
      {/* En-tête */}
      <header className="news-header">
        <h1 className="news-title">Actualités C6Radio</h1>
        <p className="news-subtitle">
          Découvrez les dernières nouvelles, événements et coulisses de la radio
        </p>
      </header>

      {/* Filtres de recherche et tri */}
      {!categoriesLoading && (
        <NewsFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      )}

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

        {/* État : Aucun article trouvé */}
        {!loading && !error && posts.length === 0 && (
          <div className="news-empty">
            {searchTerm || selectedCategory ? (
              // Message spécifique si filtres actifs
              <>
                <p className="news-empty__message">
                  🔍 Aucun article trouvé
                </p>
                <p className="news-empty__help">
                  Essayez d'autres mots-clés ou changez de catégorie
                </p>
              </>
            ) : (
              // Message par défaut si aucun filtre
              <>
                <p className="news-empty__message">
                  📭 Aucune actualité pour le moment
                </p>
                <p className="news-empty__help">
                  Revenez bientôt pour découvrir nos dernières nouvelles !
                </p>
              </>
            )}
          </div>
        )}

        {/* État : Articles chargés */}
        {!loading && !error && posts.length > 0 && (
          <>
            {/* Compteur de résultats (si filtres actifs) */}
            {(searchTerm || selectedCategory) && (
              <div className="news-results-count">
                <p>
                  <strong>{posts.length}</strong> article{posts.length > 1 ? 's' : ''} trouvé{posts.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Grille d'articles */}
            <div className="news-grid">
              {posts.map(post => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * RÉACTIVITÉ DES FILTRES :
 * - Quand searchTerm ou selectedCategory change, le hook refetch automatiquement
 * - C'est magique ! useWordPressPosts surveille les changements de filtres
 * 
 * DEBOUNCING :
 * - Implémenté dans NewsFilters.jsx
 * - Évite de faire 10 requêtes si on tape "concert" (1 requête seulement)
 * 
 * PERFORMANCE :
 * - Les catégories sont chargées une seule fois (useEffect avec [])
 * - Le cache du hook fonctionne toujours (5 min pour requêtes sans filtre)
 * 
 * ACCESSIBILITÉ :
 * - Messages adaptés selon contexte (filtres actifs ou non)
 * - Compteur de résultats pour feedback utilisateur
 * - Loading states clairs
 */
```

---

## 🎨 ÉTAPE 4 : Ajuster le CSS de News

### Fichier : `src/pages/News.css`

**Ajoute** ces styles à la fin du fichier existant :

```css
/* ============================================
   COMPTEUR DE RÉSULTATS
   ============================================ */

.news-results-count {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: #e7f3ff;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.news-results-count p {
  margin: 0;
  color: #004085;
  font-size: 0.95rem;
}

.news-results-count strong {
  color: #007bff;
  font-weight: 700;
}

/* ============================================
   RESPONSIVE : COMPTEUR SUR MOBILE
   ============================================ */

@media (max-width: 768px) {
  .news-results-count {
    text-align: center;
    font-size: 0.9rem;
  }
}
```

---

## ✅ ÉTAPE 5 : Tester !

### 1. Démarre le serveur de développement

```bash
npm run dev
```

### 2. Ouvre ton navigateur

Va sur la page **Actualités**

### 3. Teste la recherche

1. Tape un mot dans la barre de recherche (ex: "radio")
2. Attends 500ms (debouncing)
3. Les articles sont filtrés automatiquement !
4. Clique sur le ✕ pour effacer

### 4. Teste les catégories

1. Ouvre le menu déroulant "Catégorie"
2. Sélectionne une catégorie
3. Les articles sont filtrés instantanément !
4. Remets "Toutes les catégories" pour tout afficher

### 5. Teste la combinaison

Tu peux **combiner** recherche + catégorie :
- Catégorie "Concerts" + recherche "weekend"
- = Articles de concerts contenant "weekend"

---

## 🎓 EXPLICATION DU FLUX DE DONNÉES

### Schéma complet :

```
1. Utilisateur tape "radio" dans la barre
   ↓
2. NewsFilters.jsx détecte le changement
   ↓
3. Debouncing attend 500ms
   ↓
4. onSearchChange() est appelé
   ↓
5. News.jsx met à jour searchTerm avec setSearchTerm()
   ↓
6. useWordPressPosts() détecte le changement de filtres
   ↓
7. Le hook refetch les articles avec ?search=radio
   ↓
8. WordPress retourne seulement les articles contenant "radio"
   ↓
9. Le hook met à jour posts
   ↓
10. React re-render News.jsx avec les nouveaux articles
   ↓
11. NewsCard affiche les résultats filtrés
```

### En résumé :

- **NewsFilters** = Interface utilisateur (UI)
- **News.jsx** = État et logique (state management)
- **useWordPressPosts** = Communication avec API (data fetching)
- **WordPress** = Base de données (backend)

---

## 🔍 VÉRIFICATION : Fichiers Créés/Modifiés

### ✅ Nouveaux fichiers :
```
src/components/NewsFilters.jsx  ← Composant de filtres
src/components/NewsFilters.css  ← Styles du composant
```

### ✅ Fichiers modifiés :
```
src/pages/News.jsx              ← Intégration des filtres
src/pages/News.css              ← Styles compteur résultats
```

### ✅ Fichiers utilisés (déjà existants) :
```
src/hooks/useWordPressPosts.js  ← Hook avec support filtres
src/services/wordpress.js       ← fetchCategories()
```

---

## 🐛 TROUBLESHOOTING

### Problème : "Les catégories ne s'affichent pas"

**Solution** : Vérifie la console du navigateur (F12). Si erreur WordPress :
1. Assure-toi que WordPress est accessible
2. Vérifie que l'endpoint `/wp-json/wp/v2/categories` fonctionne
3. Vérifie que tu as des catégories avec des articles publiés

### Problème : "La recherche ne fonctionne pas"

**Solution** :
1. Ouvre la console (F12) et regarde les requêtes réseau
2. Vérifie que la requête inclut `?search=ton_mot`
3. Vérifie que WordPress retourne des résultats

### Problème : "Trop de requêtes API envoyées"

**Solution** :
- C'est normal si le debouncing ne fonctionne pas
- Vérifie que `useEffect` dans NewsFilters.jsx est correct
- Le timer de 500ms doit être présent

---

## 🚀 AMÉLIORATIONS FUTURES (OPTIONNEL)

### Fonctionnalités supplémentaires possibles :

1. **Tri par date** : Ajouter un bouton "Plus récent / Plus ancien"
2. **Tags** : Filtrer aussi par tags (en plus des catégories)
3. **Pagination** : Charger plus d'articles (bouton "Voir plus")
4. **Sauvegarde filtres** : Mémoriser les filtres dans l'URL (`?search=radio&cat=5`)
5. **Mode liste/grille** : Basculer entre affichage grille et liste
6. **Favoris** : Marquer des articles en favoris (localStorage)

### Code pour tri par date (bonus) :

```jsx
// Dans News.jsx, ajoute un état :
const [sortOrder, setSortOrder] = useState('desc'); // 'desc' ou 'asc'

// Modifie le hook :
const { posts, loading, error } = useWordPressPosts({
  search: searchTerm || undefined,
  categories: selectedCategory || undefined,
  per_page: 20,
  order: sortOrder,  // ← Ajout du tri
});

// Dans NewsFilters, ajoute un bouton :
<button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
  {sortOrder === 'desc' ? '📅 Plus récent' : '📅 Plus ancien'}
</button>
```

---

## 📊 RÉSUMÉ POUR DÉBUTANT

### Ce qu'on a fait :

1. **Créé NewsFilters.jsx** : Un composant avec recherche + select
2. **Créé NewsFilters.css** : Styles responsive et modernes
3. **Modifié News.jsx** : Intégration des filtres avec état React
4. **Ajouté CSS** : Compteur de résultats

### Concepts React utilisés :

- **useState** : Stocker les filtres (searchTerm, selectedCategory)
- **useEffect** : Charger les catégories + debouncing
- **Props** : Passer données et fonctions entre composants
- **Callbacks** : Remonter les événements (onSearchChange, onCategoryChange)

### Techniques avancées :

- **Debouncing** : Attendre avant de déclencher la recherche
- **Filtres combinés** : Recherche + catégorie en même temps
- **Feedback utilisateur** : Compteur de résultats, messages adaptés

---

## 🎉 FÉLICITATIONS !

Tu as implémenté avec succès la recherche et le tri des articles ! 🚀

**Prochaines étapes suggérées :**
- Tester sur mobile (responsive)
- Ajouter d'autres filtres (tags, date)
- Implémenter le partage social (prochaine feature)

**Besoin d'aide ?**
- Consulte la console navigateur (F12) pour les logs
- Vérifie les requêtes réseau (onglet Network)
- Relis les commentaires dans le code

---

**📝 Documentation créée avec ❤️ pour les débutants**
