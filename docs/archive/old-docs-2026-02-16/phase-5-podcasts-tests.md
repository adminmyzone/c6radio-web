# Guide de Test Rapide - Podcasts WordPress

**Date :** 15 février 2026  
**Phase :** 5 - Podcasts  
**Durée test :** ~10 minutes

---

## 🎯 Objectif du Test

Valider que les podcasts MP3 intégrés dans les articles fonctionnent correctement et respectent la règle "un seul audio à la fois".

---

## 🔧 Prérequis

### Côté WordPress

1. **Plugin ACF installé et activé**
2. **Champ ACF `c6_podcast_audio` créé** (type File/URL)
3. **Au moins 1 article avec fichier audio MP3**

**⚠️ Si vous n'avez pas encore configuré WordPress :**
Créez un article de test avec un lien vers n'importe quel MP3 public :
- Exemple : `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`

### Côté Application

1. **Dev server lancé :** `npm run dev`
2. **Console navigateur ouverte :** F12
3. **Pas d'erreurs dans console**

---

## ✅ Tests à Effectuer

### Test 1 : Article avec Podcast

**Objectif :** Vérifier que le lecteur s'affiche

**Étapes :**
1. Ouvrir http://localhost:5173/news
2. Identifier un article qui a un podcast (vous devez le savoir côté WordPress)
3. Cliquer sur l'article
4. **VÉRIFIER :** Un lecteur podcast s'affiche sous l'en-tête
5. **VÉRIFIER :** Lecteur contient :
   - Icône 🎙️
   - Titre "Podcast audio"
   - Bouton "▶️ Écouter"
   - Temps "00:00 / 00:00"
   - Barre de progression vide

**✅ Succès si :** Lecteur visible et bien formaté  
**❌ Échec si :** Lecteur absent ou cassé

---

### Test 2 : Article sans Podcast

**Objectif :** Vérifier que le lecteur ne s'affiche PAS

**Étapes :**
1. Ouvrir http://localhost:5173/news
2. Cliquer sur un article qui N'A PAS de podcast
3. **VÉRIFIER :** Aucun lecteur podcast visible
4. **VÉRIFIER :** Article s'affiche normalement

**✅ Succès si :** Pas de lecteur, pas d'erreur  
**❌ Échec si :** Lecteur vide ou erreur

---

### Test 3 : Lecture Podcast

**Objectif :** Vérifier que le podcast démarre

**Étapes :**
1. Ouvrir un article avec podcast
2. Cliquer sur "▶️ Écouter"
3. **VÉRIFIER :** Bouton change en "⏳ Chargement..."
4. Attendre 1-2 secondes
5. **VÉRIFIER :** Bouton change en "⏹️ Stop"
6. **VÉRIFIER :** Audio se lance (entendre le son)
7. **VÉRIFIER :** Barre de progression commence à bouger
8. **VÉRIFIER :** Temps actuel augmente (ex: 00:01, 00:02...)
9. **VÉRIFIER :** Durée totale s'affiche (ex: 00:00 / 03:45)

**Console :**
```
[WordPress API] Post loaded: Titre Article
[GlobalAudio] Registering player: podcast
[Audio Player] Starting podcast...
```

**✅ Succès si :** Audio joue, progression visible  
**❌ Échec si :** Aucun son, barre immobile, erreur console

---

### Test 4 : Stop Podcast

**Objectif :** Vérifier l'arrêt

**Étapes :**
1. Lancer un podcast (Test 3)
2. Attendre 3-5 secondes
3. Cliquer sur "⏹️ Stop"
4. **VÉRIFIER :** Audio s'arrête immédiatement
5. **VÉRIFIER :** Bouton change en "▶️ Écouter"
6. **VÉRIFIER :** Temps reset à "00:00"
7. **VÉRIFIER :** Barre de progression vide

**✅ Succès si :** Arrêt propre, reset complet  
**❌ Échec si :** Audio continue, bouton ne change pas

---

### Test 5 : GlobalAudioContext - Podcast → Live

**Objectif :** Vérifier règle "un seul audio"

