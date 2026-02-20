# Checklist - Tests d'intégration Sections Contextuelles

## 🎯 Objectif

Vérifier que la fonctionnalité "Sections Contextuelles" fonctionne correctement avant le déploiement en production.

---

## ✅ Prérequis

- [ ] WordPress avec plugin ACF installé
- [ ] Champ ACF `context_section` configuré
- [ ] Au moins 2 catégories élections créées (ex: `election-beaumont`, `election-clermont`)
- [ ] Au moins 2 pages contextuelles créées
- [ ] Au moins 3 articles électoraux publiés (répartis sur les communes)
- [ ] Serveur de développement lancé (`npm run dev`)

---

## 🧪 Tests Backend & API

### Test 1 : API fetchContextualPages()

**Objectif** : Vérifier que l'API récupère les pages contextuelles

**Console navigateur** :
```javascript
import { fetchContextualPages } from './src/services/wordpress.js';
const pages = await fetchContextualPages('elections');
console.log(pages);
```

**Résultat attendu** :
```javascript
[
  { id: 123, slug: "beaumont", title: "Beaumont", context: "elections" },
  { id: 124, slug: "clermont", title: "Clermont", context: "elections" }
]
```

✅ **Passe si** : Liste des pages avec `context_section = "elections"`  
❌ **Échoue si** : Tableau vide ou erreur API

---

### Test 2 : API fetchPostsByContext()

**Objectif** : Vérifier que l'API récupère les articles d'une commune

**Console navigateur** :
```javascript
import { fetchPostsByContext } from './src/services/wordpress.js';
const posts = await fetchPostsByContext('elections', 'beaumont');
console.log(posts);
```

**Résultat attendu** :
```javascript
[
  { id: 1, title: "Article Beaumont 1", categories: [{slug: "election-beaumont"}] },
  { id: 2, title: "Article Beaumont 2", categories: [{slug: "election-beaumont"}] }
]
```

✅ **Passe si** : Articles avec catégorie `election-beaumont` uniquement  
❌ **Échoue si** : Articles d'autres communes ou erreur

---

## 🌐 Tests Navigation

### Test 3 : Route `/elections`

**Actions** :
1. Ouvrir `http://localhost:5173/elections`

**Vérifications** :
- [ ] Page se charge sans erreur
- [ ] Bouton hamburger (☰) visible
- [ ] Icône 🗳️ + titre "Élections" affichés
- [ ] Grille de cartes avec toutes les communes
- [ ] Clic sur une carte → redirige vers `/elections/[commune]`

✅ **Passe si** : Toutes les vérifications OK  
❌ **Échoue si** : Page 404 ou composant cassé

---

### Test 4 : Route `/elections/:commune`

**Actions** :
1. Ouvrir `http://localhost:5173/elections/beaumont`

**Vérifications** :
- [ ] Page se charge sans erreur
- [ ] Bouton hamburger (☰) visible
- [ ] Titre "Beaumont" affiché
- [ ] Breadcrumb "Élections / Beaumont"
- [ ] Articles de Beaumont uniquement
- [ ] Barre de recherche fonctionne

✅ **Passe si** : Toutes les vérifications OK  
❌ **Échoue si** : Page 404, mauvais articles ou erreur

---

### Test 5 : Menu hamburger

**Actions** :
1. Ouvrir `/elections`
2. Cliquer sur bouton ☰

**Vérifications** :
- [ ] Menu slide depuis la gauche
- [ ] Backdrop sombre visible
- [ ] Titre "Élections" dans menu
- [ ] Lien "← Toutes les élections"
- [ ] Liste des communes cliquables
- [ ] Animation fade-in progressive des items
- [ ] Clic commune → navigation + fermeture menu
- [ ] Clic backdrop → fermeture menu
- [ ] Bouton ✕ → fermeture menu

✅ **Passe si** : Toutes les vérifications OK  
❌ **Échoue si** : Menu ne s'ouvre pas ou navigation cassée

---

## 🔒 Tests Isolation

### Test 6 : Exclusion NEWS - Dropdown catégories

**Objectif** : Vérifier que les catégories élections n'apparaissent PAS dans NEWS

