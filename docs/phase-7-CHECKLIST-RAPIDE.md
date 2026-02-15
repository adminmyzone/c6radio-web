# ✅ CHECKLIST RAPIDE - Configuration iOS TestFlight

**Utilise cette checklist pour vérifier que tout est en place.**

---

## 📋 CHECKLIST APPLE DEVELOPER PORTAL

Sur https://developer.apple.com/account

### Identifiers (App ID)

- [ ] App ID créé : `fr.c6debug.app`
- [ ] Type : Explicit App ID
- [ ] Status : Active

**Comment vérifier** :  
`Certificates, Identifiers & Profiles → Identifiers → Cherche "fr.c6debug.app"`

---

### Certificates

- [ ] Certificat créé : `Apple Distribution`
- [ ] Status : Active (non expiré)
- [ ] Tu as le fichier `.p12` avec mot de passe

**Comment vérifier** :  
`Certificates, Identifiers & Profiles → Certificates → Cherche "Apple Distribution"`

---

### Profiles

- [ ] Profil créé : Type `App Store Connect`
- [ ] Lié à l'App ID : `fr.c6debug.app`
- [ ] Lié au certificat : Apple Distribution
- [ ] Status : Active
- [ ] Tu as le fichier `.mobileprovision`

**Comment vérifier** :  
`Certificates, Identifiers & Profiles → Profiles → Cherche ton profil`

⚠️ **ATTENTION** : Le type DOIT être "App Store Connect" (pas "Development" ou "Ad Hoc")

---

## 📋 CHECKLIST APP STORE CONNECT

Sur https://appstoreconnect.apple.com

### App créée

- [ ] App existe : `C6Radio Debug`
- [ ] Bundle ID : `fr.c6debug.app`
- [ ] Status : Au minimum "Prepare for Submission"

**Comment vérifier** :  
`My Apps → Cherche "C6Radio Debug"`

---

### Clé API

- [ ] Clé API créée : Nom "GitHub Actions C6Radio" (ou similaire)
- [ ] Access : `App Manager` ⚠️ (PAS "Developer")
- [ ] Status : Active
- [ ] Tu as le Key ID (ex: `ABC123XYZ4`)
- [ ] Tu as l'Issuer ID (ex: `12345678-abcd-...`)
- [ ] Tu as le fichier `.p8`

**Comment vérifier** :  
`Users and Access → Integrations → App Store Connect API → Team Keys`

---

## 📋 CHECKLIST GITHUB SECRETS

Sur GitHub → Settings → Secrets and variables → Actions

Tu dois avoir **EXACTEMENT 7 secrets** :

| # | Nom du Secret | Format | Comment le tester |
|---|---------------|--------|-------------------|
| 1 | `IOS_P12_BASE64` | Très long texte base64 | Commence par des lettres/chiffres |
| 2 | `IOS_P12_PASSWORD` | Texte court | Le mot de passe que tu as choisi |
| 3 | `IOS_MOBILEPROVISION_BASE64` | Très long texte base64 | Commence par des lettres/chiffres |
| 4 | `APPLE_TEAM_ID` | 10 caractères | Ex: `ABCD123456` |
| 5 | `ASC_API_KEY_ID` | ~10 caractères | Ex: `ABC123XYZ4` |
| 6 | `ASC_API_ISSUER_ID` | Format UUID | Ex: `12345678-abcd-1234-efgh-567890abcdef` |
| 7 | `ASC_API_PRIVATE_KEY_BASE64` | Très long texte base64 | Commence par des lettres/chiffres |

