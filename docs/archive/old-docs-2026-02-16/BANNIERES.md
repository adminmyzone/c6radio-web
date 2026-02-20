# 📢 Système de Bannières Publicitaires - C6Radio

## Vue d'ensemble

Système de bannières publicitaires rotatif avec préchargement des images pour des transitions fluides sans flash blanc.

## Architecture

### Fichiers principaux
- **`useBanners.js`** : Hook de gestion (chargement, rotation, préchargement)
- **`BannerAd.jsx`** : Composant d'affichage
- **`BannerAd.css`** : Styles et animations
- **`App.jsx`** : Intégration dans le layout

### Positions disponibles
- **header** : Bannière en haut de page
- **footer** : Bannière en bas de page  
- **sidebar** : Bannières latérales (desktop uniquement)

## Fonctionnement

### 1. Chargement initial
```javascript
// useBanners.js charge les bannières depuis WordPress
const banners = await fetchBanners(position);
```

### 2. Cache intelligent
- Cache de 5 minutes par position
- Évite les requêtes répétées
- Actualisation automatique après expiration

### 3. Préchargement des images
```javascript
// Toutes les images sont préchargées en mémoire
banners.forEach(banner => {
  const img = new Image();
  img.src = banner.image; // Mise en cache navigateur
});
```

### 4. Rotation automatique
- Intervalle configurable (défaut: 5-7 secondes selon position)
- Change automatiquement de bannière
- **Pas de flash blanc** grâce au préchargement

### 5. Transition fluide
```css
.banner-image {
  transition: opacity 0.6s ease-in-out;
  opacity: 1; /* Toujours visible */
}
```

## Utilisation

### Dans App.jsx
```jsx
<BannerAd
  position="header"           // Position de la bannière
  rotationInterval={6000}     // Rotation toutes les 6 secondes
  showIndicators={true}       // Afficher les dots
  height="150px"              // Hauteur fixe
/>
```

### Responsive
- **Desktop** : Header + Footer + 2 Sidebars
- **Tablette** : Header + Footer seulement
- **Mobile** : Header + Footer (hauteur adaptée)

## Optimisations clés

### Pas de flash blanc ✅
1. Images préchargées au chargement
2. État `imageLoaded` maintenu pendant rotation
3. Opacity à 0.3 (au lieu de 0) pendant chargement
4. Transition douce de 0.6 secondes

### Performance
- Cache pour éviter requêtes multiples
- Préchargement uniquement des bannières nécessaires
- Rotation désactivée si une seule bannière

## Workflow complet

```
1. Chargement page
   ↓
2. useBanners charge depuis WordPress/cache
   ↓
3. Préchargement de toutes les images
   ↓
4. Affichage première bannière (instantané)
   ↓
5. Timer de rotation démarre
   ↓
6. Changement bannière (fondu fluide)
   ↓
7. Répéter étape 6
```

## Configuration WordPress

Les bannières doivent avoir :
- **Titre** : Nom de la bannière
- **Image** : URL de l'image
- **Lien** : URL de destination (optionnel)
- **Position** : header, footer ou sidebar

## Débogage

Mode développement affiche :
```
[useBanners] Fetching banners from WordPress for position: header
[useBanners] Preloading 2 banner images...
[useBanners] Preloaded image 1/2: Banner Albireo
[useBanners] Starting banner rotation (6000ms)
```

---

**Dernière mise à jour** : 16/02/2026  
**Status** : ✅ Opérationnel sur Desktop + Mobile (iOS optimisé)