**Actions** :
1. Ouvrir `http://localhost:5173/news`
2. Ouvrir le dropdown "Catégories"

**Vérifications** :
- [ ] Catégories `election-*` absentes du dropdown
- [ ] Catégorie "Bannières" absente du dropdown
- [ ] Catégories normales présentes

✅ **Passe si** : Aucune catégorie `election-*` visible  
❌ **Échoue si** : Catégories élections présentes

---

### Test 7 : Exclusion NEWS - Articles

**Objectif** : Vérifier que les articles électoraux n'apparaissent PAS dans NEWS

**Actions** :
1. Ouvrir `http://localhost:5173/news`
2. Vérifier la liste d'articles

**Vérifications** :
- [ ] Aucun article avec catégorie `election-*` visible
- [ ] Seulement articles "normaux" affichés

**Actions supplémentaires** :
1. Rechercher le titre d'un article électoral dans NEWS
2. Vérifier qu'il n'apparaît pas

✅ **Passe si** : Articles électoraux totalement absents  
❌ **Échoue si** : Un article électoral apparaît dans NEWS

---

### Test 8 : Vérification logs

**Objectif** : Vérifier que l'exclusion fonctionne côté code

**Actions** :
1. Ouvrir `/news`
2. Ouvrir Console développeur (F12)
3. Chercher `[News] Excluded category IDs:`

**Vérifications** :
- [ ] Log affiche IDs des catégories exclues
- [ ] IDs contiennent au minimum : 32 (bannières) + IDs élections

**Exemple attendu** :
```
[News] Excluded category IDs: 32,45,46
```

✅ **Passe si** : IDs élections présents dans la chaîne  
❌ **Échoue si** : Seulement "32" ou log absent

---

## 🎨 Tests Styling & UX

### Test 9 : Thématisation par contexte

**Objectif** : Vérifier que les couleurs changent selon le contexte

**Actions élections** :
1. Ouvrir `/elections`
2. Inspecter élément (F12)
3. Vérifier classe `context-elections` sur conteneur

