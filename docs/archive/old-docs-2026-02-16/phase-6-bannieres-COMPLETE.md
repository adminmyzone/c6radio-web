# 📢 Phase 6 - Bannières Publicitaires - GUIDE COMPLET

**Date de création :** 16 février 2026  
**Status :** ✅ IMPLÉMENTÉ  
**Durée d'implémentation :** ~2 heures

---

## 🎯 Objectif

Implémenter un système de bannières publicitaires géré via WordPress avec rotation automatique, permettant à l'équipe éditoriale de gérer les publicités sans intervention technique.

---

## ✅ Ce Qui a Été Implémenté

### 1. Service WordPress - Fetch Bannières

**Fichier :** `src/services/wordpress.js`

**Fonction :** `fetchBanners(position)`

**Description :**
Récupère les bannières depuis WordPress via l'API REST.

**Paramètres :**
- `position` : Filtre par position (header, footer, sidebar, all)

**Retour :**
```javascript
[
  {
    id: 123,
    title: "Bannière Partenaire X",
    image: "https://wordpress.com/wp-content/uploads/banner.jpg",
    link: "https://partenaire.com",
    position: "header",
    order: 1
  }
]
```

**Champs ACF WordPress requis :**
- `banner_image` : Image de la bannière (image/URL/ID)
- `banner_link` : Lien de destination (URL, optionnel)
- `banner_position` : Position (header/footer/sidebar/all)
- `banner_active` : Activer/désactiver (true/false)
- `banner_order` : Ordre d'affichage (nombre)

---

### 2. Hook useBanners

**Fichier :** `src/hooks/useBanners.js`

**Description :**
Hook React qui gère :
- Le chargement des bannières depuis WordPress
- La rotation automatique
- Le cache local (5 minutes)
- Les états loading/error

**Utilisation :**
```jsx
const { 
  currentBanner,    // Bannière actuellement affichée
  banners,          // Toutes les bannières
  currentIndex,     // Index courant
  isLoading,        // État de chargement
  error,            // Erreur éventuelle
  hasBanners,       // Boolean : y a-t-il des bannières ?
  nextBanner,       // Fonction : bannière suivante
  previousBanner,   // Fonction : bannière précédente
  goToBanner,       // Fonction : aller à un index
  refresh           // Fonction : rafraîchir les bannières
} = useBanners('header', 5000);
```

**Paramètres :**
- `position` : Position des bannières (défaut: 'all')
- `rotationInterval` : Intervalle de rotation en ms (défaut: 5000)

**Features :**
- ✅ Cache localStorage (5 minutes)
- ✅ Rotation automatique
- ✅ Gestion états loading/error
- ✅ Contrôles manuels (next/prev/goto)

---

### 3. Composant BannerAd

**Fichier :** `src/components/BannerAd.jsx`

**Description :**
Composant React pour afficher une bannière avec rotation automatique.

**Props :**
```jsx
<BannerAd 
  position="header"           // Position des bannières
  rotationInterval={5000}     // Rotation toutes les 5s
  showControls={false}        // Boutons prev/next
  showIndicators={true}       // Dots de pagination
  className="custom-class"    // Classes CSS additionnelles
  height="auto"               // Hauteur de la bannière
/>
```

**Features :**
- ✅ Animation de transition fluide
- ✅ Lien cliquable (nouvel onglet)
- ✅ Indicateurs de pagination (dots)
- ✅ Contrôles navigation optionnels
- ✅ État loading avec shimmer effect
- ✅ Lazy loading des images
- ✅ Responsive mobile

**Styles :** `src/components/BannerAd.css`

---

### 4. Intégration dans l'Application

**Pages intégrées :**

#### Page Home (`src/pages/Home.jsx`)
```jsx
<BannerAd 
  position="header" 
  rotationInterval={6000}
  showIndicators={true}
  className="home-banner"
  height="150px"
/>
```

