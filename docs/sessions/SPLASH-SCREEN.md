# Splash Screen - Documentation

**Date :** 20-02-2026  
**Statut :** ✅ Implémenté

---

## C'est quoi un Splash Screen ?

C'est l'écran qui s'affiche quelques secondes au **lancement de l'application**, avant d'afficher le contenu principal. On le voit dans pratiquement toutes les applis mobiles (Netflix, Spotify, etc.).

---

## Ce qu'on a fait

1. **Logo C6 Radio** centré sur fond sombre, avec une animation d'entrée (monte et apparaît)
2. **Spinner** (anneau rouge tournant) en dessous du logo pour indiquer le chargement
3. **Disparition automatique** après 2,5 secondes avec un fondu
4. **Commentaire pour le jingle audio** (voir ci-dessous)

---

## Fichiers créés / modifiés

| Fichier | Action | Rôle |
|---|---|---|
| `src/components/SplashScreen.jsx` | ✨ Créé | Composant React du splash screen |
| `src/components/SplashScreen.css` | ✨ Créé | Styles et animations CSS |
| `src/App.jsx` | ✏️ Modifié | Ajout de l'overlay de démarrage |

---

## Comment ça fonctionne (pour débutants)

```
    Lancement de l'app
           │
           ▼
    showSplash = true
    (dans App.jsx)
           │
           ▼
    <SplashScreen> s'affiche
    (overlay par-dessus tout)
           │
           ▼ (après 2500ms)
    Animation de sortie (fondu 0.5s)
           │
           ▼
    onComplete() est appelé
           │
           ▼
    showSplash = false
    → SplashScreen disparaît
    → L'app est visible normalement
```

**Concept clé :** l'overlay a `position: fixed` et `z-index: 9999`, ce qui le place physiquement au-dessus de toute l'application. L'app se charge normalement en arrière-plan pendant que le splash est visible.

---

## Ajouter un jingle audio

Pour jouer un son au lancement :

1. **Dépose ton fichier audio** dans le dossier `/public/` — par exemple `jingle.mp3`
2. **Ouvre** `src/components/SplashScreen.jsx`
3. **Dans le `useEffect`**, décommente ces 3 lignes :

```js
const audio = new Audio('/jingle.mp3');
audio.volume = 0.7;      // Volume entre 0 et 1
audio.play().catch(() => {}); // Le .catch() évite une erreur si le navigateur bloque l'autoplay
```

> ⚠️ **Note :** Les navigateurs web bloquent parfois l'autoplay audio (le son ne joue pas si l'utilisateur n'a pas encore interagi avec la page). Sur une appli mobile Capacitor, ce problème ne se pose pas.

---

## Personnalisation

### Changer la durée d'affichage

Dans `src/App.jsx`, modifie la prop `duration` (en millisecondes) :

```jsx
// Afficher pendant 3 secondes
<SplashScreen onComplete={() => setShowSplash(false)} duration={3000} />
```

### Changer la couleur du spinner

Dans `src/components/SplashScreen.css`, modifie `border-top-color` :

```css
.splash-spinner {
  border-top-color: #e63946; /* Rouge C6 - change cette valeur */
}
```

### Changer la taille du logo

Dans `src/components/SplashScreen.css` :

```css
.splash-logo {
  width: 220px; /* Change cette valeur */
}
```

---

## Évolutions possibles

- [ ] Jingle audio avec fichier `/public/jingle.mp3`
- [ ] Animation du logo (rotation, pulsation, effet de lumière)
- [ ] Ne pas afficher le splash si l'app était déjà ouverte dans l'onglet (via `sessionStorage`)
- [ ] Version adaptée pour Capacitor iOS/Android (avec le plugin `@capacitor/splash-screen`)
