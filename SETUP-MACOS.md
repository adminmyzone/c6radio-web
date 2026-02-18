# 🍎 Setup macOS - Ordre des commandes

## ⚠️ IMPORTANT - Ruby 2.6 est trop ancien !

CocoaPods nécessite Ruby >= 3.0, mais macOS inclut Ruby 2.6 par défaut.

---

## 🚀 Étape 1 : Installer Ruby 3.3 + CocoaPods

```bash
cd ~/WebstormProjects/c6radio-web
./setup-ios-helper.sh
```

Ce script va :
1. ✅ Installer Homebrew (si nécessaire)
2. ✅ Installer Ruby 3.3
3. ✅ Configurer le PATH dans ~/.zshrc
4. ✅ Installer CocoaPods avec Ruby 3.3
5. ⏳ **Durée : 5-10 minutes**

**Après le script, FERME et ROUVRE le Terminal** pour activer Ruby 3.3.

Vérifie :
```bash
ruby -v  # Doit afficher "ruby 3.3.x"
pod --version  # Doit afficher une version de CocoaPods
```

---

## 🚀 Étape 2 : Setup du projet

**Dans un NOUVEAU terminal** (pour avoir Ruby 3.3 actif) :

```bash
cd ~/WebstormProjects/c6radio-web

# 1. Installer les dépendances Node.js
npm install

# 2. Build l'application
npm run build:ios

# 3. Installer Firebase via CocoaPods
./setup-ios-pods.sh

# 4. Ouvrir Xcode
open ios/App/App.xcworkspace
```

---

## ⚡ Version ultra-rapide (après Ruby 3.3 installé)

**Nouveau terminal obligatoire !**

```bash
npm install && npm run build:ios && ./setup-ios-pods.sh && open ios/App/App.xcworkspace
```

---

## 🎯 Dans Xcode

1. **Product** → **Clean Build Folder** (⇧⌘K)
2. **Product** → **Build** (⌘B)
3. ✅ Le build devrait réussir !

---

## ✅ Vérifications

```bash
# Vérifier Ruby (DOIT être 3.3.x)
ruby -v

# Vérifier que gem pointe vers Homebrew
which gem  # Doit contenir "/opt/homebrew/opt/ruby"

# Vérifier CocoaPods
pod --version

# Vérifier Firebase installé
ls ios/App/Pods/FirebaseCore

# Vérifier workspace
ls ios/App/App.xcworkspace
```

---

## 🐛 Dépannage

### Erreur "you don't have write permissions for /Library/Ruby/Gems/2.6.0"
➡️ Ruby 3.3 n'est pas actif. Solutions :

**Option 1 : Fermer/rouvrir le Terminal**
```bash
# Quitter Terminal complètement
# Rouvrir Terminal
ruby -v  # Doit être 3.3.x
```

**Option 2 : Sourcer le profil manuellement**
```bash
source ~/.zshrc
ruby -v
```

**Option 3 : Utiliser le Ruby Homebrew directement**
```bash
/opt/homebrew/opt/ruby@3.3/bin/ruby -v
/opt/homebrew/opt/ruby@3.3/bin/gem install cocoapods
```

### Ruby 3.3 installé mais `ruby -v` montre 2.6
```bash
# Ajouter manuellement au PATH
echo 'export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
ruby -v
```

### Homebrew pas installé
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 📋 Résumé : 2 terminaux différents

### Terminal 1 : Setup Ruby
```bash
cd ~/WebstormProjects/c6radio-web
./setup-ios-helper.sh
# Puis FERMER ce terminal
```

### Terminal 2 : Build iOS (NOUVEAU terminal)
```bash
cd ~/WebstormProjects/c6radio-web
ruby -v  # Vérifier = 3.3.x
npm install && npm run build:ios && ./setup-ios-pods.sh && open ios/App/App.xcworkspace
```

**Prêt pour le build ! 🚀**