#### Page News (`src/pages/News.jsx`)
```jsx
<BannerAd 
  position="header" 
  rotationInterval={7000}
  showIndicators={true}
  className="news-banner"
  height="120px"
/>
```

**Styles associés :**
- `src/pages/Home.css` : Style `.home-banner`
- `src/pages/News.css` : Style `.news-banner`

---

## 🔧 Configuration WordPress

### Étape 1 : Créer les Champs ACF

Dans WordPress Admin :

1. **Aller dans ACF > Groupes de champs**
2. **Créer un nouveau groupe : "Bannières Publicitaires"**
3. **Ajouter les champs suivants :**

**Champ 1 : banner_image**
- Type : Image
- Nom : `banner_image`
- Label : Image de la bannière
- Format de retour : URL de l'image
- Requis : Oui

**Champ 2 : banner_link**
- Type : URL
- Nom : `banner_link`
- Label : Lien de destination
- Format : URL
- Requis : Non

**Champ 3 : banner_position**
- Type : Select
- Nom : `banner_position`
- Label : Position
- Choix :
  - `header` : Header
  - `footer` : Footer
  - `sidebar` : Sidebar
  - `all` : Toutes les positions
- Valeur par défaut : `all`
- Requis : Oui

**Champ 4 : banner_active**
- Type : True/False
- Nom : `banner_active`
- Label : Activer la bannière
- Valeur par défaut : True
- Requis : Non

**Champ 5 : banner_order**
- Type : Number
- Nom : `banner_order`
- Label : Ordre d'affichage
- Min : 0
- Max : 999
- Valeur par défaut : 0
- Requis : Non

4. **Règles d'affichage :**
   - Type de post = Post
   - OU Catégorie = Bannières (créer une catégorie "Bannières")

---

### Étape 2 : Créer des Bannières dans WordPress

1. **Créer une nouvelle catégorie "Bannières"**
   - Articles > Catégories > Ajouter
   - Nom : Bannières
   - Slug : bannieres

2. **Créer un nouvel article bannière**
   - Articles > Ajouter
   - Titre : "Bannière Partenaire X"
   - Catégorie : Bannières
   - Remplir les champs ACF :
     - Image : Uploader l'image (recommandé : 1200x200px)
     - Lien : https://partenaire.com
     - Position : header
     - Activer : Oui
     - Ordre : 1
   - Publier

3. **Répéter pour chaque bannière**

---

### Étape 3 : Tester l'Affichage

1. **Vérifier l'API WordPress**
   ```bash
   curl https://votre-site.com/wp-json/wp/v2/posts?categories=ID_CATEGORIE_BANNIERES
   ```

2. **Vérifier dans l'app**
   - Ouvrir la page Home ou News
   - La bannière devrait s'afficher
   - Vérifier la rotation automatique (si plusieurs bannières)

---

## 📊 Architecture Technique

### Flux de Données

```
WordPress CMS
    ↓ (API REST)
fetchBanners()
    ↓ (fetch + filter)
useBanners() hook
    ↓ (state + rotation)
BannerAd component
    ↓ (render)
Page (Home, News, etc.)
```

### Cache Strategy

**Cache local (Map) :**
- Durée : 5 minutes
- Clé : `position` (header, footer, etc.)
- Invalidation : Automatique après 5 min ou `refresh()`

**Avantages :**
- ✅ Réduit les appels API
- ✅ Améliore les performances
- ✅ Expérience utilisateur fluide

---

## 🎨 Personnalisation

### Modifier l'Intervalle de Rotation

**Par défaut :** 5 secondes

**Changer globalement :**
```jsx
// Dans useBanners.js, modifier la valeur par défaut
export function useBanners(position = 'all', rotationInterval = 8000) {
  // ...
}
```

**Changer par page :**
```jsx
<BannerAd position="header" rotationInterval={10000} />
```

---

### Ajouter des Styles Personnalisés

**Modifier les couleurs :**
```css
/* Dans BannerAd.css */
.banner-indicator.active {
  background: #ff6b35; /* Votre couleur */
}
```

