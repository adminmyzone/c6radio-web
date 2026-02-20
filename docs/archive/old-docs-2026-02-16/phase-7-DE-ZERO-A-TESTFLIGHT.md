# 🚀 Guide Complet : De Zéro à TestFlight

**Date** : 15 février 2026  
**Projet** : C6Radio Web  
**Bundle ID** : `fr.c6debug.app`  
**Objectif** : Déployer automatiquement sur TestFlight à chaque push sur `main`

---

## 📋 PRÉREQUIS

Avant de commencer, assure-toi d'avoir :

- ✅ Un compte Apple Developer **payant** (99€/an) actif
- ✅ Accès à https://developer.apple.com/account
- ✅ Accès à https://appstoreconnect.apple.com
- ✅ Un iPhone 13 mini avec un Apple ID
- ✅ Un PC Linux avec terminal bash
- ✅ Accès au repository GitHub en mode Admin

---

## 🎯 VUE D'ENSEMBLE

### Ce que tu vas créer aujourd'hui :

1. **App ID** sur Apple Developer Portal
2. **Certificat de distribution** (Apple Distribution)
3. **Profil de provisionnement** (App Store Connect)
4. **App sur App Store Connect**
5. **Clé API App Store Connect**
6. **7 secrets GitHub** pour le workflow
7. **Premier déploiement automatique**

### Durée totale estimée :
**45-60 minutes** (si tu suis bien les étapes)

### Résultat final :
À chaque `git push`, ton app se build automatiquement et arrive sur TestFlight ! 🎉

---

## 🔴 ÉTAPE 1 : Créer l'App ID

### Pourquoi ?
L'App ID est l'identifiant unique de ton app dans l'écosystème Apple. Sans ça, rien ne fonctionne.

### Comment ?

1. **Ouvre** : https://developer.apple.com/account

2. **Navigue** :
   ```
   Certificates, Identifiers & Profiles → Identifiers → Bouton [+]
   ```

3. **Sélectionne** :
   - ☑️ `App IDs`
   - Clique sur `Continue`

4. **Type** :
   - ☑️ `App`
   - Clique sur `Continue`

5. **Remplis le formulaire** :
   ```
   Description: C6Radio Debug
   
   Bundle ID: 
   ☑️ Explicit
   📝 fr.c6debug.app
   ```

6. **Capabilities** :
   - ⚠️ Ne coche RIEN pour l'instant (on ajoutera plus tard si besoin)

7. **Clique sur** : `Continue` → `Register`

### Vérification ✅

Tu dois voir :
```
✅ C6Radio Debug
   fr.c6debug.app
   Explicit App ID
```

---

## 🔴 ÉTAPE 2 : Créer le Certificat de Distribution

### Pourquoi ?
Le certificat prouve que c'est bien TOI qui build l'app. C'est comme ta signature numérique.

### Comment ?

#### 2.1 Générer une clé privée sur Linux

```bash
# Crée un dossier pour stocker les fichiers
mkdir -p ~/apple-certificates
cd ~/apple-certificates

# Génère une clé privée
openssl genrsa -out c6radio.key 2048

# Génère une demande de certificat (CSR)
openssl req -new -key c6radio.key -out c6radio.csr -subj "/emailAddress=TON_EMAIL@example.com, CN=TON_NOM, C=FR"
```

⚠️ **REMPLACE** :
- `TON_EMAIL@example.com` par ton vrai email Apple Developer
- `TON_NOM` par ton nom complet

Tu auras maintenant 2 fichiers :
- `c6radio.key` (GARDE-LE SECRET !)
- `c6radio.csr` (à uploader sur Apple)

#### 2.2 Créer le certificat sur Apple Developer

1. **Ouvre** : https://developer.apple.com/account

2. **Navigue** :
   ```
   Certificates, Identifiers & Profiles → Certificates → Bouton [+]
   ```

3. **Sélectionne** :
   - ☑️ `Apple Distribution`
   - Clique sur `Continue`

4. **Upload le CSR** :
   - Clique sur `Choose File`
   - Sélectionne `c6radio.csr`
   - Clique sur `Continue`

5. **Download** :
   - Clique sur `Download`
   - Tu obtiens un fichier : `distribution.cer`

#### 2.3 Convertir en .p12 (format utilisable)

