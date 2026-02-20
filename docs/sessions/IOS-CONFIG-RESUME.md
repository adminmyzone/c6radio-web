# ✅ Configuration iOS - Résumé

## Ce qui a été fait automatiquement

### 1. Info.plist ✅
- Ajout de `UIBackgroundModes` avec `remote-notification`
- Permet de recevoir les notifications en arrière-plan

### 2. AppDelegate.swift ✅
- Import de Firebase Core et Firebase Messaging
- Initialisation de Firebase au démarrage
- Configuration de UNUserNotificationCenter
- Enregistrement pour les notifications distantes
- Gestion du token APNS
- Delegate pour afficher les notifications (foreground + background)

### 3. Package.swift ✅
- Ajout de la dépendance Firebase iOS SDK
- Import de FirebaseCore et FirebaseMessaging
- Gestion via Swift Package Manager

### 4. Capacitor Sync ✅
- Synchronisation effectuée
- Plugin @capacitor/push-notifications détecté

---

## Prochaines étapes MANUELLES

### Étape 1 : Configurer APNS dans Firebase (si pas déjà fait)

Suis le guide : `/docs/sessions/IOS-PUSH-CONFIG.md` (section "ÉTAPE 1 & 2")

**Résumé** :
1. Créer une clé APNs sur developer.apple.com
2. Upload la clé .p8 dans Firebase Console
3. Entrer Key ID et Team ID

### Étape 2 : Ajouter GoogleService-Info.plist

1. Firebase Console > Ton projet > ⚙️ Paramètres
2. Section "Vos applications" > iOS
3. Télécharge **GoogleService-Info.plist**
4. Ouvre Xcode :
   ```bash
   cd ios/App
   open App.xcworkspace
   ```
5. Drag & drop `GoogleService-Info.plist` dans le dossier `App/App`
6. ✅ Coche "Copy items if needed"
7. ✅ Coche "Add to targets: App"

### Étape 3 : Activer Push Notifications dans Xcode

1. Dans Xcode, sélectionne le projet **App**
2. Target **App**
3. Onglet **Signing & Capabilities**
4. Clique sur **"+ Capability"**
5. Ajoute **"Push Notifications"**

### Étape 4 : Remplir firebase.config.js

Fichier : `/src/config/firebase.config.js`

Remplace les valeurs par celles de Firebase Console (déjà récupérées normalement).

---

## Build iOS

Une fois les étapes ci-dessus terminées :

```bash
# Option 1 : Via Xcode (recommandé)
cd ios/App
open App.xcworkspace

# Option 2 : Via CLI
npx cap run ios --target="DEVICE_NAME"
```

**⚠️ IMPORTANT** : Les notifications PUSH ne fonctionnent **QUE sur un vrai iPhone**, pas sur simulateur !

---

## Test

1. Lance l'app sur ton iPhone
2. Accepte la permission notifications
3. Va dans WordPress Admin > Push Notifs
4. Tu devrais voir 1 appareil iOS enregistré
5. Envoie une notification de test

---

Besoin d'aide pour une étape ? Demande-moi ! 📱
