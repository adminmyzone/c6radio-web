# 🚨 AIDE-MÉMOIRE RAPIDE - Dépannage Workflow iOS

**Date**: 15 février 2026

---

## ❌ ERREUR ACTUELLE

```
error: exportArchive No profiles for 'fr.c6debug.app' were found
** EXPORT FAILED **
Error: Process completed with exit code 70.
```

---

## ✅ SOLUTION RAPIDE

**Le profil de provisionnement n'existe PAS sur Apple Developer !**

### À FAIRE MAINTENANT :

1. **Va sur** https://developer.apple.com/account
2. **Certificates, Identifiers & Profiles** → **Profiles**
3. Clique sur le bouton **"+"**
4. Sélectionne **"App Store Connect"** (PAS "Development" !)
5. App ID : Sélectionne **"C6Radio Debug (fr.c6debug.app)"**
6. Certificat : Sélectionne ton **Apple Distribution**
7. Nom : **"C6Radio Debug AppStore"**
8. **Télécharge** le fichier `.mobileprovision`
9. **Encode en base64** :
   ```bash
   base64 -i C6Radio_Debug_AppStore.mobileprovision > profile.base64
   cat profile.base64
   ```
10. **Sur GitHub** → Settings → Secrets → Actions
11. Modifie le secret **IOS_MOBILEPROVISION_BASE64**
12. Colle le nouveau contenu
13. **Refais un push** pour relancer le workflow

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant chaque tentative, vérifie :

### ✅ 1. L'App ID existe
- [ ] Va sur https://developer.apple.com/account
- [ ] Certificates, Identifiers & Profiles → Identifiers
- [ ] Tu dois voir : **C6Radio Debug (fr.c6debug.app)**
- [ ] Si absent → Crée-le (voir guide étape par étape)

### ✅ 2. Le certificat Apple Distribution existe
- [ ] Va sur https://developer.apple.com/account
- [ ] Certificates, Identifiers & Profiles → Certificates
- [ ] Tu dois voir un certificat **"Apple Distribution"** valide (non expiré)
- [ ] Si absent → Crée-le (voir guide étape par étape)

### ✅ 3. Le profil de provisionnement existe
- [ ] Va sur https://developer.apple.com/account
- [ ] Certificates, Identifiers & Profiles → Profiles
- [ ] Tu dois voir : **C6Radio Debug AppStore** de type **App Store Connect**
- [ ] Il doit être lié à l'App ID **fr.c6debug.app**
- [ ] Il doit être lié à ton certificat **Apple Distribution**
- [ ] **⚠️ SI ABSENT → C'EST LE PROBLÈME ACTUEL !**

### ✅ 4. L'app existe sur App Store Connect
- [ ] Va sur https://appstoreconnect.apple.com
- [ ] My Apps
- [ ] Tu dois voir **C6Radio Debug** avec le Bundle ID **fr.c6debug.app**
- [ ] Si absent → Crée-la (voir guide étape par étape)

### ✅ 5. La clé API existe
- [ ] Va sur https://appstoreconnect.apple.com
- [ ] Users and Access → Integrations → App Store Connect API
- [ ] Tu dois voir une clé avec le rôle **App Manager** ou **Admin**
- [ ] Si absent → Crée-la (voir guide étape par étape)

### ✅ 6. Les 7 secrets GitHub sont configurés
- [ ] Va sur GitHub → Settings → Secrets and variables → Actions
- [ ] Tu dois voir ces 7 secrets :
  - `IOS_P12_BASE64`
  - `IOS_P12_PASSWORD`
  - `IOS_MOBILEPROVISION_BASE64`
  - `APPLE_TEAM_ID`
  - `ASC_API_KEY_ID`
  - `ASC_API_ISSUER_ID`
  - `ASC_API_PRIVATE_KEY_BASE64`

### ✅ 7. Le Bundle ID est cohérent
- [ ] `capacitor.config.json` : `"appId": "fr.c6debug.app"`
- [ ] `ios/App/App.xcodeproj/project.pbxproj` : `PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app`
- [ ] Apple Developer → App ID : `fr.c6debug.app`
- [ ] App Store Connect → App : Bundle ID `fr.c6debug.app`

---

## 🔍 DIAGNOSTIC PAR ERREUR

### Erreur : "No profiles for 'fr.c6debug.app' were found"
**Cause** : Le profil de provisionnement n'existe pas ou n'est pas du bon type  
**Solution** : Crée un profil **App Store Connect** lié à `fr.c6debug.app`

### Erreur : "No signing certificate 'iOS Development' found"
**Cause** : Le workflow cherche un certificat de développement au lieu de distribution  
**Solution** : Vérifie que le projet Xcode est configuré en mode "Manual Signing" avec un certificat "Apple Distribution"

### Erreur : "Cloud signing permission error"
**Cause** : Le workflow essaie d'utiliser Automatic Signing au lieu de Manual Signing  
**Solution** : Configure Manual Signing dans le projet Xcode

### Erreur : "Authentication credentials invalid"
**Cause** : La clé API `.p8` est invalide ou le Key ID / Issuer ID est incorrect  
**Solution** : Vérifie les secrets `ASC_API_KEY_ID`, `ASC_API_ISSUER_ID`, `ASC_API_PRIVATE_KEY_BASE64`

### Erreur : "No code signing identity found"
**Cause** : Le certificat `.p12` est invalide ou le mot de passe est incorrect  
**Solution** : Vérifie les secrets `IOS_P12_BASE64` et `IOS_P12_PASSWORD`

