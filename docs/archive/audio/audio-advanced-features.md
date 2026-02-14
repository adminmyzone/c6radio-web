# Fonctionnalités Avancées Audio Player

**Date de création :** 13 février 2026  
**Version :** 1.3.0  
**Complément de :** [audio-player-feature.md](audio-player-feature.md)

---

## 📑 Table des Matières

1. [Reconnexion Automatique](#reconnexion-automatique)
2. [Media Session API](#media-session-api)
3. [Initialisation Globale](#initialisation-globale)
4. [Tests de Validation](#tests-de-validation)

---

## 🔄 Reconnexion Automatique

### Vue d'Ensemble

Quand le stream audio coupe (WiFi instable, serveur temporairement down, tunnel...), le système réessaie automatiquement de se reconnecter avec des délais croissants.

### Principe : Backoff Exponentiel

**Pourquoi attendre plus longtemps à chaque tentative ?**

```
Erreur détectée
    ↓
Attendre 3 secondes  → Tentative 1
    ↓ (si échec)
Attendre 10 secondes → Tentative 2
    ↓ (si échec)
Attendre 30 secondes → Tentative 3
    ↓ (si échec)
Abandonner → Afficher message utilisateur
```

**Raisons :**
- La plupart des coupures courtes se résolvent en 3-10 secondes
- Évite de surcharger le serveur avec trop de requêtes rapides
- Les problèmes sérieux nécessitent plus de temps pour se résoudre

### Fichier : `reconnectionManager.js`

**Variables principales :**

```javascript
const RETRY_DELAYS = [3000, 10000, 30000]; // Délais : 3s, 10s, 30s
const MAX_RETRIES = 3;                      // Maximum 3 tentatives

let retryCount = 0;          // Compteur de tentatives
let reconnectTimer = null;   // ID du timer en cours
```

### API Publique

#### `setupReconnection(onRetry, onFailure)`

**Rôle :** Configure les fonctions appelées lors d'une tentative de reconnexion.

**Paramètres :**
- `onRetry` : Fonction appelée pour chaque tentative (relance le stream)
- `onFailure` : Fonction appelée si toutes les tentatives échouent

**Exemple :**

```javascript
import * as reconnectionManager from './reconnectionManager.js';

reconnectionManager.setupReconnection(
  // Callback retry : relancer le stream
  () => {
    console.log('Tentative de reconnexion...');
    playLiveStream();
  },
  
  // Callback échec : notifier l'utilisateur
  () => {
    console.error('Impossible de se connecter après 3 tentatives');
    // TODO: afficher un toast notification
    currentState = 'error';
  }
);
```

#### `startReconnection()`

**Rôle :** Démarre le processus de reconnexion.

**Appelée automatiquement** quand l'événement `error` de l'audio est déclenché.

**Logique :**

```javascript
export function startReconnection() {
  // Vérifier si déjà en cours
  if (reconnectTimer !== null) return;
  
  // Vérifier si max tentatives atteint
  if (retryCount >= MAX_RETRIES) {
    failureCallback(); // Abandonner
    reset();
    return;
  }
  
  // Récupérer le délai pour cette tentative
  const delay = RETRY_DELAYS[retryCount];
  
  console.log(`Reconnexion ${retryCount + 1}/${MAX_RETRIES} dans ${delay / 1000}s`);
  
  // Lancer le timer
  reconnectTimer = setTimeout(() => {
    retryCount++;
    reconnectTimer = null;
    retryCallback(); // Réessayer
  }, delay);
}
```

#### `cancelReconnection()`

**Rôle :** Annule toute reconnexion en cours.

**Utilisé quand :** L'utilisateur arrête manuellement le stream pendant qu'une reconnexion est planifiée.

```javascript
export function cancelReconnection() {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  reset();
}
```

#### `reset()`

**Rôle :** Réinitialise le compteur de tentatives à 0.

**Appelée automatiquement** quand l'audio joue avec succès.

```javascript
export function reset() {
  retryCount = 0;
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}
```

### Intégration dans audioPlayer.js

**1. Configuration au démarrage (dans `initializeAudioPlayer()`) :**

```javascript
reconnectionManager.setupReconnection(
  // Retry : relancer le stream
  () => playLiveStream(),
  
  // Échec total : marquer comme erreur
  () => {
    console.error('Échec connexion après plusieurs tentatives');
    currentState = 'error';
    notifyStateChange();
  }
);
```

**2. Détection erreur et déclenchement :**

```javascript
audioElement.addEventListener('error', (e) => {
  console.error('Erreur audio:', e);
  currentState = 'error';
  notifyStateChange();
  
  // Si c'est le live qui a planté, essayer de reconnecter
  if (currentSource === 'live') {
    console.log('Erreur sur live stream → Démarrage reconnexion automatique');
    reconnectionManager.startReconnection();
  }
});
```

**3. Réinitialisation si succès :**

```javascript
audioElement.addEventListener('playing', () => {
  currentState = 'playing';
  notifyStateChange();
  
  // Audio joue avec succès → réinitialiser le compteur de reconnexion
  reconnectionManager.reset();
});
```

**4. Annulation si stop manuel :**

```javascript
export function stopLiveStream() {
  // Annuler toute reconnexion en cours
  reconnectionManager.cancelReconnection();
  
  destroyAudio();
  currentState = 'stopped';
  currentSource = null;
  notifyStateChange();
}
```

### Tests de Validation

#### ✅ Test 1 : Coupure courte (3 secondes)

**Scénario :**
1. Lancer live → attendre que ça joue
2. Ouvrir DevTools (F12) → onglet Network → Throttling → **Offline**
3. Observer console : `Tentative de reconnexion 1/3 dans 3s...`
4. Remettre **Online** après 2 secondes
5. Observer : `Reconnexion tentative 1...` → Stream reprend

**Résultat attendu :** ✅ Stream reprend automatiquement sans action utilisateur

---

#### ✅ Test 2 : Coupure moyenne (10 secondes)

**Scénario :**
1. Lancer live
2. Passer **Offline** et rester 5 secondes
3. Observer : `Tentative 1... échec` → `Tentative 2/3 dans 10s...`
4. Remettre **Online**
5. Observer : Stream reprend après le délai de 10s

**Résultat attendu :** ✅ Backoff fonctionne, délai augmente

---

#### ✅ Test 3 : Échec total (abandon)

**Scénario :**
1. Lancer live
2. Passer **Offline** et ne **JAMAIS** remettre Online
3. Observer console :
   - `Tentative 1/3 dans 3s...`
   - `Tentative 2/3 dans 10s...`
   - `Tentative 3/3 dans 30s...`
   - `Échec après 3 tentatives de reconnexion`

**Résultat attendu :** ✅ Message d'échec affiché, pas de boucle infinie

---

#### ✅ Test 4 : Annulation manuelle

**Scénario :**
1. Lancer live → passer **Offline** → reconnexion démarre
2. Observer console : `Tentative 1/3 dans 3s...`
3. **Cliquer Stop** avant la fin du timer (dans les 3 secondes)
4. Observer console : `Reconnexion annulée`

**Résultat attendu :** ✅ Timer stoppé, aucune tentative effectuée

---

## 📻 Media Session API

### Vue d'Ensemble

Media Session API permet d'afficher les informations du stream (titre, artiste, image) dans les **contrôles natifs** du système d'exploitation et du navigateur.

### Qu'est-ce que c'est ?

C'est une fonctionnalité native des navigateurs modernes qui connecte ton application audio avec les contrôles media du système.

**Sur ORDINATEUR :**
- Widget media dans la barre de notification (Chrome, Edge, Firefox)
- Touches média du clavier (Play/Pause génériques)
- Extension navigateur pour contrôles media

**Sur TÉLÉPHONE :**
- Écran verrouillé (titre/artiste/image + boutons)
- Barre de notification (Android)
- Control Center (iOS)
- Contrôles Bluetooth (casque, voiture)

### Exemple Visuel

**Écran verrouillé Android/iOS :**
```
┌─────────────────────────────────┐
│  🎵  C6Radio                    │
│                                  │
│  [  Image   ]                    │
│   Album     │  Bohemian Rhapsody│
│   Cover     │  Queen            │
│             │                    │
│      ⏮  ⏸  ⏭                   │
└─────────────────────────────────┘
```

**Widget navigateur Chrome :**
```
┌───────────────────────────┐
│ 🎵 Bohemian Rhapsody      │
│    Queen - C6Radio Live   │
│    [⏸] [⏹]               │
└───────────────────────────┘
```

### Fichier : `mediaSession.js`

**Variables principales :**

```javascript
let playCallback = null;    // Fonction appelée si Play cliqué
let pauseCallback = null;   // Fonction appelée si Pause cliqué
let stopCallback = null;    // Fonction appelée si Stop cliqué

let currentMetadata = {     // Métadonnées actuelles
  title: 'C6Radio',
  artist: 'En direct',
  artwork: null
};
```

### API Publique

#### `setupMediaSession(onPlay, onPause, onStop)`

**Rôle :** Configure les gestionnaires d'actions au démarrage.

**Paramètres :**
- `onPlay` : Fonction appelée quand Play cliqué dans contrôles natifs
- `onPause` : Fonction appelée quand Pause cliqué
- `onStop` : Fonction appelée quand Stop cliqué

**Exemple :**

```javascript
import * as mediaSession from './mediaSession.js';

mediaSession.setupMediaSession(
  // Play : relancer stream ou reprendre podcast
  () => {
    if (currentSource === 'live') {
      playLiveStream();
    } else if (currentSource === 'podcast') {
      resumePodcast();
    }
  },
  
  // Pause : uniquement pour podcast
  () => {
    if (currentSource === 'podcast') {
      pausePodcast();
    }
  },
  
  // Stop : arrêter tout
  () => {
    stop();
  }
);
```

**Ce qui se passe sous le capot :**

```javascript
// API native du navigateur
navigator.mediaSession.setActionHandler('play', () => {
  console.log('Media Session: Play déclenché');
  if (playCallback) {
    playCallback(); // Appelle la fonction configurée
  }
});
```

#### `updateMetadata(metadata)`

**Rôle :** Met à jour les métadonnées affichées dans les contrôles natifs.

**Paramètres :**
- `metadata.title` : Titre du morceau
- `metadata.artist` : Nom de l'artiste
- `metadata.artwork` : URL de l'image (optionnel)

**Exemple :**

```javascript
mediaSession.updateMetadata({
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  artwork: 'https://radio.c6media.fr/api/track?id=631&return=artwork'
});
```

**Résultat :** Les contrôles natifs affichent immédiatement les nouvelles infos ! 🎵

**Format API native :**

```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'C6Radio Live',
  artwork: [
    {
      src: 'https://example.com/album.jpg',
      sizes: '512x512',   // Taille recommandée
      type: 'image/png'
    }
  ]
});
```

#### `setPlaybackState(state)`

**Rôle :** Change l'icône du bouton Play/Pause dans les contrôles.

**Paramètres :**
- `'playing'` : Affiche icône ⏸ (Pause)
- `'paused'` : Affiche icône ▶ (Play)
- `'none'` : Aucun contrôle actif

**Exemple :**

```javascript
// Quand l'audio démarre
mediaSession.setPlaybackState('playing'); // Bouton devient ⏸

// Quand l'audio pause
mediaSession.setPlaybackState('paused');  // Bouton devient ▶

// Quand l'audio s'arrête
mediaSession.setPlaybackState('none');    // Désactive contrôles
```

#### `clearMediaSession()`

**Rôle :** Efface toutes les métadonnées et réinitialise l'état.

**Utilisé quand :** L'audio est complètement arrêté.

```javascript
// Dans stopLiveStream()
destroyAudio();
mediaSession.clearMediaSession(); // ✅ Efface tout
```

### Intégration dans audioPlayer.js

**1. Configuration au démarrage :**

```javascript
// Dans initializeAudioPlayer()
mediaSession.setupMediaSession(
  // Play
  () => {
    if (currentSource === 'live') playLiveStream();
    else if (currentSource === 'podcast') resumePodcast();
    else playLiveStream(); // Par défaut
  },
  // Pause
  () => {
    if (currentSource === 'podcast') pausePodcast();
  },
  // Stop
  () => stop()
);
```

**2. Mise à jour état lecture :**

```javascript
audioElement.addEventListener('playing', () => {
  currentState = 'playing';
  mediaSession.setPlaybackState('playing'); // Bouton → ⏸
});

audioElement.addEventListener('pause', () => {
  if (currentSource === 'podcast') {
    currentState = 'paused';
    mediaSession.setPlaybackState('paused'); // Bouton → ▶
  }
});
```

**3. Effacement au stop :**

```javascript
export function stopLiveStream() {
  destroyAudio();
  currentState = 'stopped';
  mediaSession.clearMediaSession(); // ✅ Efface métadonnées
}
```

### Mise à Jour Automatique avec Now Playing

Le hook `useNowPlaying` synchronise automatiquement les métadonnées :

**Fichier : `useNowPlaying.js`**

```javascript
// Effect : Mettre à jour Media Session automatiquement
useEffect(() => {
  const currentSource = getSource();
  const currentState = getState();
  
  // Mettre à jour uniquement si live joue
  if (currentSource === 'live' && currentState === 'playing') {
    updateNowPlayingMetadata({
      title: nowPlaying.title,
      artist: nowPlaying.artist,
      artwork: nowPlaying.artwork
    });
    
    console.log('📻 Media Session mis à jour:', nowPlaying.title);
  }
}, [nowPlaying]); // ✅ Se déclenche à chaque changement
```

**Flux complet :**

```
API Libretime retourne nouveau morceau (polling 12s)
    ↓
useNowPlaying reçoit les données
    ↓
useEffect détecte changement de nowPlaying
    ↓
updateNowPlayingMetadata() appelée
    ↓
mediaSession.updateMetadata() exécutée
    ↓
navigator.mediaSession.metadata mise à jour
    ↓
Contrôles natifs affichent nouvelles infos ✅
```

**Résultat :** Toutes les 12 secondes, les contrôles natifs se mettent à jour automatiquement avec le nouveau morceau !

### Compatibilité Navigateurs

| Navigateur | Desktop | Mobile | Lockscreen |
|------------|---------|--------|------------|
| Chrome     | ✅ 73+ | ✅ 57+ | ✅         |
| Edge       | ✅ 79+ | ✅     | ✅         |
| Firefox    | ✅ 82+ | ✅ 82+ (Android) | ✅         |
| Safari     | ✅ 14.1+ | ✅ 13.4+ (iOS) | ✅         |
| Opera      | ✅ 60+ | ✅     | ✅         |

**Graceful Degradation :**

Le code vérifie automatiquement le support :

```javascript
function isMediaSessionSupported() {
  return 'mediaSession' in navigator;
}

export function updateMetadata(metadata) {
  // Si non supporté, rien ne plante
  if (!isMediaSessionSupported()) {
    return; // ❌ Non supporté → rien faire
  }
  
  // ✅ Supporté → continuer normalement
  navigator.mediaSession.metadata = new MediaMetadata({ ... });
}
```

**Résultat :** Sur navigateurs anciens, l'app fonctionne normalement mais sans les contrôles natifs.

### Tests de Validation

#### ✅ Test 1 : Affichage métadonnées (Desktop)

**Scénario :**
1. Lancer live dans Chrome
2. Observer barre de notification (icône 🎵 en haut à droite)
3. Cliquer sur l'icône → panneau s'ouvre
4. Vérifier : titre, artiste, image affichés

**Résultat attendu :** ✅ Métadonnées correctement affichées

---

#### ✅ Test 2 : Mise à jour temps réel

**Scénario :**
1. Live en cours, contrôles natifs ouverts
2. Attendre 12 secondes (changement morceau sur API)
3. Observer panneau : titre/artiste changent automatiquement

**Résultat attendu :** ✅ Synchronisation parfaite, pas de refresh manuel

---

#### ✅ Test 3 : Contrôles fonctionnels

**Scénario :**
1. Lancer live depuis l'UI
2. Cliquer **Stop** dans widget natif
3. Observer : audio s'arrête + PlayerBar disparaît

**Résultat attendu :** ✅ Action déclenchée correctement

---

#### ✅ Test 4 : Mobile Lockscreen

**Prérequis :** Téléphone iOS/Android, navigateur Chrome/Safari

**Scénario :**
1. Ouvrir app web, lancer live
2. Verrouiller l'écran
3. Observer écran verrouillé : contrôles affichés avec titre/artiste
4. Cliquer **Stop** depuis lockscreen
5. Déverrouiller et observer : audio arrêté

**Résultat attendu :** ✅ Contrôles lockscreen fonctionnels

---

#### ✅ Test 5 : Touches clavier média (Desktop)

**Prérequis :** Clavier avec touches média (Play/Pause)

**Scénario :**
1. Lancer live
2. Appuyer sur touche **Play/Pause** du clavier
3. Observer console : `Media Session: Pause déclenché` (ou Play)

**Résultat attendu :** ✅ Touches média reconnues et gérées

---

## 🚀 Initialisation Globale

### Fonction : `initializeAudioPlayer()`

**Rôle :** Configure tous les services audio au démarrage de l'application.

**Où l'appeler :** Une seule fois dans `main.jsx`, avant le rendu de l'app.

**Fichier : `main.jsx`**

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ✅ Initialiser le player audio (reconnexion + media session)
import { initializeAudioPlayer } from './services/audioPlayer.js'
initializeAudioPlayer();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Que fait `initializeAudioPlayer()` ?

**Étape 1 : Vérifier si déjà initialisé**

```javascript
if (isInitialized) {
  console.log('Audio Player déjà initialisé');
  return; // Évite double initialisation
}
```

**Étape 2 : Configurer reconnexion automatique**

```javascript
reconnectionManager.setupReconnection(
  // Callback retry
  () => {
    console.log('Tentative de reconnexion...');
    playLiveStream();
  },
  // Callback échec
  () => {
    console.error('Impossible de se connecter après plusieurs tentatives');
    currentState = 'error';
    notifyStateChange();
  }
);
```

**Étape 3 : Configurer Media Session**

```javascript
mediaSession.setupMediaSession(
  // Play
  () => {
    if (currentSource === 'live') playLiveStream();
    else if (currentSource === 'podcast') resumePodcast();
    else playLiveStream();
  },
  // Pause
  () => {
    if (currentSource === 'podcast') pausePodcast();
  },
  // Stop
  () => stop()
);
```

**Étape 4 : Marquer comme initialisé**

```javascript
isInitialized = true;
console.log('✅ Audio Player initialisé avec succès');
```

### Logs Console au Démarrage

Quand tu lances l'app, tu dois voir :

```
🎵 Initialisation Audio Player...
Reconnection Manager configuré
Media Session configuré avec succès
✅ Audio Player initialisé avec succès
```

---

## 📋 Résumé de l'Architecture Complète

### Services

| Fichier | Rôle | Fonctions principales |
|---------|------|----------------------|
| `audioPlayer.js` | Gestion centrale audio | playLiveStream(), stop(), subscribe() |
| `nowPlaying.js` | Fetch API Libretime | fetchNowPlaying() |
| `reconnectionManager.js` | Reconnexion auto | startReconnection(), reset() |
| `mediaSession.js` | Contrôles natifs | updateMetadata(), setPlaybackState() |

### Hooks

| Fichier | Rôle | Retourne |
|---------|------|----------|
| `useAudioPlayer.js` | Interface React player | state, playLive(), stop(), etc. |
| `useNowPlaying.js` | Polling + sync Media Session | title, artist, artwork |

### Initialisation

```javascript
// main.jsx
initializeAudioPlayer() → Configure tout au démarrage
```

### Flux de Données

```
User clique Play
    ↓
playLiveStream() appelée
    ↓
Audio démarre → événement 'playing'
    ↓
reconnectionManager.reset() (compteur à 0)
mediaSession.setPlaybackState('playing')
    ↓
NOW PLAYING polling démarre (12s)
    ↓
Toutes les 12s : fetch API
    ↓
useNowPlaying reçoit données
    ↓
useEffect → updateNowPlayingMetadata()
    ↓
Media Session mis à jour
    ↓
Contrôles natifs affichent nouvelles infos ✅
```

---

## 🧪 Checklist de Tests Complète

### Tests Fonctionnels Audio Core

- [ ] Play live → audio joue
- [ ] Stop live → audio s'arrête + buffer vidé
- [ ] Play podcast → audio joue
- [ ] Pause podcast → audio pause
- [ ] Resume podcast → audio reprend
- [ ] Basculement live → podcast → live s'arrête automatiquement
- [ ] Basculement podcast → live → podcast s'arrête automatiquement

### Tests Now Playing

- [ ] Live joue → métadonnées affichées
- [ ] Attendre 12s → métadonnées mises à jour
- [ ] Stop live → métadonnées disparaissent
- [ ] Passer en mode podcast → métadonnées disparaissent

### Tests Reconnexion

- [ ] Coupure courte (3s) → reconnexion auto
- [ ] Coupure moyenne (10s) → backoff fonctionne
- [ ] Coupure longue (30s+) → abandon après 3 tentatives
- [ ] Stop manuel pendant reconnexion → timer annulé

### Tests Media Session

#### Desktop
- [ ] Widget navigateur affiche métadonnées
- [ ] Cliquer Stop dans widget → audio s'arrête
- [ ] Touches média clavier fonctionnent
- [ ] Métadonnées actualisées toutes les 12s

#### Mobile
- [ ] Contrôles lockscreen affichés
- [ ] Titre/artiste/image visibles
- [ ] Stop depuis lockscreen fonctionne
- [ ] Bluetooth contrôles fonctionnent (si disponible)

### Tests Navigateurs

- [ ] Chrome Desktop (Windows/Mac/Linux)
- [ ] Firefox Desktop
- [ ] Edge Desktop
- [ ] Safari Desktop (Mac)
- [ ] Chrome Mobile (Android)
- [ ] Firefox Mobile (Android)
- [ ] Safari Mobile (iOS)

---

## 📚 Ressources Utiles

**Documentation Officielle :**
- [Media Session API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)
- [HTML5 Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [Backoff Algorithms - Wikipedia](https://en.wikipedia.org/wiki/Exponential_backoff)

**Exemples Google :**
- [Media Session Samples](https://googlechrome.github.io/samples/media-session/)

**Outils de Test :**
- Chrome DevTools → Network → Throttling (simuler coupures)
- Chrome DevTools → Console (observer logs reconnexion)
- about:inspect (Chrome) → Observer metadata en temps réel

---

**Auteur :** DOFRECORDS  
**Dernière mise à jour :** 13 février 2026  
**Status :** ✅ Phase 1 Audio Core complétée à 100%
