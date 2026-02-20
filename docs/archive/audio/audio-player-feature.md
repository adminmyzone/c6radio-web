# Feature : Audio Player Unifié

**Date de création :** 13 février 2026  
**Dernière mise à jour :** 13 février 2026 - 21:00  
**Statut :** ✅ Implémenté et testé  
**Version :** 1.3.0

---

## 📝 Changelog

### v1.3.0 - 13/02/2026 21:00
- ✅ **Reconnexion automatique** : Backoff exponentiel (3s/10s/30s)
- ✅ **Media Session API** : Contrôles natifs navigateur/téléphone
- ✅ **Métadonnées lockscreen** : Titre/artiste/artwork sur écran verrouillé
- ✅ **Gestion erreurs robuste** : Retry automatique si coupure stream
- ✅ **Initialisation unifiée** : `initializeAudioPlayer()` au démarrage
- 🆕 **Fichiers créés** :
  - `reconnectionManager.js` (180 lignes) - Gestion reconnexion
  - `mediaSession.js` (220 lignes) - Contrôles natifs
- 🆕 **Phase 1 Audio Core** : 100% complétée

### v1.2.0 - 13/02/2026 18:00
- ✅ **PlayerBar sticky footer** : Barre de contrôle toujours visible en bas
- ✅ **Affichage conditionnel** : Visible uniquement quand un audio est actif
- ✅ **Now Playing intégré** : Mode compact dans PlayerBar pour le live
- ✅ **Contrôles contextuels** : Play/Pause/Stop selon l'état (live vs podcast)
- ✅ **Design responsive** : Adapté mobile et desktop
- ✅ **Palette classique** : Boutons vert (Play), jaune (Pause), rouge (Stop)
- 🔄 **Migration CSS pur COMPLÈTE** : Abandon total de Tailwind
  - `PlayerBar.css` créé (145 lignes)
  - `NowPlaying.css` créé (88 lignes)
  - `AudioTest.css` créé (186 lignes)
  - `PlayerButton.css` créé (50 lignes)
  - Tous les composants convertis en CSS vanilla
  - Tailwind désinstallé (0 dépendance CSS)
  - vite.config.js nettoyé
  - package.json vérifié (aucune trace de Tailwind)
  - Commentaires Tailwind supprimés

### v1.1.1 - 13/02/2026 17:20
- ✅ **Format API adapté** : Parsing correct de l'API Libretime
- ✅ **Nettoyage titre** : Suppression automatique extensions audio (.wav, .mp3, etc.)
- ✅ **Structure validée** : `data.current.metadata.track_title` / `artist_name` / `artwork_url`

### v1.1.0 - 13/02/2026 16:00
- ✅ Now Playing API implémentée (polling 12s)
- ✅ Hook `useNowPlaying` avec gestion erreurs
- ✅ Composant `NowPlaying` avec modes compact/complet

### v1.0.0 - 13/02/2026 14:00
- ✅ Player audio unifié (live + podcast)
- ✅ Un seul audio actif garanti
- ✅ Buffer clearing automatique

---

## 📋 Vue d'Ensemble

**Objectif :** Un seul player audio gérant deux sources différentes (live stream et podcasts) avec la garantie qu'**UN SEUL audio joue à la fois**.

**Contraintes respectées :**
- ✅ Live Stream : Play → Stop (pas de pause, buffer toujours vidé)
- ✅ Podcast : Play → Pause → Resume → Stop
- ✅ Basculement automatique : lancer une source arrête l'autre automatiquement
- ✅ Buffer clearing : toujours reprendre au point live actuel
- ✅ **Now Playing API** : affichage titre/artiste en temps réel (live uniquement)

---

## 🏗️ Architecture

### Structure des Fichiers

