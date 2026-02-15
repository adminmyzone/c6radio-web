# ⚡ ACTION IMMÉDIATE - Bundle ID com.c6media.c6media

**Date** : 15 février 2026  
**Bundle ID CORRECT** : `com.c6media.c6media`  
**Status Code** : ✅ Vérifié et cohérent  
**Status Apple** : ⏳ À configurer

---

## ✅ CE QUI EST DÉJÀ BON

J'ai vérifié ton code :

```bash
✅ capacitor.config.json : com.c6media.c6media
✅ project.pbxproj : com.c6media.c6media (2 occurrences)
✅ workflow : mis à jour vers com.c6media.c6media
```

**Ton code est 100% correct ! 👍**

---

## ⚠️ LE PROBLÈME

L'erreur dit :
```
error: exportArchive No profiles for 'com.c6media.c6media' were found
```

Cela signifie que sur **Apple Developer Portal**, tu n'as PAS :
- L'App ID `com.c6media.c6media`
- OU le Profil de provisionnement lié à cet App ID

---

## 🎯 CE QU'IL FAUT FAIRE MAINTENANT (20 minutes)

### Étape 1 : Créer l'App ID (5 min)

**Sur** : https://developer.apple.com/account

```
1. Certificates, Identifiers & Profiles
2. Identifiers → [+]
3. Sélectionne "App IDs" → Continue
4. Type: App → Continue
5. Description: C6 Media
6. Bundle ID: Explicit → com.c6media.c6media
7. Capabilities: (aucune)
8. Continue → Register
```

### Étape 2 : Créer le Profil (10 min)

**Sur** : https://developer.apple.com/account

```
1. Certificates, Identifiers & Profiles
2. Profiles → [+]
3. Type: App Store Connect ⚠️ (PAS Development !)
4. Continue
5. App ID: Sélectionne "C6 Media (com.c6media.c6media)"
6. Continue
7. Certificate: Sélectionne ton certificat "Apple Distribution"
8. Continue
9. Profile Name: C6Media AppStore
10. Generate
11. Download le fichier .mobileprovision
```

### Étape 3 : Encoder le Profil en Base64 (2 min)

```bash
cd ~/apple-certificates

# Copie le fichier téléchargé
cp ~/Downloads/*.mobileprovision .

# Encode en base64
base64 -w 0 *.mobileprovision > profile-c6media.base64

# Affiche pour copier
cat profile-c6media.base64
```

### Étape 4 : Mettre à jour le Secret GitHub (3 min)

**Sur GitHub** : https://github.com/TON_USERNAME/c6radio-web/settings/secrets/actions

```
1. Clique sur IOS_MOBILEPROVISION_BASE64
2. Clique "Update"
3. Colle le contenu de profile-c6media.base64
4. Clique "Update secret"
```

### Étape 5 : Créer l'App sur App Store Connect (5 min)

**Sur** : https://appstoreconnect.apple.com

```
1. My Apps → [+] → New App
2. Platforms: iOS
3. Name: C6 Media
4. Primary Language: French (France)
5. Bundle ID: com.c6media.c6media (sélectionne dans la liste)
6. SKU: c6media-001
7. User Access: Full Access
8. Create
```

### Étape 6 : Tester (10-15 min)

```bash
# Fais un changement
echo "// Fix Bundle ID com.c6media.c6media" >> src/App.jsx

# Commit et push
git add .
git commit -m "fix: Bundle ID com.c6media.c6media configuré"
git push origin main

# Surveille le workflow
# https://github.com/TON_USERNAME/c6radio-web/actions
```

---

## 📋 CHECKLIST RAPIDE

Avant de push, vérifie que tu as TOUT fait :

- [ ] **App ID** créé sur Apple Developer : `com.c6media.c6media`
- [ ] **Profil** créé de type "App Store Connect"
- [ ] **Profil** encodé en base64
- [ ] **Secret GitHub** `IOS_MOBILEPROVISION_BASE64` mis à jour
- [ ] **App** créée sur App Store Connect avec le bon Bundle ID

---

## 🔍 VÉRIFICATION

### Vérifier que l'App ID existe

