# 🍎 Setup macOS - Ordre des commandes

## ⚠️ IMPORTANT - Ruby 2.6 est trop ancien !

CocoaPods nécessite Ruby >= 3.0, mais macOS inclut Ruby 2.6 par défaut.

---

## 🚀 Étape 1 : Installer Ruby 3.3 (OBLIGATOIRE)

```bash
cd ~/WebstormProjects/c6radio-web
./setup-ios-helper.sh
```

Ce script va :
1. ✅ Installer Homebrew (si nécessaire)
2. ✅ Installer Ruby 3.3
3. ✅ Configurer le PATH dans ~/.zshrc
4. ✅ Installer CocoaPods
5. ⏳ **Durée : 5-10 minutes**

Après l'installation :
```bash
source ~/.zshrc
ruby -v  # Doit afficher "ruby 3.3.x"
```

---

## 🚀 Étape 2 : Setup du projet

```bash
cd ~/WebstormProjects/c6radio-web

# 1. Installer les dépendances Node.js
npm install

# 2. Build l'application (OU utiliser le script raccourci)
npm run build:ios
# Équivalent à: npm run build && npx cap sync ios

# 3. Installer Firebase via CocoaPods
./setup-ios-pods.sh

# 4. Ouvrir Xcode avec le WORKSPACE
open ios/App/App.xcworkspace
```

---

## ⚡ Version ultra-rapide (après avoir installé Ruby 3.3)

```bash
npm install && npm run build:ios && ./setup-ios-pods.sh && open ios/App/App.xcworkspace
```

---

## 📝 Que fait chaque commande ?

### `./setup-ios-helper.sh` (PREMIÈRE FOIS UNIQUEMENT)
- Installe Homebrew
- Installe Ruby 3.3
- Configure le PATH
- Installe CocoaPods
- ⏳ **5-10 minutes**

### `npm install`
- Installe React, Vite, Capacitor, Firebase, etc.
- Crée `node_modules/`

### `npm run build:ios`
- Compile React → `dist/`
- Copie `dist/` → `ios/App/App/public/`
- Met à jour la config Capacitor

### `./setup-ios-pods.sh`
- Télécharge Firebase Core + Messaging
- Crée `App.xcworkspace`
- ⏳ **2-5 minutes**

### `open ios/App/App.xcworkspace`
- ⚠️ **WORKSPACE obligatoire** (pas .xcodeproj)
- Contient App + Pods Firebase

---

## 🎯 Dans Xcode

1. **Product** → **Clean Build Folder** (⇧⌘K)
2. **Product** → **Build** (⌘B)
3. ✅ Le build devrait réussir !

---

## ✅ Vérifications rapides

```bash
# Vérifier Ruby
ruby -v  # Doit être >= 3.0

# Vérifier CocoaPods
pod --version

# Vérifier que dist/ existe
ls dist/index.html

# Vérifier que public/ est copié
ls ios/App/App/public/index.html

# Vérifier que Firebase est installé
ls ios/App/Pods/FirebaseCore

# Vérifier que le workspace existe
ls ios/App/App.xcworkspace
```

---

## 🐛 Dépannage

### Erreur "ffi requires Ruby >= 3.0"
```bash
./setup-ios-helper.sh
source ~/.zshrc
ruby -v  # Doit afficher 3.3.x
```

### Homebrew pas installé
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Ruby 3.3 installé mais pas actif
```bash
source ~/.zshrc
# OU
source ~/.bash_profile
```

**Tout bon ? Let's build ! 🚀**