**Étapes :**
1. Lancer un podcast (Test 3)
2. Laisser jouer 5 secondes
3. Scroller en bas de page
4. Cliquer sur "▶️ Écouter le direct" dans PlayerBar (footer)
5. **VÉRIFIER :** Podcast s'arrête automatiquement
6. **VÉRIFIER :** Bouton podcast revient à "▶️ Écouter"
7. **VÉRIFIER :** Live stream démarre
8. **VÉRIFIER :** PlayerBar affiche "⏹️ Arrêter le direct"

**Console :**
```
[GlobalAudio] Registering player: live
[GlobalAudio] Pausing previous player: podcast
[Audio Player] Stopping podcast
[Audio Player] Starting live stream...
```

**✅ Succès si :** Basculement propre, un seul audio actif  
**❌ Échec si :** Deux audios simultanés, crash

---

### Test 6 : GlobalAudioContext - Live → Podcast

**Objectif :** Vérifier règle inverse

**Étapes :**
1. Lancer le live stream depuis PlayerBar
2. Laisser jouer 5 secondes
3. Naviguer vers un article avec podcast
4. Cliquer sur "▶️ Écouter" du podcast
5. **VÉRIFIER :** Live s'arrête automatiquement
6. **VÉRIFIER :** PlayerBar revient à "▶️ Écouter le direct"
7. **VÉRIFIER :** Podcast démarre
8. **VÉRIFIER :** Bouton podcast → "⏹️ Stop"

**Console :**
```
[GlobalAudio] Registering player: podcast
[GlobalAudio] Pausing previous player: live
[Audio Player] Stopping live
[Audio Player] Starting podcast...
```

**✅ Succès si :** Basculement propre  
**❌ Échec si :** Deux audios, erreur

---

### Test 7 : Responsive Mobile

**Objectif :** Vérifier affichage mobile

**Étapes :**
1. Ouvrir DevTools (F12)
2. Activer mode mobile (Ctrl+Shift+M)
3. Choisir "iPhone 12 Pro" ou similaire
4. Ouvrir un article avec podcast
5. **VÉRIFIER :** Lecteur bien affiché
6. **VÉRIFIER :** Bouton et temps en colonne (pas côte à côte)
7. **VÉRIFIER :** Texte lisible (pas trop petit)
8. **VÉRIFIER :** Zones cliquables assez larges

**✅ Succès si :** UI adapté mobile  
**❌ Échec si :** Texte coupé, bouton trop petit

---

### Test 8 : Erreur URL Invalide

**Objectif :** Vérifier gestion erreurs

**⚠️ Requiert modification temporaire WordPress :**
1. Créer un article test avec URL MP3 invalide :
   - Ex: `https://example.com/inexistant.mp3`
2. Ouvrir l'article
3. Cliquer "▶️ Écouter"
4. **VÉRIFIER :** Message d'erreur s'affiche :
   - "⚠️ Erreur de lecture. Vérifiez votre connexion."
5. **VÉRIFIER :** Pas de crash
6. **VÉRIFIER :** Console affiche erreur mais pas de crash app

**Console :**
```
[Audio Player] Error loading podcast: [error details]
```

**✅ Succès si :** Erreur gracieuse, pas de crash  
**❌ Échec si :** App plante, page blanche

---

### Test 9 : Navigation Pendant Lecture

**Objectif :** Vérifier que l'audio continue

**Étapes :**
1. Lancer un podcast
2. Pendant lecture, cliquer sur "Actualités" (header)
3. **VÉRIFIER :** Audio continue de jouer
4. Cliquer sur "Accueil"
5. **VÉRIFIER :** Audio continue
6. Retourner à l'article
7. **VÉRIFIER :** Bouton toujours "⏹️ Stop"
8. **VÉRIFIER :** Progression correcte

**✅ Succès si :** Audio persiste entre pages  
**❌ Échec si :** Audio s'arrête au changement page

---

### Test 10 : Fin de Podcast

**Objectif :** Vérifier comportement fin de fichier

**Étapes :**
1. Trouver un podcast court (< 1 minute) ou...
2. **Triche :** Dans console navigateur :
   ```javascript
   // Avancer manuellement vers la fin
   document.querySelector('audio').currentTime = document.querySelector('audio').duration - 5;
   ```
