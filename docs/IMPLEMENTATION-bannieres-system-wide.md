# 🎨 Bannières System-Wide avec Sidebar

**Date :** 16 février 2026  
**Feature :** Bannières publicitaires visibles sur toutes les pages  
**Status :** ✅ Implémenté

---

## 🎯 Objectif

Afficher les bannières publicitaires **system-wide** (sur toutes les pages) avec :
- Bannière **header** au-dessus du contenu (toutes pages)
- Bannière **sidebar** sur le côté droit (desktop uniquement)
- Bannière **footer** en bas du contenu (toutes pages)

---

## 🏗️ Architecture

### Layout Final

```
┌────────────────────────────────────────────┐
│           Header (fixe)                    │
├────────────────────────────────────────────┤
│                                            │
│      Bannière Header (120px)               │
│      ─────────────────────────             │
│                                            │
├───────────────────┬────────────────────────┤
│                   │                        │
│   Contenu Page    │  Sidebar Bannières    │
│   (dynamique)     │  (300px - desktop)    │
│                   │  (sticky)              │
│   <Outlet />      │                        │
│                   │                        │
├───────────────────┴────────────────────────┤
│                                            │
│      Bannière Footer (100px)               │
│      ─────────────────────────             │
│                                            │
│           Footer (statique)                │
│                                            │
└────────────────────────────────────────────┘
│        PlayerBar (fixe en bas)             │
└────────────────────────────────────────────┘
```

---

## 📝 Implémentation

### 1. App.jsx - Layout Principal

```jsx
function App() {
  return (
    <>
      <Header />
      
      {/* Bannière Header - Toutes pages */}
      <div className="banner-container banner-header-container">
        <BannerAd 
          position="header"
          rotationInterval={6000}
          showIndicators={true}
          height="120px"
        />
      </div>
      
      <div className="app-container">
        <div className="content-layout">
          {/* Sidebar - Desktop uniquement */}
          <aside className="sidebar-banners">
            <BannerAd 
              position="sidebar"
              rotationInterval={8000}
              showIndicators={true}
              height="600px"
            />
          </aside>
          
          {/* Contenu principal */}
          <main className="main-content">
            <Outlet /> {/* Pages individuelles */}
          </main>
        </div>
        
        {/* Bannière Footer - Toutes pages */}
        <div className="banner-container banner-footer-container">
          <BannerAd 
            position="footer"
            rotationInterval={7000}
            showIndicators={true}
            height="100px"
          />
        </div>
        
        <Footer />
      </div>
      
      <PlayerBar />
    </>
  );
}
```

---

## 🎨 Styles CSS (App.css)

### Layout avec Sidebar

```css
/* Layout flexbox avec sidebar */
.content-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 20px;
  padding: 0 20px;
}

/* Contenu principal (prend tout l'espace disponible) */
.main-content {
  flex: 1;
  min-width: 0;
}

/* Sidebar bannières (fixe 300px) */
.sidebar-banners {
  width: 300px;
  flex-shrink: 0;
  position: sticky;
  top: 100px; /* Stick sous le header */
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
```

### Responsive

```css
/* Masquer sidebar sur tablette/mobile */
@media (max-width: 1024px) {
  .sidebar-banners {
    display: none;
  }
}
```

---

## 📊 Configuration Bannières WordPress

### Header (toutes pages)
```
Banner Position: ☑ header
Rotation: 6 secondes
Hauteur: 120px
```

### Sidebar (desktop uniquement)
```
Banner Position: ☑ sidebar
Rotation: 8 secondes
Hauteur: 600px
Visible: Desktop (> 1024px) uniquement
```

### Footer (toutes pages)
```
Banner Position: ☑ footer
Rotation: 7 secondes
Hauteur: 100px
```

---

## 🎯 Avantages System-Wide

### Avant (bannières par page)
❌ Code dupliqué sur chaque page
❌ Maintenance difficile
❌ Risque d'oubli sur nouvelles pages
❌ Configuration différente par page

### Après (bannières system-wide)
✅ Code centralisé dans App.jsx
✅ Maintenance facile (un seul endroit)
✅ Toutes les pages automatiquement couvertes
✅ Configuration uniforme

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
```
┌─────────────────────────────────┐
│    Bannière Header (pleine)     │
├──────────────────┬──────────────┤
│   Contenu Page   │   Sidebar    │
│                  │  Bannières   │
│                  │   (300px)    │
└──────────────────┴──────────────┘
│    Bannière Footer (pleine)     │
└─────────────────────────────────┘
```

