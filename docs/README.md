# 📻 C6Radio - Documentation Projet

**Dernière mise à jour :** 16 février 2026  
**Version :** 1.0  
**Statut :** ✅ Production Ready

---

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build
```

**URL :** https://exp937.fr  
**App iOS :** TestFlight (en cours)

---

## 📱 Stack Technique

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool rapide
- **React Router** - Navigation SPA
- **CSS moderne** - Responsive design

### Backend
- **WordPress REST API** - CMS headless
- **ACF (Advanced Custom Fields)** - Champs personnalisés
- **Libretime API** - Métadonnées radio en direct

### Mobile
- **Capacitor** - Wrapper natif iOS/Android
- **TestFlight** - Distribution beta iOS

---

## ✅ Fonctionnalités Actuelles

### 🎵 Audio Player
- ✅ Lecture du stream radio en direct
- ✅ Affichage métadonnées en temps réel (artiste, titre)
- ✅ Contrôles natifs iOS (Media Session API)
- ✅ Reconnexion automatique en cas de perte réseau
- ✅ Gestion globale : un seul audio à la fois

### 📰 Actualités WordPress
- ✅ Liste des articles avec pagination
- ✅ Page détail article (HTML WordPress)
- ✅ Images featured
- ✅ Catégories et tags
- ✅ Date de publication

### 🎙️ Podcasts
- ✅ Lecture MP3 intégrée aux articles
- ✅ Barre de progression
- ✅ Contrôles lecture/pause
- ✅ Intégration GlobalAudioContext

### 📢 Bannières Publicitaires
- ✅ Rotation automatique multi-positions
- ✅ Préchargement des images (pas de flash)
- ✅ Gestion WordPress (header, footer, sidebar)
- ✅ Responsive desktop/mobile

### 🧭 Navigation
- ✅ Menu dynamique depuis WordPress
- ✅ Pages personnalisées
- ✅ Header/Footer responsive
- ✅ Menu mobile hamburger

### 📱 Mobile iOS
- ✅ App native Capacitor
- ✅ Safe areas iOS (notch, home indicator)
- ✅ Distribution TestFlight
- ✅ Icônes et splash screens

---

## 📚 Documentation par Phase

Chaque phase du projet est documentée dans un fichier dédié :

| Phase | Fichier | Description | Status |
|-------|---------|-------------|--------|
| **Phase 1** | [PHASE-1-audio-player.md](PHASE-1-audio-player.md) | Player audio + streaming | ✅ Complété |
| **Phase 2** | [PHASE-2-wordpress-api.md](PHASE-2-wordpress-api.md) | Connexion WordPress | ✅ Complété |
| **Phase 3** | [PHASE-3-navigation.md](PHASE-3-navigation.md) | Navigation dynamique | ✅ Complété |
| **Phase 4** | [PHASE-4-actualites.md](PHASE-4-actualites.md) | Articles WordPress | ✅ Complété |
| **Phase 5** | [PHASE-5-podcasts.md](PHASE-5-podcasts.md) | Podcasts MP3 | ✅ Complété |
| **Phase 6** | [PHASE-6-bannieres.md](PHASE-6-bannieres.md) | Bannières publicitaires | ✅ Complété |
| **Phase 7** | [PHASE-7-mobile-ios.md](PHASE-7-mobile-ios.md) | Application iOS | ✅ Complété |

---

## 🏗️ Architecture Globale

### Structure du Projet

```
c6radio-web/
├── src/
│   ├── components/        # Composants React
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PlayerBar.jsx
│   │   ├── BannerAd.jsx
│   │   └── ...
│   ├── contexts/          # React Contexts
│   │   └── GlobalAudioContext.jsx
│   ├── hooks/             # Custom Hooks
│   │   ├── useAudioPlayer.js
│   │   ├── useNowPlaying.js
│   │   └── useBanners.js
│   ├── services/          # Services métier
│   │   ├── audioPlayer.js
│   │   ├── wordpress.js
│   │   ├── nowPlaying.js
│   │   ├── reconnectionManager.js
│   │   └── mediaSession.js
│   ├── pages/             # Pages React Router
│   │   ├── Home.jsx
│   │   ├── News.jsx
│   │   └── NewsDetail.jsx
│   └── lib/               # Utilitaires
│       └── logger.js
├── public/                # Assets statiques
├── ios/                   # App Capacitor iOS
└── docs/                  # Documentation
```

### Principes Architecturaux

**Séparation des responsabilités :**
- **Components** : UI pure (affichage)
- **Hooks** : Logique React (état, effets)
- **Services** : Logique métier (API, audio)
- **Contexts** : État global partagé

**Gestion de l'audio :**
- Un seul `GlobalAudioContext` pour toute l'app
- **Règle d'or** : Un seul audio actif à la fois
- Arrêt automatique du stream si podcast lance
- Arrêt automatique du podcast si stream lance

**Performance :**
- Lazy loading des images
- Cache des données WordPress (5 min)
- Préchargement des bannières
- Debouncing des requêtes API

---

## 🔧 Configuration Requise

### WordPress

**Plugins requis :**
- Advanced Custom Fields (ACF) PRO
- WP REST API (natif WordPress)

**Champs ACF nécessaires :**
- `c6_podcast_audio` : URL MP3 pour podcasts
- `banner_image` : Image bannière
- `banner_link` : Lien bannière
- `banner_position` : Position (header/footer/sidebar)
- `banner_active` : Activation bannière
- `banner_order` : Ordre affichage

**Custom Post Types :**
- `page` : Pages menu navigation
- `post` : Articles actualités
- `banner` : Bannières publicitaires (si utilisé)

### Libretime

**API endpoint :** `https://c6radio.zapto.org:8443/api/live-info-v2`