**Modifier la hauteur par défaut :**
```jsx
<BannerAd height="200px" />
```

---

### Ajouter des Contrôles de Navigation

**Afficher les boutons prev/next :**
```jsx
<BannerAd 
  position="header" 
  showControls={true}  /* ← Activer les contrôles */
/>
```

---

### Désactiver les Indicateurs

```jsx
<BannerAd 
  position="header" 
  showIndicators={false}  /* ← Masquer les dots */
/>
```

---

## 🧪 Tests

### Test 1 : Aucune Bannière

**Objectif :** Vérifier que le composant ne s'affiche pas si aucune bannière.

**Procédure :**
1. Désactiver toutes les bannières dans WordPress
2. Recharger la page
3. Vérifier qu'aucun container `.banner-ad` n'apparaît

**Résultat attendu :** ✅ Aucun affichage

---

### Test 2 : Une Seule Bannière

**Objectif :** Vérifier l'affichage d'une bannière unique.

**Procédure :**
1. Activer une seule bannière dans WordPress
2. Recharger la page
3. Vérifier l'affichage

**Résultat attendu :**
- ✅ Bannière affichée
- ✅ Pas de rotation
- ✅ Pas d'indicateurs (dots)
- ✅ Image chargée avec lazy loading

---

### Test 3 : Plusieurs Bannières avec Rotation

**Objectif :** Vérifier la rotation automatique.

**Procédure :**
1. Activer 3+ bannières dans WordPress
2. Recharger la page
3. Attendre 5-7 secondes

**Résultat attendu :**
- ✅ Première bannière affichée au démarrage
- ✅ Rotation automatique après intervalle
- ✅ Indicateurs (dots) visibles
- ✅ Dot actif change avec la bannière
- ✅ Cycle infini (retour au début après la dernière)

---

### Test 4 : Clic sur Bannière

**Objectif :** Vérifier le lien cliquable.

**Procédure :**
1. Cliquer sur une bannière avec lien
2. Vérifier l'ouverture

**Résultat attendu :**
- ✅ Lien s'ouvre dans nouvel onglet
- ✅ `rel="noopener noreferrer"` appliqué (sécurité)

---

### Test 5 : Bannière Sans Lien

**Objectif :** Vérifier qu'une bannière sans lien ne fait rien.

**Procédure :**
1. Créer une bannière sans lien dans WordPress
2. Cliquer dessus

**Résultat attendu :**
- ✅ Aucune action
- ✅ Pas de navigation

---

### Test 6 : Cache Fonctionnel

**Objectif :** Vérifier que le cache évite les requêtes répétées.

**Procédure :**
1. Ouvrir DevTools > Network
2. Charger la page (1ère requête API visible)
3. Naviguer vers une autre page
4. Revenir à la page avec bannière (< 5 min)

**Résultat attendu :**
- ✅ 1ère fois : Requête API visible
- ✅ 2ème fois : Pas de requête (cache utilisé)
- ✅ Après 5 min : Nouvelle requête API

---

### Test 7 : Responsive Mobile

**Objectif :** Vérifier l'affichage mobile.

**Procédure :**
1. Ouvrir DevTools > Responsive mode
2. Tester sur iPhone, iPad
3. Vérifier les indicateurs et contrôles

**Résultat attendu :**
- ✅ Bannière s'adapte à la largeur
- ✅ Indicateurs visibles et proportionnels
- ✅ Contrôles masqués sur mobile (si showControls=false)

---

## 🐛 Dépannage

### Problème : Aucune Bannière n'Apparaît

**Causes possibles :**
1. Aucune bannière active dans WordPress
2. Champs ACF mal configurés
3. Catégorie "Bannières" non assignée
4. API WordPress inaccessible

**Solutions :**
```bash
# Vérifier l'API WordPress
curl https://votre-site.com/wp-json/wp/v2/posts

# Vérifier les logs dans la console
# Filtrer par "[useBanners]" ou "[WordPress API]"
```

