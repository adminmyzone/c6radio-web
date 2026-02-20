# ⚡ Configuration Secrets GitHub - Version Simplifiée (6 secrets)

**Date :** 15 février 2026  
**Mise à jour :** Signature automatique - Plus besoin du profil de provisionnement !

---

## 🎯 BONNE NOUVELLE : Seulement 6 secrets au lieu de 8 !

Avec la signature automatique Xcode, vous n'avez plus besoin de :
- ~~`PROVISIONING_PROFILE_NAME`~~ ❌
- ~~`IOS_MOBILEPROVISION_BASE64`~~ ❌

**Xcode télécharge automatiquement les profils via la clé API ! 🎉**

---

## 📋 Les 6 Secrets Requis

| # | Secret | Type | Difficulté |
|---|--------|------|-----------|
| 1 | `APPLE_TEAM_ID` | Texte simple | ⭐ Facile |
| 2 | `IOS_P12_BASE64` | Fichier encodé | ⭐⭐ Moyen |
| 3 | `IOS_P12_PASSWORD` | Texte simple | ⭐ Facile |
| 4 | `ASC_API_KEY_ID` | Texte simple | ⭐ Facile |
| 5 | `ASC_API_ISSUER_ID` | Texte simple | ⭐ Facile |
| 6 | `ASC_API_PRIVATE_KEY_BASE64` | Fichier encodé | ⭐ Facile |

---

## 🚀 Configuration Rapide (30 min)

### Secret 1 : APPLE_TEAM_ID ⏱️ 2 min

```
1. https://developer.apple.com/account
2. Menu "Membership"
3. Copier le Team ID (ex: ABC123XYZ)

GitHub → Settings → Secrets → New
Name: APPLE_TEAM_ID
Value: [Votre Team ID]
```

---

### Secrets 2-3 : Certificat iOS ⏱️ 10-15 min

**Si vous avez déjà un .p12 d'un autre projet :**

```bash
# Réutiliser directement !
base64 -w 0 ancien_certificat.p12 > cert_base64.txt
```

**Sinon, créer un nouveau certificat :**

Option A : **Avec OpenSSL (si vous avez la clé privée)**

```bash
# 1. Convertir .cer en .pem
openssl x509 -inform DER -in certificat.cer -out cert.pem

# 2. Créer le .p12 (entrer un mot de passe quand demandé)
openssl pkcs12 -export -out cert.p12 -inkey private_key.pem -in cert.pem

# 3. Encoder en base64
base64 -w 0 cert.p12 > cert_base64.txt
```

Option B : **Extraire d'un .p12 existant**

```bash
# Si vous avez un vieux .p12, juste le réencoder
base64 -w 0 votre_ancien.p12 > cert_base64.txt
```

**Ajouter dans GitHub :**

```
Secret 1:
Name: IOS_P12_BASE64
Value: [Contenu de cert_base64.txt]

Secret 2:
Name: IOS_P12_PASSWORD
Value: [Le mot de passe du .p12]
```

---

### Secrets 4-6 : Clé API App Store Connect ⏱️ 5 min

**Créer la clé :**

```
1. https://appstoreconnect.apple.com/access/api
2. Section "Keys" → "+"
3. Name: "GitHub Actions C6Radio"
4. Access: "App Manager"
5. Generate

⚠️ TÉLÉCHARGER LE .p8 IMMÉDIATEMENT (une seule chance!)

Noter :
- Issuer ID (en haut, format UUID)
- Key ID (dans la liste)
- Télécharger AuthKey_XXXXX.p8
```

**Encoder la clé :**

```bash
base64 -w 0 AuthKey_XXXXX.p8 > api_key_base64.txt
```

**Ajouter dans GitHub :**

```
Secret 1:
Name: ASC_API_KEY_ID
Value: [Key ID, ex: AB12CD34EF]

Secret 2:
Name: ASC_API_ISSUER_ID
Value: [Issuer ID, UUID complet]

Secret 3:
Name: ASC_API_PRIVATE_KEY_BASE64
Value: [Contenu de api_key_base64.txt]
```

---

## ✅ Vérification Finale

**Dans GitHub → Settings → Secrets, vous devez voir 6 secrets :**

```
✓ APPLE_TEAM_ID
✓ ASC_API_ISSUER_ID
✓ ASC_API_KEY_ID
✓ ASC_API_PRIVATE_KEY_BASE64
✓ IOS_P12_BASE64
✓ IOS_P12_PASSWORD
```

**Plus besoin de :**
- ~~IOS_MOBILEPROVISION_BASE64~~ (auto)
- ~~PROVISIONING_PROFILE_NAME~~ (auto)

---

## 🔧 Commandes de Référence

**Encoder un fichier en base64 :**
```bash
base64 -w 0 fichier.ext > fichier_base64.txt
```

**Vérifier qu'un fichier base64 n'est pas vide :**
```bash
cat fichier_base64.txt | wc -c
# Doit afficher > 1000
```

**Créer un .p12 depuis .cer :**
```bash
openssl x509 -inform DER -in cert.cer -out cert.pem
openssl pkcs12 -export -out cert.p12 -inkey private.key -in cert.pem
```

---

## 🎯 Prochaines Étapes

Une fois les 6 secrets configurés :

```bash
# 1. Commit les changements du workflow
git add .github/workflows/ios-testflight.yml
git commit -m "fix: Correction signature code iOS"
git push origin main

# 2. Le workflow se lance automatiquement

# 3. Suivre le build
GitHub → Actions → Regarder les logs

# 4. Attendre 10-15 minutes
# 5. App disponible sur TestFlight ! 🎉
```

---

## 🐛 Problèmes Courants

### "No signing certificate found"

**✅ Solution appliquée !**  
Le workflow utilise maintenant la signature automatique.

### "Certificate requires private key"

**Cause :** Le .p12 n'a pas de clé privée

**Solution :**
```bash
# Vérifier que le .p12 contient la clé
openssl pkcs12 -info -in cert.p12 -noout
# Doit afficher des infos, pas d'erreur
```

### "API key not authorized"

**Cause :** La clé API n'a pas les bonnes permissions

**Solution :**
- Vérifier que la clé a le rôle "App Manager"
- Recréer la clé si nécessaire

---

## 💡 Astuces

### Sauvegarder localement

Créer un fichier `~/secrets/c6radio-secrets.txt` :

```
# C6Radio GitHub Secrets
# NE JAMAIS COMMIT CE FICHIER !

APPLE_TEAM_ID=ABC123XYZ
IOS_P12_PASSWORD=MonMotDePasse123
ASC_API_KEY_ID=AB12CD34EF
ASC_API_ISSUER_ID=12345678-1234-1234-1234-123456789012

Fichiers base64 :
- ~/secrets/cert_base64.txt
- ~/secrets/api_key_base64.txt

Date de renouvellement certificat : Février 2027
```

### Tester le .p12 avant d'encoder

```bash
# Extraire et vérifier le certificat
openssl pkcs12 -in cert.p12 -clcerts -nokeys -out temp_cert.pem
openssl x509 -in temp_cert.pem -text -noout | grep -A 2 "Validity"

# Vérifier la date d'expiration
```

---

**Temps total :** 30 minutes  
**Secrets requis :** 6 (au lieu de 8)  
**Difficulté :** ⭐⭐ Moyen

**Vous êtes presque là ! 🚀**

