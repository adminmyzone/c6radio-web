# 📋 TODO Prochaine Session - C6Radio WebApp

> **Dernière session :** 14 février 2026  
> **Phase actuelle :** Phase 3 complétée à 100% ✅  
> **Prochaine session :** À définir

---

## 🎯 Priorités Session Prochaine

### 🔴 PRIORITÉ 1 : Problèmes Médias WordPress

⚠️ **Problèmes identifiés lors des tests Phase 3 :**

#### 1. Vidéos WordPress : Performance Dégradée

**Symptômes :**
- ✅ Affichage OK (responsive corrigé)
- ❌ Chargement lent
- ❌ Lecture saccadée

**Causes possibles :**
- Vidéos non optimisées (poids/format)
- Pas de compression
- Pas de streaming adaptatif
- Préchargement complet (`preload="auto"`)

**Solutions à implémenter :**

```javascript
// Option 1 : Lazy loading vidéos
<video preload="metadata"> // Au lieu de "auto"

// Option 2 : Intersection Observer (charge quand visible)
useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.load();
      }
    });
  });
});

// Option 3 : Recommandation éditoriale
// Guide WordPress : optimiser vidéos avant upload
// - Format MP4 (H.264)
// - Résolution max 1080p
// - Compression recommandée
```

**Fichiers à modifier :**
- `src/pages/DynamicPage.jsx` - Lazy loading vidéos
- `src/pages/DynamicPage.css` - Placeholder loading
- `docs/phase-3b-test-guide.md` - Guide optimisation vidéos

---

#### 2. Gestion Audio Globale : Règle "Un Seul Lecteur"

**Problème :**
❌ **Règle "un audio à la fois" NON respectée**

**Scénarios problématiques :**

| Situation | Comportement actuel | Comportement attendu |
|-----------|---------------------|---------------------|
| Live joue + vidéo page lancée | ❌ Les deux jouent ensemble | ✅ Live pause automatiquement |
| Live joue + audio page lancé | ❌ Les deux jouent ensemble | ✅ Live pause automatiquement |
| Vidéo page joue + clic Play live | ❌ Les deux jouent ensemble | ✅ Vidéo/audio page pause |
| Podcast joue + vidéo page lancée | ❌ Les deux jouent ensemble | ✅ Podcast pause |

**Causes :**
- Lecteur live (`useAudioPlayer`) ne connaît pas les médias WordPress
- Médias WordPress (vidéos/audio dans pages) indépendants
- Pas de gestionnaire centralisé

**Architecture actuelle :**
```
useAudioPlayer.js (hook)
   └─> Gère uniquement: live stream + podcasts
   
DynamicPage.jsx
   └─> Affiche HTML WordPress (vidéos/audio indépendants)
   
❌ Aucune communication entre les deux !
```

**Solutions possibles :**

##### Solution A : Context API Global Audio (Recommandé)

```javascript
// Créer src/contexts/GlobalAudioContext.jsx
export const GlobalAudioContext = createContext();

export function GlobalAudioProvider({ children }) {
  const [activePlayer, setActivePlayer] = useState(null);
  // 'live' | 'podcast' | 'wordpress-video' | 'wordpress-audio' | null

  const registerPlayer = (type, audioElement) => {
    // Pause tous les autres lecteurs
    if (activePlayer && activePlayer !== type) {
      pauseAllExcept(type);
    }
    setActivePlayer(type);
  };

  return (
    <GlobalAudioContext.Provider value={{ registerPlayer, activePlayer }}>
      {children}
    </GlobalAudioContext.Provider>
  );
}
```

**Modifications requises :**

1. **Créer nouveau fichier :**
   - `src/contexts/GlobalAudioContext.jsx`

2. **Modifier fichiers existants :**
   - `src/main.jsx` - Wrapper avec GlobalAudioProvider
   - `src/hooks/useAudioPlayer.js` - Utiliser context pour signaler lecture
   - `src/pages/DynamicPage.jsx` - Intercepter événements play vidéo/audio

3. **Logique à implémenter :**
   ```javascript
   // Dans DynamicPage.jsx
   useEffect(() => {
     const videos = document.querySelectorAll('.page-content video');
     const audios = document.querySelectorAll('.page-content audio');
     
     [...videos, ...audios].forEach(media => {
       media.addEventListener('play', () => {
         globalAudio.registerPlayer('wordpress-media');
         // Pause le live stream automatiquement
       });
     });
   }, [page]);
   
   // Dans useAudioPlayer.js
   const play = () => {
     globalAudio.registerPlayer('live');
     // Pause vidéos WordPress si actives
     audioRef.current.play();
   };
   ```

