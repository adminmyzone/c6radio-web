# 🔍 DIAGNOSTIC COMPLET - Workflow GitHub Actions iOS

**Date**: 15 février 2026  
**Status**: PROBLÈME IDENTIFIÉ - Configuration incomplète sur Apple Developer

---

## ❌ PROBLÈME ACTUEL

L'erreur `No profiles for 'fr.c6debug.app' were found` signifie que :

1. **Le Bundle ID `fr.c6debug.app` n'existe PAS sur Apple Developer Portal**
2. **Aucun profil de provisionnement n'a été créé pour ce Bundle ID**
3. Le workflow essaie de signer une app avec un Bundle ID inexistant

---

## 🎯 SOLUTION

Il faut créer **TOUS les éléments nécessaires** sur Apple Developer Portal avant que le workflow fonctionne.

---

## 📋 CHECKLIST COMPLÈTE (À FAIRE DANS L'ORDRE)

### ✅ ÉTAPE 1 : Créer l'App ID sur Apple Developer

1. Va sur https://developer.apple.com/account
2. Clique sur **Certificates, Identifiers & Profiles**
3. Clique sur **Identifiers** dans le menu de gauche
4. Clique sur le bouton **+** (en haut à droite)
5. Sélectionne **App IDs** → Continue
6. Sélectionne **App** → Continue
7. Configure l'App ID :
   - **Description** : `C6Radio Debug`
   - **Bundle ID** : `Explicit` → `fr.c6debug.app` ⚠️ DOIT correspondre exactement
   - **Capabilities** : rien de spécial pour l'instant
8. Clique sur **Continue** → **Register**

---

### ✅ ÉTAPE 2 : Créer le Certificat de Distribution

**Tu as déjà fait ça normalement !** Vérifie que tu as :

- Un certificat **Apple Distribution** valide et non expiré
- Le fichier `.p12` (avec son mot de passe) encodé en base64

**Pour vérifier** :
```bash
# Liste tes certificats
security find-identity -v -p codesigning
```

Si tu dois recréer le `.p12` depuis un `.cer` :
```bash
# 1. Convertir .cer en .pem
openssl x509 -inform DER -in distribution.cer -out certificate.pem

# 2. Créer un fichier de clé privée (tu dois l'avoir depuis la création du CSR)
# Si tu ne l'as pas, tu dois recréer un nouveau certificat

# 3. Combiner certificat + clé privée en .p12
openssl pkcs12 -export -out distribution.p12 -inkey privateKey.key -in certificate.pem

# 4. Encoder en base64
base64 -i distribution.p12 -o distribution.p12.base64
```

---

### ✅ ÉTAPE 3 : Créer le Profil de Provisionnement

**C'EST L'ÉTAPE MANQUANTE ACTUELLEMENT !**

1. Sur Apple Developer Portal, va dans **Profiles**
2. Clique sur le bouton **+** (en haut à droite)
3. Sélectionne **App Store Connect** (pour TestFlight) → Continue
4. **App ID** : Sélectionne `C6Radio Debug (fr.c6debug.app)` → Continue
5. **Certificates** : Sélectionne ton certificat Apple Distribution → Continue
6. **Profile Name** : `C6Radio Debug AppStore` → Continue
7. Clique sur **Generate**
8. **Télécharge** le fichier `.mobileprovision`

**Encoder le profil en base64** :
```bash
base64 -i C6Radio_Debug_AppStore.mobileprovision -o profile.mobileprovision.base64
```

---

### ✅ ÉTAPE 4 : Créer l'App sur App Store Connect