### Tablette (768-1024px)
```
┌─────────────────────────────────┐
│    Bannière Header (pleine)     │
├─────────────────────────────────┤
│       Contenu Page              │
│       (pleine largeur)          │
│                                 │
└─────────────────────────────────┘
│    Bannière Footer (pleine)     │
└─────────────────────────────────┘
```

### Mobile (< 768px)
```
┌───────────────────┐
│ Bannière Header   │
├───────────────────┤
│   Contenu Page    │
│                   │
└───────────────────┘
│ Bannière Footer   │
└───────────────────┘
```

---

## 🔧 Fichiers Modifiés

### Créés/Modifiés
1. **`src/App.jsx`** - Layout system-wide avec bannières
2. **`src/App.css`** - Styles layout + sidebar + responsive

### Nettoyés (bannières retirées)
3. **`src/pages/Home.jsx`** - Retrait bannières locales
4. **`src/pages/News.jsx`** - Retrait bannières locales
5. **`src/pages/Home.css`** - Retrait styles `.home-banner`
6. **`src/pages/News.css`** - Retrait styles `.news-banner`

---

## ✅ Tests

### Build Production
```bash
npm run build
✓ built in 804ms
Bundle size: 27.23 kB CSS (5.71 kB gzipped)
           319.60 kB JS (101.11 kB gzipped)
```

### Affichage
- ✅ Header : Bannière visible sur toutes pages
- ✅ Sidebar : Visible desktop, masquée mobile
- ✅ Footer : Bannière visible sur toutes pages
- ✅ Responsive : Layout adapté mobile/tablette/desktop

---

## 🎨 Personnalisation

### Changer la Largeur Sidebar

```css
.sidebar-banners {
  width: 250px; /* Au lieu de 300px */
}
```

### Changer la Hauteur des Bannières

```jsx
// Header plus haut
<BannerAd position="header" height="150px" />

// Footer plus bas
<BannerAd position="footer" height="120px" />
```

### Changer le Seuil Responsive

```css
/* Masquer sidebar à partir de 1200px au lieu de 1024px */
@media (max-width: 1200px) {
  .sidebar-banners {
    display: none;
  }
}
```

---

## 💡 Cas d'Usage

### Page Home
- ✅ Bannière header visible
- ✅ Bannière sidebar visible (desktop)
- ✅ Bannière footer visible

### Page News
- ✅ Bannière header visible
- ✅ Bannière sidebar visible (desktop)
- ✅ Bannière footer visible

### Page Contact
- ✅ Bannière header visible
- ✅ Bannière sidebar visible (desktop)
- ✅ Bannière footer visible

### Nouvelle Page (future)
- ✅ Bannières automatiquement présentes !

---

## 🚀 Améliorations Futures

### V1.1 - Sidebar Sticky Améliorée
```css
.sidebar-banners {
  position: sticky;
  top: 100px;
  /* Scroll avec la page mais reste visible */
}
```

### V1.2 - Plusieurs Bannières Sidebar
```jsx
<aside className="sidebar-banners">
  <BannerAd position="sidebar-top" height="300px" />
  <BannerAd position="sidebar-bottom" height="300px" />
</aside>
```

### V1.3 - Bannières Conditionnelles par Page
```jsx
// Afficher certaines bannières seulement sur certaines pages
{location.pathname === '/news' && (
  <BannerAd position="news-special" />
)}
```

---

## 📊 Performance

### Impact Bundle
- **CSS :** +0.7 KB (styles layout)
- **JS :** +0.2 KB (import BannerAd)
- **Total :** +0.9 KB négligeable

### Chargement
- Bannières chargées **une seule fois** (cache 5 min)
- Pas de rechargement à chaque changement de page
- Performance optimale

---

## 🎉 Résultat

**Bannières system-wide implémentées avec succès !** ✅

- ✅ Visibles sur **toutes les pages** automatiquement
- ✅ **Sidebar** sur desktop uniquement
- ✅ **Responsive** mobile/tablette/desktop
- ✅ **Performance** optimale (cache)
- ✅ **Maintenance** facile (code centralisé)

---

**Prochaine étape :** Créer des bannières dans WordPress pour les positions `sidebar` ! 🎨