```
src/
├── services/
│   ├── audioPlayer.js        ← Logique centrale (UN SEUL objet Audio)
│   ├── nowPlaying.js         ← Fetch API Libretime (titre/artiste)
│   ├── reconnectionManager.js ← 🆕 Gestion reconnexion automatique
│   └── mediaSession.js       ← 🆕 Contrôles natifs (lockscreen/navigateur)
├── hooks/
│   ├── useAudioPlayer.js     ← Interface React player
│   └── useNowPlaying.js      ← Polling automatique now playing
└── components/
    ├── PlayerButton.jsx      ← Exemple d'utilisation simple
    ├── PlayerButton.css      ← 🎨 Styles PlayerButton (CSS pur)
    ├── PlayerBar.jsx         ← 🆕 Barre sticky footer avec contrôles
    ├── PlayerBar.css         ← 🎨 Styles PlayerBar (CSS pur)
    ├── NowPlaying.jsx        ← Affichage titre/artiste/artwork
    ├── NowPlaying.css        ← 🎨 Styles NowPlaying (CSS pur)
    ├── AudioTest.jsx         ← Composant de test complet
    └── AudioTest.css         ← 🎨 Styles AudioTest (CSS pur)
```

**Note :** Projet 100% CSS vanilla - Aucune dépendance Tailwind

### Principe Central

**Une seule variable globale partagée :**
```javascript
// Dans audioPlayer.js
let audioElement = null;  // ← UN SEUL objet Audio pour TOUT
```

**Cette variable est :**
- Partagée par toutes les fonctions du service
- Détruite et recréée à chaque changement de source
- Jamais dupliquée → impossible d'avoir 2 audios simultanés

---

## 🔧 Service : `audioPlayer.js`

### Responsabilités

1. **Gérer l'objet Audio unique** (création, destruction)
2. **Contrôler la lecture** (play, pause, stop)
3. **Tracker l'état** (playing, paused, stopped, loading, error)
4. **Notifier les changements** (pattern Observer via `subscribe()`)

### Variables d'État

```javascript
let audioElement = null;           // Objet Audio unique
let currentState = 'stopped';      // État actuel
let currentSource = null;          // 'live' | 'podcast' | null
let currentPodcastUrl = null;      // URL podcast si actif
let stateChangeListeners = [];     // Abonnés aux changements
```

### Fonctions Critiques

#### `destroyAudio()` - Nettoyage complet

**Rôle :** Arrête et détruit l'audio actuel + vide le buffer.

```javascript
function destroyAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = '';      // ← Vide la source = clear buffer
    audioElement.load();        // ← Force le nettoyage
    audioElement = null;        // ← Détruit l'objet
  }
}
```

**Appelée avant :** chaque nouvelle lecture (live ou podcast).

**Pourquoi important ?**
- Vide le buffer (évite décalage sur live)
- Libère la mémoire
- Garantit qu'on repart de zéro

---

#### `createAudio(url)` - Création nouvel audio

**Rôle :** Crée un nouvel objet Audio avec l'URL donnée.

```javascript
function createAudio(url) {
  destroyAudio();  // ← Toujours détruire l'ancien d'abord
  
  audioElement = new Audio(url);
  
  // Écoute des événements natifs HTML5
  audioElement.addEventListener('playing', () => {
    currentState = 'playing';
    notifyStateChange();
  });
  
  audioElement.addEventListener('pause', () => {
    if (currentSource === 'podcast') {
      currentState = 'paused';
      notifyStateChange();
    }
  });
  
  audioElement.addEventListener('error', (e) => {
    currentState = 'error';
    notifyStateChange();
  });
  
  return audioElement;
}
```

**Événements écoutés :**
- `playing` : lecture en cours
- `pause` : pause (podcast uniquement)
- `error` : erreur de lecture

---

#### `notifyStateChange()` - Notification changements

**Rôle :** Informe tous les abonnés (composants React) qu'un changement a eu lieu.

```javascript
function notifyStateChange() {
  stateChangeListeners.forEach(listener => {
    listener({
      state: currentState,
      source: currentSource,
      podcastUrl: currentPodcastUrl
    });
  });
}
```

**Pattern Observer :**
- Service = Subject (émet des événements)
- Hook React = Observer (reçoit les événements)
- Permet synchronisation automatique UI ↔ Service

---

### API Publique

#### Live Stream

```javascript
playLiveStream()   // Démarre le stream live
stopLiveStream()   // Arrête le live + clear buffer
```

