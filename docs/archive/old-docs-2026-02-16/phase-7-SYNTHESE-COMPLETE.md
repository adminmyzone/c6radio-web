# 📋 SYNTHÈSE COMPLÈTE - Workflow GitHub Actions iOS TestFlight

**Date** : 15 février 2026  
**Projet** : C6Radio Web  
**Objectif** : Déploiement automatique sur TestFlight à chaque push sur `main`

---

## 🎯 RÉSUMÉ DU PROBLÈME

### Erreur actuelle :
```
error: exportArchive No profiles for 'fr.c6debug.app' were found
** EXPORT FAILED **
```

### Cause :
**Le profil de provisionnement n'existe pas sur Apple Developer Portal**

### Solution :
**Créer un profil de provisionnement de type "App Store Connect" pour le Bundle ID `fr.c6debug.app`**

---

## 📚 GUIDES DISPONIBLES

J'ai créé **4 guides** pour t'aider :

### 1. 🔍 **phase-7-DIAGNOSTIC-COMPLET.md**
- Diagnostic exhaustif du problème
- Checklist complète des 6 étapes
- Explication détaillée du fonctionnement du workflow
- Points d'attention et erreurs courantes

### 2. 📱 **phase-7-GUIDE-ETAPE-PAR-ETAPE.md**
- Guide pratique avec instructions précises
- Chaque étape expliquée simplement
- Screenshots simulés et formulaires
- Commandes Linux à copier/coller

### 3. 🚨 **phase-7-AIDE-MEMOIRE-RAPIDE.md**
- Aide-mémoire pour dépannage rapide
- Checklist de vérification
- Diagnostic par type d'erreur
- Commandes utiles

### 4. 🎨 **phase-7-GUIDE-VISUEL.md**
- Schémas et diagrammes
- Vue d'ensemble du système
- Flux de travail illustré
- Tableau récapitulatif

---

## ✅ CE QUE TU DOIS FAIRE MAINTENANT

### ÉTAPE 1 : Créer l'App ID (si pas déjà fait)

**Où ?** https://developer.apple.com/account

```
Navigation :
Certificates, Identifiers & Profiles → Identifiers → +

Configuration :
• Type : App IDs → App
• Description : C6Radio Debug
• Bundle ID : Explicit → fr.c6debug.app
• Capabilities : (rien de spécial)

Action : Register
```

### ÉTAPE 2 : Vérifier le certificat (tu l'as déjà)

**Où ?** https://developer.apple.com/account

```
Navigation :
Certificates, Identifiers & Profiles → Certificates

Vérification :
• Type : Apple Distribution ✅
• Status : Active (non expiré) ✅
• Tu as le fichier .p12 avec son mot de passe ✅
```

### ÉTAPE 3 : Créer le profil de provisionnement ⚠️ **ÉTAPE MANQUANTE**

**Où ?** https://developer.apple.com/account

```
Navigation :
Certificates, Identifiers & Profiles → Profiles → +

Configuration :
• Type : App Store Connect ← IMPORTANT !
• App ID : C6Radio Debug (fr.c6debug.app)
• Certificate : Ton Apple Distribution
• Name : C6Radio Debug AppStore

Action : Generate → Download .mobileprovision

Ensuite sur Linux :
base64 -i fichier.mobileprovision > profil.base64
cat profil.base64  # Copie tout le contenu

GitHub :
Settings → Secrets → IOS_MOBILEPROVISION_BASE64 → Colle le contenu
```

### ÉTAPE 4 : Créer l'app sur App Store Connect (si pas déjà fait)

**Où ?** https://appstoreconnect.apple.com

```
Navigation :
My Apps → + → New App

Configuration :
• Platforms : iOS
• Name : C6Radio Debug
• Primary Language : French (France)
• Bundle ID : fr.c6debug.app
• SKU : c6radio-debug-001
• User Access : Full Access

Action : Create
```

### ÉTAPE 5 : Créer la clé API (si pas déjà fait)

