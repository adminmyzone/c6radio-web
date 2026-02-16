# Décisions Techniques Finalisées - C6Radio MVP

**Date de finalisation :** 13 février 2026  
**Statut :** ✅ Validé - Prêt pour implémentation  
**Profil développeur :** Débutant - Premier projet - Apprentissage progressif

---

## 0. Stack Technique & Approche

### Décision : React + Vite (approche progressive)

**Contexte :**
- Développeur débutant avec notions React basiques
- Premier projet d'envergure
- Besoin de code maintenable et compréhensible
- SEO secondaire pour le moment
- Maquette fonctionnelle disponible (exp937.fr)

**Stack choisie (Phase 1 - Web) :**
```
React 18 + Vite
├── JavaScript (pas TypeScript au MVP)
├── React Router DOM (navigation)
├── CSS Pur (plus simple que Tailwind pour débuter)
├── Context API (state global simple)
└── Fetch API native (pas de librairie complexe)
```

**Stack Phase 2 (Mobile) :**
```
Même codebase React
└── + Capacitor 6 (wrapping natif)
    ├── @capacitor/ios
    ├── @capacitor/android
    └── Plugins audio natifs (ajout ciblé)
```

**Rationale :**
- ✅ **Simplicité** : pas de SSR/SSG complexe (Next.js)
- ✅ **Apprentissage** : React pur, concepts classiques bien documentés
- ✅ **Rapidité** : Vite = setup instantané, HMR ultra-rapide
- ✅ **Progression** : valider web d'abord, mobile ensuite
- ✅ **Maintenabilité** : code lisible sans sur-abstraction
- ✅ **Communauté** : énorme documentation React + tutos débutants

**Approche progressive (web-first) :**
```
Phase 1 (Semaines 1-6) : Application web fonctionnelle
  ├── Player live + now playing
  ├── Pages actus WordPress
  ├── Bannières publicitaires
  └── Déploiement Netlify/Vercel

Phase 2 (Semaines 7-8) : Wrapping mobile
  ├── Installation Capacitor
  ├── Adaptation audio natif (iOS + Android)
  ├── Lockscreen controls
  └── Tests devices

Phase 3 (Semaines 9-10) : Stores & Release
  ├── Builds production
  ├── Beta testing
  └── Soumission stores
```

**Pourquoi pas Next.js / TypeScript / State management complexe ?**
- Next.js App Router = trop de "magie" et conventions pour débutant
- TypeScript = excellente mais courbe d'apprentissage supplémentaire (V1.1)
- Redux/Zustand = overkill, Context API suffit largement
- Focus : **apprendre React solidement**, pas multiplier les abstractions