```
Apple Developer → Identifiers
→ Cherche "com.c6media.c6media"
→ Doit être présent ✅
```

### Vérifier que le Profil existe

```
Apple Developer → Profiles
→ Cherche un profil lié à "com.c6media.c6media"
→ Type: "App Store Connect" ✅
→ Status: Active ✅
```

### Vérifier que l'App existe

```
App Store Connect → My Apps
→ Cherche une app avec Bundle ID "com.c6media.c6media"
→ Doit être présente ✅
```

### Vérifier le code (déjà fait ✅)

```bash
./verify-bundle-id.sh
# ✅ TOUT EST OK !
```

---

## ❌ SI ÇA ÉCHOUE ENCORE

### Erreur : "No profiles for 'com.c6media.c6media' were found"

**1. Vérifie que le profil existe**
```
Apple Developer → Profiles
→ Il DOIT y avoir un profil lié à com.c6media.c6media
```

**2. Vérifie le type du profil**
```
Le profil DOIT être de type "App Store Connect"
PAS "iOS App Development" !
```

**3. Vérifie que le secret GitHub est à jour**
```
GitHub → Settings → Secrets → IOS_MOBILEPROVISION_BASE64
→ Doit contenir le profil encodé pour com.c6media.c6media
```

**4. Re-télécharge et re-encode le profil**
```bash
# Télécharge à nouveau le profil depuis Apple Developer
# Puis :
cd ~/apple-certificates
base64 -w 0 NOUVEAU_PROFIL.mobileprovision > nouveau-profile.base64
cat nouveau-profile.base64
# Copie et mets à jour le secret GitHub
```

---

## 🎯 RÉSUMÉ VISUEL

```
┌─────────────────────────────────────────┐
│     CODE (Déjà OK ✅)                   │
├─────────────────────────────────────────┤
│ capacitor.config.json                   │
│   appId: com.c6media.c6media ✅         │
│                                         │
│ project.pbxproj                         │
│   BUNDLE_ID: com.c6media.c6media ✅     │
│                                         │
│ workflow                                │
│   BUNDLE_ID: com.c6media.c6media ✅     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│     APPLE (À faire ⏳)                  │
├─────────────────────────────────────────┤
│ 1. App ID                               │
│    com.c6media.c6media ⏳               │
│                                         │
│ 2. Profil App Store Connect             │
│    Lié à com.c6media.c6media ⏳         │
│                                         │
│ 3. App sur App Store Connect            │
│    Bundle: com.c6media.c6media ⏳       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│     GITHUB SECRET (À mettre à jour ⏳)  │
├─────────────────────────────────────────┤
│ IOS_MOBILEPROVISION_BASE64              │
│   Doit contenir le nouveau profil ⏳    │
└─────────────────────────────────────────┘
```

---

## ⏱️ TEMPS TOTAL

**20-30 minutes** pour tout configurer

---

## 📚 GUIDES DISPONIBLES

- **Guide détaillé** : `docs/phase-7-FIX-BUNDLE-ID-CORRECT.md`
- **Guide complet** : `docs/phase-7-DE-ZERO-A-TESTFLIGHT.md` (utilise `com.c6media.c6media` au lieu de `fr.c6debug.app`)
- **Checklist** : `docs/phase-7-CHECKLIST-RAPIDE.md`

---

## 🔧 OUTIL

```bash
# Vérifier que le code est bon
./verify-bundle-id.sh
```

---

## ✅ APRÈS AVOIR TOUT FAIT

Tu devrais avoir :

```
Apple Developer:
✅ App ID: com.c6media.c6media
✅ Profil: App Store Connect pour com.c6media.c6media

App Store Connect:
✅ App: C6 Media (com.c6media.c6media)

GitHub:
✅ IOS_MOBILEPROVISION_BASE64 à jour

Code:
✅ capacitor.config.json: com.c6media.c6media
✅ project.pbxproj: com.c6media.c6media
✅ workflow: com.c6media.c6media
```

**Workflow devrait passer ! 🎉**

---

**👉 COMMENCE PAR L'ÉTAPE 1 : Créer l'App ID sur Apple Developer**

**GO ! 🚀**

