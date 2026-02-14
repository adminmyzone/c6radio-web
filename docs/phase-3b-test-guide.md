# Guide de Test - Phase 3B : Pages Dynamiques WordPress

> **Date :** 14 février 2026  
> **Phase :** 3B - Pages Dynamiques WordPress  
> **Durée estimée des tests :** 15-20 minutes

---

## 🎯 Ce Qui a Été Implémenté

### Fonctionnalités Phase 3B

✅ **Service API WordPress** (`src/services/wordpress.js`)
- Fetch pages depuis WordPress REST API
- Fallback automatique si WordPress down

✅ **Composant DynamicPage** (`src/pages/DynamicPage.jsx`)
- Affiche n'importe quelle page WordPress
- Gestion états : loading, erreur, contenu

✅ **Navigation Dynamique** (Header.jsx modifié)
- Menu chargé depuis WordPress
- Liens générés automatiquement

✅ **Route Catch-All** (router.jsx modifié)
- Route `/:slug` capture toutes les URLs
- Page 404 si page WordPress n'existe pas

---

## 🧪 Tests à Effectuer

### Test 1 : Navigation Chargée depuis WordPress

**But :** Vérifier que le menu se charge depuis WordPress

**Steps :**
1. Ouvrir le site : `http://localhost:5173/`
2. Observer le Header en haut
3. **Résultat attendu :**
   - "Chargement..." apparaît brièvement
   - Puis les liens s'affichent : Accueil, À Propos, Contact, etc.
   - Les liens correspondent aux pages WordPress

**Vérification Technique :**
- Ouvrir Console navigateur (F12)
- Chercher logs : `[Header] Loading menu from WordPress...`
- Chercher : `[Header] Loaded X menu pages`

---

### Test 2 : Page WordPress Dynamique (About)

**But :** Vérifier qu'on peut charger une page depuis WordPress

**Steps :**
1. Cliquer sur "À Propos" dans le menu
2. **Résultat attendu :**
   - URL change vers `/about`
   - Spinner de chargement apparaît
   - Page WordPress s'affiche avec le contenu
   - Titre dans l'onglet : "À Propos - C6Radio"

**Vérification Technique :**
- Console : `[DynamicPage] Loading page: about`
- Console : `[WordPress API] Fetching page: about`
- Console : `[WordPress API] Page loaded: À Propos`

---

### Test 3 : Page WordPress Dynamique (Contact)

**Steps :**
1. Cliquer sur "Contact" dans le menu
2. **Résultat attendu :**
   - URL vers `/contact`
   - Contenu WordPress affiché
   - Titre onglet : "Contact - C6Radio"

---

### Test 4 : Page 404 (Non Trouvée)

**But :** Tester le comportement si page n'existe pas

**Steps :**
1. Aller sur URL inexistante : `http://localhost:5173/page-qui-nexiste-pas`
2. **Résultat attendu :**
   - Page 404 s'affiche (fond violet)
   - Message "Page non trouvée"
   - Bouton "Retour à l'accueil"
   - URL devient `/404`

**Vérification Technique :**
- Console : `[DynamicPage] Page not found: page-qui-nexiste-pas`

---

### Test 5 : Fallback si WordPress Down

**But :** Vérifier que le site fonctionne même si WordPress ne répond pas

**Steps :**
1. **Simuler WordPress down :**
   - Éditer `src/config/constants.js`
   - Changer `WP_API_BASE_URL` vers URL invalide :
     ```javascript
     export const WP_API_BASE_URL = 'https://invalid-url.com/wp-json/wp/v2';
     ```
   - Sauvegarder (HMR recharge automatiquement)

2. Recharger le site
3. **Résultat attendu :**
   - Le site fonctionne toujours !
   - Menu affiche : Accueil, À Propos, Contact (fallback)
   - Cliquer sur "À Propos" → Affiche page hardcodée (fallback)

4. **Restaurer :**
   - Remettre la vraie URL WordPress dans constants.js

**Vérification Technique :**
- Console : `[WordPress API] Error fetching menu pages`
- Console : `[WordPress API] Using fallback pages`

---

### Test 6 : Menu Mobile (Responsive)

**But :** Tester le menu hamburger sur petit écran

**Steps :**
1. Réduire fenêtre navigateur (< 768px)
   OU
   DevTools (F12) → Mode Device (Ctrl+Shift+M) → iPhone