---

## 🛠️ COMMANDES UTILES

### Vérifier un fichier .p12
```bash
openssl pkcs12 -in distribution.p12 -noout -info
# Si ça demande un mot de passe et affiche des infos → OK
# Si erreur → Le fichier est corrompu
```

### Vérifier un profil .mobileprovision
```bash
security cms -D -i profile.mobileprovision | grep -A 5 "UUID"
# Doit afficher l'UUID du profil
```

### Encoder un fichier en base64
```bash
base64 -i fichier.ext > fichier.ext.base64
```

### Voir le contenu d'un fichier base64
```bash
cat fichier.ext.base64
```

### Décoder un fichier base64 (pour test)
```bash
base64 -d -i fichier.ext.base64 -o fichier.ext
```

---

## 📊 SCHÉMA DE FONCTIONNEMENT

```
┌─────────────────────────────────────────────────────────┐
│ 1. Push sur GitHub                                      │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 2. GitHub Actions démarre le workflow                   │
│    - Checkout du code                                   │
│    - Build React + Vite (dist/)                         │
│    - Sync Capacitor iOS                                 │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Configuration de la signature                        │
│    - Import du certificat .p12 → Keychain macOS        │
│    - Install du profil .mobileprovision                │
│    - Config de la clé API .p8                          │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Build Xcode                                          │
│    xcodebuild archive                                   │
│    → Crée App.xcarchive                                 │
│    ⚠️ Ici : Vérifie que le certificat et le profil     │
│       correspondent au Bundle ID fr.c6debug.app         │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Export IPA                                           │
│    xcodebuild -exportArchive                            │
│    → Crée App.ipa                                       │
│    ⚠️ Ici : Vérifie que le profil existe               │
│       et est du type App Store Connect                  │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Upload vers TestFlight                               │
│    xcrun altool --upload-app                            │
│    ⚠️ Ici : Vérifie que la clé API a les bons droits  │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 7. SUCCESS ! 🎉                                         │
│    L'app apparaît sur TestFlight dans 15-30 minutes    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 FOCUS : LE PROBLÈME ACTUEL

**L'erreur se produit à l'étape 5 : Export IPA**

Cela signifie que :
- ✅ Le build Xcode a RÉUSSI (l'archive .xcarchive a été créée)
- ❌ L'export en .ipa a ÉCHOUÉ car aucun profil de provisionnement n'a été trouvé

**Pourquoi ?**
- Le profil de provisionnement N'EXISTE PAS sur Apple Developer
- OU le profil existe mais n'est PAS du type "App Store Connect"
- OU le profil existe mais n'est PAS lié au Bundle ID "fr.c6debug.app"

**Solution** :
→ **Crée le profil de provisionnement App Store Connect pour fr.c6debug.app**

---

## 📞 SI TU ES BLOQUÉ

### Option 1 : Vérification manuelle
1. Ouvre **phase-7-GUIDE-ETAPE-PAR-ETAPE.md**
2. Suis l'**ÉTAPE 3** en détail
3. Vérifie bien que tu sélectionnes **"App Store Connect"** (pas "Development")

### Option 2 : Recommencer à zéro
1. Supprime l'App ID sur Apple Developer
2. Supprime l'app sur App Store Connect
3. Suis le guide complet depuis le début

### Option 3 : Changer de Bundle ID
Si tu veux utiliser un autre Bundle ID (par exemple `fr.c6radio.app`) :
1. Change dans `capacitor.config.json`
2. Change dans `ios/App/App.xcodeproj/project.pbxproj`
3. Crée l'App ID sur Apple Developer avec le nouveau Bundle ID
4. Crée le profil de provisionnement avec le nouveau Bundle ID
5. Crée l'app sur App Store Connect avec le nouveau Bundle ID
6. Mets à jour le workflow GitHub (variable `BUNDLE_ID`)

---

## ✅ VALIDATION FINALE

Après avoir créé le profil de provisionnement :

```bash
# 1. Encode-le en base64
base64 -i C6Radio_Debug_AppStore.mobileprovision > profile.base64

# 2. Vérifie le contenu
cat profile.base64
# Tu dois voir une TRÈS longue ligne de texte

# 3. Copie tout le contenu

# 4. Sur GitHub → Settings → Secrets
# Modifie IOS_MOBILEPROVISION_BASE64 et colle le contenu

# 5. Fais un push
git add .
git commit -m "fix: update provisioning profile"
git push

# 6. Surveille le workflow sur GitHub Actions
```

---

## 🎊 APRÈS LE SUCCÈS

Une fois que le workflow réussit :

1. **Attends 15-30 minutes** (traitement par Apple)
2. Va sur **App Store Connect** → **My Apps** → **C6Radio Debug**
3. Onglet **TestFlight**
4. Tu verras ton build avec le statut "Processing" puis "Ready to Test"
5. Ajoute-toi comme testeur interne
6. Installe **TestFlight** sur ton iPhone 13 mini
7. Teste l'app en conditions réelles !

**Félicitations ! 🎉**

---

## 📚 GUIDES COMPLETS

- **Diagnostic complet** : `docs/phase-7-DIAGNOSTIC-COMPLET.md`
- **Guide étape par étape** : `docs/phase-7-GUIDE-ETAPE-PAR-ETAPE.md`
- **Ce guide rapide** : `docs/phase-7-AIDE-MEMOIRE-RAPIDE.md`

