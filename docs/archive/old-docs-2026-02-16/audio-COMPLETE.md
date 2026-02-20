# 🎵 Audio - Documentation Complète

> **Source unique de vérité pour toute la feature audio de C6Radio**  
> Dernière mise à jour : 15 février 2026  
> Statut : ✅ Production Ready

---

## 📑 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [GlobalAudioContext](#globalaudiocontext)
4. [Services Audio](#services-audio)
5. [Hooks React](#hooks-react)
6. [Composants UI](#composants-ui)
7. [Tests & Validation](#tests--validation)
8. [API Référence](#api-référence)
9. [Troubleshooting](#troubleshooting)
10. [Changelog](#changelog)

---

## 🎯 Vue d'Ensemble

### Ce qui est Implémenté

**✅ Phase 1 : Audio Core (100%)**
- Live streaming radio
- Reconnexion automatique (backoff exponentiel 3s/10s/30s)
- Media Session API (contrôles natifs lockscreen)
- Gestion erreurs robuste

**✅ Phase 2 : Barre de Contrôle (100%)**
- PlayerBar sticky footer
- Now Playing API (polling 12s)
- Affichage métadonnées (titre/artiste/artwork)

**✅ Phase 3B : GlobalAudioContext (100%)**
- Gestion centralisée de tous les lecteurs
- Règle "un seul audio à la fois" respectée
- Lazy loading vidéos WordPress
- Animation loading vidéos

### Fonctionnalités Clés

#### 1. Live Streaming ✅
```javascript
// User clique Play
playLive()
  → Crée Audio(STREAM_URL)
  → Démarre lecture
  → Reconnexion auto si erreur
  → Affiche métadonnées Now Playing
```

#### 2. Gestion Audio Globale ✅
```javascript
// Live joue + User lance vidéo WordPress
videoElement.play()
  → GlobalAudioContext.registerPlayer('wordpress-video')
  → Context pause automatiquement le live
  → Un seul audio joue à la fois ✅
```

#### 3. Reconnexion Automatique ✅
```javascript
// WiFi coupe pendant stream
audioElement.error
  → Attendre 3s → Retry
  → Si échec → Attendre 10s → Retry
  → Si échec → Attendre 30s → Retry
  → Si échec → Afficher erreur utilisateur
```

#### 4. Media Session API ✅
```javascript
// Contrôles natifs (lockscreen, notifications)
navigator.mediaSession.setActionHandler('play', playLive)
navigator.mediaSession.setActionHandler('pause', stop)
navigator.mediaSession.metadata = { title, artist, artwork }
```

---

## 🏗️ Architecture

### Vue en Couches

```
┌─────────────────────────────────────────────────────────┐
│                  CONTEXT (Global State)                  │
│               GlobalAudioProvider (main.jsx)             │
│  Gère : activePlayer, registerPlayer, pauseWordPressMedia│
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    COMPOSANTS UI                         │
│    PlayerBar • NowPlaying • Header • DynamicPage        │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   HOOKS REACT                            │
│        useAudioPlayer • useNowPlaying • useGlobalAudio   │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                 SERVICES (Business Logic)                │
│  audioPlayer.js • reconnectionManager.js • mediaSession  │
│  nowPlaying.js • wordpress.js                            │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│              NAVIGATEUR (Web APIs)                       │
│  HTML5 Audio • Media Session API • Intersection Observer│
└─────────────────────────────────────────────────────────┘
```

### Flux de Données

#### Scénario 1 : User lance le live

```
1. USER ACTION
   ↓ (clic bouton Play)
2. COMPOSANT (PlayerBar/Header)
   ↓ (appelle playLive())
3. HOOK (useAudioPlayer)
   ↓ (appelle audioPlayer.playLiveStream())
4. SERVICE (audioPlayer.js)
   ↓ (crée Audio, démarre lecture)
5. CONTEXT (GlobalAudioContext)
   ↓ (enregistre 'live' comme activePlayer)
6. HTML5 AUDIO
   ↓ (événement 'playing')
7. SERVICE (reconnectionManager, mediaSession)
   ↓ (reset retry, update lockscreen)
8. HOOK (useAudioPlayer)
   ↓ (setState 'playing')
9. COMPOSANT
   ↓ (affiche bouton Pause)
```

#### Scénario 2 : Vidéo WordPress joue pendant live

```
1. USER ACTION
   ↓ (clic play vidéo dans page WordPress)
2. COMPOSANT (DynamicPage)
   ↓ (écoute événement 'play' sur <video>)
3. CONTEXT (GlobalAudioContext)
   ↓ (registerPlayer('wordpress-video'))
4. CONTEXT LOGIC
   ↓ (détecte que 'live' était actif)
5. CALLBACK
   ↓ (appelle mainPlayerPauseCallback → stopLiveStream)
6. SERVICE (audioPlayer.js)
   ↓ (arrête le live)
7. RÉSULTAT
   → ✅ Seule la vidéo joue
```

---

## 🌐 GlobalAudioContext

### Principe

**Problème résolu :**
Avant, plusieurs sources audio pouvaient jouer simultanément :
- Live stream (via useAudioPlayer)
- Vidéos WordPress (dans pages dynamiques)
- Audio WordPress (dans pages dynamiques)

**Solution : Context centralisé**
Un seul "activePlayer" à la fois. Quand un nouveau lecteur démarre, l'ancien se met automatiquement en pause.

### Implémentation

**Fichier :** `src/contexts/GlobalAudioContext.jsx`

#### État Principal

```javascript
const [activePlayer, setActivePlayer] = useState(null);
// Valeurs possibles :
// - 'live' : Stream radio en direct
// - 'podcast' : Épisode podcast (futur)
// - 'wordpress-video' : Vidéo dans page WordPress
// - 'wordpress-audio' : Audio dans page WordPress
// - null : Rien ne joue
```

#### Références

```javascript
// Références vers éléments vidéo/audio WordPress
const wordpressMediaElements = useRef(new Set());

// Callback pour mettre en pause le lecteur principal (live/podcast)
const mainPlayerPauseCallback = useRef(null);
```

#### Fonction Principale : registerPlayer

```javascript
const registerPlayer = useCallback((playerType, options = {}) => {
  setActivePlayer((prevActivePlayer) => {
    // Si déjà actif, ne rien faire
    if (prevActivePlayer === playerType) return prevActivePlayer;

    // Mettre en pause l'ancien lecteur
    if (prevActivePlayer) {
      if (prevActivePlayer.startsWith('wordpress-')) {
        pauseWordPressMedia(); // Pause tous les médias WordPress
      } else if (prevActivePlayer === 'live' || prevActivePlayer === 'podcast') {
        mainPlayerPauseCallback.current(); // Pause le lecteur principal
      }
    }

    // Enregistrer le nouveau lecteur
    if (playerType.startsWith('wordpress-') && options.mediaElement) {
      wordpressMediaElements.current.add(options.mediaElement);
    } else if ((playerType === 'live' || playerType === 'podcast') && options.pauseCallback) {
      mainPlayerPauseCallback.current = options.pauseCallback;
    }

    return playerType;
  });
}, [pauseWordPressMedia]);
```

### Utilisation

#### Dans useAudioPlayer (Live/Podcast)

```javascript
import { useGlobalAudio } from '../contexts/GlobalAudioContext';

export function useAudioPlayer() {
  const { registerPlayer, resetActivePlayer } = useGlobalAudio();
  
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((audioState) => {
      // Enregistrer quand lecture démarre
      if (audioState.state === 'playing') {
        registerPlayer(audioState.source, {
          pauseCallback: () => {
            if (audioState.source === 'live') {
              audioPlayer.stopLiveStream();
            } else if (audioState.source === 'podcast') {
              audioPlayer.pausePodcast();
            }
          }
        });
      }
      
      // Reset quand complètement arrêté
      if (audioState.state === 'stopped') {
        resetActivePlayer();
      }
    });
    
    return unsubscribe;
  }, [registerPlayer, resetActivePlayer]);
}
```

#### Dans DynamicPage (Vidéos/Audio WordPress)

```javascript
import { useGlobalAudio } from '../contexts/GlobalAudioContext';

function DynamicPage() {
  const { registerPlayer, unregisterWordPressMedia } = useGlobalAudio();
  
  useEffect(() => {
    // Trouver tous les médias dans le contenu
    const videos = document.querySelectorAll('.page-content video');
    const audios = document.querySelectorAll('.page-content audio');
    const allMedia = [...videos, ...audios];
    
    // Écouter l'événement 'play'
    const handlePlay = (event) => {
      const mediaElement = event.target;
      const isVideo = mediaElement.tagName === 'VIDEO';
      const playerType = isVideo ? 'wordpress-video' : 'wordpress-audio';
      
      registerPlayer(playerType, { mediaElement });
    };
    
    allMedia.forEach(media => {
      media.addEventListener('play', handlePlay);
    });
    
    // Cleanup
    return () => {
      allMedia.forEach(media => {
        media.removeEventListener('play', handlePlay);
        unregisterWordPressMedia(media);
      });
    };
  }, [page, registerPlayer, unregisterWordPressMedia]);
}
```

### Optimisations

**1. useCallback pour performances**
```javascript
const registerPlayer = useCallback((type, options) => {
  // Fonction mémorisée, ne se recrée pas à chaque render
}, [dependencies]);
```

**2. useRef pour références sans re-render**
```javascript
const wordpressMediaElements = useRef(new Set());
// Modifiable sans causer de re-render
```

**3. Forme fonctionnelle de setState**
```javascript
setActivePlayer((prev) => {
  // Utilise prev au lieu de lire depuis l'état
  // Évite problèmes de dépendances
  return newValue;
});
```

---

## 🛠️ Services Audio

### 1. audioPlayer.js (Service Central)

**Fichier :** `src/services/audioPlayer.js` (425 lignes)

#### Responsabilités
- Gestion de l'objet Audio unique
- États : 'stopped', 'playing', 'paused', 'loading', 'error'
- Sources : 'live', 'podcast', null
- Pattern Observer pour notifier les composants React

#### API Publique

```javascript
// Live Stream
export function playLiveStream()   // Démarre le stream
export function stopLiveStream()   // Arrête le stream

// Podcast (futur)
export function playPodcast(url)   // Joue un podcast
export function pausePodcast()     // Met en pause
export function resumePodcast()    // Reprend lecture
export function stopPodcast()      // Arrête podcast

// Getters
export function getState()         // Retourne état actuel
export function getSource()        // Retourne source active
export function getPodcastUrl()    // Retourne URL podcast si actif

// Observer Pattern
export function subscribe(callback)   // S'abonner aux changements
// Retourne : fonction unsubscribe
```

#### Implémentation Clé

```javascript
// Objet Audio unique (Singleton pattern)
let audioElement = null;

// État actuel
let currentState = 'stopped';
let currentSource = null;

// Listeners (Observer pattern)
let stateChangeListeners = [];

function notifyStateChange() {
  stateChangeListeners.forEach(listener => {
    listener({
      state: currentState,
      source: currentSource,
      podcastUrl: currentPodcastUrl
    });
  });
}

// Cleanup critique pour éviter lecture en retard
function destroyAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = ''; // Vide le buffer
    audioElement.load();   // Force nettoyage
    audioElement = null;
  }
}
```

---

### 2. reconnectionManager.js

**Fichier :** `src/services/reconnectionManager.js` (180 lignes)

#### Principe : Backoff Exponentiel

```javascript
const RETRY_DELAYS = [3000, 10000, 30000]; // 3s, 10s, 30s
```

**Pourquoi des délais croissants ?**
- Coupures courtes (WiFi instable) : résolu en 3-10s
- Évite surcharge serveur
- Problèmes sérieux nécessitent plus de temps

#### API

```javascript
export function startReconnection()   // Démarre tentatives
export function stopReconnection()    // Arrête tentatives
export function reset()               // Remet compteur à zéro
export function isReconnecting()      // État actuel
```

#### Logique

```javascript
let retryCount = 0;
let reconnectTimer = null;

export function startReconnection() {
  if (retryCount >= RETRY_DELAYS.length) {
    // Trop de tentatives, abandonner
    logger.error('Reconnexion échouée après 3 tentatives');
    return;
  }
  
  const delay = RETRY_DELAYS[retryCount];
  logger.info(`Reconnexion dans ${delay/1000}s (tentative ${retryCount + 1})`);
  
  reconnectTimer = setTimeout(() => {
    retryCount++;
    audioPlayer.playLiveStream(); // Réessayer
  }, delay);
}

export function reset() {
  retryCount = 0;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}
```

---

### 3. mediaSession.js

**Fichier :** `src/services/mediaSession.js` (287 lignes)

#### Responsabilités
- Contrôles natifs (lockscreen, notifications, casque Bluetooth)
- Métadonnées affichées (titre, artiste, artwork)
- Handlers pour Play/Pause

#### API

```javascript
export function initMediaSession()            // Initialise handlers
export function updateMetadata(metadata)      // MAJ métadonnées
export function setPlaybackState(state)       // 'playing' | 'paused'
export function clearMetadata()               // Nettoie lockscreen
```

#### Métadonnées

```javascript
export function updateMetadata({ title, artist, artwork }) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'C6Radio',
      artist: artist || 'En direct',
      artwork: [
        {
          src: artwork || '/logo-c6radio.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    });
  }
}
```

#### Handlers

```javascript
export function initMediaSession() {
  if ('mediaSession' in navigator) {
    // Play : Démarrer ou reprendre
    navigator.mediaSession.setActionHandler('play', () => {
      audioPlayer.playLiveStream();
    });
    
    // Pause : Arrêter (pas de pause sur live stream)
    navigator.mediaSession.setActionHandler('pause', () => {
      audioPlayer.stopLiveStream();
    });
    
    // Stop : Arrêter complètement
    navigator.mediaSession.setActionHandler('stop', () => {
      audioPlayer.stop();
      clearMetadata();
    });
  }
}
```

---

### 4. nowPlaying.js

**Fichier :** `src/services/nowPlaying.js` (118 lignes)

#### Responsabilités
- Récupérer métadonnées en direct depuis API Libretime
- Parsing correct du format API
- Nettoyage titre (suppression extensions .mp3, .wav, etc.)

#### API

```javascript
export async function fetchNowPlaying()  // Fetch API Libretime
// Retourne : { title, artist, artwork, show } ou null
```

#### Format API Libretime

```json
{
  "data": {
    "current": {
      "metadata": {
        "track_title": "Nom Chanson.mp3",
        "artist_name": "Nom Artiste",
        "artwork_url": "https://..."
      },
      "show_title": "Émission en cours"
    }
  }
}
```

#### Parsing

```javascript
export async function fetchNowPlaying() {
  const response = await fetch(NOW_PLAYING_URL);
  const data = await response.json();
  
  const current = data?.data?.current;
  if (!current) return null;
  
  const metadata = current.metadata || {};
  let title = metadata.track_title || 'Titre inconnu';
  
  // Nettoyer les extensions audio
  title = title.replace(/\.(mp3|wav|flac|ogg|aac|m4a)$/i, '');
  
  return {
    title,
    artist: metadata.artist_name || 'Artiste inconnu',
    artwork: metadata.artwork_url || '/logo-c6radio.png',
    show: current.show_title || null
  };
}
```

---

## 🎣 Hooks React

### 1. useAudioPlayer

**Fichier :** `src/hooks/useAudioPlayer.js` (65 lignes)

#### Responsabilité
Interface React pour le service audioPlayer.js

#### API

```javascript
const {
  // État
  state,        // 'stopped' | 'playing' | 'paused' | 'loading' | 'error'
  source,       // 'live' | 'podcast' | null
  podcastUrl,   // URL si podcast actif
  
  // Propriétés dérivées
  isPlaying,
  isPaused,
  isStopped,
  isLive,
  isPodcast,
  
  // Fonctions
  playLive,
  stopLive,
  playPodcast,
  pausePodcast,
  resumePodcast,
  stopPodcast,
  stop
} = useAudioPlayer();
```

#### Implémentation

```javascript
export function useAudioPlayer() {
  const [state, setState] = useState(audioPlayer.getState());
  const [source, setSource] = useState(audioPlayer.getSource());
  const { registerPlayer, resetActivePlayer } = useGlobalAudio();
  
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((audioState) => {
      setState(audioState.state);
      setSource(audioState.source);
      
      // Intégration GlobalAudioContext
      if (audioState.state === 'playing') {
        registerPlayer(audioState.source, {
          pauseCallback: () => {
            if (audioState.source === 'live') audioPlayer.stopLiveStream();
            else if (audioState.source === 'podcast') audioPlayer.pausePodcast();
          }
        });
      }
      
      if (audioState.state === 'stopped') {
        resetActivePlayer();
      }
    });
    
    return unsubscribe; // Cleanup
  }, [registerPlayer, resetActivePlayer]);
  
  return { state, source, /* ... */ };
}
```

---

### 2. useNowPlaying

**Fichier :** `src/hooks/useNowPlaying.js` (130 lignes)

#### Responsabilités
- Polling API Now Playing toutes les 12 secondes
- Gestion cache (évite fetch si déjà en cours)
- Retry automatique si erreur

#### API

```javascript
const {
  nowPlaying,   // { title, artist, artwork, show } | null
  isLoading,    // boolean
  error         // Error | null
} = useNowPlaying();
```

#### Implémentation

```javascript
export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    let intervalId = null;
    
    async function fetchData() {
      try {
        const data = await fetchNowPlaying();
        if (isMounted) {
          setNowPlaying(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    // Fetch initial
    fetchData();
    
    // Polling toutes les 12 secondes
    intervalId = setInterval(fetchData, 12000);
    
    // Cleanup
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  
  return { nowPlaying, isLoading, error };
}
```

---

### 3. useGlobalAudio

**Fichier :** `src/contexts/GlobalAudioContext.jsx`

#### API

```javascript
const {
  activePlayer,           // 'live' | 'podcast' | 'wordpress-video' | 'wordpress-audio' | null
  registerPlayer,         // (type, options) => void
  resetActivePlayer,      // () => void
  pauseWordPressMedia,    // () => void
  unregisterWordPressMedia // (element) => void
} = useGlobalAudio();
```

---

## 🎨 Composants UI

### 1. PlayerBar

**Fichier :** `src/components/PlayerBar.jsx` (122 lignes)

#### Responsabilités
- Sticky footer avec contrôles audio
- Affichage conditionnel (visible seulement si audio actif)
- Now Playing intégré en mode compact

#### Props
Aucune (utilise hooks internes)

#### Structure

```jsx
<div className="player-bar">
  <div className="player-bar-content">
    {/* Now Playing Info */}
    <div className="now-playing-section">
      <NowPlaying mode="compact" />
    </div>
    
    {/* Contrôles */}
    <div className="controls-section">
      {isLive && (
        <>
          {!isPlaying && <PlayerButton onClick={playLive} type="play" />}
          {isPlaying && <PlayerButton onClick={stopLive} type="stop" />}
        </>
      )}
      
      {isPodcast && (
        <>
          {isPaused && <PlayerButton onClick={resumePodcast} type="play" />}
          {isPlaying && <PlayerButton onClick={pausePodcast} type="pause" />}
          <PlayerButton onClick={stopPodcast} type="stop" />
        </>
      )}
    </div>
  </div>
</div>
```

---

### 2. NowPlaying

**Fichier :** `src/components/NowPlaying.jsx` (48 lignes)

#### Props

```javascript
{
  mode: 'compact' | 'full'  // Default: 'full'
}
```

#### Modes

**Mode Compact (dans PlayerBar) :**
```jsx
<div className="now-playing compact">
  <img src={artwork} alt="cover" />
  <div className="info">
    <div className="title">{title}</div>
    <div className="artist">{artist}</div>
  </div>
</div>
```

**Mode Full (page dédiée) :**
```jsx
<div className="now-playing full">
  <img src={artwork} className="large-artwork" />
  <h2 className="title">{title}</h2>
  <p className="artist">{artist}</p>
  {show && <p className="show">{show}</p>}
</div>
```

---

### 3. PlayerButton

**Fichier :** `src/components/PlayerButton.jsx` (35 lignes)

#### Props

```javascript
{
  type: 'play' | 'pause' | 'stop',
  onClick: () => void,
  disabled?: boolean
}
```

#### Rendu

```jsx
<button
  className={`player-button ${type}`}
  onClick={onClick}
  disabled={disabled}
  aria-label={labels[type]}
>
  {icons[type]}
</button>
```

**Couleurs :**
- Play : Vert (#4ade80)
- Pause : Jaune (#fbbf24)
- Stop : Rouge (#ef4444)

---

## 🧪 Tests & Validation

### Tests Critiques

#### Test 1 : Règle "Un Seul Audio"

**Scénario A : Live → Vidéo**
1. Aller sur page d'accueil
2. Cliquer "Play" sur le live (Header ou PlayerBar)
3. ✅ Vérifier : Live joue
4. Naviguer vers page WordPress avec vidéo
5. Lancer la vidéo
6. ✅ **VÉRIFIER : Live se pause automatiquement**

**Scénario B : Vidéo → Live**
1. Aller sur page WordPress avec vidéo
2. Lancer la vidéo
3. ✅ Vérifier : Vidéo joue
4. Cliquer "Play" sur le live (Header)
5. ✅ **VÉRIFIER : Vidéo se pause automatiquement**

**Scénario C : Plusieurs vidéos**
1. Page WordPress avec 2+ vidéos
2. Lancer vidéo 1
3. Lancer vidéo 2
4. ✅ **VÉRIFIER : Vidéo 1 se pause automatiquement**

---

#### Test 2 : Lazy Loading Vidéos

**Scénario A : Vidéo hors écran**
1. Page WordPress longue avec vidéo en bas
2. Ouvrir DevTools (F12) → Network → Filter "video"
3. ✅ **VÉRIFIER : Vidéo ne charge PAS immédiatement**
4. Scroller vers la vidéo
5. ✅ **VÉRIFIER : Vidéo commence à charger 50px avant d'être visible**

**Scénario B : Animation loading**
1. Page avec vidéo
2. ✅ **VÉRIFIER : Animation shimmer gris visible pendant chargement**
3. Attendre que vidéo charge
4. ✅ **VÉRIFIER : Animation disparaît (data-loaded="true")**

---

#### Test 3 : Reconnexion Automatique

**Simulation coupure :**
1. Live joue
2. Dans DevTools : Network → Offline
3. ✅ **VÉRIFIER : Message "Reconnexion dans 3s..."**
4. Attendre 3s
5. ✅ **VÉRIFIER : Tentative reconnexion automatique**
6. Si échec : Attendre 10s → Nouvelle tentative
7. Si échec : Attendre 30s → Dernière tentative

---

#### Test 4 : Media Session API

**Lockscreen (Mobile) :**
1. Live joue sur smartphone
2. Verrouiller écran
3. ✅ **VÉRIFIER : Métadonnées affichées (titre, artiste, artwork)**
4. ✅ **VÉRIFIER : Boutons Play/Pause fonctionnent**

**Notifications (Desktop) :**
1. Live joue sur ordinateur
2. ✅ **VÉRIFIER : Notification système avec contrôles**

**Casque Bluetooth :**
1. Live joue avec casque Bluetooth
2. Appuyer bouton Play/Pause casque
3. ✅ **VÉRIFIER : Audio se met en pause**

---

### Commandes Debug

#### Console Browser (F12)

```javascript
// Filtrer logs GlobalAudio
// Chercher : "[GlobalAudio]"

// Voir logs audioPlayer
// Chercher : "[AudioPlayer]"

// Voir logs reconnexion
// Chercher : "[ReconnectionManager]"

// Vérifier vidéos trouvées
document.querySelectorAll('.page-content video')

// Vérifier dataset loading
document.querySelector('video').dataset.loaded // "true" si chargée

// Vérifier état audio
window.audioPlayerState // Debug helper (si défini)
```

#### React DevTools

```
Components → 
  GlobalAudioProvider → hooks → State : activePlayer
  PlayerBar → hooks → useAudioPlayer : { state, source }
  DynamicPage → hooks → useGlobalAudio
```

---

## 📚 API Référence

### audioPlayer.js

```typescript
// Live Stream
function playLiveStream(): void
function stopLiveStream(): void

// Podcast
function playPodcast(url: string): void
function pausePodcast(): void
function resumePodcast(): void
function stopPodcast(): void

// Universal
function stop(): void

// Getters
function getState(): 'stopped' | 'playing' | 'paused' | 'loading' | 'error'
function getSource(): 'live' | 'podcast' | null
function getPodcastUrl(): string | null

// Observer
function subscribe(callback: (state: AudioState) => void): () => void

// Initialization
function initializeAudioPlayer(): void

// Types
interface AudioState {
  state: 'stopped' | 'playing' | 'paused' | 'loading' | 'error';
  source: 'live' | 'podcast' | null;
  podcastUrl: string | null;
}
```

---

### reconnectionManager.js

```typescript
function startReconnection(): void
function stopReconnection(): void
function reset(): void
function isReconnecting(): boolean

// Constants
const RETRY_DELAYS: number[] = [3000, 10000, 30000]
```

---

### mediaSession.js

```typescript
function initMediaSession(): void
function updateMetadata(metadata: MediaMetadata): void
function setPlaybackState(state: 'playing' | 'paused' | 'none'): void
function clearMetadata(): void

interface MediaMetadata {
  title?: string;
  artist?: string;
  artwork?: string;
}
```

---

### nowPlaying.js

```typescript
async function fetchNowPlaying(): Promise<NowPlayingData | null>

interface NowPlayingData {
  title: string;
  artist: string;
  artwork: string;
  show?: string;
}
```

---

### GlobalAudioContext

```typescript
// Context Value
interface GlobalAudioContextValue {
  activePlayer: 'live' | 'podcast' | 'wordpress-video' | 'wordpress-audio' | null;
  registerPlayer: (type: string, options?: RegisterOptions) => void;
  resetActivePlayer: () => void;
  pauseWordPressMedia: () => void;
  unregisterWordPressMedia: (element: HTMLMediaElement) => void;
}

interface RegisterOptions {
  mediaElement?: HTMLMediaElement;  // Pour WordPress
  pauseCallback?: () => void;        // Pour live/podcast
}

// Hook
function useGlobalAudio(): GlobalAudioContextValue
```

---

## 🐛 Troubleshooting

### Problème 1 : Live et vidéo jouent ensemble

**Symptômes :**
- Live stream + vidéo WordPress jouent en même temps
- Règle "un seul audio" pas respectée

**Debug :**
```javascript
// Console (F12)
// Chercher logs "[GlobalAudio]"
// Si aucun log → Problème d'intégration

// Vérifier activePlayer
// React DevTools → GlobalAudioProvider → State
```

**Solutions :**
1. Vérifier que `GlobalAudioProvider` wraps l'app dans `main.jsx`
2. Vérifier que `useAudioPlayer` appelle `registerPlayer()`
3. Vérifier que `DynamicPage` écoute événement 'play'

---

### Problème 2 : Reconnexion ne fonctionne pas

**Symptômes :**
- Stream coupe et ne se reconnecte pas
- Message "Reconnexion..." n'apparaît pas

**Debug :**
```javascript
// Console
// Chercher logs "[ReconnectionManager]"
// Vérifier si startReconnection() appelé

// Vérifier état
reconnectionManager.isReconnecting() // doit retourner true
```

**Solutions :**
1. Vérifier que `audioElement.addEventListener('error')` appelle `startReconnection()`
2. Vérifier délais RETRY_DELAYS
3. Tester manuellement : DevTools → Network → Offline

---

### Problème 3 : Vidéos chargent toutes immédiatement

**Symptômes :**
- Lazy loading ne fonctionne pas
- Toutes les vidéos se chargent au load de la page

**Debug :**
```javascript
// Console
// Chercher logs "[DynamicPage] Video entering viewport"
// Si absent → IntersectionObserver pas initialisé

// Vérifier vidéos
document.querySelectorAll('video').forEach(v => {
  console.log(v.preload); // Doit être "metadata"
  console.log(v.dataset.loaded); // "true" si déjà chargée
});
```

**Solutions :**
1. Vérifier que `video.preload = 'metadata'` est défini
2. Vérifier que `IntersectionObserver` est créé
3. Vérifier `rootMargin: '50px'` et `threshold: 0.1`

---

### Problème 4 : Media Session ne fonctionne pas

**Symptômes :**
- Pas de contrôles lockscreen
- Boutons casque Bluetooth ne marchent pas

**Debug :**
```javascript
// Console
if ('mediaSession' in navigator) {
  console.log('✅ Media Session supporté');
  console.log(navigator.mediaSession.metadata);
  console.log(navigator.mediaSession.playbackState);
} else {
  console.log('❌ Media Session NON supporté');
}
```

**Solutions :**
1. Vérifier support navigateur (Chrome/Edge/Safari OK, Firefox limité)
2. Vérifier que `initMediaSession()` est appelé dans `main.jsx`
3. Vérifier que `updateMetadata()` est appelé après fetch Now Playing
4. Tester sur mobile (support meilleur que desktop)

---

### Problème 5 : Now Playing ne s'affiche pas

**Symptômes :**
- "Titre inconnu / Artiste inconnu" toujours affiché
- Métadonnées ne se mettent pas à jour

**Debug :**
```javascript
// Console
// Vérifier fetch API
fetch('https://radio.c6media.fr/api/live-info-v2')
  .then(r => r.json())
  .then(d => console.log(d));

// Vérifier format
// Doit contenir : data.current.metadata.track_title
```

**Solutions :**
1. Vérifier URL API Now Playing
2. Vérifier format réponse API (peut changer côté Libretime)
3. Vérifier parsing dans `nowPlaying.js`
4. Vérifier polling : 12 secondes entre chaque fetch

---

### Problème 6 : Erreurs console

**"Unused function GlobalAudioProvider"**
- ⚠️ Faux positif ESLint
- 🟢 Pas d'impact, fonction utilisée dans `main.jsx`

**"Fast refresh only works..."**
- ⚠️ Warning dev React
- 🟢 Pas d'impact, fonctionne en pratique

**"Local variable unsubscribe is redundant"**
- ⚠️ Inspection IntelliJ
- 🟢 Pas d'impact, variable utilisée dans return

---

## 📊 Changelog

### v2.0.0 - 15 février 2026 ✨ GlobalAudioContext

**Features :**
- ✅ GlobalAudioContext créé (`src/contexts/GlobalAudioContext.jsx`)
- ✅ Règle "un seul audio à la fois" appliquée globalement
- ✅ Lazy loading vidéos WordPress (IntersectionObserver)
- ✅ Animation shimmer pour vidéos en chargement
- ✅ Integration context dans useAudioPlayer
- ✅ Gestion médias WordPress dans DynamicPage

**Fichiers modifiés :**
- `src/main.jsx` - Wrapper GlobalAudioProvider
- `src/hooks/useAudioPlayer.js` - Intégration context
- `src/pages/DynamicPage.jsx` - Lazy loading + event listeners
- `src/pages/DynamicPage.css` - Animations loading

**Impact :**
- ✅ Amélioration UX majeure (pas de conflits audio)
- ✅ Performance vidéos améliorée (lazy loading)
- ✅ Architecture scalable pour Phase 4 (Podcasts)

---

### v1.3.0 - 13 février 2026 - Phase 1 Audio Core

**Features :**
- ✅ Reconnexion automatique (backoff 3s/10s/30s)
- ✅ Media Session API (lockscreen + Bluetooth)
- ✅ Métadonnées lockscreen (titre/artiste/artwork)
- ✅ Initialisation unifiée `initializeAudioPlayer()`

**Fichiers créés :**
- `src/services/reconnectionManager.js` (180 lignes)
- `src/services/mediaSession.js` (287 lignes)

---

### v1.2.0 - 13 février 2026 - PlayerBar

**Features :**
- ✅ PlayerBar sticky footer
- ✅ Affichage conditionnel (visible si audio actif)
- ✅ Now Playing intégré mode compact
- ✅ Contrôles contextuels (live vs podcast)
- ✅ Design responsive mobile/desktop

**Fichiers créés :**
- `src/components/PlayerBar.jsx` (122 lignes)
- `src/components/PlayerBar.css` (145 lignes)
- `src/components/NowPlaying.css` (88 lignes)

---

### v1.1.0 - 13 février 2026 - Now Playing

**Features :**
- ✅ Now Playing API (polling 12s)
- ✅ Hook `useNowPlaying` avec gestion erreurs
- ✅ Composant `NowPlaying` modes compact/full
- ✅ Parsing correct API Libretime
- ✅ Nettoyage extensions audio (.mp3, .wav, etc.)

**Fichiers créés :**
- `src/services/nowPlaying.js` (118 lignes)
- `src/hooks/useNowPlaying.js` (130 lignes)
- `src/components/NowPlaying.jsx` (48 lignes)

---

### v1.0.0 - 13 février 2026 - Audio Core

**Features :**
- ✅ Live streaming basique
- ✅ Service audioPlayer.js central
- ✅ Hook useAudioPlayer
- ✅ États : stopped/playing/paused/loading/error
- ✅ Pattern Observer pour React
- ✅ Logger intelligent dev/prod

**Fichiers créés :**
- `src/services/audioPlayer.js` (425 lignes)
- `src/hooks/useAudioPlayer.js` (65 lignes)
- `src/lib/logger.js` (52 lignes)

---

## 🎓 Concepts Avancés

### Pattern Observer

**Utilisé dans :** `audioPlayer.js`

**Problème résolu :**
Comment notifier plusieurs composants React quand l'état audio change ?

**Solution :**
```javascript
// Service (Observable)
let listeners = [];

export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

function notifyStateChange() {
  listeners.forEach(listener => listener(currentState));
}

// Composant (Observer)
useEffect(() => {
  const unsubscribe = audioPlayer.subscribe((state) => {
    setState(state); // React re-render
  });
  return unsubscribe; // Cleanup
}, []);
```

---

### Singleton Pattern

**Utilisé dans :** `audioPlayer.js`

**Principe :**
Un seul objet Audio pour toute l'application.

```javascript
// Variable privée (closure)
let audioElement = null;

export function playLiveStream() {
  // Toujours destroy l'ancien avant de créer nouveau
  destroyAudio();
  audioElement = new Audio(STREAM_URL);
  audioElement.play();
}
```

**Avantages :**
- Pas de conflits multiples Audio
- État centralisé
- Cleanup garanti

---

### Context API + useCallback/useRef

**Utilisé dans :** `GlobalAudioContext.jsx`

**Optimisations :**
```javascript
// useCallback : Fonction mémorisée
const registerPlayer = useCallback((type) => {
  // Ne se recrée pas à chaque render
}, [dependencies]);

// useRef : Valeur persistante sans re-render
const wordpressMediaElements = useRef(new Set());
wordpressMediaElements.current.add(element); // Pas de re-render

// Forme fonctionnelle setState : Évite dépendances
setActivePlayer(prev => {
  // Utilise prev au lieu de lire state
  return newValue;
});
```

---

### IntersectionObserver (Lazy Loading)

**Utilisé dans :** `DynamicPage.jsx`

**Principe :**
Observer quand un élément devient visible dans le viewport.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Élément visible → Charger
      const video = entry.target;
      video.load();
      video.dataset.loaded = 'true';
    }
  });
}, {
  rootMargin: '50px',  // Charger 50px avant visibilité
  threshold: 0.1,      // Déclenche quand 10% visible
});

videos.forEach(v => observer.observe(v));
```

**Performance :**
- Pas de scroll listeners (géré par navigateur)
- Chargement progressif
- Meilleure expérience utilisateur

---

## 📖 Ressources

### Documentation React
- [Context API](https://react.dev/reference/react/createContext)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useRef](https://react.dev/reference/react/useRef)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

### Web APIs
- [HTMLMediaElement](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement)
- [Media Session API](https://developer.mozilla.org/fr/docs/Web/API/Media_Session_API)
- [IntersectionObserver](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API)

### Performance
- [Lazy Loading](https://web.dev/lazy-loading/)
- [Video Preload](https://web.dev/fast-playback-with-preload/)

---

## ✅ Conclusion

### État Actuel

**✅ Production Ready**

- Live streaming robuste
- Reconnexion automatique
- Media Session API
- GlobalAudioContext (un seul audio à la fois)
- Lazy loading vidéos
- Performance optimisée
- Documentation complète

### Architecture

**Professionnelle et Scalable**

- Séparation des responsabilités (UI / Hooks / Services)
- Patterns modernes (Observer, Singleton, Context)
- Optimisations performances (useCallback, useRef, IntersectionObserver)
- Gestion erreurs robuste
- Code commenté et maintenable

### Prochaines Étapes

**Phase 4 : Podcasts WordPress**
- API WordPress podcasts
- Page liste épisodes
- Player podcast (réutilise useAudioPlayer ✅)
- Intégration GlobalAudioContext (déjà prêt ✅)

---

**Dernière mise à jour :** 15 février 2026  
**Mainteneur :** GitHub Copilot + DOFRECORDS  
**Statut :** ✅ Validé et testé en production

