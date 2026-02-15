# 🔐 Guide Rapide : Configuration des Secrets GitHub

**Durée estimée :** 30-45 minutes  
**Difficulté :** ⭐⭐ Facile à Moyen

---

## 📋 Checklist des secrets

Avant de commencer, vous aurez besoin de :

- [ ] Compte Apple Developer actif (99$/an)
- [ ] Accès à https://developer.apple.com
- [ ] Accès à https://appstoreconnect.apple.com
- [ ] Accès à votre repository GitHub (Settings)

---

## 🎯 Les 8 secrets à configurer

| # | Secret | Type | Où le trouver |
|---|--------|------|---------------|
| 1 | `APPLE_TEAM_ID` | Texte simple | Apple Developer → Membership |
| 2 | `IOS_P12_BASE64` | Fichier encodé | Apple Developer → Certificates |
| 3 | `IOS_P12_PASSWORD` | Texte simple | Défini par vous |
| 4 | `IOS_MOBILEPROVISION_BASE64` | Fichier encodé | Apple Developer → Profiles |
| 5 | `PROVISIONING_PROFILE_NAME` | Texte simple | Nom du profil |
| 6 | `ASC_API_KEY_ID` | Texte simple | App Store Connect → Keys |
| 7 | `ASC_API_ISSUER_ID` | Texte simple | App Store Connect → Keys |
| 8 | `ASC_API_PRIVATE_KEY_BASE64` | Fichier encodé | App Store Connect → Keys |

---

## 🚀 Procédure rapide

### 1. APPLE_TEAM_ID ⏱️ 2 minutes

1. Aller sur https://developer.apple.com/account
2. Menu "Membership"
3. Copier le **Team ID** (ex: `ABC123XYZ`)

**Ajouter dans GitHub :**
- Repository → Settings → Secrets and variables → Actions
- New repository secret
- Name: `APPLE_TEAM_ID`
- Value: `ABC123XYZ` (votre Team ID)

---

### 2-3. Certificat iOS ⏱️ 10 minutes

#### Option A : Vous avez déjà un certificat

Si vous avez déjà créé une app iOS avant, vous avez peut-être déjà un certificat.

1. Vérifier sur https://developer.apple.com/account/resources/certificates
2. Chercher "Apple Distribution" ou "iOS Distribution"
3. Si vous en avez un qui n'est pas expiré → passer à l'étape "Export"

#### Option B : Créer un nouveau certificat

**⚠️ Important : Cette étape nécessite normalement un Mac**

