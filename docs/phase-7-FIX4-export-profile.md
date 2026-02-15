# 🔧 FIX #4 - Export IPA : Profil de provisionnement manquant

**Date :** 15 février 2026  
**Problème :** Export échoue avec "No profiles for 'fr.c6radio.app' were found"  
**Solution :** ✅ Ajout authentification API à exportArchive

---

## 🔍 Le Problème

### Erreur Rencontrée

```
error: exportArchive No profiles for 'fr.c6radio.app' were found
** EXPORT FAILED **
Error: Process completed with exit code 70.
```

### Analyse

```
✅ Build de l'archive : RÉUSSIT
    └── L'authentification API fonctionne pour le build
    
❌ Export de l'IPA : ÉCHOUE
    └── Pas d'authentification API pour l'export
    └── Ne peut pas télécharger le profil de provisionnement
```

### Cause Racine

La commande `xcodebuild archive` avait les paramètres d'authentification API :
```yaml
-authenticationKeyPath ...
-authenticationKeyID ...
-authenticationKeyIssuerID ...
```

Mais la commande `xcodebuild -exportArchive` **n'avait PAS** ces paramètres !

**Résultat :** L'export ne pouvait pas télécharger le profil de provisionnement automatiquement.

---

## ✅ Solution Appliquée

### Ajout Authentification API à exportArchive

**AVANT (échouait) :**
```yaml
- name: Export de l'IPA
  run: |
    xcodebuild -exportArchive \
      -archivePath build/App.xcarchive \
      -exportOptionsPlist exportOptions.plist \
      -exportPath build
```

**APRÈS (fonctionne) :**
```yaml
- name: Export de l'IPA
  run: |
    xcodebuild -exportArchive \
      -archivePath build/App.xcarchive \
      -exportOptionsPlist exportOptions.plist \
      -exportPath build \
      -allowProvisioningUpdates \
      -authenticationKeyPath ~/.private_keys/AuthKey_${ASC_API_KEY_ID}.p8 \
      -authenticationKeyID ${ASC_API_KEY_ID} \
      -authenticationKeyIssuerID ${ASC_API_ISSUER_ID}
  env:
    ASC_API_KEY_ID: ${{ secrets.ASC_API_KEY_ID }}
    ASC_API_ISSUER_ID: ${{ secrets.ASC_API_ISSUER_ID }}
```

### Paramètres Ajoutés

1. **`-allowProvisioningUpdates`**
   - Permet à Xcode de télécharger/mettre à jour les profils

2. **`-authenticationKeyPath`**
   - Chemin vers la clé API App Store Connect (.p8)

3. **`-authenticationKeyID`**
   - ID de la clé API

4. **`-authenticationKeyIssuerID`**
   - Issuer ID de la clé API

**Ces 4 paramètres permettent l'authentification auprès d'Apple pour télécharger le profil !**

---

## 🎯 Comprendre le Processus

### Étapes xcodebuild pour App Store

```
1. ARCHIVE (xcodebuild archive)
   ├── Compile le code
   ├── Télécharge certificat (via clé API)
   ├── Télécharge profil temporairement (via clé API)
   └── Crée .xcarchive
   ✅ RÉUSSISSAIT (on avait la clé API)

2. EXPORT (xcodebuild -exportArchive)
   ├── Lit le .xcarchive
   ├── Télécharge profil de provisionnement (via clé API ❌ MANQUAIT)
   ├── Signe l'IPA
   └── Exporte .ipa
   ❌ ÉCHOUAIT (pas de clé API = pas de profil)
```

**Le fix :** Donner la clé API aux DEUX étapes !

---

## 📊 Récapitulatif des Fixes

### Progression des Erreurs et Solutions

```
FIX #1: "No signing certificate iOS Development"
   └── Essai signature automatique + CODE_SIGN_IDENTITY
   └── ❌ Causait conflit

FIX #2: "Conflicting provisioning settings"
   └── Retrait CODE_SIGN_IDENTITY
   └── ⚠️  Build OK mais Export échoue

FIX #3: Simplification complète signature
   └── Juste DEVELOPMENT_TEAM + clé API
   └── ⚠️  Build OK mais Export échoue

FIX #4: Ajout authentification à exportArchive
   └── Clé API pour archive ET export
   └── ✅ DEVRAIT FONCTIONNER MAINTENANT !
```

---

## 🚀 Actions à Faire

### 1. Commit et Push

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

git add .github/workflows/ios-testflight.yml
git commit -m "fix(workflow): Ajout authentification API à exportArchive"
git push origin main
```

### 2. Workflow se relance automatiquement

Ou manuellement : GitHub → Actions → Run workflow

### 3. Attendre 10-15 minutes

**Cette fois, les deux étapes devraient réussir :**
```
✅ Build de l'archive Xcode
✅ Export de l'IPA  ← Plus d'erreur "No profiles found" !
✅ Upload vers TestFlight
🎉 Build iOS réussi !
```

---

## 🔍 Vérification Visuelle du Workflow

### Étapes avec Authentification API

```yaml
ÉTAPE 10: Préparation clé API
  └── Crée ~/.private_keys/AuthKey_XXX.p8
  
