# 🔥 Fix Firebase iOS - Solution CocoaPods

## ❌ Problème
Swift Package Manager (SPM) ne trouve pas le package Firebase depuis GitHub.

## ✅ Solution : Utiliser CocoaPods

CocoaPods est plus stable et fiable pour Firebase sur iOS.

---

## 🚀 Installation (sur macOS)

### Étape 1 : Exécuter le script
```bash
cd ~/WebstormProjects/c6radio-web
./setup-ios-pods.sh
```

Ce script va :
1. ✅ Installer CocoaPods si nécessaire
2. ✅ Télécharger Firebase/Core et Firebase/Messaging
3. ✅ Créer `App.xcworkspace` avec les pods

**⏳ Durée : 2-5 minutes** (téléchargement Firebase ~100 MB)

---

### Étape 2 : Ouvrir dans Xcode

**⚠️ TRÈS IMPORTANT :**
```bash
# ✅ CORRECT - Ouvrir le WORKSPACE
open ios/App/App.xcworkspace

# ❌ INCORRECT - Ne PAS ouvrir le projet
# open ios/App/App.xcodeproj  ← NON !
```

**Pourquoi ?** Le `.xcworkspace` contient le projet + les pods Firebase.

---

### Étape 3 : Build dans Xcode

1. **Product** → **Clean Build Folder** (⇧⌘K)
2. **Product** → **Build** (⌘B)

Le build devrait maintenant **réussir** ! ✅

---

## 🔍 Vérification

### Dans Xcode Project Navigator (barre latérale gauche)

Tu dois voir 2 projets :
```
📁 App (ton projet)
📁 Pods (dépendances Firebase)
  └── 📦 Firebase
      ├── FirebaseCore
      ├── FirebaseMessaging
      └── ...
```

### Dans AppDelegate.swift

Les imports doivent fonctionner sans erreur :
```swift
import FirebaseCore      // ✅ OK
import FirebaseMessaging // ✅ OK
```

---

## 🐛 Dépannage

### Erreur "CocoaPods not installed"
```bash
sudo gem install cocoapods
```

### Erreur pendant `pod install`
```bash
cd ~/WebstormProjects/c6radio-web/ios/App
pod repo update
pod install
```

### Build échoue avec "framework not found"
1. Vérifier que tu as ouvert **App.xcworkspace** (pas .xcodeproj)
2. **Product** → **Clean Build Folder**
3. Rebuild

### "Could not find module FirebaseCore"
1. Vérifier que le Podfile contient :
   ```ruby
   pod 'Firebase/Core'
   pod 'Firebase/Messaging'
   ```
2. Re-exécuter :
   ```bash
   cd ~/WebstormProjects/c6radio-web/ios/App
   pod install
   ```

---

## 📝 Fichiers créés

### `ios/App/Podfile`
Définit les dépendances Firebase + Capacitor

### `ios/App/Podfile.lock`
Versions exactes installées (sera créé après `pod install`)

### `ios/App/Pods/`
Dossier contenant les frameworks Firebase (sera créé après `pod install`)

### `ios/App/App.xcworkspace`
Workspace Xcode incluant le projet + les pods (sera créé après `pod install`)

---

## ⚙️ Modifications apportées

### 1. Package.swift nettoyé
Suppression de Firebase/SPM (qui ne fonctionnait pas)
→ Garde uniquement Capacitor + PushNotifications

### 2. Podfile créé
Ajout de Firebase via CocoaPods

### 3. AppDelegate.swift inchangé
Les imports Firebase fonctionneront avec les pods

---

## 🎯 Résumé rapide

```bash
# Sur macOS Terminal
cd ~/WebstormProjects/c6radio-web
./setup-ios-pods.sh

# Attendre installation (2-5 min)

# Fermer Xcode si ouvert (Cmd+Q)

# Ouvrir le WORKSPACE
open ios/App/App.xcworkspace

# Dans Xcode
# Product → Clean Build Folder (⇧⌘K)
# Product → Build (⌘B)
```

**✅ Le build devrait réussir !**

---

## 💡 Notes importantes

### Après `npx cap sync ios`
CocoaPods est compatible avec Capacitor. Pas besoin de réinstaller les pods après chaque sync.

### Mise à jour de Firebase
```bash
cd ~/WebstormProjects/c6radio-web/ios/App
pod update Firebase
```

### Alternative : Installation manuelle de CocoaPods
Si `sudo gem install cocoapods` échoue :
```bash
brew install cocoapods
```

---

## ✅ Indicateurs de succès

1. ✅ `pod install` termine sans erreur
2. ✅ Fichier `App.xcworkspace` créé
3. ✅ Dossier `Pods/` existe avec Firebase dedans
4. ✅ Xcode montre "Pods" dans Project Navigator
5. ✅ Build réussit sans erreur "module not found"
6. ✅ L'app se lance (peut crash après mais c'est un autre problème)

**Prêt pour le build ! 🚀**
