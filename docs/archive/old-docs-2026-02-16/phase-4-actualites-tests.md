# Guide de Tests - Phase 4 : Actualités WordPress

**Objectif :** Vérifier que toutes les fonctionnalités actualités fonctionnent correctement

---

## 🚀 Avant de commencer

### Prérequis

1. **WordPress configuré avec :**
   - Au moins 3-5 articles publiés
   - Images à la une sur les articles
   - Catégories créées et assignées

2. **Serveur de dev lancé :**
   ```bash
   cd /home/dofrecords/WebstormProjects/c6radio-web
   npm run dev
   ```

3. **Ouvrir DevTools :**
   - Chrome/Firefox : F12
   - Onglets importants : Console, Network, Application

---

## ✅ Test 1 : Navigation vers Actualités

### Actions
1. Ouvrir `http://localhost:5173`
2. Cliquer sur "Actualités" dans le menu

### Résultats attendus
- ✅ URL change vers `/news`
- ✅ Lien "Actualités" dans le menu devient actif (surligné)
- ✅ Page "Actualités C6Radio" s'affiche
- ✅ Sous-titre visible : "Découvrez les dernières nouvelles..."

### En cas de problème
- **Menu ne s'affiche pas** : Vérifier que Header.jsx est bien modifié
- **Page blanche** : Ouvrir console → vérifier erreurs JavaScript

---

## ✅ Test 2 : Chargement des articles

### Actions
1. Observer le chargement de `/news`
2. Ouvrir Console DevTools

### Résultats attendus
- ✅ Spinner de chargement visible brièvement
- ✅ Message "Chargement des actualités..." affiché
- ✅ Puis grille de cartes apparaît
- ✅ Dans Console : `[useWordPressPosts] Loading posts...`
- ✅ Dans Console : `[WordPress API] Found X posts`

### En cas de problème

**"Aucune actualité pour le moment" :**
- Vérifier que WordPress a des articles publiés (status = publish)
- Tester l'API directement : `https://exp937.fr/wp/wp-json/wp/v2/posts`
- Vérifier Console pour erreurs CORS

**Spinner qui tourne indéfiniment :**
- Problème de connexion WordPress
- Vérifier l'URL dans `src/config/constants.js`
- Vérifier Console pour erreur réseau

**Erreur "Impossible de charger les actualités" :**
- WordPress inaccessible
- Timeout (>10 secondes)
- Vérifier connexion internet

---

## ✅ Test 3 : Affichage des cartes

### Actions
1. Observer les cartes d'actualités
2. Compter le nombre de cartes