**Comportement `playLiveStream()` :**
1. Vérifie si podcast joue → l'arrête (`destroyAudio()`)
2. Crée nouvel audio avec URL live
3. Lance la lecture
4. Notifie les composants

**Pourquoi ça garantit un seul audio ?**
```javascript
// Si un podcast joue, on l'arrête d'abord
if (currentSource === 'podcast') {
  console.log('Arrêt du podcast pour lancer le live');
  destroyAudio();  // ← Détruit le podcast
}
// Puis on crée le nouveau live
createAudio(STREAM_URL);
currentSource = 'live';
```

---

#### Podcasts

```javascript
playPodcast(url)   // Démarre un podcast
pausePodcast()     // Pause (podcast uniquement)
resumePodcast()    // Reprend après pause
stopPodcast()      // Arrête + clear buffer
```

**Comportement `playPodcast(url)` :**
1. Vérifie si live joue → l'arrête (`destroyAudio()`)
2. Crée nouvel audio avec URL podcast
3. Lance la lecture
4. Notifie les composants

**Pourquoi pause/resume seulement sur podcast ?**
- Live = temps réel → pas de pause (sinon décalage)
- Podcast = contenu à la demande → pause logique

---

#### Contrôle Universel

```javascript
stop()  // Arrête tout (live ou podcast)
```

Détecte automatiquement la source active et appelle la fonction appropriée.

---

#### Getters

```javascript
getState()        // Retourne : 'stopped' | 'playing' | 'paused' | 'loading' | 'error'
getSource()       // Retourne : 'live' | 'podcast' | null
getPodcastUrl()   // Retourne : URL du podcast actuel ou null
isPlaying()       // Retourne : boolean
```

---

#### Abonnement

```javascript
subscribe(listener)  // S'abonne aux changements d'état
                    // Retourne fonction de désabonnement
```

**Usage :**
```javascript
const unsubscribe = audioPlayer.subscribe((audioState) => {
  console.log('État changé:', audioState.state);
});

// Cleanup
unsubscribe();
```

---

## 🪝 Hook : `useAudioPlayer.js`

### Responsabilités

1. **Synchroniser React avec le service** (via `subscribe()`)
2. **Fournir une interface simple** pour les composants
3. **Gérer le cycle de vie** (montage/démontage)

### Code Source Expliqué

```javascript
export function useAudioPlayer() {
  // États React synchronisés avec le service
  const [state, setState] = useState(audioPlayer.getState());
  const [source, setSource] = useState(audioPlayer.getSource());
  const [podcastUrl, setPodcastUrl] = useState(audioPlayer.getPodcastUrl());

  // Au montage du composant
  useEffect(() => {
    // S'abonner aux changements du service
    const unsubscribe = audioPlayer.subscribe((audioState) => {
      // Changement détecté → mettre à jour les states React
      setState(audioState.state);
      setSource(audioState.source);
      setPodcastUrl(audioState.podcastUrl);
    });

    // Au démontage : se désabonner (évite fuites mémoire)
    return unsubscribe;
  }, []); // [] = s'exécute une seule fois

  // Retourne tout ce dont l'UI a besoin
  return {
    state, source, podcastUrl,
    isPlaying: state === 'playing',
    isPaused: state === 'paused',
    isLive: source === 'live',
    isPodcast: source === 'podcast',
    playLive: audioPlayer.playLiveStream,
    stopLive: audioPlayer.stopLiveStream,
    playPodcast: audioPlayer.playPodcast,
    pausePodcast: audioPlayer.pausePodcast,
    resumePodcast: audioPlayer.resumePodcast,
    stop: audioPlayer.stop,
  };
}
```

### Flux de Données

```
Service change d'état
    ↓
notifyStateChange() appelée
    ↓
Tous les listeners sont notifiés
    ↓
Hook reçoit notification
    ↓
setState() appelé dans le hook
    ↓
React détecte changement de state
    ↓
Composant se re-render automatiquement
    ↓
UI mise à jour
```

**Tout est automatique !** Le composant n'a rien à gérer manuellement.

---

## � Now Playing API (ajouté v1.1)

