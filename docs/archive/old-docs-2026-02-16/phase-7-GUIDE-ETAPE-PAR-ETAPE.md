# 📱 GUIDE ÉTAPE PAR ÉTAPE - Configuration Apple Developer pour GitHub Actions

**Pour débutant** - Chaque étape avec des explications simples

---

## 🎯 CE QUE NOUS ALLONS FAIRE

Nous allons créer **4 choses essentielles** sur Apple Developer :

1. ✅ Un **App ID** (l'identité unique de ton app)
2. ✅ Un **Certificat** (pour prouver que c'est bien toi qui publie l'app)
3. ✅ Un **Profil de provisionnement** (pour autoriser l'installation sur des appareils)
4. ✅ Une **entrée App Store Connect** (pour gérer l'app sur TestFlight)

---

## 📋 ÉTAPE 1 : CRÉER L'APP ID

### 🌐 Où aller ?
👉 https://developer.apple.com/account

### 📍 Navigation :
1. Clique sur **"Certificates, Identifiers & Profiles"**
2. Dans le menu de gauche, clique sur **"Identifiers"**

### ➕ Création :
1. Clique sur le bouton bleu **"+"** (en haut à droite)
2. Sélectionne **"App IDs"**
3. Clique sur **"Continue"**

### 📝 Formulaire :
4. Sélectionne **"App"** (pas "App Clip")
5. Clique sur **"Continue"**

### ✏️ Configuration :

```
Description
┌─────────────────────────────────────┐
│ C6Radio Debug                       │  ← Un nom compréhensible
└─────────────────────────────────────┘

Bundle ID
┌─────────────────────────────────────┐
│ ● Explicit                          │  ← IMPORTANT : Sélectionne "Explicit"
│                                     │
│ fr.c6debug.app                      │  ← EXACTEMENT ce texte
└─────────────────────────────────────┘
```

6. **Capabilities** : Laisse tout par défaut (rien à cocher pour l'instant)
7. Clique sur **"Continue"**
8. Clique sur **"Register"**

✅ **FAIT !** Tu as créé l'App ID `fr.c6debug.app`

---

## 📋 ÉTAPE 2 : VÉRIFIER LE CERTIFICAT

### 🌐 Où aller ?
👉 https://developer.apple.com/account

### 📍 Navigation :
1. **"Certificates, Identifiers & Profiles"**
2. Dans le menu de gauche, clique sur **"Certificates"**

### 🔍 Vérification :
Tu dois avoir un certificat de type **"Apple Distribution"** :

```
Type                  | Name              | Expires
─────────────────────┼───────────────────┼──────────────
Apple Distribution    | John Doe          | Feb 15, 2027  ✅
```

### ❌ Si tu n'as PAS ce certificat :

#### A. Créer une Certificate Signing Request (CSR) :

**Sur Linux** :
```bash
# 1. Créer une clé privée
openssl genrsa -out privateKey.key 2048

# 2. Créer le CSR
openssl req -new -key privateKey.key -out CertificateSigningRequest.certSigningRequest \
  -subj "/emailAddress=ton-email@exemple.com, CN=Ton Nom, C=FR"
```

⚠️ **GARDE PRÉCIEUSEMENT le fichier `privateKey.key`** - Tu en auras besoin plus tard !

#### B. Sur Apple Developer :
1. Clique sur le bouton **"+"**
2. Sélectionne **"Apple Distribution"**
3. Clique sur **"Continue"**
4. Upload ton fichier `CertificateSigningRequest.certSigningRequest`
5. Clique sur **"Continue"**
6. **Télécharge** le fichier `.cer` (par exemple : `distribution.cer`)

#### C. Convertir en .p12 :

```bash
# 1. Convertir .cer en .pem
openssl x509 -inform DER -in distribution.cer -out certificate.pem

# 2. Créer le .p12 (combine certificat + clé privée)
openssl pkcs12 -export -out distribution.p12 \
  -inkey privateKey.key \
  -in certificate.pem

# Il te demandera un mot de passe - CHOISIS UN MOT DE PASSE SIMPLE et NOTE-LE !
# Par exemple : C6Radio2026
```

#### D. Encoder en base64 :

```bash
base64 -i distribution.p12 > distribution.p12.base64

# Affiche le contenu :
cat distribution.p12.base64
```

📋 **COPIE** tout le contenu (c'est une TRÈS longue ligne) - Ce sera le secret `IOS_P12_BASE64`

✅ **FAIT !** Tu as ton certificat en `.p12` encodé en base64

---

## 📋 ÉTAPE 3 : CRÉER LE PROFIL DE PROVISIONNEMENT

**⚠️ C'EST L'ÉTAPE LA PLUS IMPORTANTE** - C'est ce qui manque actuellement !

### 🌐 Où aller ?
👉 https://developer.apple.com/account

### 📍 Navigation :
1. **"Certificates, Identifiers & Profiles"**
2. Dans le menu de gauche, clique sur **"Profiles"**

### ➕ Création :
1. Clique sur le bouton bleu **"+"**
2. **⚠️ IMPORTANT** : Sélectionne **"App Store Connect"** (pas "Development" !)
3. Clique sur **"Continue"**

### 🔗 Association App ID :
4. Dans la liste déroulante, sélectionne **"C6Radio Debug (fr.c6debug.app)"**
5. Clique sur **"Continue"**

### 🔒 Association Certificat :
6. Coche ton certificat **"Apple Distribution"**
7. Clique sur **"Continue"**

### ✏️ Nom du profil :
```
Provisioning Profile Name
┌─────────────────────────────────────┐
│ C6Radio Debug AppStore              │  ← Un nom descriptif
└─────────────────────────────────────┘
```

8. Clique sur **"Generate"**
9. **⚠️ Télécharge** le fichier `.mobileprovision`

Le fichier aura un nom comme : `C6Radio_Debug_AppStore.mobileprovision`

### 🔐 Encoder en base64 :

```bash
base64 -i C6Radio_Debug_AppStore.mobileprovision > profile.mobileprovision.base64

# Affiche le contenu :
cat profile.mobileprovision.base64
```

📋 **COPIE** tout le contenu - Ce sera le secret `IOS_MOBILEPROVISION_BASE64`

✅ **FAIT !** Tu as créé le profil de provisionnement

---

## 📋 ÉTAPE 4 : CRÉER L'APP SUR APP STORE CONNECT

### 🌐 Où aller ?
👉 https://appstoreconnect.apple.com

### 📍 Navigation :
1. Clique sur **"My Apps"**
2. Clique sur le bouton bleu **"+"** (en haut à gauche)
3. Sélectionne **"New App"**

### ✏️ Formulaire :

```
Platforms
┌─────────────────────────────────────┐
│ ☑ iOS                               │  ← Coche iOS
└─────────────────────────────────────┘

Name
┌─────────────────────────────────────┐
│ C6Radio Debug                       │  ← Le nom de l'app (peut être changé)
└─────────────────────────────────────┘

Primary Language
┌─────────────────────────────────────┐
│ French (France)                     │  ← Sélectionne français
└─────────────────────────────────────┘

Bundle ID
┌─────────────────────────────────────┐
│ fr.c6debug.app (C6Radio Debug)     │  ← Sélectionne dans la liste
└─────────────────────────────────────┘

SKU
┌─────────────────────────────────────┐
│ c6radio-debug-001                   │  ← Un identifiant unique interne
└─────────────────────────────────────┘

User Access
┌─────────────────────────────────────┐
│ ● Full Access                       │  ← Laisse "Full Access"
└─────────────────────────────────────┘
```

4. Clique sur **"Create"**

✅ **FAIT !** L'app existe maintenant sur App Store Connect

---

## 📋 ÉTAPE 5 : CRÉER LA CLÉ API APP STORE CONNECT

### 🌐 Où aller ?
👉 https://appstoreconnect.apple.com

### 📍 Navigation :
1. Clique sur ton nom (en haut à droite)
2. Sélectionne **"Users and Access"**
3. Clique sur l'onglet **"Integrations"**
4. Clique sur **"App Store Connect API"** (sous-onglet)

### ➕ Création :
1. Sous la section **"Team Keys"**, clique sur le bouton **"+"**

### ✏️ Formulaire :

```
Name
┌─────────────────────────────────────┐
│ GitHub Actions C6Radio              │  ← Un nom descriptif
└─────────────────────────────────────┘

Access
┌─────────────────────────────────────┐
│ ● App Manager                       │  ← IMPORTANT : Choisis "App Manager"
└─────────────────────────────────────┘
```

2. Clique sur **"Generate"**

### 📥 Téléchargement :

⚠️ **ATTENTION** : Tu ne pourras télécharger le fichier `.p8` **QU'UNE SEULE FOIS** !

1. Clique sur **"Download API Key"**
2. Le fichier s'appelle quelque chose comme : `AuthKey_ABC123XYZ4.p8`

### 📋 Note les informations :

Sur la page, tu verras :

```
KEY ID:    ABC123XYZ4          ← Note ce KEY ID
ISSUER ID: 12345678-abcd-1234-efgh-567890abcdef  ← Note cet ISSUER ID
```

### 🔐 Encoder en base64 :

```bash
base64 -i AuthKey_ABC123XYZ4.p8 > authkey.p8.base64

# Affiche le contenu :
cat authkey.p8.base64
```

📋 **COPIE** tout le contenu - Ce sera le secret `ASC_API_PRIVATE_KEY_BASE64`

✅ **FAIT !** Tu as la clé API App Store Connect

---

## 📋 ÉTAPE 6 : OBTENIR LE TEAM ID

### 🌐 Où aller ?
👉 https://developer.apple.com/account

### 📍 Où le trouver ?
En haut de la page, dans la section **"Membership Details"** :

```
┌─────────────────────────────────────────────┐
│ Membership Details                          │
│                                             │
│ Team Name:       John Doe                   │
│ Team ID:         ABC123XYZ4  ← COPIE CECI  │
│ Program Type:    Individual                 │
└─────────────────────────────────────────────┘
```

📋 **COPIE** le Team ID - Ce sera le secret `APPLE_TEAM_ID`

✅ **FAIT !** Tu as ton Team ID

---

## 🔐 ÉTAPE 7 : CONFIGURER LES SECRETS GITHUB

### 🌐 Où aller ?
👉 https://github.com/TON-USERNAME/c6radio-web

### 📍 Navigation :
1. Clique sur l'onglet **"Settings"** (en haut)
2. Dans le menu de gauche, clique sur **"Secrets and variables"**
3. Clique sur **"Actions"**
4. Clique sur le bouton vert **"New repository secret"**

### 📝 Secrets à créer (un par un) :

#### Secret 1 : IOS_P12_BASE64
```
Name: IOS_P12_BASE64
Secret: [Colle le contenu de distribution.p12.base64]
```

#### Secret 2 : IOS_P12_PASSWORD
```
Name: IOS_P12_PASSWORD
Secret: C6Radio2026  ← Le mot de passe que tu as choisi
```

#### Secret 3 : IOS_MOBILEPROVISION_BASE64
```
Name: IOS_MOBILEPROVISION_BASE64
Secret: [Colle le contenu de profile.mobileprovision.base64]
```

#### Secret 4 : APPLE_TEAM_ID
```
Name: APPLE_TEAM_ID
Secret: ABC123XYZ4  ← Ton Team ID
```

#### Secret 5 : ASC_API_KEY_ID
```
Name: ASC_API_KEY_ID
Secret: ABC123XYZ4  ← Le Key ID de ta clé API
```

#### Secret 6 : ASC_API_ISSUER_ID
```
Name: ASC_API_ISSUER_ID
Secret: 12345678-abcd-1234-efgh-567890abcdef  ← L'Issuer ID
```

#### Secret 7 : ASC_API_PRIVATE_KEY_BASE64
```
Name: ASC_API_PRIVATE_KEY_BASE64
Secret: [Colle le contenu de authkey.p8.base64]
```

✅ **FAIT !** Tous les secrets sont configurés

---

## ✅ VÉRIFICATION FINALE

Avant de tester, vérifie que tu as TOUT fait :

- [ ] App ID `fr.c6debug.app` créé sur Apple Developer ✅
- [ ] Certificat Apple Distribution téléchargé et converti en .p12 ✅
- [ ] Profil de provisionnement **App Store Connect** créé et téléchargé ✅
- [ ] App créée sur App Store Connect avec le Bundle ID `fr.c6debug.app` ✅
- [ ] Clé API App Store Connect créée avec le rôle **App Manager** ✅
- [ ] Team ID récupéré ✅
- [ ] 7 secrets GitHub configurés ✅

---

## 🚀 TEST DU WORKFLOW

1. **Fais un changement mineur dans ton projet** :
```bash
# Par exemple, ajoute un commentaire dans App.jsx
echo "// Test workflow" >> src/App.jsx
```

2. **Commit et push** :
```bash
git add .
git commit -m "test: workflow iOS TestFlight"
git push origin main
```

3. **Surveille le workflow** :
   - Va sur GitHub → onglet **Actions**
   - Clique sur le workflow qui vient de démarrer
   - Regarde chaque étape se dérouler (ça prend environ 10-15 minutes)

4. **En cas de succès** ✅ :
   - Attends 15-30 minutes
   - Va sur App Store Connect → My Apps → C6Radio Debug
   - Onglet **TestFlight**
   - Tu verras ton build apparaître !

5. **En cas d'erreur** ❌ :
   - Clique sur l'étape qui a échoué
   - Lis les logs en détail
   - Reviens au guide de diagnostic (`phase-7-DIAGNOSTIC-COMPLET.md`)

---

## 🎉 SUCCÈS !

Si tout fonctionne, tu verras sur GitHub :

```
✅ Build iOS réussi !
✅ Upload réussi sur TestFlight !
```

Et sur App Store Connect, tu verras ton build dans TestFlight ! 🎊

---

## 🆘 AIDE RAPIDE

### Le workflow échoue à l'étape "Build de l'archive Xcode"
→ Problème de certificat ou de profil de provisionnement

### Le workflow échoue à l'étape "Export de l'IPA"
→ Le profil de provisionnement n'est pas du bon type ou n'existe pas

### Le workflow échoue à l'étape "Upload vers TestFlight"
→ La clé API est invalide ou n'a pas les bons droits

### L'erreur dit "No profiles for 'fr.c6debug.app' were found"
→ Tu n'as pas créé le profil de provisionnement (Étape 3)

---

## 📚 PROCHAINES ÉTAPES

Une fois que le workflow fonctionne :

1. 📖 Lis le guide **TestFlight Internal Testing** (`testflight-internal-guide.md`)
2. 👤 Ajoute-toi comme testeur interne
3. 📱 Installe TestFlight sur ton iPhone
4. 🎮 Teste l'app en conditions réelles !
5. 🔄 À chaque push sur `main`, un nouveau build sera automatiquement envoyé sur TestFlight

**Félicitations ! Tu as configuré un pipeline CI/CD complet pour iOS ! 🚀**