```bash
cd ~/apple-certificates

# Convertir le .cer en .pem
openssl x509 -in distribution.cer -inform DER -out distribution.pem -outform PEM

# Créer le .p12 (IMPORTANT : choisis un mot de passe FORT)
openssl pkcs12 -export -out distribution.p12 -inkey c6radio.key -in distribution.pem

# Le terminal va te demander un mot de passe
# ⚠️ MÉMORISE-LE ! Tu en auras besoin pour GitHub
```

Tu auras maintenant :
- `distribution.p12` (à encoder en base64)
- Un mot de passe (à mettre dans GitHub Secrets)

#### 2.4 Encoder en base64

```bash
# Encode le .p12
base64 -w 0 distribution.p12 > distribution.p12.base64

# Affiche le contenu (COPIE TOUT)
cat distribution.p12.base64
```

📋 **Copie la sortie** dans un fichier texte temporaire, tu en auras besoin pour GitHub.

### Vérification ✅

Sur https://developer.apple.com/account :
```
✅ Certificates → Apple Distribution
   Type: Apple Distribution
   Status: Active
   Expires: [Date dans 1 an]
```

---

## 🔴 ÉTAPE 3 : Créer le Profil de Provisionnement

### Pourquoi ?
Le profil lie ton certificat à ton App ID et autorise l'installation sur des devices.

### ⚠️ ATTENTION : Choisis le BON type !

- ❌ **iOS App Development** → Pour dev uniquement
- ❌ **Ad Hoc** → Pour distribution manuelle
- ✅ **App Store Connect** → Pour TestFlight et App Store

### Comment ?

1. **Ouvre** : https://developer.apple.com/account

2. **Navigue** :
   ```
   Certificates, Identifiers & Profiles → Profiles → Bouton [+]
   ```

3. **Sélectionne** :
   - ☑️ `App Store Connect`
   - Clique sur `Continue`

4. **Choisis l'App ID** :
   - Sélectionne : `C6Radio Debug (fr.c6debug.app)`
   - Clique sur `Continue`

