# Plan d'implémentation - Sections thématiques contextuelles

## 🎯 Objectif

Créer un système flexible permettant de gérer des **sections thématiques contextuelles** (élections municipales, événements spéciaux, etc.) avec :
- Navigation par sous-catégories (communes, quartiers, thèmes...)
- Isolation des contenus (n'apparaissent pas dans NEWS global)
- Réutilisabilité pour d'autres contextes futurs
- Interface inspirée de la page News existante

## 📋 Cas d'usage prioritaire

**Élections municipales** : 
- Section `/elections` avec menu de navigation par commune
- Chaque commune = page dédiée avec ses articles
- Articles catégorisés par commune, exclus de NEWS global

## 🏗️ Architecture technique

### Principes de conception

**1. Généricité via champ ACF WordPress**
- Nouveau champ ACF `context_section` sur les pages WordPress
- Valeurs possibles : `null` (menu normal), `"elections"`, `"evenements"`, etc.
- Les pages avec `context_section` non-null sont des "pages contextuelles"

**2. Catégories avec préfixe**
- Convention de nommage : `election-[commune]` (ex: `election-beaumont`, `election-clermont`)
- Permet d'isoler facilement les articles contextuels
- Reste flexible pour autres contextes : `event-[nom]`, `quartier-[nom]`, etc.

**3. Routes dynamiques**
- Route principale : `/elections` (liste ou page d'accueil)
- Routes par sous-catégorie : `/elections/beaumont`, `/elections/clermont`
- Générique : `/:context/:subcategory`

### Structure de données

**WordPress - Configuration des pages contextuelles :**
```
Page "Beaumont" :
  - show_in_menu: false (n'apparaît PAS dans menu principal)
  - context_section: "elections" (NOUVEAU CHAMP ACF)
  - parent: 0 ou Page "Elections" parente (optionnel)
  
Articles de Beaumont :
  - Catégorie: "election-beaumont"
  - Exclus du flux NEWS global via filtre
```

**API WordPress - Nouvelles fonctions :**
```javascript
fetchContextualPages(context)
  → Récupère pages avec context_section = "elections"
  → Retourne liste des communes/sous-sections
  
fetchPostsByContext(context, subcategory)
  → Récupère articles avec catégorie "election-[commune]"
  → Même format que fetchPosts() actuel
```

## ✅ Todos d'implémentation

### Phase 1 : Backend WordPress & API ✅ TERMINÉE

**todo-1-acf-field** : Créer champ ACF `context_section` ✅
- ✅ Documentation créée : `docs/ACF-CONTEXTUAL-SECTIONS.md`
- ✅ Guide configuration ACF complet (champ select, valeurs, règles)
- ✅ Export PHP pour développeurs inclus

**todo-2-api-contextual-pages** : Fonction `fetchContextualPages()` ✅
- ✅ Ajouté dans `src/services/wordpress.js` (ligne ~702)
- ✅ Récupère pages avec `acf.context_section = context`
- ✅ Retourne `{id, slug, title, context}`, tri alphabétique
- ✅ Timeout 10s, gestion erreurs

**todo-3-api-contextual-posts** : Fonction `fetchPostsByContext()` ✅
- ✅ Ajouté dans `src/services/wordpress.js` (ligne ~768)
- ✅ Récupère posts via catégorie `context-subcategory`
- ✅ Réutilise `fetchPosts()` existante (recherche, pagination)
- ✅ Exclut automatiquement bannières (ID 32)

**todo-4-categories-convention** : Documenter convention de nommage ✅
- ✅ Guide éditeur créé : `docs/CONTEXTUAL-SECTIONS.md`
- ✅ Exemples complets : élections, événements, quartiers
- ✅ Workflow étape par étape, pièges à éviter
- ✅ Procédures WordPress détaillées

### Phase 2 : Composants React réutilisables ✅ TERMINÉE

**todo-5-contextual-menu** : Composant `ContextualMenu.jsx` ✅
- ✅ Créé : `src/components/ContextualMenu.jsx` + `.css`
- ✅ Menu slide-in gauche avec backdrop, icônes par contexte
- ✅ Props : `context`, `pages`, `isOpen`, `onClose`
- ✅ Navigation + lien retour section, états active
- ✅ Responsive, accessibilité (ARIA, focus-visible)

**todo-6-contextual-page** : Composant `ContextualPage.jsx` ✅
- ✅ Créé : `src/pages/ContextualPage.jsx` + `.css`
- ✅ Hook custom : `src/hooks/useContextualPosts.js`
- ✅ Affichage articles avec breadcrumb, recherche, menu hamburger
- ✅ Réutilise `NewsCard`, `NewsFilters` existants
- ✅ Grid responsive, états loading/error/empty

**todo-7-contextual-home** : Composant `ContextualHome.jsx` ✅
- ✅ Créé : `src/pages/ContextualHome.jsx` + `.css`
- ✅ Liste sous-sections en grille de cartes cliquables
- ✅ Icônes + descriptions par contexte (élections, événements, etc.)
- ✅ Menu hamburger intégré
- ✅ Hover effects, responsive, accessibilité

### Phase 3 : Routing & Navigation ✅ TERMINÉE

**todo-8-routes** : Ajouter routes dans `router.jsx` ✅
- ✅ Modifié : `src/router.jsx`
- ✅ Routes ajoutées : `/elections` → ContextualHome
- ✅ Routes ajoutées : `/elections/:subcategory` → ContextualPage
- ✅ Routes ajoutées : `/evenements` et `/evenements/:subcategory` (bonus)
- ✅ Ordre correct : routes spécifiques AVANT catch-all `/:slug`

**todo-9-header-menu** : Intégrer lien "Élections" dans Header ✅
- ✅ Modifié : `src/components/Header.jsx` + `.css`
- ✅ Lien "Élections" avec icône 🗳️ dans menu principal
- ✅ Classe spéciale `.nav-link-elections` avec bordure distinctive
- ✅ Hover effects et styles responsive

**todo-10-news-exclusion** : Exclure articles contextuels de NEWS ✅
- ✅ Modifié : `src/pages/News.jsx`
- ✅ Détection automatique catégories contextuelles (préfixes: election-, event-, etc.)
- ✅ Construction dynamique liste IDs à exclure
- ✅ Exclusion du dropdown + des résultats d'articles
- ✅ Logging pour debugging

### Phase 4 : Styling & UX ✅ TERMINÉE

**todo-11-contextual-css** : Styles sections contextuelles ✅
- ✅ Créé : `src/styles/contextual-theme.css`
- ✅ Variables CSS par contexte (élections, événements, quartiers, sports)
- ✅ Couleurs adaptables : primary, hover, light, border
- ✅ Classes utilitaires réutilisables (buttons, badges, cards, links)
- ✅ Intégration dans ContextualHome, ContextualPage via `context-${context}`
- ✅ Support dark mode (prefers-color-scheme)

**todo-12-menu-animation** : Animation menu contextuel ✅
- ✅ Modifié : `src/components/ContextualMenu.css`
- ✅ Animation fade-in staggered pour items menu (delay progressif)
- ✅ Effet hover avec background animé (::before pseudo-element)
- ✅ Animation slide pour lien retour (translateX)
- ✅ Transitions fluides sur tous les états
- ✅ Support prefers-reduced-motion

### Phase 5 : Documentation & Tests ✅ TERMINÉE

**todo-13-editorial-guide** : Guide éditorial WordPress ✅
- ✅ Créé : `docs/GUIDE-EDITORIAL-ELECTIONS.md`
- ✅ Guide pratique pour équipe éditoriale (non-technique)
- ✅ Procédures : créer catégorie, créer page commune, publier article
- ✅ FAQ avec 8 questions fréquentes
- ✅ Schéma visuel WordPress → Site web
- ✅ Checklist vérification

**todo-14-test-integration** : Tests d'intégration ✅
- ✅ Créé : `docs/TESTS-INTEGRATION-ELECTIONS.md`
- ✅ 15 tests complets : API, navigation, isolation, styling, accessibilité
- ✅ Instructions détaillées pour chaque test
- ✅ Résultats attendus + critères validation
- ✅ Tableau récapitulatif + critères de déploiement
- ✅ Debugging si tests échouent

**todo-15-deploy-doc** : Documentation déploiement ✅
- ✅ Créé : `docs/DEPLOIEMENT-ELECTIONS.md`
- ✅ Checklist déploiement en 3 phases (WordPress, React, Validation)
- ✅ Procédures ACF, catégories, pages en production
- ✅ Plan de rollback (3 options selon gravité)
- ✅ Monitoring post-déploiement
- ✅ Métriques performance à surveiller

## 🔄 Dépendances entre todos

```
todo-1-acf-field
    ↓
todo-2-api-contextual-pages, todo-4-categories-convention
    ↓
todo-3-api-contextual-posts
    ↓
todo-5-contextual-menu, todo-6-contextual-page, todo-7-contextual-home
    ↓
todo-8-routes, todo-9-header-menu, todo-10-news-exclusion
    ↓
todo-11-contextual-css, todo-12-menu-animation
    ↓
todo-13-editorial-guide, todo-14-test-integration, todo-15-deploy-doc
```

## 📝 Notes techniques

### Évolutivité future

**Autres contextes possibles :**
- `/evenements/festival-2026` - Festival annuel
- `/quartiers/centre-ville` - Actualités par quartier
- `/sports/equipe-locale` - Suivi équipe sportive

**Paramétrage avancé (V2) :**
- Champ ACF `context_color` pour thème personnalisé
- Champ ACF `context_icon` pour icône menu
- Page parent pour hiérarchie complexe

### Points d'attention

1. **Performance** : Utiliser cache localStorage comme pour NEWS
2. **SEO** : Meta tags spécifiques par commune (OpenGraph)
3. **Accessibilité** : Navigation clavier dans menu contextuel
4. **Mobile** : Menu hamburger prioritaire sur petit écran

### Alternatives considérées

❌ **Taxonomie custom WordPress** : Trop complexe, ACF + catégories suffisent
❌ **Custom Post Type** : Pas nécessaire, ce sont des posts normaux
✅ **Champ ACF + convention catégories** : Simple, flexible, évolutif

## 🚀 Prêt à démarrer

Approche recommandée :
1. Commencer par Phase 1 (backend/API) - fondations solides
2. Phase 2 (composants) - construction modulaire
3. Phase 3 (routing) - intégration dans l'app
4. Phase 4-5 (polish + doc) - finitions

Ce plan permet de tester progressivement sans casser l'existant.
