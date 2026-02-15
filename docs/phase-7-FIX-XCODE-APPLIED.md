# ✅ FIX APPLIQUÉ - Configuration Xcode Corrigée

**Date** : 15 février 2026  
**Bundle ID** : `com.c6media.c6media`  
**Problème résolu** : Configuration de signature Xcode

---

## 🎯 PROBLÈME IDENTIFIÉ

Le workflow échouait avec :
```
error: No profiles for 'com.c6media.c6media' were found: 
Xcode couldn't find any iOS App Development provisioning profiles
```

**Cause** : Le projet Xcode était configuré en :
- ❌ `CODE_SIGN_STYLE = Automatic`
- ❌ `CODE_SIGN_IDENTITY = "iPhone Developer"`

Pour TestFlight/App Store, il faut :
- ✅ `CODE_SIGN_STYLE = Manual`
- ✅ `CODE_SIGN_IDENTITY = "Apple Distribution"`

---

## ✅ CORRECTIONS APPLIQUÉES

### Fichier modifié
`ios/App/App.xcodeproj/project.pbxproj`

### Changements effectués

**1. Configuration globale (Debug et Release)**
```
Avant : CODE_SIGN_IDENTITY = "iPhone Developer";
Après : CODE_SIGN_IDENTITY = "Apple Distribution";
```

**2. Configurations de build (Debug et Release)**
```
Avant : CODE_SIGN_STYLE = Automatic;
Après : CODE_SIGN_STYLE = Manual;
        CODE_SIGN_IDENTITY = "Apple Distribution";
```

**3. Bundle ID vérifié**
```
✅ PRODUCT_BUNDLE_IDENTIFIER = com.c6media.c6media;
```

---

## 📋 CONFIGURATION FINALE

### project.pbxproj

**Configuration globale Debug (ligne ~214)**
```
CODE_SIGN_IDENTITY = "Apple Distribution";
```

**Configuration globale Release (ligne ~271)**
```
CODE_SIGN_IDENTITY = "Apple Distribution";
```

**Configuration target Debug (ligne ~298)**
```
CODE_SIGN_STYLE = Manual;
CODE_SIGN_IDENTITY = "Apple Distribution";
PRODUCT_BUNDLE_IDENTIFIER = com.c6media.c6media;
```

**Configuration target Release (ligne ~320)**
```
CODE_SIGN_STYLE = Manual;
CODE_SIGN_IDENTITY = "Apple Distribution";
PRODUCT_BUNDLE_IDENTIFIER = com.c6media.c6media;
```

---

## 🚀 PROCHAINES ÉTAPES

### 1. Commit les changements

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

git add ios/App/App.xcodeproj/project.pbxproj
git add .github/workflows/ios-testflight.yml
git commit -m "fix: configuration signature Xcode pour distribution App Store"
```

### 2. Configurer Apple Developer (20 min)

**⚠️ IMPORTANT** : Tu dois TOUJOURS créer les éléments sur Apple Developer avec le Bundle ID `com.c6media.c6media`

#### A. Créer l'App ID
```
Apple Developer → Identifiers → [+]
Type: App IDs → App
Description: C6 Media
Bundle ID: Explicit → com.c6media.c6media
Continue → Register
```

#### B. Créer le Profil
```
Apple Developer → Profiles → [+]
Type: App Store Connect ⚠️ (PAS Development !)
App ID: Sélectionne "C6 Media (com.c6media.c6media)"
Certificate: Sélectionne ton certificat "Apple Distribution"
Profile Name: C6Media AppStore
Generate → Download
```

#### C. Encoder le Profil
```bash
cd ~/apple-certificates
base64 -w 0 PROFIL.mobileprovision > profile.base64
cat profile.base64  # Copie le contenu
```

#### D. Mettre à jour GitHub Secret
```
GitHub → Settings → Secrets → IOS_MOBILEPROVISION_BASE64
→ Edit → Colle le contenu base64
```

#### E. Créer l'App sur App Store Connect
```
App Store Connect → My Apps → [+] → New App
Name: C6 Media
Bundle ID: com.c6media.c6media
SKU: c6media-001
Create
```

### 3. Push et tester

```bash
git push origin main