3. Attendre que le podcast se termine
4. **VÉRIFIER :** Bouton revient à "▶️ Écouter"
5. **VÉRIFIER :** Temps reset à "00:00"
6. **VÉRIFIER :** Barre de progression vide
7. **VÉRIFIER :** Pas d'erreur console

**✅ Succès si :** Reset propre fin de lecture  
**❌ Échec si :** Bloqué en fin, erreur

---

## 📋 Résumé Résultats

| Test | Statut | Notes |
|------|--------|-------|
| 1. Article avec podcast | ⬜ | |
| 2. Article sans podcast | ⬜ | |
| 3. Lecture podcast | ⬜ | |
| 4. Stop podcast | ⬜ | |
| 5. Podcast → Live | ⬜ | |
| 6. Live → Podcast | ⬜ | |
| 7. Responsive mobile | ⬜ | |
| 8. Erreur URL | ⬜ | |
| 9. Navigation pendant lecture | ⬜ | |
| 10. Fin de podcast | ⬜ | |

**Légende :**
- ✅ : Test réussi
- ❌ : Test échoué
- ⬜ : Pas encore testé

---

## 🐛 Problèmes Courants

### Lecteur ne s'affiche pas

**Causes possibles :**
1. Champ ACF mal configuré dans WordPress
2. Nom du champ différent de `c6_podcast_audio`
3. Article n'a pas de fichier audio
4. Cache WordPress (vider cache)

**Solution :**
```bash
# Vérifier l'API WordPress directement
curl https://exp937.fr/wp/wp-json/wp/v2/posts/[ID]

# Chercher dans la réponse :
"acf": {
  "c6_podcast_audio": "https://..."
}
```

### Audio ne démarre pas

**Causes possibles :**
1. URL MP3 invalide/inaccessible
2. CORS bloqué (serveur externe)
3. Format fichier non supporté
4. Autoplay bloqué par navigateur

**Solution :**
- Tester URL directement dans navigateur
- Vérifier console : erreur CORS ?
- Utiliser format MP3 (pas WMA, FLAC, etc.)

### Deux audios simultanés

**Cause :** Bug GlobalAudioContext

**Solution :**
1. Vérifier console : "Registering player" appelé ?
2. Vérifier `registerPlayer()` dans PodcastPlayer
3. Vérifier `pauseCallback` défini

### Progression ne bouge pas

**Causes possibles :**
1. Stream live (pas de durée)
2. Métadonnées non chargées
3. Bug timeupdate listener

**Solution :**
- Console : `document.querySelector('audio').duration` → doit être > 0
- Vérifier que `currentSource === 'podcast'`

---

## 🎓 Commandes Console Utiles

### Débugger le lecteur

```javascript
// État actuel
window.audioPlayer = import('../services/audioPlayer.js');
audioPlayer.getState(); // 'playing', 'stopped', etc.
audioPlayer.getSource(); // 'live', 'podcast', null
audioPlayer.getCurrentTime(); // secondes
audioPlayer.getDuration(); // secondes

// Accéder à l'élément audio natif
const audio = document.querySelector('audio');
audio.currentTime; // position
audio.duration; // durée totale
audio.paused; // true/false
audio.src; // URL actuelle

// Forcer stop
audioPlayer.stop();
```

### Simuler avance rapide

```javascript
// Avancer de 10 secondes
const audio = document.querySelector('audio');
audio.currentTime += 10;

// Aller à la fin
audio.currentTime = audio.duration - 5;
```

---

## ✅ Validation Complète

**Tous les tests passent :** 🎉 Phase 5 validée !  
**1-2 tests échouent :** Problème mineur, continuer  
**3+ tests échouent :** Problème critique, debugger

---

## 📞 Support

**Erreur non résolue :**
1. Copier message console complet
2. Noter test échoué
3. Vérifier `phase-5-podcasts-COMPLETE.md` section "Notes Techniques"
4. Si bloqué : demander aide avec logs console

---

**Durée totale :** ~10 minutes  
**Tests critiques :** 1, 3, 5, 6  
**Tests optionnels :** 7, 8, 9, 10

