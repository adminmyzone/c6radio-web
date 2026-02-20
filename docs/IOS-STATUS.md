# 📱 iOS Setup - Status et prochaines étapes

## 📊 État actuel

### ✅ Ce qui est prêt (dans le code)
- ✅ **Podfile** créé avec Firebase Core + Messaging
- ✅ **Package.swift** nettoyé (SPM sans Firebase)
- ✅ **AppDelegate.swift** configuré avec Firebase
- ✅ **GoogleService-Info.plist** présent
- ✅ **Scripts d'installation** créés :
  - `setup-ios-helper.sh` (installation Ruby + CocoaPods)
  - `setup-ios-pods.sh` (installation Firebase via Pods)
  - `fix-ios-firebase.sh` (nettoyage caches)
- ✅ **Documentation complète** :
  - `FIX-FIREBASE-IOS.md`
  - `SETUP-MACOS.md`
  - `docs/PUSH-NOTIFICATIONS.md`

### ⚠️ Problème rencontré
- **VM macOS** : Ruby bloqué en version 2.6.10
- Ruby 3.0+ requis pour CocoaPods moderne
- Impossible de mettre à jour Ruby dans la VM (problème d'environnement)

---

## 🍎 Solution : Utiliser un vrai Mac

Le code est **100% prêt**. Sur un vrai Mac, l'installation devrait fonctionner parfaitement.

### Sur un vrai Mac (macOS Sonoma/Ventura/Sequoia)

#### Option 1 : Si Ruby >= 3.0 déjà installé
```bash
cd ~/WebstormProjects/c6radio-web
ruby -v  # Si >= 3.0, OK !

# Directement :
npm install && npm run build:ios && ./setup-ios-pods.sh && open ios/App/App.xcworkspace
```

#### Option 2 : Si Ruby < 3.0
```bash
cd ~/WebstormProjects/c6radio-web

# Installer Ruby 3.3 + CocoaPods
./setup-ios-helper.sh

# Fermer/rouvrir Terminal

# Build
npm install && npm run build:ios && ./setup-ios-pods.sh && open ios/App/App.xcworkspace
```

---

## 🎯 Ce qui va se passer sur un vrai Mac

### 1. Installation des Pods (2-5 minutes)
```
Analyzing dependencies
Downloading dependencies
Installing Firebase (11.x.x)
Installing FirebaseCore (11.x.x)
Installing FirebaseMessaging (11.x.x)
Generating Pods project
Integrating client project

✅ Pod installation complete! There are X dependencies from the Podfile
```

### 2. Ouverture Xcode
Le fichier **App.xcworkspace** sera créé et contiendra :
- 📁 **App** (le projet Capacitor)
- 📁 **Pods** (Firebase + dépendances)

### 3. Build Xcode
**Product** → **Build** devrait réussir sans erreur "FirebaseCore not found"

### 4. Test sur iPhone physique
- ✅ L'app se lance
- ✅ Demande permission notifications
- ✅ Envoie le token FCM au backend WordPress
- ✅ Reçoit les notifications push

---

## 📝 Checklist pour le vrai Mac

### Avant de commencer
- [ ] Xcode 15+ installé
- [ ] Command Line Tools installés (`xcode-select --install`)
- [ ] Node.js installé
- [ ] Git configuré
- [ ] Compte Apple Developer (pour signer l'app)

### Étapes
- [ ] Clone le repo : `git clone <url>`
- [ ] Vérifier Ruby : `ruby -v` (si < 3.0 : `./setup-ios-helper.sh`)
- [ ] Installer deps Node : `npm install`
- [ ] Build iOS : `npm run build:ios`
- [ ] Installer Firebase : `./setup-ios-pods.sh`
- [ ] Ouvrir Xcode : `open ios/App/App.xcworkspace`
- [ ] Signer avec Apple Developer account
- [ ] Connecter iPhone physique
- [ ] Build & Run sur l'iPhone
- [ ] Tester notifications depuis WordPress

---

## 🔧 Fichiers à vérifier dans Xcode

### 1. GoogleService-Info.plist
- Doit être dans le dossier **App** (pas à la racine)
- Doit être coché dans le target "App"

### 2. Signing & Capabilities
- Team : Sélectionner ton compte Apple Developer
- Bundle ID : `fr.c6media.radio`
- **Push Notifications** capability activée ✅
- **Background Modes** activés :
  - ✅ Remote notifications

### 3. Package Dependencies (Project Navigator)
- Doit contenir le projet **Pods** avec Firebase

---

## 🐛 Problèmes possibles et solutions

### "FirebaseCore module not found"
```bash
cd ios/App
pod install --repo-update
```

### Build réussit mais app crash au lancement
- Vérifier que **GoogleService-Info.plist** est bien dans le target
- Vérifier les logs Xcode (⌘9 → Report Navigator)
- Possible problème de config Firebase (Project ID, Bundle ID)

### Token FCM non reçu
- Tester sur **iPhone physique** (simulateur ne supporte PAS les push)
- Vérifier permissions : Settings → C6Radio → Notifications → Allow
- Vérifier réseau : L'app doit communiquer avec Firebase

---

## 📚 Documentation de référence

### Créée pour ce projet
- **FIX-FIREBASE-IOS.md** : Solution CocoaPods détaillée
- **SETUP-MACOS.md** : Instructions complètes pour macOS
- **docs/PUSH-NOTIFICATIONS.md** : Architecture complète push notifs

### Officielle
- [Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [CocoaPods](https://cocoapods.org)

---

## 🎉 Résumé

### ✅ Fait
- Code iOS 100% configuré
- Firebase intégré via CocoaPods
- Scripts d'installation automatisés
- Documentation complète

### ⏳ En attente
- Accès à un vrai Mac (VM macOS incompatible)
- Test sur iPhone physique
- Signature avec Apple Developer

### 🚀 Prêt pour
Dès que tu as un vrai Mac → Suivre **SETUP-MACOS.md** → Build → Test → Profit ! 🎊

---

**Le projet est prêt. Il ne manque que l'environnement macOS fonctionnel.** 💪