# Surveille le workflow
# https://github.com/TON_USERNAME/c6radio-web/actions
```

---

## ✅ CHECKLIST COMPLÈTE

### Code (✅ Fait)

- [x] `capacitor.config.json` : com.c6media.c6media
- [x] `project.pbxproj` : com.c6media.c6media
- [x] `project.pbxproj` : CODE_SIGN_STYLE = Manual
- [x] `project.pbxproj` : CODE_SIGN_IDENTITY = "Apple Distribution"
- [x] `workflow` : BUNDLE_ID = com.c6media.c6media

### Apple Developer (⏳ À faire)

- [ ] App ID créé : com.c6media.c6media
- [ ] Profil créé : Type "App Store Connect"
- [ ] Profil encodé en base64
- [ ] Secret GitHub `IOS_MOBILEPROVISION_BASE64` mis à jour
- [ ] App créée sur App Store Connect

---

## 🔍 VÉRIFICATION

### Vérifier la configuration Xcode

```bash
grep "CODE_SIGN" ios/App/App.xcodeproj/project.pbxproj
```

**Résultat attendu** :
```
CODE_SIGN_IDENTITY = "Apple Distribution";  (4 fois)
CODE_SIGN_STYLE = Manual;  (2 fois)
```

### Vérifier le Bundle ID

```bash
./verify-bundle-id.sh
```

**Résultat attendu** :
```
✅ TOUT EST OK !
Bundle ID configuré partout : com.c6media.c6media
```

---

## 📚 GUIDES DISPONIBLES

- **Action immédiate** : `docs/phase-7-ACTION-MAINTENANT.md`
- **Fix Bundle ID** : `docs/phase-7-FIX-BUNDLE-ID-CORRECT.md`
- **Guide complet** : `docs/phase-7-DE-ZERO-A-TESTFLIGHT.md`

---

## 🎯 RÉSUMÉ VISUEL

```
┌─────────────────────────────────────────┐
│  CODE (✅ CORRIGÉ)                      │
├─────────────────────────────────────────┤
│ capacitor.config.json                   │
│   appId: com.c6media.c6media ✅         │
│                                         │
│ project.pbxproj                         │
│   BUNDLE_ID: com.c6media.c6media ✅     │
│   CODE_SIGN_STYLE: Manual ✅            │
│   CODE_SIGN_IDENTITY: Distribution ✅   │
│                                         │
│ workflow                                │
│   BUNDLE_ID: com.c6media.c6media ✅     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  APPLE DEVELOPER (⏳ À FAIRE)           │
├─────────────────────────────────────────┤
│ 1. App ID: com.c6media.c6media ⏳       │
│ 2. Profil: App Store Connect ⏳         │
│ 3. Profil encodé + secret GitHub ⏳     │
│ 4. App sur App Store Connect ⏳         │
└─────────────────────────────────────────┘
```

---

## ⏱️ TEMPS ESTIMÉ

- **Code** : ✅ 0 min (déjà fait)
- **Apple config** : ⏳ 20-30 min
- **Test workflow** : ⏳ 10-15 min

**Total** : 30-45 minutes jusqu'au premier build réussi ! 🚀

---

## 💡 POINTS IMPORTANTS

### ✅ Ce qui est maintenant correct

1. **Signature manuelle** au lieu d'automatique
2. **Certificat de distribution** au lieu de développement
3. **Bundle ID cohérent** partout : `com.c6media.c6media`
4. **Workflow mis à jour** avec le bon Bundle ID

### ⚠️ Ce qu'il reste à faire

1. Créer les éléments sur Apple Developer avec `com.c6media.c6media`
2. Mettre à jour le secret GitHub avec le nouveau profil
3. Push et tester

---

## 🎉 APRÈS LA CONFIGURATION APPLE

Une fois que tu auras créé les éléments sur Apple et mis à jour le secret GitHub, le workflow devrait :

```
✅ Compiler le projet Xcode
✅ Signer avec le certificat Apple Distribution
✅ Utiliser le profil App Store Connect
✅ Exporter l'IPA
✅ Uploader sur TestFlight
```

**Et voilà ! App sur iPhone ! 📱🎉**

---

**👉 PROCHAINE ACTION** : `docs/phase-7-ACTION-MAINTENANT.md`

**LET'S GO ! 💪🚀**