**Où ?** https://appstoreconnect.apple.com

```
Navigation :
Users and Access → Integrations → App Store Connect API → Team Keys → +

Configuration :
• Name : GitHub Actions C6Radio
• Access : App Manager

Action : Generate → Download .p8 (IMMÉDIATEMENT !)

Note :
• Key ID : ABC123XYZ4
• Issuer ID : 12345678-abcd-1234-efgh-567890abcdef

Ensuite sur Linux :
base64 -i AuthKey_ABC123XYZ4.p8 > authkey.base64
cat authkey.base64  # Copie tout le contenu

GitHub :
Settings → Secrets → ASC_API_PRIVATE_KEY_BASE64 → Colle le contenu
Settings → Secrets → ASC_API_KEY_ID → ABC123XYZ4
Settings → Secrets → ASC_API_ISSUER_ID → 12345678-abcd-...
```

### ÉTAPE 6 : Obtenir le Team ID

**Où ?** https://developer.apple.com/account

```
Emplacement :
En haut de la page, section "Membership Details"

Note :
Team ID : ABC123XYZ4

GitHub :
Settings → Secrets → APPLE_TEAM_ID → ABC123XYZ4
```

---

## 🔐 SECRETS GITHUB - CHECKLIST FINALE

Sur GitHub → Settings → Secrets and variables → Actions, tu dois avoir **7 secrets** :

| # | Secret Name | Source | Comment l'obtenir |
|---|-------------|--------|-------------------|
| 1 | `IOS_P12_BASE64` | Certificat `.p12` encodé | `base64 -i distribution.p12 > cert.base64` |
| 2 | `IOS_P12_PASSWORD` | Mot de passe du `.p12` | Le mot de passe que tu as choisi lors de la création du .p12 |
| 3 | `IOS_MOBILEPROVISION_BASE64` | Profil `.mobileprovision` encodé | `base64 -i profil.mobileprovision > profil.base64` |
| 4 | `APPLE_TEAM_ID` | Team ID Apple Developer | Visible sur developer.apple.com (Membership Details) |
| 5 | `ASC_API_KEY_ID` | Key ID de la clé API | Visible sur appstoreconnect.apple.com (Integrations) |
| 6 | `ASC_API_ISSUER_ID` | Issuer ID | Visible sur appstoreconnect.apple.com (Integrations) |
| 7 | `ASC_API_PRIVATE_KEY_BASE64` | Fichier `.p8` encodé | `base64 -i AuthKey_XXX.p8 > authkey.base64` |

---

## 🔄 COMMENT FONCTIONNE LE WORKFLOW

### Déclenchement :
- À chaque `git push` sur la branche `main`
- Ou manuellement depuis l'onglet "Actions" de GitHub

### Étapes :
1. **Checkout** : Récupère le code source
2. **Setup Node.js** : Configure Node.js 24
3. **Install** : `npm ci` (installation propre)
4. **Build** : `npm run build` (génère `dist/`)
5. **Sync** : `npx cap sync ios` (copie vers iOS)
6. **Increment Build** : Utilise `github.run_number`
7. **Import Cert** : Import du `.p12` dans le keychain
8. **Install Profile** : Installation du `.mobileprovision`
9. **Setup API Key** : Configuration de la clé `.p8`
10. **Archive** : `xcodebuild archive` (crée `.xcarchive`)
11. **Export** : `xcodebuild -exportArchive` (crée `.ipa`)
12. **Upload** : `xcrun altool --upload-app` (vers TestFlight)

### Durée totale :
**10-15 minutes** pour tout le workflow

### Après l'upload :
**15-30 minutes** de traitement par Apple, puis l'app apparaît sur TestFlight

---

## ⚠️ POINTS CRITIQUES

