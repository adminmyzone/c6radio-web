# 🚀 Déploiement iOS TestFlight - DÉMARRAGE RAPIDE

**Bundle ID** : `fr.c6debug.app`  
**Objectif** : Déploiement automatique sur TestFlight à chaque `git push`

---

## 📖 PAR OÙ COMMENCER ?

### Tu pars de ZÉRO ? Commence ici 👇

**1️⃣ Lis le guide complet** :
```bash
docs/phase-7-DE-ZERO-A-TESTFLIGHT.md
```

**2️⃣ Utilise le script helper** :
```bash
./setup-ios-helper.sh
```
Ce script interactif t'aide avec toutes les commandes Linux nécessaires.

**3️⃣ Suis la checklist** :
```bash
docs/phase-7-CHECKLIST-RAPIDE.md
```

---

## ⚡ RÉSUMÉ ULTRA-RAPIDE

### Ce que tu dois créer sur Apple :

1. **App ID** : `fr.c6debug.app` sur Apple Developer
2. **Certificat** : Apple Distribution
3. **Profil** : App Store Connect (lié à App ID + Certificat)
4. **App** : Sur App Store Connect
5. **Clé API** : Sur App Store Connect (rôle "App Manager")

### Les 7 secrets GitHub à configurer :

| Secret | Description |
|--------|-------------|
| `IOS_P12_BASE64` | Certificat encodé |
| `IOS_P12_PASSWORD` | Mot de passe du certificat |
| `IOS_MOBILEPROVISION_BASE64` | Profil encodé |
| `APPLE_TEAM_ID` | Team ID (10 caractères) |
| `ASC_API_KEY_ID` | Key ID de la clé API |
| `ASC_API_ISSUER_ID` | Issuer ID (UUID) |
| `ASC_API_PRIVATE_KEY_BASE64` | Clé API encodée |

### Après configuration :

```bash
# Fais un changement
echo "// Test" >> src/App.jsx

# Commit et push
git add .
git commit -m "test: workflow iOS"
git push origin main

# Le workflow se lance automatiquement !
# ➜ GitHub Actions (10-15 min)
# ➜ TestFlight (15-30 min)
# ➜ iPhone ✅
```

---

## 📚 DOCUMENTATION DISPONIBLE

### Guides principaux

- **📖 Guide complet** : `docs/phase-7-DE-ZERO-A-TESTFLIGHT.md`
  - Configuration A à Z (45-60 min)
  
- **✅ Checklist** : `docs/phase-7-CHECKLIST-RAPIDE.md`
  - Validation étape par étape
  
- **📋 Index** : `docs/phase-7-INDEX-COMPLET.md`
  - Vue d'ensemble de tous les guides

### Dépannage

- **🚨 Aide-mémoire** : `docs/phase-7-AIDE-MEMOIRE-RAPIDE.md`
  - Solutions aux erreurs courantes

### Outils

- **🔧 Script helper** : `./setup-ios-helper.sh`
  - Assistant interactif pour les commandes Linux

---

## 🎯 WORKFLOW

Le workflow se trouve dans `.github/workflows/ios-testflight.yml`

**Déclenchement** :
- Automatique à chaque `push` sur `main`
- Manuel depuis l'onglet Actions de GitHub

**Étapes** :
1. Build React + Vite
2. Sync Capacitor
3. Build Xcode
4. Export IPA
5. Upload TestFlight

**Durée** : 10-15 minutes

---

## 🔐 SÉCURITÉ

⚠️ **Ne commit JAMAIS** :
- Fichiers `*.p12`, `*.key`, `*.p8`, `*.mobileprovision`
- Mots de passe
- Secrets GitHub

✅ **Backup** :
- Tous les fichiers dans `~/apple-certificates/`
- Mots de passe dans un gestionnaire sécurisé

---

## ❌ ERREURS COURANTES

### "No profiles for 'fr.c6debug.app' were found"
➜ Le profil n'existe pas ou n'est pas encodé correctement  
➜ Retourne à l'ÉTAPE 3 du guide

### "No signing certificate found"
➜ Certificat invalide ou mot de passe incorrect  
➜ Vérifie les secrets 1 et 2

### "Authentication credentials invalid"
➜ Clé API incorrecte  
➜ Vérifie les secrets 5, 6, 7

### "Bundle identifier mismatch"
➜ Bundle ID pas identique partout  
➜ Lance : `./setup-ios-helper.sh` → Option 7

---

## 🌍 LIENS UTILES

- **Apple Developer** : https://developer.apple.com/account
- **App Store Connect** : https://appstoreconnect.apple.com
- **GitHub Actions** : https://github.com/TON_USERNAME/c6radio-web/actions

---

## 📊 PROCHAINES ÉTAPES

Après le premier build réussi :

1. ✅ Build arrive sur TestFlight (15-30 min)
2. 📱 Ajoute-toi comme testeur interne
3. 📥 Installe TestFlight sur iPhone
4. 🎉 Teste l'app !

---

## 💡 CONSEIL

**La première fois prend du temps** (45-60 min de config), mais après **c'est automatique** !

Chaque `git push` = Nouveau build TestFlight = Zéro effort ! ✨

---

**👉 COMMENCE PAR LÀ** : `docs/phase-7-INDEX-COMPLET.md`

Bon courage ! 🚀