---

### Problème : Rotation Ne Fonctionne Pas

**Causes possibles :**
1. Une seule bannière (rotation désactivée)
2. Intervalle trop long
3. Bug JavaScript

**Solutions :**
1. Vérifier qu'il y a 2+ bannières actives
2. Réduire `rotationInterval` pour tester
3. Vérifier console pour erreurs JS

---

### Problème : Images Ne Se Chargent Pas

**Causes possibles :**
1. URL image incorrecte dans WordPress
2. CORS bloqué
3. Problème réseau

**Solutions :**
```javascript
// Vérifier les URLs dans la console
console.log('Banner image:', banner.image);

// Tester l'URL directement dans le navigateur
```

---

### Problème : Cache Trop Agressif

**Solution : Invalider manuellement**

```javascript
// Dans la console du navigateur
localStorage.clear();

// Ou utiliser refresh() dans le hook
const { refresh } = useBanners('header');
refresh(); // Force un rechargement
```

---

## 📈 Améliorations Futures

### V1.1 - Analytics

**Objectif :** Tracker les clics sur bannières

```javascript
// Dans BannerAd.jsx
const handleClick = (e) => {
  // Envoyer event à Google Analytics
  gtag('event', 'banner_click', {
    banner_id: currentBanner.id,
    banner_title: currentBanner.title,
    banner_link: currentBanner.link,
  });
};
```

---

### V1.2 - A/B Testing

**Objectif :** Tester plusieurs variantes de bannières

```javascript
// Ajouter un champ ACF "banner_variant"
// Randomiser l'affichage
// Tracker les performances
```

---

### V1.3 - Bannières Dynamiques par Page

**Objectif :** Afficher bannières spécifiques selon la page

```javascript
// Ajouter champ ACF "banner_pages"
// Filtrer par page courante dans fetchBanners()
```

---

### V1.4 - Lazy Load Avancé

**Objectif :** Charger bannières uniquement quand visibles

```javascript
// Utiliser IntersectionObserver
// Charger image uniquement quand banner visible
```

---

## 📝 Checklist Déploiement

- [ ] Champs ACF créés dans WordPress
- [ ] Catégorie "Bannières" créée
- [ ] Au moins 2 bannières test créées
- [ ] API WordPress accessible
- [ ] Cache fonctionnel (tester 2x chargement)
- [ ] Rotation testée (attendre 10s)
- [ ] Liens cliquables testés
- [ ] Responsive mobile testé (iPhone, iPad)
- [ ] Console propre (pas d'erreurs)
- [ ] Performance Lighthouse > 90

---

## 🎉 Résumé

**Phase 6 : Bannières Publicitaires** ✅ COMPLÈTE

**Fichiers créés :**
- `src/services/wordpress.js` : Fonction `fetchBanners()`
- `src/hooks/useBanners.js` : Hook de gestion (185 lignes)
- `src/components/BannerAd.jsx` : Composant (170 lignes)
- `src/components/BannerAd.css` : Styles (250 lignes)

**Fichiers modifiés :**
- `src/pages/Home.jsx` : Ajout bannière
- `src/pages/Home.css` : Styles bannière
- `src/pages/News.jsx` : Ajout bannière
- `src/pages/News.css` : Styles bannière

**Total :** ~700 lignes de code

**Features :**
- ✅ Chargement depuis WordPress API
- ✅ Rotation automatique configurable
- ✅ Cache local (5 minutes)
- ✅ Indicateurs de pagination
- ✅ Contrôles navigation optionnels
- ✅ Lazy loading images
- ✅ Responsive mobile
- ✅ Liens cliquables sécurisés
- ✅ États loading/error gérés
- ✅ Animation fluide

**Prochaine étape :** Phase 7 - Polish & Tests, ou Phase 8 - Mobile Native

---

**Bravo ! Les bannières publicitaires sont maintenant opérationnelles ! 🎉**