### Service : `nowPlaying.js`

**Responsabilités :**
1. Fetch l'API Libretime pour récupérer titre/artiste/artwork
2. Timeout de 5 secondes pour éviter requêtes longues
3. Retourner fallback si erreur

**Endpoint :** `https://radio.c6media.fr/api/live-info`

**Code source :**

```javascript
const NOW_PLAYING_URL = 'https://radio.c6media.fr/api/live-info';
const FETCH_TIMEOUT = 5000;

const DEFAULT_NOW_PLAYING = {
  title: 'C6Radio',
  artist: 'En direct',
  artwork: null,
};

export async function fetchNowPlaying() {
  try {
    const response = await fetchWithTimeout(NOW_PLAYING_URL, FETCH_TIMEOUT);
    
    if (!response.ok) {
      return DEFAULT_NOW_PLAYING;
    }

    const data = await response.json();
    
    return {
export async function fetchNowPlaying() {
  try {
    const response = await fetchWithTimeout(NOW_PLAYING_URL, FETCH_TIMEOUT);
    
    if (!response.ok) {
      return DEFAULT_NOW_PLAYING;
    }

    const data = await response.json();
    
    // Vérifier structure API Libretime
    if (!data.current || !data.current.metadata) {
      return DEFAULT_NOW_PLAYING;
    }

    const metadata = data.current.metadata;
    
    // Nettoyer le titre (retirer extension .wav, .mp3, etc.)
    let title = metadata.track_title || data.current.name || DEFAULT_NOW_PLAYING.title;
    title = title.replace(/\.(wav|mp3|flac|ogg|aac)$/i, '');
    
    return {
      title,
      artist: metadata.artist_name || DEFAULT_NOW_PLAYING.artist,
      artwork: metadata.artwork_url || null,
      startTime: data.current.starts || null,
    };
  } catch (error) {
    console.warn('Erreur fetch now playing:', error);
    return DEFAULT_NOW_PLAYING;
  }
}
```

**Structure API Libretime réelle :**
```json
{
  "current": {
    "starts": "2026-02-13 16:15:31.7281",
    "ends": "2026-02-13 16:19:16.2991",
    "name": " - Club Angel - Stylin'.wav",
    "metadata": {
      "track_title": "Club Angel - Stylin'.wav",
      "artist_name": null,
      "artwork_url": "https://radio.c6media.fr/api/track?id=631&return=artwork"
    }
  }
}
```

**Points clés :**
- **Fetch avec timeout** : Promise.race() contre un timeout
- **Fallback robuste** : toujours retourner des données affichables
- **Nettoyage titre** : regex retire extensions audio (.wav, .mp3, etc.)
- **Artist nullable** : l'API peut retourner `null` → fallback "En direct"
- **Artwork URL** : endpoint API track pour récupérer l'image

**✅ Format validé et testé** (13/02/2026)

---

### Hook : `useNowPlaying.js`

**Responsabilités :**
1. Polling automatique toutes les 12 secondes
2. Actif **uniquement** si live stream joue
3. Gestion erreurs avec compteur (fallback après 3 échecs)

**Code source :**

```javascript
const POLLING_INTERVAL = 12000; // 12 secondes

export function useNowPlaying(shouldPoll = true) {
  const [nowPlaying, setNowPlaying] = useState(getDefaultNowPlaying());
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const fetchData = async () => {
    // Vérifier si live actif
    const currentSource = getSource();
    const currentState = getState();
    
    if (currentSource !== 'live' || currentState !== 'playing') {
      setNowPlaying(getDefaultNowPlaying());
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchNowPlaying();
      setNowPlaying(data);
      setErrorCount(0);
    } catch (err) {
      setErrorCount(prev => prev + 1);
      
      // 3 erreurs consécutives → fallback
      if (errorCount >= 2) {
        setNowPlaying(getDefaultNowPlaying());
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Polling automatique
  useEffect(() => {
    if (!shouldPoll) return;

    fetchData(); // Fetch immédiat

    const intervalId = setInterval(fetchData, POLLING_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [shouldPoll]);

  return { title, artist, artwork, isLoading, refresh: fetchData };
}
```