**Comment vérifier** :  
Sur GitHub, tu ne peux PAS voir le contenu des secrets (c'est normal).  
Tu peux seulement voir les noms et les modifier/supprimer.

---

## 📋 CHECKLIST CODE SOURCE

### Bundle ID cohérent

- [ ] `capacitor.config.json` : `"appId": "fr.c6debug.app"`
- [ ] `ios/App/App.xcodeproj/project.pbxproj` : `PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app;`

**Comment vérifier** :

```bash
# Vérifier capacitor.config.json
grep "appId" capacitor.config.json

# Résultat attendu :
# "appId": "fr.c6debug.app",

# Vérifier project.pbxproj
grep "PRODUCT_BUNDLE_IDENTIFIER" ios/App/App.xcodeproj/project.pbxproj

# Résultat attendu (plusieurs lignes) :
# PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app;
# PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app;
# ...
```

---

### Workflow GitHub Actions

- [ ] Fichier existe : `.github/workflows/ios-testflight.yml`
- [ ] Le workflow contient bien `BUNDLE_ID: fr.c6debug.app`

**Comment vérifier** :

```bash
# Vérifier que le fichier existe
ls -la .github/workflows/ios-testflight.yml

# Vérifier le Bundle ID dans le workflow
grep "BUNDLE_ID" .github/workflows/ios-testflight.yml

# Résultat attendu :
# BUNDLE_ID: fr.c6debug.app
```

---

## 📋 CHECKLIST FICHIERS LOCAUX (Backup)

Dans `~/apple-certificates/` tu dois avoir :

- [ ] `c6radio.key` (clé privée - GARDE SECRET)
- [ ] `c6radio.csr` (demande de certificat)
- [ ] `distribution.cer` (certificat téléchargé)
- [ ] `distribution.pem` (certificat converti)
- [ ] `distribution.p12` (certificat final)
- [ ] `distribution.p12.base64` (encodé pour GitHub)
- [ ] `C6Radio_Debug_AppStore.mobileprovision` (profil)
- [ ] `profile.base64` (profil encodé pour GitHub)
- [ ] `AuthKey_*.p8` (clé API)
- [ ] `authkey.base64` (clé API encodée)
- [ ] Un fichier texte avec tous les IDs et mots de passe

⚠️ **Backup ce dossier dans un endroit sûr !**

---

## 🚀 CHECKLIST AVANT LE PREMIER BUILD

Avant de faire `git push`, vérifie **TOUT** :

### Sur Apple Developer Portal :

- [x] App ID existe et est actif
- [x] Certificat Apple Distribution existe et n'est pas expiré
- [x] Profil App Store Connect existe, est actif, et lié au bon App ID

### Sur App Store Connect :

- [x] App créée avec le bon Bundle ID
- [x] Clé API créée avec rôle "App Manager"

### Sur GitHub :

- [x] 7 secrets configurés (tous présents)
- [x] Workflow `.github/workflows/ios-testflight.yml` existe

### Dans le code :

- [x] Bundle ID identique dans `capacitor.config.json`
- [x] Bundle ID identique dans `project.pbxproj`

### Fichiers locaux :

- [x] Tous les fichiers sont sauvegardés dans `~/apple-certificates/`

---

## 🎯 CHECKLIST POST-BUILD

Après le `git push`, vérifie :

### Sur GitHub Actions :

- [ ] Workflow démarré automatiquement
- [ ] Toutes les étapes passent au vert ✅
- [ ] Pas d'erreurs rouges ❌
- [ ] Message final : "✅ Build iOS réussi !"

**Comment vérifier** :  
https://github.com/TON_USERNAME/c6radio-web/actions

---

### Sur App Store Connect :

**Immédiatement** :
- [ ] Build apparaît dans TestFlight
- [ ] Status : "Processing"

**Après 15-30 minutes** :
- [ ] Status : "Ready to Test"
- [ ] TestFlight Badge : ✅

**Comment vérifier** :  
https://appstoreconnect.apple.com → My Apps → C6Radio Debug → TestFlight

---

### Sur iPhone :

- [ ] TestFlight app installée
- [ ] Invitation reçue par email
- [ ] App visible dans TestFlight
- [ ] App installée sur iPhone
- [ ] App se lance sans crash
- [ ] Toutes les fonctionnalités testées

---

## ⚠️ ERREURS COURANTES

### "No profiles for 'fr.c6debug.app' were found"

**Causes possibles** :
- [ ] Le profil n'existe pas sur Apple Developer
- [ ] Le profil n'est pas de type "App Store Connect"
- [ ] Le secret `IOS_MOBILEPROVISION_BASE64` est invalide ou vide

**Solution** : Retourne à l'ÉTAPE 3 du guide complet

---

### "No signing certificate found"

**Causes possibles** :
- [ ] Le certificat n'existe pas
- [ ] Le secret `IOS_P12_BASE64` est invalide
- [ ] Le secret `IOS_P12_PASSWORD` est incorrect

**Solution** : Retourne à l'ÉTAPE 2 du guide complet

---

### "Authentication credentials invalid"

**Causes possibles** :
- [ ] `ASC_API_KEY_ID` incorrect
- [ ] `ASC_API_ISSUER_ID` incorrect
- [ ] `ASC_API_PRIVATE_KEY_BASE64` invalide
- [ ] La clé API a été révoquée

**Solution** : Retourne à l'ÉTAPE 5 du guide complet

---

### "Bundle identifier mismatch"

**Causes possibles** :
- [ ] Bundle ID différent dans `capacitor.config.json`
- [ ] Bundle ID différent dans `project.pbxproj`

**Solution** : Retourne à l'ÉTAPE 8 du guide complet

---

### "Cloud signing permission error"

**Causes possibles** :
- [ ] Le projet Xcode est configuré en "Automatic Signing"
- [ ] Il devrait être en "Manual Signing"

**Solution** : Ouvre le projet avec Xcode (sur Mac) ou vérifie `project.pbxproj`

---

## 📱 CHECKLIST TEST SUR IPHONE

Une fois l'app installée via TestFlight :

### Tests de base :

- [ ] App se lance
- [ ] Pas de crash au démarrage
- [ ] Interface s'affiche correctement
- [ ] Navigation entre les pages fonctionne

### Tests audio :

- [ ] Le stream live démarre
- [ ] Le son est audible
- [ ] Pause/Play fonctionne
- [ ] Volume contrôlable
- [ ] Barre de contrôle visible

### Tests podcast :

- [ ] Actualités s'affichent
- [ ] Clic sur article affiche le détail
- [ ] Lecteur podcast visible (si l'article a un audio)
- [ ] Podcast peut se lancer
- [ ] Barre de progression fonctionne

### Tests avancés :

- [ ] Audio continue quand écran verrouillé ⚠️ (peut ne pas fonctionner)
- [ ] Contrôles lockscreen fonctionnent
- [ ] Audio continue en arrière-plan
- [ ] Pas de crash lors de navigation
- [ ] Basculement live ↔ podcast fonctionne

⚠️ **Si l'audio s'arrête quand l'écran se verrouille** → Phase 7b nécessaire

---

## 💾 CHECKLIST SÉCURITÉ

### Fichiers à ne JAMAIS commiter sur Git :

- [ ] `*.p12` (certificat)
- [ ] `*.key` (clé privée)
- [ ] `*.mobileprovision` (profil)
- [ ] `*.p8` (clé API)
- [ ] Fichiers `*.base64`
- [ ] Fichiers contenant des mots de passe

### Vérification :

```bash
# Vérifie que .gitignore contient ces patterns
cat .gitignore | grep -E "(\.p12|\.key|\.mobileprovision|\.p8|\.base64)"
```

### Secrets GitHub :

- [ ] Ne partage jamais tes secrets GitHub
- [ ] Ne les screenshot jamais
- [ ] N'utilise pas les mêmes secrets pour d'autres projets

---

## 🔄 CHECKLIST MISES À JOUR FUTURES

À chaque nouveau build :

### Build automatique :

- [x] `git push` → Workflow automatique
- [x] Pas besoin de refaire la config
- [x] Les secrets sont réutilisés

### Build number :

- [x] Incrémenté automatiquement (basé sur `github.run_number`)
- [x] Pas de conflit "version déjà utilisée"

### Sur TestFlight :

- [ ] Nouveau build apparaît automatiquement
- [ ] Testeurs reçoivent notification
- [ ] Update disponible dans TestFlight app

---

## 📊 STATISTIQUES

### Temps de setup initial :
**45-60 minutes** (si tu suis le guide)

### Temps par build après setup :
**0 seconde** (tout est automatique !)

### Temps d'attente par build :
- Workflow GitHub Actions : **10-15 min**
- Traitement Apple : **15-30 min**
- **Total : 25-45 min** du push au build testable

---

## ✅ VALIDATION FINALE

**Coche TOUTES les cases avant de considérer la Phase 7 comme terminée** :

- [ ] App ID créé sur Apple Developer
- [ ] Certificat Apple Distribution créé
- [ ] Profil App Store Connect créé
- [ ] App créée sur App Store Connect
- [ ] Clé API créée avec rôle App Manager
- [ ] 7 secrets GitHub configurés
- [ ] Bundle ID cohérent partout
- [ ] Premier build réussi sur GitHub Actions
- [ ] Build visible sur TestFlight
- [ ] App installée sur iPhone via TestFlight
- [ ] Tests de base réussis
- [ ] Audio fonctionne
- [ ] Navigation fonctionne

**Si toutes les cases sont cochées ✅ → Phase 7 COMPLÈTE ! 🎉**

---

## 📚 GUIDES ASSOCIÉS

- **Guide complet** : `phase-7-DE-ZERO-A-TESTFLIGHT.md` (instructions détaillées)
- **Synthèse** : `phase-7-SYNTHESE-COMPLETE.md` (vue d'ensemble)
- **Dépannage** : `phase-7-AIDE-MEMOIRE-RAPIDE.md` (résolution erreurs)

---

**Utilise cette checklist à chaque fois que tu as un doute !** ✅