1. Va sur https://appstoreconnect.apple.com
2. Clique sur **My Apps**
3. Clique sur le bouton **+** → **New App**
4. Configure :
   - **Platforms** : iOS
   - **Name** : C6Radio Debug
   - **Primary Language** : French
   - **Bundle ID** : Sélectionne `fr.c6debug.app` (si absent, retourne à l'étape 1)
   - **SKU** : `c6radio-debug-001` (identifiant unique)
   - **User Access** : Full Access
5. Clique sur **Create**

---

### ✅ ÉTAPE 5 : Créer la clé API App Store Connect

**Tu as déjà fait ça normalement !** Vérifie que tu as :

1. Une clé API avec le rôle **App Manager** ou **Admin**
2. Le fichier `.p8` encodé en base64
3. L'**Issuer ID** (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. Le **Key ID** (format : `XXXXXXXXXX`)

**Pour créer une nouvelle clé si nécessaire** :
1. Va sur https://appstoreconnect.apple.com
2. **Users and Access** → **Integrations** → **App Store Connect API**
3. Clique sur le bouton **+** sous **Team Keys**
4. **Name** : `GitHub Actions C6Radio`
5. **Access** : **App Manager**
6. Clique sur **Generate**
7. **⚠️ IMPORTANT** : Télécharge le fichier `.p8` IMMÉDIATEMENT (tu ne pourras plus jamais le retélécharger)
8. Note le **Key ID** et l'**Issuer ID**

**Encoder la clé en base64** :
```bash
base64 -i AuthKey_XXXXXXXXXX.p8 -o authkey.p8.base64
```

---

### ✅ ÉTAPE 6 : Obtenir le Team ID

1. Va sur https://developer.apple.com/account
2. En haut de la page, dans la section **Membership Details**, tu verras ton **Team ID**
3. Note-le (format : `XXXXXXXXXX`)

---

## 🔐 SECRETS GITHUB À CONFIGURER

Sur GitHub, va dans **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Voici les **7 secrets** à créer :

| Secret Name | Description | Format | Exemple |
|-------------|-------------|--------|---------|
| `IOS_P12_BASE64` | Certificat Apple Distribution en base64 | Chaîne très longue | `MIIKcAIBAzCCCi4...` |
| `IOS_P12_PASSWORD` | Mot de passe du fichier .p12 | Texte simple | `MonMotDePasse123` |
| `IOS_MOBILEPROVISION_BASE64` | Profil de provisionnement en base64 | Chaîne très longue | `MIIMuwYJKoZIhv...` |
| `APPLE_TEAM_ID` | Team ID Apple Developer | 10 caractères | `XXXXXXXXXX` |
| `ASC_API_KEY_ID` | Key ID de la clé API App Store Connect | 10 caractères | `XXXXXXXXXX` |
| `ASC_API_ISSUER_ID` | Issuer ID App Store Connect | UUID | `xxxxxxxx-xxxx-xxxx-...` |
| `ASC_API_PRIVATE_KEY_BASE64` | Fichier .p8 encodé en base64 | Chaîne très longue | `LS0tLS1CRUdJT...` |

---

## 🔄 WORKFLOW - COMMENT ÇA FONCTIONNE

### 1. **Déclenchement**
- À chaque push sur `main`
- Ou manuellement depuis l'onglet "Actions" de GitHub

### 2. **Build du projet React + Vite**
```bash
npm ci              # Installation propre des dépendances
npm run build       # Génère le dossier dist/
npx cap sync ios    # Copie dist/ vers ios/App/App/public/
```

### 3. **Incrémentation du build number**
- Utilise le numéro du run GitHub (`${{ github.run_number }}`)
- Évite les conflits "build déjà utilisé" sur TestFlight

### 4. **Signature du code**
- Import du certificat `.p12` dans le keychain macOS du runner
- Installation du profil de provisionnement `.mobileprovision`
- Configuration de la clé API App Store Connect

### 5. **Build Xcode**
```bash
xcodebuild archive   # Crée l'archive .xcarchive
```

### 6. **Export IPA**
```bash
xcodebuild -exportArchive   # Génère le fichier .ipa
```

### 7. **Upload vers TestFlight**
```bash
xcrun altool --upload-app   # Envoie l'app sur App Store Connect
```

---

## ⚠️ POINTS D'ATTENTION

### 1. **Le Bundle ID doit être EXACTEMENT le même partout** :
- `capacitor.config.json` : `"appId": "fr.c6debug.app"`
- `project.pbxproj` : `PRODUCT_BUNDLE_IDENTIFIER = fr.c6debug.app`
- Apple Developer Portal : App ID `fr.c6debug.app`
- Profil de provisionnement : lié à `fr.c6debug.app`
- App Store Connect : créée avec `fr.c6debug.app`

### 2. **Le profil de provisionnement doit être de type "App Store Connect"**
- ❌ PAS "iOS App Development"
- ❌ PAS "Ad Hoc"
- ✅ **"App Store Connect"** (pour TestFlight)

### 3. **Le certificat doit être "Apple Distribution"**
- ❌ PAS "Apple Development"
- ✅ **"Apple Distribution"**

### 4. **La clé API doit avoir les bons droits**
- ❌ PAS "Developer"
- ✅ **"App Manager"** ou **"Admin"**

---

## 🧪 COMMENT TESTER

1. **Vérifie que tous les secrets sont configurés** :
   ```bash
   # Sur GitHub → Settings → Secrets → Actions
   # Tu dois voir 7 secrets avec une icône verte
   ```

2. **Pousse un commit** :
   ```bash
   git add .
   git commit -m "test: workflow iOS"
   git push
   ```

3. **Surveille le workflow** :
   - Va sur GitHub → onglet **Actions**
   - Clique sur le workflow en cours
   - Regarde chaque étape en détail

4. **En cas d'erreur** :
   - Lis TOUS les logs de l'étape qui a échoué
   - Vérifie que le Bundle ID est correct PARTOUT
   - Vérifie que les secrets sont corrects

---

## 🎯 PROCHAINES ÉTAPES

### Une fois que le workflow fonctionne :

1. **Attends 15-30 minutes** après l'upload
2. Va sur **App Store Connect** → **My Apps** → **C6Radio Debug**
3. Onglet **TestFlight**
4. Tu verras ton build apparaître
5. Ajoute-toi comme testeur interne
6. Reçois l'invitation par email
7. Installe TestFlight sur ton iPhone
8. Télécharge et teste l'app !

---

## 📚 RÉSUMÉ DES FICHIERS IMPORTANTS

```
c6radio-web/
├── capacitor.config.json          ← Bundle ID : fr.c6debug.app
├── ios/
│   └── App/
│       └── App.xcodeproj/
│           └── project.pbxproj    ← Bundle ID : fr.c6debug.app
└── .github/
    └── workflows/
        └── ios-testflight.yml     ← Le workflow GitHub Actions
```

---

## 🆘 EN CAS DE PROBLÈME

### Erreur : "No profiles found"
→ Tu n'as pas créé le profil de provisionnement sur Apple Developer (Étape 3)

### Erreur : "No code signing identity found"
→ Ton certificat `.p12` est invalide ou le mot de passe est incorrect

### Erreur : "Authentication credentials invalid"
→ Ta clé API `.p8` est invalide ou le Key ID / Issuer ID est incorrect

### Erreur : "Bundle identifier mismatch"
→ Le Bundle ID n'est pas le même dans `capacitor.config.json` et `project.pbxproj`

---

## ✅ VALIDATION FINALE

Avant de pousser un commit, vérifie :

- [ ] App ID `fr.c6debug.app` créé sur Apple Developer
- [ ] Certificat Apple Distribution valide
- [ ] Profil de provisionnement **App Store Connect** créé et téléchargé
- [ ] App créée sur App Store Connect avec le même Bundle ID
- [ ] Clé API App Store Connect créée avec le rôle App Manager
- [ ] Les 7 secrets GitHub configurés correctement
- [ ] Bundle ID identique dans `capacitor.config.json` et `project.pbxproj`

**Si tout est ✅, le workflow devrait fonctionner ! 🎉**