**Flux de données :**

```
Composant monte
    ↓
Hook s'abonne aux changements player
    ↓
Si live joue → fetchData() immédiat
    ↓
setInterval(fetchData, 12000)
    ↓
Toutes les 12s : fetch API → state React mis à jour
    ↓
Composant re-render avec nouvelles données
    ↓
Si live s'arrête → polling s'arrête automatiquement
```

**Optimisations :**
- ✅ **Polling conditionnel** : pas de requêtes si podcast joue ou rien
- ✅ **Cleanup automatique** : clearInterval() au démontage
- ✅ **Gestion erreurs** : fallback après 3 échecs mais continue polling
- ✅ **Loading state** : permet animations UI

---

### Composant : `NowPlaying.jsx`

**Affichage :** Titre + Artiste + Artwork

**Props :**
- `shouldPoll` (boolean) : active/désactive le polling
- `compact` (boolean) : mode compact (une ligne) ou complet (avec artwork)

**Usage :**

```javascript
import NowPlaying from './NowPlaying';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export function MyPlayer() {
  const { isLive, isPlaying } = useAudioPlayer();

  return (
    <div>
      {/* Polling actif uniquement si live joue */}
      <NowPlaying shouldPoll={isLive && isPlaying} />
    </div>
  );
}
```

**Mode compact (pour footer) :**

```javascript
<NowPlaying shouldPoll={isLive && isPlaying} compact />
// Affiche : "Titre du morceau • Nom de l'artiste"
```

**Mode complet (pour page dédiée) :**

```javascript
<NowPlaying shouldPoll={isLive && isPlaying} />
// Affiche : Artwork 64x64 + Titre + Artiste
```

**Artwork fallback :**
- Si `artwork` présent dans l'API → affiche l'image
- Sinon → affiche `/public/logo.png` (à créer)

---

### Validation Now Playing

**Tests à effectuer :**

1. **Polling actif uniquement si live**
   - Lancer live → ✅ requêtes API toutes les 12s (vérifier Network tab)
   - Stopper live → ✅ requêtes arrêtées
   - Lancer podcast → ✅ requêtes arrêtées

2. **Affichage données**
   - Live joue → ✅ titre/artiste mis à jour toutes les 12s
   - Observer changements dans l'UI

3. **Gestion erreurs**
   - Couper connexion réseau → ✅ fallback affiché après 3 tentatives
   - Rétablir connexion → ✅ données réelles réapparaissent

4. **Format API**
   - Vérifier logs console : `Now Playing data: {...}`
   - Adapter les champs dans `nowPlaying.js` si structure différente

**Commande test réseau (Chrome DevTools) :**
- F12 → Network → Throttling → Offline → Observer comportement

---

## �🎨 Utilisation dans un Composant

### Exemple Simple

```javascript
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function PlayerButton() {
  const { isPlaying, playLive, stop } = useAudioPlayer();

  return (
    <div>
      {isPlaying ? (
        <button onClick={stop}>Stop</button>
      ) : (
        <button onClick={playLive}>Play Live</button>
      )}
    </div>
  );
}
```

**C'est tout !** Pas besoin de gérer l'état local, le hook s'en occupe.

### Exemple Complet (Live + Podcast)

```javascript
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function CompletePlayer() {
  const { 
    state,
    isLive,
    isPodcast,
    isPlaying,
    isPaused,
    playLive,
    playPodcast,
    pausePodcast,
    resumePodcast,
    stop
  } = useAudioPlayer();

  return (
    <div>
      {/* Affichage état */}
      <p>État: {state}</p>
      
      {/* Contrôles Live */}
      <button onClick={playLive}>Play Live</button>
      {isLive && <button onClick={stop}>Stop Live</button>}
      
      {/* Contrôles Podcast */}
      <button onClick={() => playPodcast('URL_PODCAST')}>Play Podcast</button>
      {isPodcast && isPlaying && <button onClick={pausePodcast}>Pause</button>}
      {isPodcast && isPaused && <button onClick={resumePodcast}>Resume</button>}
      {isPodcast && <button onClick={stop}>Stop Podcast</button>}
    </div>
  );
}
```