### Résultats attendus
- ✅ Chaque carte affiche :
  - Image à la une (ou logo C6Radio si pas d'image)
  - Titre de l'article
  - Extrait du contenu (max 150 caractères)
  - Date formatée (ex: "15 février 2026")
  - Catégories en badges colorés

### Vérifications détaillées

**Images :**
- Toutes les images s'affichent
- Ratio 16:9 respecté (pas déformées)
- Pas d'images cassées (icône 🖼️ cassée)

**Textes :**
- Titres lisibles et complets
- Extraits limités (pas de texte infini)
- Dates en français

**Catégories :**
- Badges visibles sous la date
- Première catégorie colorée (rouge/accent)
- Autres catégories en gris

---

## ✅ Test 4 : Responsive (grille)

### Actions
1. Redimensionner la fenêtre du navigateur
2. Tester ces largeurs :
   - 1920px (grand écran)
   - 1200px (desktop standard)
   - 768px (tablette)
   - 375px (mobile)

### Résultats attendus

**Desktop (> 1024px) :**
- ✅ 3 colonnes de cartes
- ✅ Espacement uniforme

**Tablette (768-1024px) :**
- ✅ 2 colonnes de cartes
- ✅ Cartes plus larges

**Mobile (< 768px) :**
- ✅ 1 colonne de cartes
- ✅ Cartes pleine largeur
- ✅ Menu hamburger visible
- ✅ Textes toujours lisibles

### Astuce DevTools
Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
Tester devices : iPhone SE, iPad, Desktop HD

---

## ✅ Test 5 : Lazy Loading des images

### Actions
1. Ouvrir DevTools → Network
2. Filtrer : Images (Img)
3. Recharger `/news`
4. Scroller lentement vers le bas

### Résultats attendus
- ✅ Seulement 2-3 premières images chargent immédiatement
- ✅ Nouvelles images chargent quand on scroll
- ✅ Dans Network : nouvelles requêtes apparaissent au scroll

### Pourquoi c'est important ?
Lazy loading économise la bande passante et accélère le chargement initial !

---

## ✅ Test 6 : Clic sur une carte (navigation)

### Actions
1. Cliquer sur une carte d'actualité
2. Observer la navigation

### Résultats attendus
- ✅ URL change vers `/news/slug-article`
- ✅ Page détail s'affiche (pas de rechargement)
- ✅ Navigation fluide (pas de flash blanc)
- ✅ PlayerBar reste visible en bas

### En cas de problème
- **Rechargement complet** : Link doit être `<Link>` React Router, pas `<a>`
- **404** : Vérifier que l'article existe avec ce slug
- **Page blanche** : Console → erreur JavaScript

---

## ✅ Test 7 : Page détail d'article

### Actions
1. Sur une page détail `/news/slug-article`
2. Observer le contenu

### Résultats attendus

**En-tête :**
- ✅ Bouton "← Retour aux actualités" en haut
- ✅ Grande image à la une
- ✅ Titre complet de l'article
- ✅ Date de publication
- ✅ Catégories en badges

**Contenu :**
- ✅ Tout le contenu HTML s'affiche
- ✅ Paragraphes correctement espacés
- ✅ Images dans le contenu visibles
- ✅ Liens cliquables
- ✅ Styles WordPress préservés

**Footer :**
- ✅ Bouton "← Retour aux actualités" en bas
- ✅ Espacé correctement

---

## ✅ Test 8 : Bouton retour

### Actions
1. Sur page détail
2. Cliquer "← Retour aux actualités"

### Résultats attendus
- ✅ Navigation vers `/news`
- ✅ Liste des actualités réaffichée
- ✅ Pas de rechargement complet
- ✅ Scroll en haut de page

---

## ✅ Test 9 : Cache localStorage

### Actions
1. Ouvrir `/news`
2. Attendre chargement complet
3. Ouvrir DevTools → Application → Local Storage → localhost:5173
4. Chercher clé : `wp_posts_cache`

### Résultats attendus
- ✅ Clé `wp_posts_cache` existe
- ✅ Valeur contient JSON avec `data` et `timestamp`
- ✅ `data` contient tableau d'articles

**Tester le cache :**
1. Recharger la page (F5)
2. Observer : chargement INSTANTANÉ
3. Console : `[useWordPressPosts] Using cached posts`

**Tester l'expiration (optionnel) :**
1. Modifier le timestamp dans localStorage (mettre vieille date)
2. Recharger
3. Nouveau fetch doit se déclencher

---

## ✅ Test 10 : Article inexistant (404)

### Actions
1. Aller sur `/news/article-qui-nexiste-pas`
2. Observer le comportement

### Résultats attendus
- ✅ Message : "😕 Article non trouvé"
- ✅ Texte explicatif
- ✅ Bouton "← Retour aux actualités"
- ✅ Pas d'erreur JavaScript dans Console

---

## ✅ Test 11 : Erreur WordPress (simulation)

### Actions
1. **Temporairement**, modifier `src/config/constants.js` :
   ```javascript
   export const WP_API_BASE_URL = 'https://invalid-url-test.com/wp-json/wp/v2';
   ```
2. Recharger `/news`
3. Observer

### Résultats attendus
- ✅ Message : "❌ Impossible de charger les actualités"
- ✅ Texte d'aide visible
- ✅ Pas de page blanche
- ✅ Fallback gracieux

**Après le test :**
⚠️ **NE PAS OUBLIER** de remettre la vraie URL !

---

## ✅ Test 12 : Responsive mobile (détail)

### Actions
1. Ouvrir page détail sur mobile (DevTools device mode)
2. Tester iPhone SE (375px)

### Résultats attendus
- ✅ Image à la une responsive (pas débordante)
- ✅ Titre lisible (pas trop petit)
- ✅ Contenu lisible
- ✅ Boutons cliquables (assez grands)
- ✅ Pas de scroll horizontal

---

## ✅ Test 13 : Performance (Lighthouse)

### Actions
1. Ouvrir DevTools → Lighthouse
2. Sélectionner "Performance" + "Mobile"
3. Lancer l'audit

### Résultats attendus
- ✅ Score Performance : > 80
- ✅ Score Accessibility : > 90
- ✅ Score Best Practices : > 90
- ✅ Score SEO : > 80

### Si scores faibles :
- Vérifier images trop lourdes
- Activer lazy loading (déjà fait ✅)
- Optimiser le cache (déjà fait ✅)

---

## ✅ Test 14 : Console (pas d'erreurs)

### Actions
1. Ouvrir Console DevTools
2. Naviguer : Accueil → Actualités → Détail → Retour
3. Observer les logs

### Résultats attendus
- ✅ Aucune erreur rouge (errors)
- ✅ Warnings acceptables (warnings jaunes OK)
- ✅ Logs informatifs : `[useWordPressPosts]`, `[WordPress API]`

### Erreurs courantes à ignorer
- Warnings React DevTools (pas grave)
- 404 sur favicon.ico (normal si pas défini)

---

## 📊 Récapitulatif des tests

| # | Test | Statut | Notes |
|---|------|--------|-------|
| 1 | Navigation menu | ⬜ | |
| 2 | Chargement articles | ⬜ | |
| 3 | Affichage cartes | ⬜ | |
| 4 | Responsive grille | ⬜ | |
| 5 | Lazy loading | ⬜ | |
| 6 | Clic carte | ⬜ | |
| 7 | Page détail | ⬜ | |
| 8 | Bouton retour | ⬜ | |
| 9 | Cache localStorage | ⬜ | |
| 10 | 404 article | ⬜ | |
| 11 | Erreur WordPress | ⬜ | |
| 12 | Responsive mobile | ⬜ | |
| 13 | Lighthouse | ⬜ | |
| 14 | Console propre | ⬜ | |

**Légende :** ⬜ À tester | ✅ OK | ❌ Problème

---

## 🐛 Problèmes fréquents et solutions

### Problème : CORS bloqué

**Symptôme :**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solution :**
Ajouter dans WordPress `wp-config.php` :
```php
header('Access-Control-Allow-Origin: *');
```

---

### Problème : Images ne chargent pas

**Symptôme :**
Icônes d'image cassée 🖼️

**Vérifications :**
1. Article a-t-il une "Featured Image" ?
2. URL image accessible (tester dans navigateur)
3. Console → erreur 404 ou CORS ?

**Solution temporaire :**
Fallback automatique sur logo C6Radio (déjà implémenté ✅)

---

### Problème : Cache ne se met pas à jour

**Symptôme :**
Nouveaux articles WordPress pas visibles

**Solution :**
```javascript
// Dans Console navigateur
localStorage.removeItem('wp_posts_cache');
location.reload();
```

Ou attendre 5 minutes (expiration auto)

---

### Problème : Menu hamburger ne s'ouvre pas

**Vérification :**
1. Mobile < 768px ?
2. Console → erreurs JavaScript ?
3. Header.css chargé ?

**Solution :**
Vérifier que Header.jsx et Header.css sont bien présents et pas modifiés accidentellement.

---

## 🎉 Validation finale

**Tous les tests ✅ ?**

Tu as maintenant un système complet d'actualités WordPress fonctionnel !

**Prochaines étapes :**
1. Ajouter filtres par catégorie (Phase 4 suite)
2. Ajouter barre de recherche (Phase 4 suite)
3. Ou passer aux Podcasts (Phase 5)

---

**Questions ou problèmes ?**
Note-les et on les résoudra ensemble ! 🙂