### 1. Bundle ID cohérent
```
capacitor.config.json         → "appId": "fr.c6debug.app"
project.pbxproj              → PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app
Apple Developer (App ID)     → fr.c6debug.app
Apple Developer (Profile)    → lié à fr.c6debug.app
App Store Connect            → Bundle ID : fr.c6debug.app
```

### 2. Type de profil correct
```
❌ iOS App Development
❌ Ad Hoc
✅ App Store Connect  ← OBLIGATOIRE pour TestFlight
```

### 3. Type de certificat correct
```
❌ Apple Development
✅ Apple Distribution  ← OBLIGATOIRE pour TestFlight
```

### 4. Droits API corrects
```
❌ Developer
❌ Customer Support
✅ App Manager  ← OBLIGATOIRE pour upload
```

---

## 🧪 PROCÉDURE DE TEST

### 1. Vérification préalable
```bash
# Sur GitHub → Settings → Secrets → Actions
# Vérifie que les 7 secrets sont présents et sans erreur
```

### 2. Lancement du workflow
```bash
# Fais un changement mineur
echo "// Test workflow" >> src/App.jsx

# Commit et push
git add .
git commit -m "test: workflow iOS TestFlight"
git push origin main
```

### 3. Surveillance
```
1. Va sur GitHub → Actions
2. Clique sur le workflow qui vient de démarrer
3. Regarde chaque étape en temps réel
4. Si erreur → Clique sur l'étape pour voir les logs
```

### 4. Vérification du succès
```
✅ Sur GitHub Actions :
   "✅ Build iOS réussi !"
   "✅ Upload réussi sur TestFlight !"

✅ Dans 15-30 minutes sur App Store Connect :
   My Apps → C6Radio Debug → TestFlight
   → Build visible avec status "Ready to Test"
```

---

## 🐛 DÉPANNAGE RAPIDE

### Erreur : "No profiles for 'fr.c6debug.app' were found"
**Solution** : Crée le profil App Store Connect (ÉTAPE 3 ci-dessus)

### Erreur : "No signing certificate found"
**Solution** : Vérifie `IOS_P12_BASE64` et `IOS_P12_PASSWORD`

### Erreur : "Authentication credentials invalid"
**Solution** : Vérifie `ASC_API_KEY_ID`, `ASC_API_ISSUER_ID`, `ASC_API_PRIVATE_KEY_BASE64`

### Erreur : "Cloud signing permission error"
**Solution** : Le projet utilise Automatic Signing au lieu de Manual Signing

### Erreur : "Bundle identifier mismatch"
**Solution** : Vérifie que le Bundle ID est identique partout

---

## 📂 FICHIERS IMPORTANTS

```
c6radio-web/
├── capacitor.config.json              ← Bundle ID : fr.c6debug.app
├── ios/
│   └── App/
│       ├── App.xcodeproj/
│       │   └── project.pbxproj        ← Bundle ID : fr.c6debug.app
│       └── App/
│           └── Info.plist
├── .github/
│   └── workflows/
│       └── ios-testflight.yml         ← Le workflow GitHub Actions
└── docs/
    ├── phase-7-DIAGNOSTIC-COMPLET.md
    ├── phase-7-GUIDE-ETAPE-PAR-ETAPE.md
    ├── phase-7-AIDE-MEMOIRE-RAPIDE.md
    ├── phase-7-GUIDE-VISUEL.md
    └── phase-7-SYNTHESE-COMPLETE.md   ← Ce fichier
```

---

## 🎯 PROCHAINES ÉTAPES

### Une fois le workflow fonctionnel :

1. **Attends que le build apparaisse sur TestFlight** (15-30 min)
2. **Ajoute-toi comme testeur interne** :
   - App Store Connect → My Apps → C6Radio Debug
   - TestFlight → Internal Testing → +
   - Ajoute ton Apple ID
3. **Installe TestFlight sur ton iPhone 13 mini** :
   - App Store → Recherche "TestFlight"
   - Télécharge l'app TestFlight officielle d'Apple