5. **Choisis le certificat** :
   - ☑️ Ton certificat `Apple Distribution` (créé à l'étape 2)
   - Clique sur `Continue`

6. **Nom du profil** :
   ```
   Profile Name: C6Radio Debug AppStore
   ```
   - Clique sur `Generate`

7. **Download** :
   - Clique sur `Download`
   - Tu obtiens : `C6Radio_Debug_AppStore.mobileprovision`

### 3.1 Encoder en base64

```bash
cd ~/apple-certificates

# Copie le fichier téléchargé
cp ~/Downloads/C6Radio_Debug_AppStore.mobileprovision .

# Encode en base64
base64 -w 0 C6Radio_Debug_AppStore.mobileprovision > profile.base64

# Affiche le contenu (COPIE TOUT)
cat profile.base64
```

📋 **Copie la sortie** dans ton fichier texte temporaire.

### Vérification ✅

Sur https://developer.apple.com/account :
```
✅ Profiles → C6Radio Debug AppStore
   Type: App Store Connect
   Status: Active
   App ID: fr.c6debug.app
```

---

## 🔴 ÉTAPE 4 : Créer l'App sur App Store Connect

### Pourquoi ?
C'est l'app "conteneur" qui recevra tous tes builds TestFlight.

### Comment ?

1. **Ouvre** : https://appstoreconnect.apple.com

2. **Navigue** :
   ```
   My Apps → Bouton [+] (en haut à gauche) → New App
   ```

3. **Remplis le formulaire** :
   ```
   Platforms: ☑️ iOS
   
   Name: C6Radio Debug
   
   Primary Language: French (France)
   
   Bundle ID: fr.c6debug.app (sélectionne dans la liste)
   
   SKU: c6radio-debug-001
   
   User Access: Full Access
   ```

4. **Clique sur** : `Create`

### Vérification ✅

Tu dois voir :
```
✅ App créée : C6Radio Debug
   Bundle ID: fr.c6debug.app
   Status: Prepare for Submission
```

---

## 🔴 ÉTAPE 5 : Créer la Clé API App Store Connect

### Pourquoi ?
Cette clé permet au workflow GitHub d'uploader automatiquement l'app sur TestFlight.

### ⚠️ SUPER IMPORTANT
Le fichier `.p8` ne peut être téléchargé **QU'UNE SEULE FOIS** !  
Si tu le perds, tu devras créer une nouvelle clé.

### Comment ?

1. **Ouvre** : https://appstoreconnect.apple.com

2. **Navigue** :
   ```
   Users and Access → Integrations tab → App Store Connect API → Team Keys
   ```

3. **Clique sur** : `Generate API Key` (icône [+])

4. **Remplis** :
   ```
   Name: GitHub Actions C6Radio
   
   Access: App Manager ⚠️ IMPORTANT (pas "Developer" !)
   ```

5. **Clique sur** : `Generate`

6. **IMMÉDIATEMENT** :
   - 📋 **Copie le Key ID** : `ABC123XYZ4` (exemple)
   - 📋 **Copie l'Issuer ID** : `12345678-abcd-1234-efgh-567890abcdef` (exemple)
   - 📥 **Download** le fichier `.p8` : `AuthKey_ABC123XYZ4.p8`

⚠️ **Stocke-les en sécurité !** Tu ne pourras plus télécharger le `.p8` après !

### 5.1 Encoder la clé en base64

```bash
cd ~/apple-certificates

# Copie le fichier téléchargé
cp ~/Downloads/AuthKey_*.p8 .

# Encode en base64
base64 -w 0 AuthKey_*.p8 > authkey.base64

# Affiche le contenu (COPIE TOUT)
cat authkey.base64
```

📋 **Copie** :
- Le Key ID (ex: `ABC123XYZ4`)
- L'Issuer ID (ex: `12345678-abcd-1234-efgh-567890abcdef`)
- Le contenu de `authkey.base64`

### Vérification ✅

Sur App Store Connect :
```
✅ Team Keys → Active
   Key ID: ABC123XYZ4
   Access: App Manager
   Name: GitHub Actions C6Radio
```

---

## 🔴 ÉTAPE 6 : Obtenir le Team ID

### Pourquoi ?
Le Team ID identifie ton compte Apple Developer.

### Comment ?

1. **Ouvre** : https://developer.apple.com/account

2. **Cherche** en haut de la page :
   ```
   Membership Details
   Team ID: ABCD123456
   ```

3. **Copie** le Team ID

📋 **Note-le** dans ton fichier texte temporaire.

### Vérification ✅

Le Team ID est un code de **10 caractères** (lettres + chiffres).

---

## 🔴 ÉTAPE 7 : Configurer les Secrets GitHub

### Pourquoi ?
Le workflow a besoin de ces informations pour build et upload automatiquement.

### Comment ?

1. **Ouvre ton repo GitHub** : https://github.com/TON_USERNAME/c6radio-web

2. **Navigue** :
   ```
   Settings → Secrets and variables → Actions → New repository secret
   ```

3. **Crée 7 secrets** (UN PAR UN) :

#### Secret 1 : `IOS_P12_BASE64`

```
Name: IOS_P12_BASE64
Value: [Colle le contenu de distribution.p12.base64]
```

#### Secret 2 : `IOS_P12_PASSWORD`

```
Name: IOS_P12_PASSWORD
Value: [Le mot de passe que tu as choisi à l'étape 2.3]
```

#### Secret 3 : `IOS_MOBILEPROVISION_BASE64`

```
Name: IOS_MOBILEPROVISION_BASE64
Value: [Colle le contenu de profile.base64]
```

#### Secret 4 : `APPLE_TEAM_ID`

```
Name: APPLE_TEAM_ID
Value: [Ton Team ID, ex: ABCD123456]
```

#### Secret 5 : `ASC_API_KEY_ID`

```
Name: ASC_API_KEY_ID
Value: [Le Key ID, ex: ABC123XYZ4]
```

#### Secret 6 : `ASC_API_ISSUER_ID`

```
Name: ASC_API_ISSUER_ID
Value: [L'Issuer ID, ex: 12345678-abcd-1234-efgh-567890abcdef]
```

#### Secret 7 : `ASC_API_PRIVATE_KEY_BASE64`

```
Name: ASC_API_PRIVATE_KEY_BASE64
Value: [Colle le contenu de authkey.base64]
```

### Vérification ✅

Sur GitHub → Settings → Secrets :
```
✅ IOS_P12_BASE64
✅ IOS_P12_PASSWORD
✅ IOS_MOBILEPROVISION_BASE64
✅ APPLE_TEAM_ID
✅ ASC_API_KEY_ID
✅ ASC_API_ISSUER_ID
✅ ASC_API_PRIVATE_KEY_BASE64

Total: 7 secrets
```

---

## 🔴 ÉTAPE 8 : Vérifier le Bundle ID dans le Code

### Pourquoi ?
Le Bundle ID doit être **IDENTIQUE** partout.

### Vérification 1 : capacitor.config.json

```bash
cat capacitor.config.json
```

Tu dois voir :
```json
{
  "appId": "fr.c6debug.app",
  ...
}
```

✅ Si c'est bon, passe à la vérification 2.  
❌ Si c'est différent, corrige-le.

### Vérification 2 : project.pbxproj

```bash
grep -n "PRODUCT_BUNDLE_IDENTIFIER" ios/App/App.xcodeproj/project.pbxproj
```

Tu dois voir plusieurs lignes avec :
```
PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app;
```

✅ Si c'est bon, passe à l'étape 9.  
❌ Si tu vois autre chose, il faut corriger :

```bash
# Remplace ALL occurrences
sed -i 's/PRODUCT_BUNDLE_IDENTIFIER = .*/PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app;/g' ios/App/App.xcodeproj/project.pbxproj

# Vérifie que c'est corrigé
grep "PRODUCT_BUNDLE_IDENTIFIER" ios/App/App.xcodeproj/project.pbxproj
```

---

## 🚀 ÉTAPE 9 : Lancer le Premier Build !

### C'est le moment de vérité ! 🎉

1. **Fais un petit changement** (pour déclencher le workflow) :

```bash
# Ajoute un commentaire dans le code
echo "// Test workflow iOS TestFlight" >> src/App.jsx
```

2. **Commit et push** :

```bash
git add .
git commit -m "test: premier déploiement TestFlight"
git push origin main
```

3. **Surveille le workflow** :

   - Ouvre : https://github.com/TON_USERNAME/c6radio-web/actions
   - Clique sur le workflow qui vient de démarrer
   - Regarde chaque étape en temps réel

4. **Durée estimée** : **10-15 minutes**

### À quoi t'attendre :

```
✅ Checkout du code
✅ Configuration Node.js
✅ Installation des dépendances npm
✅ Build React + Vite
✅ Synchronisation Capacitor iOS
✅ Incrémentation du build number
✅ Import du certificat de signature
✅ Installation du profil de provisionnement
✅ Préparation de la clé API App Store Connect
✅ Build de l'archive Xcode (⏱️ le plus long ~5 min)
✅ Export de l'IPA
✅ Upload vers TestFlight (⏱️ ~2-3 min)
✅ Succès !
```

### Si ça échoue ❌

1. **Clique sur l'étape en rouge**
2. **Lis l'erreur**
3. **Consulte** : `docs/phase-7-AIDE-MEMOIRE-RAPIDE.md`

---

## 🎉 ÉTAPE 10 : Vérifier sur TestFlight

### Où ?

1. **Ouvre** : https://appstoreconnect.apple.com

2. **Navigue** :
   ```
   My Apps → C6Radio Debug → TestFlight
   ```

### Que voir ?

**Immédiatement après l'upload** :
```
⏳ Build 1.0 (1)
   Status: Processing
```

**Après 15-30 minutes** :
```
✅ Build 1.0 (1)
   Status: Ready to Test
   TestFlight Badge: ✅
```

---

## 📱 ÉTAPE 11 : Installer sur iPhone

### 11.1 Ajoute-toi comme testeur

1. **Sur App Store Connect** :
   ```
   My Apps → C6Radio Debug → TestFlight → Internal Testing
   ```

2. **Clique sur** : `+ Internal Group` (si pas déjà créé)

3. **Ajoute-toi** :
   - Clique sur le groupe
   - Click `Add Testers`
   - Sélectionne ton Apple ID
   - Clique `Add`

### 11.2 Installe TestFlight sur iPhone

1. **Sur iPhone** : Ouvre l'App Store
2. **Recherche** : "TestFlight"
3. **Télécharge** l'app officielle d'Apple (icône bleue avec avion)

### 11.3 Accepte l'invitation

1. **Check tes emails** (celui de ton Apple ID)
2. **Ouvre l'email** : "You're Invited to Test C6Radio Debug"
3. **Clique** : "View in TestFlight"
4. **L'app TestFlight s'ouvre**

### 11.4 Installe et teste !

1. **Dans TestFlight** :
   - Tu vois : C6Radio Debug
   - Clique `Install`

2. **Une fois installée** :
   - Clique `Open`
   - 🎉 **TON APP FONCTIONNE !**

---

## 🔄 CYCLE DE DÉVELOPPEMENT

### À partir de maintenant :

```bash
# 1. Tu fais des modifications
vim src/components/MonComposant.jsx

# 2. Tu commit et push
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 3. Le workflow se lance automatiquement (10-15 min)

# 4. 15-30 min après, le nouveau build apparaît sur TestFlight

# 5. Sur iPhone → TestFlight → Update → Teste !
```

### Automatique = Zéro effort ! ✨

---

## 📊 RÉCAPITULATIF

### Ce que tu as créé :

✅ **App ID** : fr.c6debug.app  
✅ **Certificat** : Apple Distribution  
✅ **Profil** : App Store Connect  
✅ **App Store Connect** : C6Radio Debug  
✅ **Clé API** : GitHub Actions  
✅ **7 secrets GitHub** configurés  
✅ **Workflow** fonctionnel  
✅ **App sur TestFlight** 🎉

### Temps total :
**45-60 minutes** (si tout s'est bien passé)

### Prochaines étapes :

- [ ] Tester toutes les fonctionnalités sur iPhone
- [ ] Vérifier que l'audio fonctionne en arrière-plan
- [ ] Si besoin, Phase 7b : Audio Background iOS
- [ ] Ajouter d'autres testeurs
- [ ] Itérer avec des mises à jour régulières

---

## ❌ DÉPANNAGE RAPIDE

### Erreur : "No profiles for 'fr.c6debug.app' were found"
**Solution** : Le profil n'existe pas ou mal configuré  
➡️ Retourne à l'ÉTAPE 3

### Erreur : "No signing certificate found"
**Solution** : Certificat invalide ou mot de passe incorrect  
➡️ Vérifie les secrets 1 et 2 (ÉTAPE 7)

### Erreur : "Authentication credentials invalid"
**Solution** : Clé API incorrecte  
➡️ Vérifie les secrets 5, 6, 7 (ÉTAPE 7)

### Erreur : "Bundle identifier mismatch"
**Solution** : Bundle ID pas identique partout  
➡️ Retourne à l'ÉTAPE 8

### Workflow ne se déclenche pas
**Solution** : Vérifie que tu push bien sur `main`  
```bash
git branch  # Vérifie que tu es sur main
```

---

## 📚 RESSOURCES

- **Apple Developer Portal** : https://developer.apple.com/account
- **App Store Connect** : https://appstoreconnect.apple.com
- **GitHub Actions** : https://github.com/TON_USERNAME/c6radio-web/actions
- **Documentation Capacitor** : https://capacitorjs.com/docs/ios

---

## 💡 CONSEILS

### Sécurité

- ⚠️ **Ne partage JAMAIS** :
  - Le fichier `.p12` et son mot de passe
  - Le fichier `.p8` (clé API)
  - Tes secrets GitHub

- ✅ **Backup** :
  - Sauvegarde `~/apple-certificates/` dans un endroit sûr
  - Stocke les mots de passe dans un gestionnaire de mots de passe

### Maintenance

- **Certificat** : Expire dans 1 an → Recevoir notification par email
- **Profil** : Expire dans 1 an → Recevoir notification par email
- **Clé API** : Pas d'expiration, mais révocable

### Optimisations futures

- [ ] Ajouter des notifications Slack/Discord
- [ ] Créer un workflow pour les releases de production
- [ ] Ajouter des tests automatisés avant build
- [ ] Mettre en place des branches de feature

---

## 🎊 FÉLICITATIONS !

Tu as maintenant un **pipeline de déploiement iOS complètement automatisé** ! 🚀

Chaque push = Nouveau build TestFlight = Tests sur iPhone réel

C'est exactement ce que font les grandes boîtes tech ! 💪

**Bon dev et bon tests !** 🎉