**Vérifications** :
- [ ] Variable CSS `--contextual-primary` = bleu (#0d6efd)
- [ ] Bouton hamburger bleu
- [ ] Cartes hover avec bordure bleue

**Actions événements** (si configuré) :
1. Ouvrir `/evenements`
2. Vérifier classe `context-evenements`
3. Couleur primaire = violet (#6f42c1)

✅ **Passe si** : Couleurs correctes par contexte  
❌ **Échoue si** : Toujours même couleur

---

### Test 10 : Animations menu

**Objectif** : Vérifier les animations du menu contextuel

**Actions** :
1. Ouvrir `/elections`
2. Cliquer bouton ☰

**Vérifications animations** :
- [ ] Menu slide-in fluide (0.3s)
- [ ] Items menu apparaissent progressivement (stagger)
- [ ] Hover item → background slide
- [ ] Hover lien retour → translateX(-3px)

✅ **Passe si** : Animations fluides  
❌ **Échoue si** : Saccades ou pas d'animation

---

### Test 11 : Responsive Mobile

**Objectif** : Vérifier fonctionnement sur mobile

**Actions** :
1. Ouvrir DevTools (F12)
2. Mode responsive (Ctrl+Shift+M)
3. Sélectionner iPhone/Android
4. Naviguer `/elections`

**Vérifications** :
- [ ] Menu hamburger s'affiche correctement
- [ ] Grille cartes = 1 colonne
- [ ] Menu contextuel = 80% largeur écran
- [ ] Boutons tactiles assez grands (44px min)
- [ ] Pas de scroll horizontal

✅ **Passe si** : Interface utilisable sur mobile  
❌ **Échoue si** : Éléments trop petits ou cassés

---

## 🔍 Tests Filtres & Recherche

### Test 12 : Recherche dans commune

**Objectif** : Vérifier que la recherche fonctionne

**Actions** :
1. Ouvrir `/elections/beaumont`
2. Taper "vote" dans barre recherche
3. Attendre 500ms (debounce)

**Vérifications** :
- [ ] Articles filtrés contiennent "vote"
- [ ] Articles ne contenant pas "vote" masqués
- [ ] Message si aucun résultat
- [ ] Effacer recherche → tous articles réapparaissent

✅ **Passe si** : Recherche fonctionne  
❌ **Échoue si** : Tous articles ou aucun article

---

## 🌍 Tests Accessibilité

### Test 13 : Navigation clavier

**Objectif** : Vérifier navigation au clavier

**Actions** :
1. Ouvrir `/elections`
2. Utiliser Tab pour naviguer
3. Entrée pour activer

**Vérifications** :
- [ ] Focus visible (outline) sur bouton ☰
- [ ] Tab dans menu → focus sur items
- [ ] Entrée sur item → navigation
- [ ] Échap → ferme menu (optionnel)

✅ **Passe si** : Navigation complète au clavier  
❌ **Échoue si** : Focus invisible ou bloqué

---

### Test 14 : Attributs ARIA

**Objectif** : Vérifier attributs accessibilité

**Actions** :
1. Inspecter bouton hamburger
2. Vérifier attributs

**Vérifications** :
- [ ] `aria-label="Ouvrir le menu"`
- [ ] `aria-expanded="false"` (fermé)
- [ ] `aria-expanded="true"` (ouvert)
- [ ] Menu : `aria-label="Menu Élections"`

✅ **Passe si** : Attributs ARIA présents  
❌ **Échoue si** : Attributs manquants

---

## 🚀 Tests Performance

### Test 15 : Temps de chargement

**Objectif** : Vérifier que les pages chargent rapidement

**Actions** :
1. Ouvrir Network tab (F12)
2. Rafraîchir `/elections`
3. Noter temps de chargement

**Vérifications** :
- [ ] Page interactive < 2s
- [ ] API `fetchContextualPages` < 1s
- [ ] Images lazy-load (si beaucoup d'articles)

✅ **Passe si** : Chargement < 2s  
❌ **Échoue si** : > 5s

---

## 📊 Résultats

### Tableau récapitulatif

| # | Test | Status | Notes |
|---|------|--------|-------|
| 1 | API fetchContextualPages | ⬜ |  |
| 2 | API fetchPostsByContext | ⬜ |  |
| 3 | Route /elections | ⬜ |  |
| 4 | Route /elections/:commune | ⬜ |  |
| 5 | Menu hamburger | ⬜ |  |
| 6 | Exclusion NEWS - Dropdown | ⬜ |  |
| 7 | Exclusion NEWS - Articles | ⬜ |  |
| 8 | Vérification logs | ⬜ |  |
| 9 | Thématisation contexte | ⬜ |  |
| 10 | Animations menu | ⬜ |  |
| 11 | Responsive Mobile | ⬜ |  |
| 12 | Recherche commune | ⬜ |  |
| 13 | Navigation clavier | ⬜ |  |
| 14 | Attributs ARIA | ⬜ |  |
| 15 | Temps chargement | ⬜ |  |

**Légende** : ⬜ À tester | ✅ OK | ❌ Échec

---

## 🐛 Problèmes connus

### Si tests échouent

**Test 1-2 (API)** :
- Vérifier WordPress accessible
- Vérifier ACF activé
- Vérifier catégories/pages créées

**Test 3-4 (Routes)** :
- Vérifier imports dans `router.jsx`
- Vérifier composants existent
- Console : erreurs React ?

**Test 6-7 (Exclusion NEWS)** :
- Vérifier préfixes dans `News.jsx`
- Vérifier logs console
- Catégories bien préfixées ?

**Test 9 (Thématisation)** :
- Vérifier import `contextual-theme.css`
- Vérifier classe `context-${context}` appliquée
- Inspecter variables CSS

---

## ✅ Critères de validation

**Déploiement autorisé SI** :
- ✅ Tests 1-8 : TOUS OK (fonctionnalité core)
- ✅ Tests 9-12 : Au moins 3/4 OK (UX)
- ✅ Tests 13-15 : Au moins 2/3 OK (accessibilité/perf)

**Déploiement bloqué SI** :
- ❌ Test 7 échoue (isolation NEWS cassée)
- ❌ Tests 3-4 échouent (navigation cassée)
- ❌ Plus de 5 tests échouent au total

---

**Dernière mise à jour** : 19 février 2026  
**Testeur** : _________________  
**Date test** : _________________