4. **Reçois l'invitation par email** :
   - Ouvre l'email "You're Invited to Test C6Radio Debug"
   - Clique sur "View in TestFlight"
5. **Installe et teste l'app** :
   - Dans TestFlight, clique sur "Install"
   - Une fois installée, clique sur "Open"
   - Teste toutes les fonctionnalités !

### Améliorations futures possibles :

- [ ] Ajouter un workflow pour les builds de production
- [ ] Créer des notifications Slack/Discord pour les builds
- [ ] Ajouter des tests automatisés avant le build
- [ ] Mettre en place un changelog automatique
- [ ] Configurer des branches de feature avec builds dédiés

---

## 📊 STATISTIQUES DU PROJET

```
État actuel :
✅ App React + Vite fonctionnelle
✅ Capacitor iOS configuré
✅ Workflow GitHub Actions créé
❌ Profil de provisionnement manquant ← À FAIRE
⏳ Premier déploiement TestFlight en attente

Bundle ID : fr.c6debug.app
Version : 1.0
Node.js : 24
React : ~18.3.1
Vite : ^6.0.5
Capacitor : ^6.2.0
```

---

## ✅ VALIDATION FINALE AVANT TEST

Coche chaque élément :

- [ ] App ID `fr.c6debug.app` existe sur Apple Developer
- [ ] Certificat Apple Distribution valide et non expiré
- [ ] Profil de provisionnement App Store Connect créé pour `fr.c6debug.app`
- [ ] App créée sur App Store Connect avec Bundle ID `fr.c6debug.app`
- [ ] Clé API App Store Connect créée avec rôle App Manager
- [ ] Team ID récupéré
- [ ] Secret `IOS_P12_BASE64` configuré sur GitHub
- [ ] Secret `IOS_P12_PASSWORD` configuré sur GitHub
- [ ] Secret `IOS_MOBILEPROVISION_BASE64` configuré sur GitHub
- [ ] Secret `APPLE_TEAM_ID` configuré sur GitHub
- [ ] Secret `ASC_API_KEY_ID` configuré sur GitHub
- [ ] Secret `ASC_API_ISSUER_ID` configuré sur GitHub
- [ ] Secret `ASC_API_PRIVATE_KEY_BASE64` configuré sur GitHub
- [ ] Bundle ID identique dans `capacitor.config.json` et `project.pbxproj`

**Si tout est coché ✅, le workflow devrait fonctionner ! 🎉**

---

## 💡 CONSEIL FINAL

**Ne te décourage pas !** La configuration d'un pipeline iOS est complexe la première fois, mais une fois en place, ça fonctionne parfaitement. Si tu rencontres des erreurs :

1. Lis attentivement les logs sur GitHub Actions
2. Consulte le guide approprié dans `docs/`
3. Vérifie la checklist ci-dessus
4. Assure-toi que le profil de provisionnement existe

**Le problème principal actuel est simple : il manque juste le profil de provisionnement !**

---

## 📞 RESSOURCES UTILES

- **Apple Developer Portal** : https://developer.apple.com/account
- **App Store Connect** : https://appstoreconnect.apple.com
- **GitHub Actions** : https://github.com/USERNAME/c6radio-web/actions
- **Documentation Capacitor iOS** : https://capacitorjs.com/docs/ios
- **Documentation TestFlight** : https://developer.apple.com/testflight/

---

## 🎊 CONCLUSION

Tu es **très proche** de la réussite ! Il ne manque plus que :

1. **Créer le profil de provisionnement** (5 minutes)
2. **L'encoder en base64 et le mettre dans GitHub Secrets** (2 minutes)
3. **Faire un push** (10 secondes)
4. **Attendre que le workflow se termine** (10-15 minutes)
5. **Attendre que Apple traite le build** (15-30 minutes)
6. **Installer TestFlight et tester l'app** (5 minutes)

**Total : Environ 1 heure, et ton app sera sur ton iPhone ! 🚀**

Bon courage ! Tu y es presque ! 💪