---

## 🎛️ Composant : PlayerBar (Footer Sticky)

**Fichier :** `src/components/PlayerBar.jsx`  
**Version :** 1.0.0  
**Date :** 13 février 2026 - 18:00

### Objectif

Barre de contrôle audio **sticky en bas de l'écran**, toujours accessible, affichant :
1. **Now Playing** en cours (mode compact) quand le live joue
2. **Contrôles audio** contextuels (Play/Pause/Stop selon l'état)
3. **Affichage conditionnel** : visible uniquement quand un audio est actif

### Caractéristiques

**Position :**
- `fixed bottom-0` → Toujours en bas de l'écran
- `z-50` → Au-dessus du contenu (z-index élevé)
- `backdrop-blur-md` → Effet de flou sur le fond pour meilleure lisibilité

**Responsive :**
- Mobile : contrôles compacts, texte tronqué si nécessaire
- Desktop : espacement optimal avec `max-w-7xl`

**États gérés :**
| État | Affichage gauche | Contrôles droite |
|------|------------------|------------------|
| Aucun audio | *(Composant caché)* | - |
| Live en cours | Now Playing (titre/artiste) | Stop |
| Podcast joue | "🎙️ Podcast en cours..." | Pause + Stop |
| Podcast pausé | "🎙️ Podcast en cours..." | Resume + Stop |

### Code Principal

```jsx
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import NowPlaying from './NowPlaying';

export default function PlayerBar() {
  const {
    state,
    isPlaying,
    isPaused,
    isLive,
    isPodcast,
    playLive,
    pausePodcast,
    resumePodcast,
    stop
  } = useAudioPlayer();

  // Ne rien afficher si aucun audio actif
  if (state === 'idle') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-md border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Section gauche : Now Playing */}
          <div className="flex-1 min-w-0">
            {isLive ? (
              <NowPlaying shouldPoll={isPlaying} compact={true} />
            ) : isPodcast ? (
              <div className="text-sm">🎙️ Podcast en cours...</div>
            ) : null}
          </div>

          {/* Section droite : Contrôles */}
          <div className="flex items-center gap-2">
            {/* Boutons contextuels selon l'état */}
            {/* Voir code complet dans le fichier */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Logique Conditionnelle

**1. Affichage du composant**
```javascript
if (state === 'idle') {
  return null;  // Pas d'audio actif → barre cachée
}
```

**2. Now Playing (section gauche)**
```javascript
{isLive ? (
  <NowPlaying shouldPoll={isPlaying} compact={true} />
) : isPodcast ? (
  <div>🎙️ Podcast en cours...</div>
) : null}
```
- **Live** → Affiche titre/artiste via `<NowPlaying compact />`
- **Podcast** → Message générique (pas de metadata podcast pour l'instant)
- **Idle** → Rien (mais le composant entier est déjà caché)

**3. Contrôles (section droite)**

| Condition | Bouton affiché |
|-----------|----------------|
| Podcast joue (`isPodcast && isPlaying`) | ⏸ Pause + ⏹ Stop |
| Podcast pausé (`isPodcast && isPaused`) | ▶ Resume + ⏹ Stop |
| Live joue (`isLive && isPlaying`) | ⏹ Stop |
| Aucun audio actif (`!isPlaying && !isPaused`) | ▶ Live |

**Code des boutons :**
```jsx
{/* Pause (podcast uniquement) */}
{isPodcast && isPlaying && (
  <button onClick={pausePodcast} className="p-3 bg-yellow-600 rounded-full">
    {/* Icône Pause SVG */}
  </button>
)}

{/* Resume (podcast pausé) */}
{isPodcast && isPaused && (
  <button onClick={resumePodcast} className="p-3 bg-green-600 rounded-full">
    {/* Icône Play SVG */}
  </button>
)}

{/* Stop (toujours visible si audio actif) */}
{(isPlaying || isPaused) && (
  <button onClick={stop} className="p-3 bg-red-600 rounded-full">
    {/* Icône Stop SVG */}
  </button>
)}
```

### Intégration dans App.jsx

```jsx
import PlayerBar from './components/PlayerBar';

function App() {
  return (
    <>
      {/* Contenu de la page */}
      <AudioTest />
      
      {/* PlayerBar sticky footer */}
      <PlayerBar />
    </>
  );
}
```

**Note importante :** Le `<PlayerBar />` doit être au même niveau que le contenu principal (pas imbriqué), pour que la position `fixed` fonctionne correctement.

### Classes CSS Utilisées

**Migration vers CSS pur** (plus simple et fiable que Tailwind pour débutants)

```css
/* Fichier : src/components/PlayerBar.css */

/* Container principal */
.player-bar {
  position: fixed;
  bottom: 0;
  z-index: 50;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(12px);
}

/* Boutons - Palette classique radio */
.player-btn-play {
  background-color: #16a34a;  /* Vert */
}
.player-btn-pause {
  background-color: #eab308;  /* Jaune */
}
.player-btn-stop {
  background-color: #dc2626;  /* Rouge */
}

/* États hover */
.player-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}
```

**Avantages du CSS pur :**
- ✅ Aucune configuration complexe
- ✅ Styles garantis de fonctionner
- ✅ Plus facile à débugger
- ✅ Pas de dépendance externe
- ✅ Idéal pour les débutants

### Tests de Validation PlayerBar

**✅ Test 1 : Affichage conditionnel**
1. Aucun audio actif → PlayerBar invisible
2. Lancer live → PlayerBar apparaît avec Now Playing + bouton Stop
3. Arrêter → PlayerBar disparaît

**✅ Test 2 : Now Playing live**
1. Lancer live → Now Playing affiche titre/artiste (mode compact)
2. Attendre 12s → Vérifier mise à jour automatique
3. Arrêter live → PlayerBar disparaît

**✅ Test 3 : Contrôles podcast**
1. Lancer podcast → PlayerBar affiche "Podcast en cours" + Pause + Stop
2. Cliquer Pause → Bouton devient Resume
3. Cliquer Resume → Bouton redevient Pause
4. Cliquer Stop → PlayerBar disparaît

**✅ Test 4 : Basculement live ↔ podcast**
1. Lancer live → PlayerBar affiche Now Playing
2. Lancer podcast → PlayerBar passe en mode podcast
3. Lancer live → PlayerBar repasse en mode Now Playing

**✅ Test 5 : Responsive**
1. Réduire largeur écran (mobile) → Texte tronqué si trop long (`truncate`)
2. Contrôles restent accessibles et cliquables
3. Boutons ronds restent proportionnés

---

## ✅ Tests de Validation

### Test 1 : Un Seul Audio à la Fois

**Scénario :**
1. Lancer live → ✅ live joue
2. Lancer podcast **sans arrêter** → ✅ live s'arrête automatiquement + podcast joue

**Résultat attendu :** UN SEUL audio actif.

**Logs console :**
```
Arrêt du live pour lancer le podcast
```

---

### Test 2 : Basculement Podcast → Live

**Scénario :**
1. Lancer podcast → ✅ podcast joue
2. Lancer live **sans arrêter** → ✅ podcast s'arrête automatiquement + live joue

**Résultat attendu :** UN SEUL audio actif.

**Logs console :**
```
Arrêt du podcast pour lancer le live
```

---

### Test 3 : Pause Uniquement sur Podcast

**Scénario :**
1. Lancer live → tester pause → ❌ pas de bouton pause
2. Lancer podcast → tester pause → ✅ bouton pause disponible et fonctionne

**Résultat attendu :** Pause disponible uniquement pour podcast.

---

### Test 4 : Buffer Clearing

**Scénario :**
1. Lancer live → attendre 30 secondes
2. Stop → Play immédiatement
3. Vérifier : audio est au point live actuel (pas 30s en retard)

**Résultat attendu :** Pas de décalage (buffer vidé).

---

## 🎯 Garanties de l'Architecture

### 1. Un Seul Audio Actif

**Comment ?**
- Variable unique `audioElement`
- `destroyAudio()` appelée avant chaque nouvelle lecture
- Impossible de créer un 2ème audio sans détruire le premier

### 2. Buffer Toujours Vidé (Live)

**Comment ?**
```javascript
audioElement.src = '';    // Vide la source
audioElement.load();      // Force le nettoyage
```

### 3. Source Trackée

**Comment ?**
- Variable `currentSource` toujours à jour
- Permet de savoir si live ou podcast joue
- UI s'adapte automatiquement (pause visible ou non)

### 4. État Synchronisé

**Comment ?**
- Pattern Observer (subscribe/notify)
- Hook React écoute les changements
- setState() déclenche re-render automatique
- UI toujours cohérente avec l'état réel

---

## 📊 Diagramme de Séquence

### Lancer Live quand Podcast joue

```
Utilisateur clique "Play Live"
    ↓