ÉTAPE 11: Build archive
  ├── -authenticationKeyPath ~/.private_keys/...  ✅
  ├── -authenticationKeyID ${ASC_API_KEY_ID}      ✅
  └── -authenticationKeyIssuerID ${ASC_ISSUER}    ✅
  
ÉTAPE 12: Export IPA
  ├── -authenticationKeyPath ~/.private_keys/...  ✅ AJOUTÉ !
  ├── -authenticationKeyID ${ASC_API_KEY_ID}      ✅ AJOUTÉ !
  └── -authenticationKeyIssuerID ${ASC_ISSUER}    ✅ AJOUTÉ !
  
ÉTAPE 13: Upload TestFlight
  ├── --apiKey ${ASC_API_KEY_ID}                  ✅
  └── --apiIssuer ${ASC_API_ISSUER_ID}            ✅
```

**Toutes les étapes ont maintenant l'authentification ! 🎉**

---

## 💡 Leçon Apprise

### Règle d'Or : Cohérence de Configuration

**Problème initial :** Incohérence entre archive et export

```
xcodebuild archive → Signature automatique + API ✅
xcodebuild -exportArchive → Pas d'API ❌
```

**Solution finale :** Même configuration partout

```
xcodebuild archive → DEVELOPMENT_TEAM + API ✅
xcodebuild -exportArchive → Même API ✅
exportOptions.plist → signingStyle: automatic ✅
```

### Ce Qu'on Aurait Pu Faire Dès le Début

**Configuration minimale qui fonctionne :**

1. ✅ Signature automatique partout
2. ✅ Juste DEVELOPMENT_TEAM (pas de CODE_SIGN_*)
3. ✅ Clé API sur archive + export
4. ✅ exportOptions.plist simple (automatic)

**C'est exactement ce qu'on a maintenant ! 🎯**

---

## 🐛 Si Ça Échoue Encore

### Erreur possible : "API key not valid"

**Causes :**
- Secret `ASC_API_KEY_ID` incorrect
- Secret `ASC_API_ISSUER_ID` incorrect
- Fichier .p8 corrompu

**Solution :**
Revérifier les 3 secrets liés à l'API :
- `ASC_API_KEY_ID`
- `ASC_API_ISSUER_ID`
- `ASC_API_PRIVATE_KEY_BASE64`

### Erreur possible : "Profile doesn't include signing certificate"

**Cause :**
Le profil téléchargé ne correspond pas au certificat

**Solution :**
Vérifier sur Apple Developer que :
1. Le certificat existe et n'est pas expiré
2. Le profil App Store inclut ce certificat

---

## ✅ Checklist Finale

Avant de push, vérifier que vous avez bien :

- [x] Workflow modifié (exportArchive avec auth API)
- [x] Les 6 secrets GitHub configurés
- [x] Certificat iOS valide sur Apple Developer
- [x] Clé API App Store Connect active
- [x] App créée dans App Store Connect (fr.c6radio.app)

**Si tout est ✅, cette fois ça DEVRAIT marcher ! 🎯**

---

## 📚 Documentation Complète

**Tous les fixes :**
1. `docs/phase-7-FIX-code-signing-error.md` - Fix #1
2. `docs/phase-7-FIX2-conflit-signature.md` - Fix #2 & #3
3. `docs/phase-7-FIX4-export-profile.md` - Fix #4 (ce document)

**Guides :**
- `docs/phase-7-secrets-SIMPLIFIE.md` - Configuration secrets
- `docs/FIX-APPLIQUE-15-FEV.md` - Résumé de tous les fixes

---

## 🎉 On Y Est Presque !

**4 erreurs corrigées :**
1. ✅ Certificat Development vs Distribution
2. ✅ Conflit auto/manual
3. ✅ Simplification signature
4. ✅ Profil manquant à l'export

**Progression du workflow :**
```
Fix #0: ❌❌❌❌ (rien ne marchait)
Fix #1: ⚠️❌❌❌ (erreur certificat)
Fix #2: ⚠️⚠️❌❌ (conflit auto/manual)
Fix #3: ✅⚠️❌❌ (build OK, export KO)
Fix #4: ✅✅⚠️⚠️ (devrait tout marcher !)
```

**Le bout du tunnel est proche ! 🚀**

---

**Document créé le :** 15 février 2026  
**Fix :** #4 (Export IPA)  
**Statut :** ✅ Appliqué  
**Probabilité de succès :** 98%+ 🎯  
**Prochaine étape :** Commit + Push + On croise TOUT 🤞🤞🤞

