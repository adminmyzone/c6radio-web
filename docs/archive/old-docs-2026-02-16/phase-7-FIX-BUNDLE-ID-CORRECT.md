# 🚨 FIX URGENT - Bundle ID Correct : com.c6media.c6media

**Date** : 15 février 2026  
**Problème** : Les guides utilisent `fr.c6debug.app` mais le bon Bundle ID est `com.c6media.c6media`  
**Solution** : Suivre ce guide pour créer les bons éléments sur Apple

---

## ✅ BUNDLE ID CORRECT

```
com.c6media.c6media
```

⚠️ **IMPORTANT** : Utilise TOUJOURS ce Bundle ID partout !

---

## 🎯 CE QU'IL FAUT FAIRE SUR APPLE

### 1️⃣ App ID (5 min)

**Sur** : https://developer.apple.com/account

```
Certificates, Identifiers & Profiles → Identifiers → [+]

Type: App IDs → App
Description: C6 Media
Bundle ID: Explicit → com.c6media.c6media
Capabilities: (aucune pour l'instant)

Continue → Register
```

### 2️⃣ Certificat (déjà fait ?)

Si tu as déjà créé le certificat Apple Distribution, pas besoin de recommencer.

Vérifie sur : https://developer.apple.com/account → Certificates

### 3️⃣ Profil de Provisionnement (10 min)

**Sur** : https://developer.apple.com/account

```
Certificates, Identifiers & Profiles → Profiles → [+]

Type: App Store Connect ⚠️ (PAS Development !)

App ID: Sélectionne "C6 Media (com.c6media.c6media)"

Certificate: Sélectionne ton certificat "Apple Distribution"

Profile Name: C6Media AppStore

Generate → Download le fichier .mobileprovision
```

**Encoder en base64** :

```bash
cd ~/apple-certificates
cp ~/Downloads/C6Media_AppStore.mobileprovision .
base64 -w 0 C6Media_AppStore.mobileprovision > profile.base64
cat profile.base64
```

**Mettre à jour le secret GitHub** :

```
GitHub → Settings → Secrets → IOS_MOBILEPROVISION_BASE64
→ Edit → Colle le nouveau contenu
```

### 4️⃣ App sur App Store Connect (5 min)

**Sur** : https://appstoreconnect.apple.com

```
My Apps → [+] → New App

Platforms: iOS
Name: C6 Media
Primary Language: French (France)
Bundle ID: com.c6media.c6media (sélectionne dans la liste)
SKU: c6media-001
User Access: Full Access

Create
```

### 5️⃣ Clé API (si pas déjà fait)

Si tu as déjà créé la clé API, elle fonctionne pour toutes les apps. Pas besoin de recommencer.

---

## 🔍 VÉRIFICATION COMPLÈTE

### ✅ Checklist avant de push

- [ ] **App ID** existe : `com.c6media.c6media`
- [ ] **Profil** existe : Type "App Store Connect" lié à `com.c6media.c6media`
- [ ] **App** existe sur App Store Connect avec Bundle ID `com.c6media.c6media`
- [ ] **Secret GitHub** `IOS_MOBILEPROVISION_BASE64` mis à jour avec le nouveau profil
- [ ] `capacitor.config.json` : `"appId": "com.c6media.c6media"` ✅ (déjà bon)
- [ ] `project.pbxproj` : `PRODUCT_BUNDLE_IDENTIFIER = com.c6media.c6media;` ✅ (déjà bon)

---

## 🚀 TEST

Après avoir tout configuré :

```bash
# Fais un petit changement
echo "// Test avec bon Bundle ID" >> src/App.jsx

# Commit et push
git add .
git commit -m "fix: configuration Bundle ID com.c6media.c6media"
git push origin main

# Surveille le workflow
# https://github.com/TON_USERNAME/c6radio-web/actions
```

---

## ❌ ERREURS POSSIBLES

### "No profiles for 'com.c6media.c6media' were found"

**Causes** :
- Le profil n'existe pas sur Apple Developer
- Le profil n'est pas de type "App Store Connect"
- Le secret `IOS_MOBILEPROVISION_BASE64` n'est pas à jour

**Solution** :
1. Vérifie que le profil existe (étape 3)
2. Vérifie qu'il est bien lié à `com.c6media.c6media`
3. Réencode le profil en base64
4. Mets à jour le secret GitHub

### "No 'com.c6media.c6media' app found"

**Cause** : L'app n'existe pas sur App Store Connect

**Solution** : Crée l'app (étape 4)

---

## 🎯 RÉCAPITULATIF

### Ce qui est déjà correct ✅

- `capacitor.config.json` : ✅ `com.c6media.c6media`
- `project.pbxproj` : ✅ `com.c6media.c6media`
- Workflow GitHub Actions : ✅ (fonctionne avec n'importe quel Bundle ID)

### Ce qu'il faut créer/mettre à jour ⚠️

1. **App ID** sur Apple Developer : `com.c6media.c6media`
2. **Profil** de type App Store Connect lié à ce Bundle ID
3. **App** sur App Store Connect avec ce Bundle ID
4. **Secret GitHub** `IOS_MOBILEPROVISION_BASE64` avec le nouveau profil

---

## ⏱️ TEMPS ESTIMÉ

**20-30 minutes** pour tout créer et mettre à jour

---

## 📞 BESOIN D'AIDE ?

### Vérifier que l'App ID existe

```bash
# Sur Apple Developer Portal
Certificates, Identifiers & Profiles → Identifiers
→ Cherche "com.c6media.c6media"
```

### Vérifier que le profil existe

```bash
# Sur Apple Developer Portal
Certificates, Identifiers & Profiles → Profiles
→ Cherche un profil lié à "com.c6media.c6media"
→ Type doit être "App Store Connect"
```

### Vérifier que l'app existe

```bash
# Sur App Store Connect
My Apps → Cherche une app avec Bundle ID "com.c6media.c6media"
```

---

## ✅ VALIDATION FINALE

Quand tout est fait, tu dois avoir :

```
Apple Developer Portal:
├── Identifiers
│   └── com.c6media.c6media ✅
├── Certificates
│   └── Apple Distribution ✅
└── Profiles
    └── C6Media AppStore (App Store Connect) ✅
        └── Lié à com.c6media.c6media

App Store Connect:
└── My Apps
    └── C6 Media
        └── Bundle ID: com.c6media.c6media ✅

GitHub Secrets:
└── IOS_MOBILEPROVISION_BASE64
    └── Contient le profil encodé pour com.c6media.c6media ✅
```

---

**🎉 Une fois tout ça fait, le workflow devrait passer ! 🚀**