playLiveStream() appelée
    ↓
Vérifie currentSource === 'podcast' ? OUI
    ↓
destroyAudio() appelée
    ├─ podcast.pause()
    ├─ podcast.src = ''
    ├─ podcast.load()
    └─ audioElement = null
    ↓
createAudio(LIVE_URL)
    ├─ nouvel Audio(LIVE_URL)
    └─ listeners attachés
    ↓
currentSource = 'live'
    ↓
audioElement.play()
    ↓
Événement 'playing' déclenché
    ↓
currentState = 'playing'
    ↓
notifyStateChange()
    ↓
Hook reçoit notification
    ↓
setState('playing')
    ↓
Composant re-render
    ↓
UI mise à jour : bouton "Stop" affiché
```

---

## 🔄 Évolutions Futures

### ✅ Phase 1.1 : Now Playing API (IMPLÉMENTÉ - 13/02/2026)

**Objectif :** Afficher titre/artiste en temps réel. ✅

**Fichiers créés :**
- `src/services/nowPlaying.js` - Fetch API Libretime
- `src/hooks/useNowPlaying.js` - Polling automatique
- `src/components/NowPlaying.jsx` - Composant d'affichage

**Voir section "Now Playing API" ci-dessus pour documentation complète.**

---

### Phase 1.5 : Reconnexion Automatique

**Objectif :** Si le stream coupe (réseau), réessayer automatiquement.

**Fichier à créer :** `src/services/reconnection.js`

**Principe :**
```javascript
// Backoff exponentiel : 3s, 10s, 30s
const RETRY_DELAYS = [3000, 10000, 30000];