**Format réponse :**
```json
{
  "currentShow": {
    "name": "Nom de l'émission"
  },
  "tracks": {
    "current": {
      "name": "Titre - Artiste"
    }
  }
}
```

---

## 🧪 Tests

### Tests Manuels Recommandés

**Audio Player :**
- [ ] Stream lance et s'arrête correctement
- [ ] Métadonnées s'affichent
- [ ] Reconnexion fonctionne après perte réseau
- [ ] Contrôles natifs iOS fonctionnent

**Podcasts :**
- [ ] MP3 se charge
- [ ] Barre de progression fonctionne
- [ ] Stream s'arrête quand podcast lance
- [ ] Podcast s'arrête quand stream lance

**Bannières :**
- [ ] Rotation automatique fluide
- [ ] Pas de flash blanc
- [ ] Clics fonctionnent
- [ ] Responsive sur mobile

**Navigation :**
- [ ] Menu charge depuis WordPress
- [ ] Routes fonctionnent
- [ ] Menu mobile responsive

**iOS :**
- [ ] Safe areas respectées
- [ ] Header/PlayerBar taille fixe
- [ ] App fonctionne hors ligne (cache)

---

## 🚀 Déploiement

### Build Production

```bash
# 1. Build
npm run build

# 2. Tester en local
npm run preview

# 3. Upload dist/ sur serveur
```

### Déploiement iOS

```bash
# 1. Build web
npm run build

# 2. Sync Capacitor
npx cap sync ios

# 3. Ouvrir Xcode
npx cap open ios

# 4. Build depuis Xcode
# Archive → Distribute → TestFlight
```

**Workflow GitHub Actions :**
- `.github/workflows/ios-build.yml` automatise le build
- Secrets GitHub configurés
- Distribution automatique TestFlight

---

## 🐛 Troubleshooting

### Audio ne se lance pas
- Vérifier URL stream : `https://stream.c6radio.fr:8443/stream`
- Vérifier console pour erreurs CORS
- Tester en HTTPS (requis pour autoplay)

### Métadonnées vides
- Vérifier API Libretime : `https://c6radio.zapto.org:8443/api/live-info-v2`
- Vérifier parsing dans `nowPlaying.js`
- Intervalle de polling : 10 secondes

### Bannières flash blanc
- Préchargement des images activé (voir `useBanners.js`)
- Vérifier que `imageLoaded` n'est pas reset

### WordPress 404
- Vérifier permalinks WordPress activés
- Vérifier CORS autorisé pour exp937.fr
- Vérifier ACF fields configurés

### iOS Safe Areas
- Utiliser `env(safe-area-inset-top)` pour header
- Utiliser `env(safe-area-inset-bottom)` pour player
- Valeurs fixes dans Capacitor (pas de variation)

---

## 📖 Ressources

### Documentation Externe
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Capacitor Docs](https://capacitorjs.com)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)

### Documentation Interne
- Voir fichiers PHASE-X.md pour détails par phase
- Voir `archive/` pour historique complet

---

## 👥 Équipe

**Développeur :** Dofrecords  
**Assistant IA :** GitHub Copilot CLI  
**CMS :** WordPress (exp937.fr)  
**Radio :** C6Radio (Libretime)

---

## 📅 Historique

- **15 février 2026** : Phases 1-5 complétées
- **16 février 2026** : Phase 6 (Bannières) + Phase 7 (iOS) complétées
- **16 février 2026** : Documentation consolidée

---

## 🎯 Prochaines Étapes (Optionnel)

### Améliorations Possibles
- [ ] Tests automatisés (Jest, Vitest)
- [ ] Analytics (Plausible, Google Analytics)
- [ ] Monitoring (Sentry)
- [ ] PWA (Service Worker, offline)
- [ ] Mode sombre
- [ ] Recherche d'articles
- [ ] Partage social

### Nouveaux Features
- [ ] Playlist personnalisées
- [ ] Favoris
- [ ] Commentaires articles
- [ ] Notifications push
- [ ] Live chat

---

**🎉 Projet C6Radio - Version 1.0 Production Ready ! 🚀**
