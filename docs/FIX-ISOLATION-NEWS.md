# Fix - Isolation NEWS (articles élections)

## 🐛 Problème identifié

Les articles avec catégories `election-*` apparaissaient dans `/news` malgré le système d'exclusion.

**Logs observés** :
```
[News] Loaded 15 categories (excluded 2 contextual)
[News] Excluded category IDs: 32  ← Seulement bannières, pas élections !
```

**Cause** : Race condition / timing issue
1. Hook `useWordPressPosts` s'exécute avec `excludedCategoryIds = "32"` (valeur initiale)
2. Catégories chargées → `excludedCategoryIds` mis à jour avec "32,45,46,47"
3. MAIS le hook ne se rechargeait pas automatiquement

**Raison** : `hasLoadedRef.current` bloquait le rechargement même si filtres changeaient

---

## ✅ Corrections appliquées

### 1. News.jsx - Force refetch après calcul IDs

**Fichier** : `src/pages/News.jsx`

**Ajout** : useEffect qui force le rechargement quand IDs exclus sont calculés

```javascript
/**
 * Refetch articles quand les IDs exclus changent
 * (Pour forcer rechargement après calcul catégories)
 */
useEffect(() => {
  if (excludedCategoryIds !== BANNERS_CATEGORY_ID && !categoriesLoading) {
    logger.log(`[News] Categories exclusion updated, refetching posts with IDs: ${excludedCategoryIds}`);
    refetch();
  }
}, [excludedCategoryIds, categoriesLoading, refetch]);
```

**Résultat** : Dès que les catégories sont chargées et les IDs calculés, on force un refetch

---

### 2. useWordPressPosts.js - Reset hasLoadedRef dans refetch

**Fichier** : `src/hooks/useWordPressPosts.js`

**Modification** : Reset `hasLoadedRef` avant de recharger

```javascript
const refetch = useCallback(() => {
  logger.log('[useWordPressPosts] Manual refetch triggered');
  hasLoadedRef.current = false; // ← AJOUT : Reset pour forcer rechargement
  loadPosts();
}, [loadPosts]);
```

**Résultat** : Le `refetch()` ne sera plus bloqué par la condition ligne 136-140

---

## 🧪 Tests de validation

### Test 1 : Logs complets

**Console navigateur** : Ouvrir `/news`

**Logs attendus** :
```
[News] Loading categories...
[WordPress API] Found 16 categories
[News] Loaded 15 categories (excluded 2 contextual)
[News] Excluded category IDs: 32,45,46,47  ← IDs élections présents !
[News] Categories exclusion updated, refetching posts with IDs: 32,45,46,47
[useWordPressPosts] Manual refetch triggered
[useWordPressPosts] Loading posts... {categories_exclude: "32,45,46,47", ...}
```

✅ **Critère** : IDs élections (45, 46, 47...) dans la chaîne `categories_exclude`

---

### Test 2 : Dropdown catégories

**Actions** :
1. Ouvrir `/news`
2. Cliquer dropdown "Catégories"

**Résultat attendu** :
- ❌ Catégories `Élection - Beaumont`, `Élection - Clermont` ABSENTES
- ✅ Catégories normales présentes

---

### Test 3 : Liste articles

**Actions** :
1. Créer un article WordPress avec catégorie `election-beaumont`
2. Rafraîchir `/news`

**Résultat attendu** :
- ❌ Article électoral ABSENT de la liste

**Vérification croisée** :
- ✅ Article visible sur `/elections/beaumont`

---

## 🔍 Debugging si échec persiste

### Si logs montrent toujours "32" uniquement

**Vérifier** :
1. Catégories élections ont bien des slugs `election-*` (pas d'espace, pas d'accent)
2. Console : `const cats = await fetchCategories(); console.log(cats.filter(c => c.slug.startsWith('election-')))`
3. Vérifier que les IDs sont bien récupérés

### Si dropdown montre quand même catégories élections

**Vérifier** :
1. `setCategories(normalCats)` est bien appelé (ligne 110 News.jsx)
2. Console : Inspecter `categories` state dans React DevTools
3. Vérifier que le filtre ligne 101 fonctionne : `if (isBanner || isContextual)`

### Si articles élections apparaissent quand même

**Vérifier** :
1. Query string API WordPress : ouvrir Network tab, chercher requête `/wp-json/wp/v2/posts`
2. Vérifier paramètre `categories_exclude=32,45,46,47` dans l'URL
3. Tester manuellement l'API : `https://votre-wp.com/wp-json/wp/v2/posts?categories_exclude=45&per_page=10`

---

## 📊 Impact

**Fichiers modifiés** : 2
- `src/pages/News.jsx` (ajout useEffect)
- `src/hooks/useWordPressPosts.js` (reset hasLoadedRef)

**Lignes ajoutées** : ~15
**Compatibilité** : Rétro-compatible, pas de breaking change

---

**Date** : 19 février 2026  
**Issue** : Tests d'isolation NEWS échouaient  
**Status** : ✅ Résolu