##### Solution B : Custom Hook useMediaSync (Alternative)

```javascript
// src/hooks/useMediaSync.js
export function useMediaSync(mediaType) {
  useEffect(() => {
    // Écouter événements play sur tous médias
    // Pause automatiquement les autres
  }, []);
}

// Usage dans DynamicPage
useMediaSync('wordpress-media');

// Usage dans useAudioPlayer
useMediaSync('live-stream');
```

**Fichiers à créer/modifier :**
- 📄 CRÉER : `src/contexts/GlobalAudioContext.jsx`
- 📝 MODIFIER : `src/main.jsx`
- 📝 MODIFIER : `src/hooks/useAudioPlayer.js`
- 📝 MODIFIER : `src/pages/DynamicPage.jsx`
- 📝 MODIFIER : `src/services/audioPlayer.js` (si nécessaire)

---

## 🟡 PRIORITÉ 2 (Optionnel) : Améliorations Vidéos

### 2.1 Loading States Vidéos

**Amélioration UX :**
```css
/* Placeholder pendant chargement */
.page-content video {
  background: linear-gradient(to right, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 2.2 Contrôles Personnalisés (Avancé)

Si vidéos natives insatisfaisantes :
- Bibliothèque : Video.js ou Plyr
- Contrôles custom React
- Buffer indicator
- Vitesse lecture

---

## 🟢 PRIORITÉ 3 : Prochaines Phases

### Phase 4 : Podcasts WordPress (Non commencée)

**Objectif :** Intégrer les podcasts depuis WordPress

**Tâches principales :**
1. API WordPress custom post type "podcast"
2. Page liste podcasts
3. Page détail épisode
4. Player podcast (réutiliser useAudioPlayer)
5. Playlist épisodes
6. Téléchargement épisodes (optionnel)

**Durée estimée :** 3-4 jours

**Fichier de référence :**
- `docs/implementation-plan.md` - Section Phase 4

---

### Phase 5 : PWA & Service Worker (Non commencée)

**Objectif :** Application installable

**Tâches principales :**
1. Service Worker
2. Cache stratégies
3. Mode offline
4. Install prompt
5. Icônes PWA
6. Notifications push (optionnel)

**Durée estimée :** 2-3 jours

---

## 📊 État Actuel Projet

### ✅ Complété

**Phase 1 : Audio Core (100%)**
- ✅ Lecteur live streaming
- ✅ Reconnexion automatique
- ✅ Media Session API
- ✅ Error boundary
- ✅ Logger structuré

**Phase 3A : Pages & Navigation (100%)**
- ✅ React Router v7
- ✅ Pages statiques
- ✅ Header + Footer
- ✅ Menu hamburger mobile
- ✅ SEO basique

**Phase 3B : WordPress Dynamique (100%)**
- ✅ Client API WordPress
- ✅ Pages dynamiques
- ✅ Filtre ACF éditorial
- ✅ Décodage HTML entities
- ✅ Support médias (images/vidéos/audio responsive)

### ⚠️ Issues Connues

**Médias WordPress :**
- ⚠️ Vidéos lentes/saccadées → À optimiser
- ⚠️ Pas de gestion audio globale → À implémenter

### 🔜 À Faire

**Prochaine session :**
1. 🔴 Fix performance vidéos
2. 🔴 Implémenter GlobalAudioContext
3. 🟢 Phase 4 Podcasts (si temps)

---

## 📚 Ressources & Références

### Documentation Projet

**Phase 3 :**
- `docs/phase-3-recap.md` - Récapitulatif complet Phase 3
- `docs/phase-3-pages-navigation.md` - Plan détaillé 2466 lignes
- `docs/phase-3b-test-guide.md` - Guide tests
- `SESSION-NOTES.md` - Notes sessions 14 février

**Architecture Audio :**
- `docs/audio-architecture.md` - Architecture lecteur audio
- `src/hooks/useAudioPlayer.js` - Hook principal
- `src/services/audioPlayer.js` - Service audio
- `src/services/mediaSession.js` - Media Session API

### Ressources Externes

**Context API React :**
- https://react.dev/reference/react/createContext
- https://react.dev/learn/passing-data-deeply-with-context

**Intersection Observer (lazy loading) :**
- https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API

**Video Performance :**
- https://web.dev/fast-playback-with-preload/
- https://developer.mozilla.org/fr/docs/Web/HTML/Element/video#attr-preload

**Media Events :**
- https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement#events

---

## 🧪 Tests à Effectuer Prochaine Session

### Tests Médias

1. **Test Vidéo Performance :**
   - [ ] Vidéo 1080p < 50MB → Chargement fluide
   - [ ] Vidéo 4K > 200MB → Lazy loading actif
   - [ ] Scroll rapide page → Vidéos hors écran pas chargées

2. **Test Audio Global :**
   - [ ] Live joue → Lance vidéo page → Live pause ✅
   - [ ] Vidéo page joue → Clic play live → Vidéo pause ✅
   - [ ] Audio page joue → Lance podcast → Audio page pause ✅
   - [ ] Podcast joue → Lance vidéo → Podcast pause ✅

3. **Test Edge Cases :**
   - [ ] Plusieurs vidéos sur même page
   - [ ] Vidéo + audio sur même page
   - [ ] Navigation rapide entre pages (cleanup)

---

## 💡 Notes & Idées

### Optimisations Futures (Après Phase 4)

**Cache & Performance :**
- localStorage cache pages WordPress
- Service Worker cache médias
- Prefetch page suivante

**UX Avancée :**
- Transitions pages animées
- Loading skeletons
- Infinite scroll podcasts
- Recherche globale

**Analytics :**
- Tracking écoutes
- Pages vues
- Temps écoute moyen

### Questions Ouvertes

**WordPress :**
- Utiliser plugin cache WordPress ?
- CDN pour médias ?
- Compression automatique uploads ?

**React :**
- Migrer vers TanStack Query (cache) ?
- Suspense pour loading states ?
- React Server Components (future) ?

---

## ✅ Checklist Démarrage Prochaine Session

**Avant de coder :**
- [ ] Lire ce fichier entièrement
- [ ] Relire `docs/phase-3-recap.md`
- [ ] Ouvrir `src/hooks/useAudioPlayer.js` (comprendre architecture)
- [ ] Ouvrir `src/pages/DynamicPage.jsx` (médias WordPress)
- [ ] Créer branch Git `feature/media-sync` (optionnel)

**Premier test rapide :**
- [ ] Lancer app (`npm run dev`)
- [ ] Aller sur page test WordPress avec vidéo
- [ ] Lancer vidéo
- [ ] Aller dans Header → Cliquer Play live
- [ ] ❌ Confirmer : vidéo + live jouent ensemble (bug)

**Ordre d'implémentation recommandé :**
1. 🔴 Créer `GlobalAudioContext.jsx` (structure de base)
2. 🔴 Wrapper app dans `main.jsx` avec Provider
3. 🔴 Modifier `useAudioPlayer.js` pour utiliser context
4. 🔴 Modifier `DynamicPage.jsx` pour écouter play vidéos/audio
5. 🧪 Tester scénarios ci-dessus
6. 🟡 (Optionnel) Lazy loading vidéos
7. 📝 Documenter changements

---

## 📞 Support

**Si blocage technique :**
1. Consulter `docs/audio-architecture.md`
2. Logs console (F12) → Logger structuré actif
3. Chercher "useAudioPlayer" dans workspace
4. Lire code commenté (français, niveau débutant)

**Si questions architecture :**
- Context API vs Redux ? → Context suffit (projet taille moyenne)
- Global state vs Props drilling ? → Context évite props drilling
- Performance concerns ? → Context bien optimisé pour ce cas

---

## 🎯 Objectif Session Suivante

**Minimum Viable (2-3h) :**
- ✅ GlobalAudioContext créé
- ✅ Règle "un audio à la fois" respectée
- ✅ Tests validés

**Idéal (4-5h) :**
- ✅ Tout le minimum +
- ✅ Lazy loading vidéos
- ✅ Loading states améliorés
- ✅ Documentation mise à jour

**Si temps restant :**
- 🚀 Commencer Phase 4 Podcasts

---

## 🎉 Conclusion Session 14 Février

**Bilan positif :**
- ✅ Phase 3 complétée à 100%
- ✅ React Router maîtrisé
- ✅ WordPress dynamique fonctionnel
- ✅ Support médias responsive
- ✅ Architecture propre et scalable

**Apprentissages :**
- React Router catch-all routes
- WordPress REST API
- ACF Advanced Custom Fields
- HTML entity decoding
- Responsive images/videos CSS

**Prêt pour la suite !** 🚀📻

---

**Dernière mise à jour :** 14 février 2026  
**Prochain RDV :** À définir  
**Fichier maintenu par :** GitHub Copilot + DOFRECORDS
