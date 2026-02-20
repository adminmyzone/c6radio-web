# Media Controls Natifs - Guide de Test 📱

## ✅ Fonctionnalité Ajoutée

Les **media controls natifs** sont maintenant disponibles sur Android et iOS :
- 🔔 Contrôles dans la zone de notification
- 🔒 Contrôles sur l'écran de verrouillage  
- 🎧 Contrôles sur les écouteurs Bluetooth

## 🔧 Modification Technique

**Changement clé** : Utilisation d'un élément `<audio>` HTML dans le DOM au lieu d'un objet `Audio()` JavaScript.

**Pourquoi ?**  
Sur Android (WebView Capacitor), les media controls natifs ne s'activent que si l'audio provient d'un élément HTML dans le DOM. C'est une limitation de Chrome WebView.

**Code modifié** :
```javascript
// AVANT (ne marche pas sur Android)
audioElement = new Audio(url);

// APRÈS (fonctionne sur Android/iOS)
audioElement = document.createElement('audio');
audioElement.src = url;
document.body.appendChild(audioElement);
```

## 🎯 Que Tester ?

### **1. Live Radio**
1. Lancez le live radio depuis l'app
2. **Baissez la zone de notification** (swipe du haut)
3. Vérifiez les contrôles :
   - ✅ Titre : Nom du titre en cours (mis à jour automatiquement)
   - ✅ Artiste : Nom de l'artiste
   - ✅ Image : Album art / logo C6Radio
   - ✅ Bouton Pause
4. **Testez** :
   - ⏸️ **Pause** → Le live s'arrête
   - ▶️ **Play** → Le live redémarre
5. **Verrouillez l'écran** et vérifiez les mêmes contrôles

### **2. Podcasts**
1. Ouvrez un article avec un podcast
2. Lancez la lecture
3. Vérifiez dans la **zone de notification** :
   - ✅ Titre du podcast
   - ✅ Nom de l'émission
   - ✅ Artwork/image
   - ✅ **Barre de progression** (durée)
4. Testez les boutons :
   - ⏸️ **Pause** → Le podcast se met en pause
   - ▶️ **Play** → Le podcast reprend
   - ⏹️ **Stop** → Le podcast s'arrête (swipe notification)

### **3. Transition Live ↔ Podcast**
1. Lancez le live
2. Lancez un podcast
   - ✅ Le live s'arrête automatiquement
   - ✅ Les contrôles affichent le podcast
3. Relancez le live
   - ✅ Le podcast s'arrête automatiquement
   - ✅ Les contrôles affichent le live

### **4. Écouteurs Bluetooth**
1. Connectez des écouteurs/casque Bluetooth
2. Lancez le live ou un podcast
3. Testez les boutons physiques :
   - ▶️⏸️ **Play/Pause** → Doit fonctionner
   - ⏭️⏮️ **Next/Prev** → Désactivés (radio live)

## 🔧 Détails Techniques

### API Utilisée
- **Media Session API** (standard web)
- Automatiquement bridgée par Capacitor vers les contrôles natifs
- Pas de plugin externe nécessaire !

### Services Utilisés
- ✅ `src/services/mediaSession.js` (gestion Web + Native)
- ✅ `src/services/audioPlayer.js` (création DOM audio element)

### Comportement
- **Web** : Media Session API → Contrôles navigateur
- **iOS/Android** : Media Session API → Contrôles OS natifs
- **Automatique** : Aucune distinction de code nécessaire

## 📝 Notes

### Live Stream
- Pas de barre de progression (streaming continu)
- Pause = Stop (pas de pause sur un stream live)
- Métadonnées mises à jour toutes les 10s (Now Playing API)

### Podcasts
- Barre de progression visible
- Pause fonctionnelle  
- Position sauvegardée
- Seek forward/backward (si supporté par OS)

## 🐛 Debug

Si les contrôles n'apparaissent pas :

1. **Vérifier que l'audio joue** dans l'app
2. **Vérifier les logs** :
```bash
export ANDROID_SDK_ROOT=~/Android/Sdk && export ANDROID_HOME=~/Android/Sdk && adb logcat | grep -E "(MediaSession|c6radio|audio)"
```

3. **Vérifier dans Chrome DevTools** (Remote Debugging) :
   - Chrome Desktop → More Tools → Inspect Devices
   - Inspecter l'app sur le téléphone
   - Console → Chercher "Media Session"

4. **Rebuild complet** si nécessaire :
```bash
npm run build:android
```
Puis dans Android Studio : **Run 'app'**

## 🚀 Déploiement

### Via Android Studio (recommandé)
1. Ouvrez le projet : `npx cap open android`
2. **Run** > **Run 'app'**
3. Sélectionnez votre smartphone
4. Testez !

### Via CLI (si Java installé)
```bash
./deploy-android.sh
```

## ✅ Checklist de Test

- [ ] Live : Contrôles visibles dans notification
- [ ] Live : Play/Pause fonctionne
- [ ] Live : Titre/Artiste se met à jour
- [ ] Live : Image (artwork) visible
- [ ] Live : Contrôles sur écran verrouillé
- [ ] Podcast : Contrôles visibles dans notification  
- [ ] Podcast : Play/Pause fonctionne
- [ ] Podcast : Barre de progression visible
- [ ] Podcast : Métadonnées correctes
- [ ] Transition : Live → Podcast (arrêt automatique)
- [ ] Transition : Podcast → Live (arrêt automatique)
- [ ] Bluetooth : Boutons casque fonctionnent