audioElement.addEventListener('error', () => {
  // Tentative 1 après 3s
  // Si échec → Tentative 2 après 10s
  // Si échec → Tentative 3 après 30s
  // Si échec → afficher erreur utilisateur
});
```

---

### Phase 2 : Media Session (Lockscreen)

**Objectif :** Contrôles sur écran verrouillé mobile.

**API à utiliser :**
- Web : Media Session API
- Mobile : Capacitor Music Controls

**Updates requises :**
```javascript
// Mettre à jour metadata lockscreen avec Now Playing
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: nowPlaying.title,
    artist: nowPlaying.artist,
    artwork: [{ src: nowPlaying.artwork || '/logo.png', sizes: '512x512', type: 'image/png' }]
  });
  
  // Handlers pour les contrôles
  navigator.mediaSession.setActionHandler('play', () => playLive());
  navigator.mediaSession.setActionHandler('pause', () => stop());
  navigator.mediaSession.setActionHandler('stop', () => stop());
}
```

---

### Phase 3 : Notifications Push

**Objectif :** Notifier l'utilisateur lors d'événements (nouvelle émission, changement programme)

**API à utiliser :** Push API + Service Worker (web) ou Firebase Cloud Messaging (mobile)

---

## 📚 Références

**Documentation utilisée :**
- [HTML5 Audio API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [React Hooks](https://react.dev/reference/react)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)

**Fichiers du projet :**
- [technical-decisions.md](technical-decisions.md) - Décisions architecture globale
- [prd.md](prd.md) - Product Requirements Document

---

**Auteur :** DOFRECORDS  
**Dernière mise à jour :** 13 février 2026  
**Status :** ✅ Implémenté et testé