**Évolution possible V1.1+ :**
- Migration TypeScript (typage progressif)
- Ajout state management (si app grandit beaucoup)
- PWA (si iOS PWA s'améliore)
- SSR/Next.js (si SEO devient critique)

---

## 1. Streaming Audio

### Décision : MP3 128kbps uniquement

**Rationale :**
- **Simplicité** : un seul flux à maintenir, moins de points de défaillance
- **Compatibilité universelle** : MP3 supporté partout (navigateurs, iOS, Android)
- **Performance réseau** : 128kbps = bon compromis qualité/bande passante pour mobile
- **MVP focus** : pas de complexité multi-qualité avant validation usage

**Spécifications techniques :**
- **Format** : MP3
- **Bitrate** : 128 kbps (constant)
- **URL prod** : `https://radio.c6media.fr:8443/main`
- **Protocole** : HTTPS (requis pour iOS)
- **Fallback** : Aucun flux secondaire (V1.1 si nécessaire)

**Stratégie de reconnexion :**
- **Backoff exponentiel** : 3s → 10s → 30s
- Si échec après 3 tentatives : afficher message d'erreur avec bouton "Réessayer"
- Reconnexion automatique lors du retour réseau (Network Information API si disponible)
- **Clear buffer obligatoire** : toujours reprendre au point live (pas de cache)

**Comportement attendu :**
```
Coupure détectée
  └─> Tentative 1 après 3s
       └─> Échec → Tentative 2 après 10s
            └─> Échec → Tentative 3 après 30s
                 └─> Échec → UI erreur + bouton manuel
```

---

## 2. Now Playing API

### Décision : Polling public 10-15 secondes

**Validation :**
- ✅ Endpoint testé et fonctionnel sans authentification
- ✅ Accessible en CORS depuis web/mobile
- ✅ Réponse stable et structure prévisible

**Spécifications techniques :**
- **Endpoint** : `https://radio.c6media.fr/api/live-info`
- **Méthode** : GET (public, sans auth)
- **Fréquence polling** : 12 secondes (moyenne 10-15s)
- **Timeout requête** : 5 secondes max
- **Strategy** : Polling actif uniquement quand stream en lecture

**Contrat API (attendu) :**
```json
{
  "artist": "Artiste en cours",
  "title": "Titre du morceau",
  "artwork": "https://...", // optionnel
  "start_time": "2026-02-13T14:30:00Z" // optionnel
}
```

**Gestion des cas limites :**
- **Champs manquants** : fallback sur valeur par défaut ("C6Radio - En direct")
- **Erreur API** : conserver dernière valeur connue + indicateur "peut-être obsolète"
- **Latence acceptable** : < 30 secondes (tolérance utilisateur)
- **Aucun impact sur lecture** : erreur now playing ≠ stop stream

**Comportement UI :**
```
Polling actif (stream playing)
  └─> Succès : update UI
  └─> Échec : 
       └─> Garder dernière valeur
       └─> Après 3 échecs consécutifs : afficher fallback "C6Radio en direct"
       └─> Continuer polling en arrière-plan
```

---

## 3. WordPress REST API

### Décision : Public-only, contenus complets MVP

**Base URL** : `https://exp937.fr/wp/wp-json/wp/v2`

**Authentification :**
- ✅ **Public uniquement** (pas d'auth requise)
- Tous les contenus exposés sont publics
- Pas d'Application Passwords ni JWT pour MVP
- Evolution possible V1.1+ si besoin contenu privé/preview

**Contenus exposés MVP :**

| Type | Endpoint | Usage | Champs clés |
|------|----------|-------|-------------|
| **Posts** (Actus) | `/posts` | Liste + détail actus | title, excerpt, content, featured_media, categories, date |
| **Pages** | `/pages` | À propos, mentions légales | title, content, slug |
| **Catégories** | `/categories` | Filtrage actus | id, name, slug, count |
| **Médias** | `/media` | Images articles/bannières | source_url, alt_text, media_details |
| **Bannières** (ACF) | `/posts?acf_fc_layout=banniere` | Publicités header/footer/sidebar | acf.banniere_image, acf.banniere_lien, acf.position |
| **Podcasts** (custom) | `/posts?category=podcast` | Épisodes audio | title, excerpt, acf.audio_url, featured_media, date |

**Champs ACF requis :**

**Bannières publicitaires :**
```json
{
  "acf": {
    "banniere_image": "URL", // requis
    "banniere_lien": "URL", // optionnel (cliquable)
    "position": "header|footer|sidebar" // requis
  }
}
```

**Podcasts/Émissions :**
```json
{
  "acf": {
    "audio_url": "https://...", // requis (fichier MP3)
    "duree": "25:30", // optionnel (format MM:SS)
    "emission": "Nom émission" // optionnel
  }
}
```

**Stratégie de synchronisation :**
- **Web (Next.js)** : ISR (Incremental Static Regeneration)
  - Revalidation : 60 secondes
  - Pages posts/actus régénérées à la demande
- **Mobile (Capacitor)** : Fetch runtime
  - Cache local avec TTL 5 minutes
  - Refresh au lancement de l'app
  - Pull-to-refresh sur pages liste

**Pagination & Performance :**
- Limite par défaut : 10 posts/page (liste actus)
- Load more / infinite scroll (mobile)
- Embed featured_media pour réduire requêtes

---

## 4. Analytics & RGPD

### Décision : Aucune analytics au MVP

**Rationale :**
- Focus delivery rapide sans complexité tracking
- Pas de bannière consentement (meilleure UX onboarding)
- Métriques serveur suffisantes pour baseline (logs stream, WordPress)
- Evolution V1.1 : Matomo auto-hébergé (RGPD-friendly)

**Métriques MVP (sans analytics) :**
- Logs stream Icecast : connexions, durée écoute
- WordPress admin : pages vues, posts populaires
- Stores (post-release) : installations, MAU

**Roadmap analytics (V1.1+) :**
1. **Matomo auto-hébergé** (préféré) : sans consentement si config correcte
2. Plausible/Simple Analytics (alternatif léger)
3. Events custom : play/stop, temps écoute, navigation

**RGPD - Conformité MVP :**
- Mentions légales : page WordPress
- Pas de cookies tiers (aucun tracker)
- Notifications push : opt-in explicite (iOS/Android natif)

---

## 5. Distribution & Stores

### Décision : iOS + Android uniquement (pas PWA)

**Plateformes MVP :**
- ✅ **iOS** (App Store) - critique pour audio background
- ✅ **Android** (Play Store) - large audience mobile
- ❌ **PWA** - reporté V1.1 (iOS PWA limitations audio)

**Comptes & Setup requis :**

**Apple Developer :**
- Compte : à créer/vérifier
- App Bundle ID : `fr.c6media.radio` (suggestion)
- Capacités requises : Background Audio, Push Notifications
- Review time : 24-48h (prévoir dans planning)

**Google Play Console :**
- Compte : à créer/vérifier  
- Package name : `fr.c6media.radio` (cohérence)
- Permissions requises : INTERNET, WAKE_LOCK, FOREGROUND_SERVICE
- Review time : quelques heures (généralement plus rapide)

**Planning distribution (estimation) :**

| Phase | Durée | Date cible |
|-------|-------|------------|
| Dev MVP | 3-4 semaines | 10 mars 2026 |
| QA interne | 1 semaine | 17 mars 2026 |
| Beta testing (TestFlight + Play Internal) | 1 semaine | 24 mars 2026 |
| Soumission stores | - | 25 mars 2026 |
| Review & corrections | 2-5 jours | 30 mars 2026 |
| **🚀 Release publique** | - | **1er avril 2026** |

**Versioning initial :**
- Version MVP : `1.0.0`
- Build iOS : `1` (incrémenté à chaque soumission)
- Version code Android : `1` (entier, incrémenté)

---

## 6. Architecture Audio - Spécifications

### Principes Architecture (Débutant-Friendly)

**Approche simple :**
- ✅ **Pas de classes complexes** : fonctions simples et hooks React
- ✅ **Pas de sur-abstraction** : code lisible et modifiable facilement
- ✅ **Séparation claire** : logique audio séparée des composants UI
- ✅ **Progressive** : commencer HTML5 Audio, évoluer vers natif

### Composants critiques

**audioPlayer.js (cœur logique - fonctions simples) :**
```javascript
// Pas de TypeScript, pas de classes - juste des fonctions
let audioElement = null;
let currentState = 'stopped'; // 'playing' | 'paused' | 'stopped' | 'loading' | 'error'
let currentSource = null; // 'live' | 'podcast' | null

// Initialisation
export function initAudio(url) {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
  audioElement = new Audio(url);
  return audioElement;
}

// Contrôles live stream
export function playLiveStream() {
  const streamUrl = 'https://radio.c6media.fr:8443/main';
  if (!audioElement || currentSource !== 'live') {
    audioElement = initAudio(streamUrl);
    currentSource = 'live';
  }
  audioElement.play();
  currentState = 'playing';
}

export function stop() {
  if (!audioElement) return;
  audioElement.pause();
  audioElement.currentTime = 0; // Clear buffer
  currentState = 'stopped';
}

// Contrôles podcast (Phase 6)
export function playPodcast(url) {
  if (currentSource === 'live') {
    stop(); // Arrêter live avant de jouer podcast
  }
  audioElement = initAudio(url);
  currentSource = 'podcast';
  audioElement.play();
  currentState = 'playing';
}

export function pause() {
  if (!audioElement || currentSource === 'live') return; // Pas de pause sur live
  audioElement.pause();
  currentState = 'paused';
}

export function resume() {
  if (!audioElement || currentSource === 'live') return;
  audioElement.play();
  currentState = 'playing';
}

// Getters
export function getState() {
  return currentState;
}

export function getCurrentSource() {
  return currentSource;
}
```

**useAudioPlayer.js (hook React simple) :**
```javascript
import { useState, useEffect } from 'react';
import * as audioPlayer from '../services/audioPlayer';

export function useAudioPlayer() {
  const [state, setState] = useState('stopped');
  const [source, setSource] = useState(null);

  const play = () => {
    audioPlayer.playLiveStream();
    setState('playing');
    setSource('live');
  };

  const stop = () => {
    audioPlayer.stop();
    setState('stopped');
  };

  const playPodcast = (url) => {
    audioPlayer.playPodcast(url);
    setState('playing');
    setSource('podcast');
  };

  const pause = () => {
    audioPlayer.pause();
    setState('paused');
  };

  const resume = () => {
    audioPlayer.resume();
    setState('playing');
  };

  return { state, source, play, stop, playPodcast, pause, resume };
}
```

**reconnection.js (Phase 1.5 - après player de base) :**
```javascript
// Gestion simple de la reconnexion
const RETRY_DELAYS = [3000, 10000, 30000]; // 3s, 10s, 30s
let retryCount = 0;
let retryTimeout = null;

export function handleError(audioElement, onRetry, onFail) {
  if (retryCount >= RETRY_DELAYS.length) {
    onFail('Impossible de se connecter au stream');
    retryCount = 0;
    return;
  }

  const delay = RETRY_DELAYS[retryCount];
  console.log(`Reconnexion dans ${delay/1000}s...`);
  
  retryTimeout = setTimeout(() => {
    retryCount++;
    onRetry();
  }, delay);
}

export function resetRetry() {
  retryCount = 0;
  if (retryTimeout) clearTimeout(retryTimeout);
}
```

**mediaSession.js (Phase 2 - mobile natif) :**
- Media Session API (web - ajout simple)
- Capacitor Music Controls (iOS/Android - Phase 2 uniquement)
- Metadata sync avec now playing
- Artwork dynamique (fallback logo C6Radio)

### Barre de contrôle footer unifiée

**Spécifications finales (simple et lisible) :**

**PlayerBar.jsx :**
```javascript
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useNowPlaying } from '../hooks/useNowPlaying';
import PlayButton from './PlayButton';
import NowPlaying from './NowPlaying';

export default function PlayerBar() {
  const { state, source, play, stop, pause, resume } = useAudioPlayer();
  const { title, artist, artwork } = useNowPlaying(state === 'playing');

  return (
    <div className="player-bar">
      {/* Image */}
      <img 
        src={artwork || '/logo.png'} 
        alt="Now playing" 
        className="player-artwork"
      />
      
      {/* Infos */}
      <div className="player-info">
        <div className="player-title">{title || 'C6Radio'}</div>
        <div className="player-artist">{artist || 'En direct'}</div>
      </div>
      
      {/* Contrôles */}
      <div className="player-controls">
        {state === 'playing' && source === 'podcast' && (
          <button onClick={pause} className="btn-pause">
            ⏸ Pause
          </button>
        )}
        {state === 'paused' && (
          <button onClick={resume} className="btn-play">
            ▶ Reprendre
          </button>
        )}
        {(state === 'stopped' || (state === 'playing' && source === 'live')) && (
          <button onClick={state === 'playing' ? stop : play} className="btn-main">
            {state === 'playing' ? '⏹ Stop' : '▶ Play'}
          </button>
        )}
      </div>
    </div>
  );
}
```

**Basculement live ↔ podcast :**
```
User action: Play podcast
  └─> Si live playing:
       └─> audioEngine.stop() // clear buffer
       └─> audioEngine.playPodcast(url)
       └─> UI: update contrôles (show Pause button)

User action: Play live
  └─> Si podcast playing:
       └─> audioEngine.stop()
       └─> audioEngine.playLiveStream()
       └─> UI: update contrôles (hide Pause button)
```

---

## 7. Browser & Mobile Support

**Phase 1 (Web uniquement) :**
- Chrome 100+ (desktop + Android)
- Safari 15+ (desktop + iOS)
- Firefox 100+
- Edge 100+

**Phase 2 (Mobile natif) :**
- iOS 15+ (Capacitor support)
- Android 8+ (API 26+, Capacitor minimum)

**Tests prioritaires Phase 1 (Web) :**
1. Chrome Desktop (dev principal)
2. Safari Desktop (second)
3. Chrome Mobile (responsive)
4. Safari iOS (responsive)

**Tests prioritaires Phase 2 (Mobile natif) :**
1. iPhone physique (iOS 16+) - **CRITIQUE audio background**
2. Samsung/Pixel physique (Android 10+)
3. Simulateurs (limités pour audio)

---

## 8. Checklist Pré-Développement

**Infrastructure :**
- [x] Stream Icecast accessible HTTPS + CORS
- [x] Now Playing API testée et fonctionnelle
- [ ] WordPress REST endpoints validés (à tester Phase 1)
- [ ] Comptes dev Apple/Google créés (Phase 2 uniquement)

**Technique Phase 1 (Web) :**
- [x] Stack technique choisie (React + Vite)
- [ ] Node.js installé (v18+ recommandé)
- [ ] VS Code + extensions (ESLint, Prettier, ES7+ React snippets)
- [ ] Git installé + compte GitHub
- [ ] Navigateurs de test installés (Chrome, Firefox, Safari)

**Technique Phase 2 (Mobile) :**
- [ ] Xcode installé (macOS) + iOS Simulator
- [ ] Android Studio installé + Émulateur Android
- [ ] Capacitor CLI installé globalement
- [ ] Comptes développeurs Apple/Google créés

**Design :**
- [x] Maquette fonctionnelle disponible (exp937.fr)
- [ ] Logo/icône app haute résolution (1024x1024px)
- [ ] Palette couleurs extraite de la maquette
- [ ] Assets publicitaires stores (Phase 2)

**Compétences à acquérir progressivement :**
- [ ] Semaine 1-2 : React basics (composants, state, props)
- [ ] Semaine 2-3 : Hooks (useState, useEffect, custom hooks)
- [ ] Semaine 3-4 : Fetch API + Context API
- [ ] Semaine 5-6 : React Router + optimisations
- [ ] Semaine 7+ : Capacitor + mobile natif

---

## Prochaines Étapes

### Phase 1 : Setup & Apprentissage React (Semaines 1-2 : 17 fév - 28 fév)

**Objectif :** Environnement prêt + bases React solides + player live basique

1. **Setup projet web (Jour 1)**
   - Installer Node.js + VS Code + extensions
   - Créer projet Vite + React
   - Premier composant "Hello World"
   
2. **Apprendre React basics (Semaine 1)**
   - Tutoriels React officiels (react.dev)
   - Composants fonctionnels
   - Props et State (useState)
   - Events (onClick, etc.)
   
3. **Player live basique (Semaine 2)**
   - Créer service `audioPlayer.js` (fonctions simples)
   - Hook `useAudioPlayer()` (Play/Stop uniquement)
   - Composant `PlayButton` basique
   - Test lecture stream Icecast

**Livrable :** Site web avec bouton Play/Stop qui joue le stream live ✅

---

### Phase 2 : Now Playing & Navigation (Semaines 3-4 : 3 mars - 14 mars)

**Objectif :** Barre player footer + now playing temps réel + pages de base

1. **Now Playing API (Semaine 3)**
   - Service `api.js` : fetch now playing
   - Hook `useNowPlaying()` : polling 12 secondes
   - Composant `NowPlaying` : afficher titre/artiste
   - Fallback si API erreur
   
2. **Barre footer unifiée (Semaine 3)**
   - Composant `PlayerBar.jsx` (Play + Now Playing + Stop)
   - Context API pour state global
   - Footer sticky toutes pages
   
3. **Pages & navigation (Semaine 4)**
   - Installer React Router
   - Page Home (hero + player)
   - Page À propos (contenu statique)
   - Header + navigation
   - Reproduire design maquette exp937.fr

**Livrable :** Site web avec player footer + navigation + maquette respectée ✅

---

### Phase 3 : WordPress & Contenus (Semaines 5-6 : 17 mars - 28 mars)

**Objectif :** Actus dynamiques + bannières publicitaires

1. **WordPress REST (Semaine 5)**
   - Service WordPress API client
   - Hook `useWordPress()` (posts + catégories)
   - Page liste actus avec filtres
   - Page détail actu (slug dynamique)
   
2. **Bannières publicitaires (Semaine 6)**
   - Fetch bannières ACF
   - Composant `BannerAd.jsx`
   - Positionnement (header/footer/sidebar)
   - Rotation dynamique
   
3. **Optimisations web (Semaine 6)**
   - Images optimisées (lazy loading)
   - SEO basique (meta tags)
   - Performance (Lighthouse audit)
   - Déploiement Netlify/Vercel

**Livrable :** Site web complet et déployé en production ✅

---

### Phase 4 : Wrapping Mobile (Semaines 7-8 : 31 mars - 11 avril)

**Objectif :** App iOS + Android avec audio background

1. **Installation Capacitor (Semaine 7)**
   - Installer Capacitor CLI
   - Configuration iOS + Android
   - Premier build test (app web wrappée)
   - Setup Xcode + Android Studio
   
2. **Audio natif & background (Semaine 7-8)**
   - **POC audio background iOS** (CRITIQUE)
   - POC audio background Android
   - Adapter `audioPlayer.js` pour natif
   - Lockscreen controls (Media Session)
   - Gestion notifications
   
3. **Tests devices (Semaine 8)**
   - Tests iPhone physique
   - Tests Android physique
   - Corrections bugs audio
   - Optimisations performances

**Livrable :** Apps iOS + Android fonctionnelles avec audio background ✅

---

### Phase 5 : Stores & Release (Semaines 9-10 : 14 avril - 25 avril)

**Objectif :** Apps sur App Store + Play Store

1. **Préparation stores (Semaine 9)**
   - Générer icônes + splash screens
   - Screenshots stores
   - Textes descriptions
   - Politique confidentialité
   - Builds production signés
   
2. **Beta testing (Semaine 9)**
   - TestFlight (10-15 testeurs iOS)
   - Play Internal (10-15 testeurs Android)
   - Collecte feedback
   - Corrections bugs prioritaires
   
3. **Soumission & release (Semaine 10)**
   - Soumission App Store (review 24-48h)
   - Soumission Play Store (review quelques heures)
   - Corrections si rejets
   - **🚀 Release publique : ~25 avril 2026**

**Livrable :** Apps publiques sur les stores ✅

---

**Planning réaliste débutant : 10 semaines** (vs 6-7 semaines équipe expérimentée)  
**Marge buffer incluse pour apprentissage**

**Prochaine action immédiate :** Setup projet Vite + React (15 minutes)

---

**Document validé par :** DOFRECORDS  
**Profil :** Débutant - Premier projet  
**Approche :** Web-first puis mobile  
**Stack :** React + Vite → Capacitor  
**Prêt pour implémentation :** ✅ Oui

---

## 🚀 Quick Start - Lancer le Projet Maintenant

### Pré-requis (10 minutes)

**1. Installer Node.js**
```bash
# Télécharger depuis https://nodejs.org (version LTS 18+)
# Vérifier installation
node --version  # doit afficher v18.x ou supérieur
npm --version   # doit afficher 9.x ou supérieur
```

**2. Installer VS Code + Extensions**
- Télécharger VS Code : https://code.visualstudio.com
- Extensions recommandées (installer depuis VS Code) :
  - **ES7+ React/Redux/React-Native snippets** (dsznajder)
  - **ESLint** (Microsoft)
  - **Prettier** (Prettier)

---

### Créer le Projet (5 minutes)

```bash
# 1. Créer projet Vite + React
npm create vite@latest c6radio-web -- --template react
cd c6radio-web

# 2. Installer dépendances
npm install

# 3. Installer dépendances additionnelles
npm install react-router-dom  # Navigation

# 4. Lancer le serveur de dev
npm run dev
```

**✅ Votre app tourne sur http://localhost:5173** 🎉

---

### Premier Composant - Player Basique

**Créer `src/components/PlayerButton.jsx` :**
```javascript
import { useState } from 'react';

export default function PlayerButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio('https://radio.c6media.fr:8443/main'));

  const handlePlay = () => {
    audio.play();
    setIsPlaying(true);
  };

  const handleStop = () => {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">C6Radio</h1>
      
      {isPlaying ? (
        <button 
          onClick={handleStop}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-semibold"
        >
          ⏹ Stop
        </button>
      ) : (
        <button 
          onClick={handlePlay}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-semibold"
        >
          ▶ Play Live
        </button>
      )}
    </div>
  );
}
```

**Modifier `src/App.jsx` :**
```javascript
import PlayerButton from './components/PlayerButton';

function App() {
  return <PlayerButton />;
}

export default App;
```

---

### 🎯 Vous Avez un Player Fonctionnel !

**Ouvrez http://localhost:5173** → Cliquez Play → **Le stream joue !** 🎵

**Prochaines étapes (Semaine 1) :**
1. Créer dossier `src/services/audioPlayer.js` (logique séparée)
2. Créer hook `src/hooks/useAudioPlayer.js`
3. Ajouter composant `NowPlaying.jsx` (polling API)
4. Créer `PlayerBar.jsx` (footer sticky)

**Besoin d'aide ?**
- Documentation React : https://react.dev
- Tutoriel React interactif : https://react.dev/learn

**💪 Vous êtes lancé !**

