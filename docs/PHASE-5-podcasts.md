# Phase 5 : Podcasts MP3

**Date :** Février 2026  
**Statut :** ✅ Complété  
**Durée :** ~2 heures

---

## 🎯 Objectif

Permettre la lecture de podcasts MP3 attachés aux articles WordPress, en respectant la règle **GlobalAudioContext** : un seul audio à la fois.

---

## 📦 Fichiers Modifiés

- `src/services/wordpress.js` - Ajout champ `podcastAudioUrl`
- `src/pages/NewsDetail.jsx` - Ajout player podcast
- `src/contexts/GlobalAudioContext.jsx` - Gestion conflits audio

---

## ⚡ Fonctionnalités

**Player Podcast :**
- ✅ Lecture/pause MP3
- ✅ Barre de progression
- ✅ Durée totale / temps écoulé
- ✅ Métadonnées (Media Session API)
- ✅ Intégration GlobalAudioContext

**Gestion conflits :**
- ✅ Stream s'arrête si podcast lance
- ✅ Podcast s'arrête si stream lance
- ✅ Un seul audio actif à la fois

---

## 🏗️ Architecture

**Règle d'or :** Avant de lancer un audio, vérifier `GlobalAudioContext.currentSource`

```javascript
// NewsDetail.jsx - Avant de lancer podcast
const handlePlayPodcast = () => {
  stopAllAudio(); // Arrête stream si actif
  playPodcast();
  setCurrentSource('podcast');
};
```

---

## 🔧 Configuration WordPress

**Champ ACF requis :**
- Nom : `c6_podcast_audio`
- Type : URL ou File
- Format : MP3

**Usage dans article :**
1. Éditer article WordPress
2. Remplir champ "Podcast Audio"
3. Publier
4. Player s'affiche automatiquement dans détail

---

## ✅ Résultat Final

- ✅ Podcasts MP3 fonctionnels
- ✅ Pas de conflit avec stream radio
- ✅ Player intégré aux articles
- ✅ Contrôles natifs iOS

---

**Phase 5 : ✅ Succès - Podcasts opérationnels !**
