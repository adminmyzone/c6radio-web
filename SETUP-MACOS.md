# 🍎 Setup macOS - Ordre des commandes

## 🚀 À exécuter sur la VM macOS (dans l'ordre)

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

## ⚡ Version ultra-rapide (une seule ligne)

```bash
npm install && npm run build:ios && ./setup-ios-pods.sh && open ios/App/App.xcworkspace
```

---

## 📝 Que fait chaque commande ?

### `npm install`
- Installe React, Vite, Capacitor, Firebase, etc.
- Crée `node_modules/`

### `npm run build:ios`
- Compile React → `dist/`
- Copie `dist/` → `ios/App/App/public/`
- Met à jour la config Capacitor

### `./setup-ios-pods.sh`
- Installe CocoaPods si besoin
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
# Vérifier que dist/ existe
ls dist/index.html

# Vérifier que public/ est copié
ls ios/App/App/public/index.html

# Vérifier que Firebase est installé
ls ios/App/Pods/FirebaseCore

# Vérifier que le workspace existe
ls ios/App/App.xcworkspace
```

**Tout bon ? Let's build ! 🚀**