2. **Résultat attendu :**
   - Menu disparaît
   - Bouton hamburger ☰ apparaît
   - Cliquer sur ☰ → Menu slide depuis la droite
   - Liens WordPress affichés verticalement
   - Cliquer sur un lien → Menu se ferme

---

### Test 7 : Styles WordPress (Images, Listes, etc.)

**But :** Vérifier que le contenu HTML WordPress s'affiche bien

**Steps :**
1. Aller sur une page avec contenu riche (images, listes, etc.)
2. **Résultat attendu :**
   - Images WordPress responsives
   - Listes (ul/ol) stylisées
   - Titres H2/H3 avec styles
   - Liens cliquables et stylisés

---

## 🔥 Test WordPress API Manuellement

Si vous voulez tester l'API WordPress directement :

### Test API dans le Navigateur

Ouvrir dans le navigateur :
```
https://radio.c6media.fr/wp-json/wp/v2/pages
```

**Résultat attendu :**
- JSON avec liste des pages
- Format :
  ```json
  [
    {
      "id": 123,
      "slug": "about",
      "title": { "rendered": "À Propos" },
      "content": { "rendered": "<p>...</p>" },
      ...
    }
  ]
  ```

### Test API dans la Console Navigateur

Ouvrir Console (F12), coller :
```javascript
// Test fetchMenuPages
import { fetchMenuPages } from './services/wordpress.js';
const pages = await fetchMenuPages();
console.log(pages);

// Test fetchPageBySlug
import { fetchPageBySlug } from './services/wordpress.js';
const page = await fetchPageBySlug('about');
console.log(page);
```

---

## ✅ Checklist Globale Phase 3B

- [ ] Menu chargé depuis WordPress (Header)
- [ ] Links dynamiques fonctionnels
- [ ] Page WordPress /about s'affiche
- [ ] Page WordPress /contact s'affiche
- [ ] Page 404 pour URLs invalides
- [ ] Fallback si WordPress down
- [ ] Menu mobile hamburger fonctionne
- [ ] Styles WordPress appliqués (images, listes)
- [ ] Console sans erreurs critiques
- [ ] Titre onglet change selon page
- [ ] PlayerBar reste visible sur toutes pages

---

## 🐛 Problèmes Possibles

### Problème 1 : "Chargement..." reste affiché

**Cause :** WordPress API ne répond pas

**Solutions :**
- Vérifier l'URL dans `src/config/constants.js`
- Vérifier que WordPress est accessible : https://radio.c6media.fr/wp-json/wp/v2/pages
- Vérifier Console pour erreurs CORS

### Problème 2 : Page vide après chargement

**Cause :** Page WordPress n'a pas de contenu

**Solution :**
- Vérifier dans WordPress admin que la page est publiée
- Vérifier que la page a du contenu dans l'éditeur

### Problème 3 : Menu ne s'affiche pas

**Cause :** Aucune page WordPress publiée

**Solution :**
- Créer des pages dans WordPress admin
- Publier au moins 2-3 pages test

### Problème 4 : Erreur CORS

**Symptôme :** Console : `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution :**
- Ajouter dans WordPress `.htaccess` ou `wp-config.php` :
  ```php
  header('Access-Control-Allow-Origin: *');
  ```
- Ou installer plugin WordPress "CORS"

---

## 📝 Notes Importantes

### URLs à Vérifier

**WordPress API :**
- Production : `https://radio.c6media.fr/wp-json/wp/v2`
- Pages : `https://radio.c6media.fr/wp-json/wp/v2/pages`

**Site React :**
- Dev : `http://localhost:5173`

### Logs à Surveiller

Ouvrir Console navigateur (F12), vous devriez voir :
```
[Header] Loading menu from WordPress...
[Header] Loaded 3 menu pages
[WordPress API] Fetching page: about
[WordPress API] Page loaded: À Propos
[DynamicPage] Loading page: about
```

---

## 🎯 Prochaines Étapes

Une fois Phase 3B validée :

**Option 1 : Améliorer Phase 3**
- Cache localStorage pour pages WordPress
- Loading skeleton plus joli
- Animation transitions entre pages

**Option 2 : Phase 4 - Podcasts**
- Liste podcasts depuis WordPress
- Player podcasts
- Page dédiée podcasts

**Option 3 : Phase 5 - PWA**
- Service Worker
- Mode offline
- Install prompt

---

**Bon tests ! 🚀**