**Si vous n'avez pas de Mac :**
- Demander à un ami avec un Mac
- OU utiliser un service de Mac virtuel (https://www.macincloud.com - payant)
- OU passer cette étape et continuer avec les autres secrets (revenir plus tard)

**Sur Mac :**

1. Ouvrir **Keychain Access** (Trousseau d'accès)
2. Menu : Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority
3. Entrer votre email
4. Choisir "Saved to disk"
5. Aller sur https://developer.apple.com/account/resources/certificates
6. Cliquer "+" → **Apple Distribution**
7. Uploader le fichier CSR créé
8. Télécharger le certificat (`.cer`)
9. Double-cliquer le `.cer` → s'installe dans Keychain
10. Dans Keychain, trouver le certificat
11. Clic droit → Export → Format `.p12`
12. Définir un **mot de passe** (à retenir !)

#### Encoder en base64

```bash
# Sur Mac/Linux
base64 -i certificat.p12 > certificat_base64.txt

# Sur Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("certificat.p12")) | Out-File certificat_base64.txt
```

#### Ajouter dans GitHub

**Secret `IOS_P12_BASE64` :**
- Name: `IOS_P12_BASE64`
- Value: Tout le contenu de `certificat_base64.txt`

**Secret `IOS_P12_PASSWORD` :**
- Name: `IOS_P12_PASSWORD`
- Value: Le mot de passe du certificat

---

### 4-5. Profil de provisionnement ⏱️ 5 minutes

#### Créer le profil

1. Aller sur https://developer.apple.com/account/resources/profiles
2. Cliquer "+"
3. Choisir **"App Store"**
4. App ID : `fr.c6radio.app`
   - Si n'existe pas : Créer d'abord dans "Identifiers"
5. Sélectionner le certificat créé précédemment
6. Nom : `C6Radio App Store Profile`
7. Télécharger (`.mobileprovision`)

#### Encoder en base64

```bash
# Sur Mac/Linux
base64 -i profil.mobileprovision > profil_base64.txt

# Sur Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("profil.mobileprovision")) | Out-File profil_base64.txt
```

#### Ajouter dans GitHub

**Secret `IOS_MOBILEPROVISION_BASE64` :**
- Name: `IOS_MOBILEPROVISION_BASE64`
- Value: Contenu de `profil_base64.txt`

**Secret `PROVISIONING_PROFILE_NAME` :**
- Name: `PROVISIONING_PROFILE_NAME`
- Value: `C6Radio App Store Profile` (le nom exact)

---

### 6-8. Clé API App Store Connect ⏱️ 5 minutes

#### Créer la clé

1. Aller sur https://appstoreconnect.apple.com/access/api
2. Section "Keys"
3. Cliquer "+"
4. Name: `GitHub Actions C6Radio`
5. Access: **App Manager**
6. Generate

#### Noter les infos

**⚠️ Télécharger le fichier .p8 IMMÉDIATEMENT (une seule chance !)**

- **Issuer ID** : En haut de la page (format UUID)
- **Key ID** : Dans la liste (ex: `AB12CD34EF`)
- **Fichier .p8** : `AuthKey_XXXXX.p8`

#### Encoder la clé en base64

```bash
# Sur Mac/Linux
base64 -i AuthKey_XXXXX.p8 > api_key_base64.txt

# Sur Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("AuthKey_XXXXX.p8")) | Out-File api_key_base64.txt
```

#### Ajouter dans GitHub

**Secret `ASC_API_KEY_ID` :**
- Name: `ASC_API_KEY_ID`
- Value: `AB12CD34EF` (votre Key ID)

**Secret `ASC_API_ISSUER_ID` :**
- Name: `ASC_API_ISSUER_ID`
- Value: UUID complet (ex: `12345678-1234-1234-1234-123456789012`)

**Secret `ASC_API_PRIVATE_KEY_BASE64` :**
- Name: `ASC_API_PRIVATE_KEY_BASE64`
- Value: Contenu de `api_key_base64.txt`

---

## ✅ Vérification finale

Dans GitHub → Settings → Secrets and variables → Actions :

```
Vous devez voir 8 secrets :

✓ APPLE_TEAM_ID
✓ ASC_API_ISSUER_ID
✓ ASC_API_KEY_ID
✓ ASC_API_PRIVATE_KEY_BASE64
✓ IOS_MOBILEPROVISION_BASE64
✓ IOS_P12_BASE64
✓ IOS_P12_PASSWORD
✓ PROVISIONING_PROFILE_NAME
```

---

## 🧪 Tester la configuration

1. GitHub → Actions
2. Workflow "iOS TestFlight Deploy"
3. Run workflow
4. Attendre 10-15 minutes
5. Si succès → 🎉 Configuration OK !
6. Si échec → Voir les logs pour identifier le problème

---

## 🐛 Problèmes courants

### "Unable to find certificate"

**Cause :** Le certificat n'est pas valide ou mal encodé

**Solution :**
1. Vérifier que le certificat n'est pas expiré
2. Vérifier l'encodage base64 (pas d'espaces, pas de retours à la ligne en trop)
3. Tester le mot de passe localement

### "Provisioning profile doesn't match"

**Cause :** Le nom du profil ne correspond pas exactement

**Solution :**
1. Vérifier le nom exact dans Apple Developer
2. Le secret `PROVISIONING_PROFILE_NAME` doit être identique (casse incluse)

### "API key not authorized"

**Cause :** La clé API n'a pas les bonnes permissions

**Solution :**
1. Vérifier que la clé a le rôle "App Manager"
2. Vérifier que l'Issuer ID et Key ID sont corrects

---

## 💡 Astuces

### Commande base64 universelle

Si la commande `base64` ne fonctionne pas, utilisez Python (installé partout) :

```bash
python3 -c "import base64; print(base64.b64encode(open('fichier', 'rb').read()).decode())"
```

### Sauvegarder les secrets localement

**⚠️ Attention : Ne JAMAIS commit ces fichiers !**

Créer un fichier `secrets.txt` (ajouter à `.gitignore`) :

```
APPLE_TEAM_ID=ABC123XYZ
IOS_P12_PASSWORD=monMotDePasse123
PROVISIONING_PROFILE_NAME=C6Radio App Store Profile
ASC_API_KEY_ID=AB12CD34EF
ASC_API_ISSUER_ID=12345678-1234-1234-1234-123456789012

Certificat : fichiers/certificat_base64.txt
Profil : fichiers/profil_base64.txt
API Key : fichiers/api_key_base64.txt
```

### Renouveler un certificat expiré

Les certificats expirent après 1 an. Pour renouveler :

1. Apple Developer → Certificates
2. Revoke l'ancien certificat
3. Créer un nouveau (même procédure)
4. Mettre à jour les secrets GitHub
5. Recréer un profil de provisionnement avec le nouveau certificat

---

**Temps total estimé :** 30-45 minutes  
**Difficulté :** ⭐⭐ Facile à Moyen (si vous avez un Mac)

**Bonne configuration ! 🚀**

