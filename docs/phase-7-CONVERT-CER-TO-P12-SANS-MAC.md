# 🔐 Convertir .cer en .p12 SANS MAC - Guide Complet

**Date :** 15 février 2026  
**Problème :** Besoin de convertir un certificat iOS .cer en .p12 pour GitHub Actions  
**Solution :** Plusieurs méthodes sans avoir besoin de Mac

---

## 🎯 Contexte

Vous avez :
- ✅ Un fichier certificat `.cer` (téléchargé depuis Apple Developer)
- ✅ Le certificat est valide et non expiré
- ✅ Vous avez déjà réussi cette conversion pour un autre workflow

Vous avez besoin :
- 🎯 Un fichier `.p12` (avec mot de passe)
- 🎯 Pour l'uploader en base64 dans GitHub Secrets

---

## ⚡ MÉTHODE RECOMMANDÉE : OpenSSL (Linux/Windows)

**Avantages :** Gratuit, local, rapide, sécurisé

### Étape 1 : Vérifier si OpenSSL est installé

```bash
# Sur Linux (Ubuntu/Debian)
openssl version

# Si pas installé :
sudo apt-get update
sudo apt-get install openssl
```

```powershell
# Sur Windows (PowerShell)
openssl version

# Si pas installé, télécharger depuis :
# https://slproweb.com/products/Win32OpenSSL.html
# Installer "Win64 OpenSSL v3.x.x Light"
```

### Étape 2 : Convertir .cer en .pem

```bash
# Remplacer "votre_certificat.cer" par le nom de votre fichier
openssl x509 -inform DER -in votre_certificat.cer -out certificat.pem
```

**Explication :**
- `x509` : Type de certificat
- `-inform DER` : Format d'entrée (Apple utilise DER)
- `-in votre_certificat.cer` : Fichier source
- `-out certificat.pem` : Fichier temporaire au format PEM

### Étape 3 : Créer une clé privée

**⚠️ IMPORTANT :** Vous devez avoir la clé privée correspondante !

**Option A : Si vous avez la clé privée (.key)**

```bash
openssl rsa -in votre_cle_privee.key -out cle_privee.pem
```

**Option B : Si vous avez créé le CSR sur votre machine Linux**

La clé privée devrait être dans votre répertoire où vous avez créé le CSR.

```bash
# Chercher la clé privée
ls -la ~/private_key.pem
# ou
ls -la ~/.ssh/
```

**Option C : Si vous n'avez PAS la clé privée**

⚠️ **STOP !** Vous ne pouvez pas convertir sans la clé privée.

**Solution :**
1. Révoquer le certificat actuel sur Apple Developer
2. Créer un nouveau CSR (Certificate Signing Request)
3. Télécharger le nouveau certificat
4. Refaire la conversion avec la nouvelle clé privée

### Étape 4 : Créer le fichier .p12

```bash
openssl pkcs12 -export \
  -inkey cle_privee.pem \
  -in certificat.pem \
  -out certificat_ios.p12
```

**Le système va vous demander :**
```
Enter Export Password: ********
Verifying - Enter Export Password: ********
```

**Choisissez un mot de passe FORT et NOTEZ-LE !**  
(Vous en aurez besoin pour le secret `IOS_P12_PASSWORD`)

### Étape 5 : Vérifier le fichier .p12

```bash
# Vérifier que le fichier est valide
openssl pkcs12 -info -in certificat_ios.p12 -noout
```

Si aucune erreur → ✅ Le fichier .p12 est valide !

### Étape 6 : Convertir en base64

```bash
# Sur Linux
base64 -w 0 certificat_ios.p12 > certificat_base64.txt

# Sur Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("certificat_ios.p12")) | Out-File -Encoding ASCII certificat_base64.txt
```

### Étape 7 : Ajouter dans GitHub Secrets

1. Ouvrir `certificat_base64.txt`
2. Copier **TOUT** le contenu (une seule ligne)
3. GitHub → Settings → Secrets → New repository secret
   - Name: `IOS_P12_BASE64`
   - Value: Coller le contenu
4. Add secret

5. Créer un autre secret :
   - Name: `IOS_P12_PASSWORD`
   - Value: Le mot de passe choisi à l'étape 4

---

## 🔄 MÉTHODE ALTERNATIVE : Utiliser votre ancien workflow

Si vous avez déjà réussi pour un autre workflow, **utilisez la même méthode !**

### Retrouver votre méthode précédente

**Où avez-vous fait la conversion la dernière fois ?**

1. **Sur un autre PC Linux ?** → Utiliser OpenSSL (méthode ci-dessus)
2. **Avec un outil en ligne ?** → Réutiliser le même outil
3. **Via un ami avec Mac ?** → Redemander 😊

### Réutiliser les mêmes certificats

**💡 ASTUCE :** Si c'est le même certificat que votre autre workflow, vous pouvez :

1. Récupérer le fichier .p12 déjà créé
2. Le reconvertir en base64
3. L'utiliser pour ce nouveau workflow

```bash
# Si vous avez déjà le .p12
base64 -w 0 ancien_certificat.p12 > certificat_base64.txt
```

---

## 🛠️ MÉTHODE 3 : Recréer un nouveau certificat complet

**Si vraiment bloqué, créez un nouveau certificat from scratch :**

### Étape 1 : Créer une nouvelle clé privée + CSR

```bash
# Créer une clé privée RSA 2048 bits
openssl genrsa -out private_key.pem 2048

# Créer le CSR (Certificate Signing Request)
openssl req -new -key private_key.pem -out CertificateSigningRequest.csr
```

**Remplir les informations demandées :**
```
Country Name (2 letter code) []: FR
State or Province Name (full name) []: Ile-de-France
Locality Name (eg, city) []: Paris
Organization Name (eg, company) []: Votre Nom / Société
Organizational Unit Name (eg, section) []: Development
Common Name (eg, YOUR name) []: Votre Nom
Email Address []: votre@email.com

A challenge password []: [Laisser vide - Appuyer Entrée]
An optional company name []: [Laisser vide - Appuyer Entrée]
```

### Étape 2 : Uploader le CSR sur Apple Developer

1. Aller sur https://developer.apple.com/account/resources/certificates
2. Cliquer "+" pour créer un nouveau certificat
3. Choisir **"Apple Distribution"** (pour App Store / TestFlight)
4. Upload `CertificateSigningRequest.csr`
5. Télécharger le certificat généré (`.cer`)

### Étape 3 : Convertir en .p12

```bash
# Convertir le .cer téléchargé en .pem
openssl x509 -inform DER -in nouveau_certificat.cer -out certificat.pem

# Créer le .p12 avec votre clé privée
openssl pkcs12 -export \
  -inkey private_key.pem \
  -in certificat.pem \
  -out certificat_ios.p12
```

**Définir un mot de passe quand demandé !**

### Étape 4 : Convertir en base64 et ajouter dans GitHub

(Voir Méthode 1, Étapes 6-7)

---

## 🚨 TROUBLESHOOTING

### Erreur : "unable to load certificates"

**Cause :** Le fichier .cer est corrompu ou pas au bon format

**Solution :**
```bash
# Vérifier le fichier
file votre_certificat.cer

# Devrait afficher : "DER encoded certificate"
```

Si autre chose → Re-télécharger depuis Apple Developer

---

### Erreur : "unable to load private key"

**Cause :** Vous n'avez pas la clé privée correspondante

**Solutions :**
1. Chercher la clé privée sur votre PC
2. Utiliser un certificat que vous avez créé vous-même
3. Créer un nouveau certificat (Méthode 3)

---

### Erreur : "Mac verify error: invalid password?"

**Cause :** Mauvais mot de passe lors de la vérification du .p12

**Solution :** Recréer le .p12 avec un mot de passe différent

---

### Le fichier base64 est vide

**Cause :** Erreur dans la commande de conversion

**Solution Linux :**
```bash
base64 -w 0 certificat_ios.p12 > certificat_base64.txt
cat certificat_base64.txt  # Vérifier le contenu
```

**Solution Windows :**
```powershell
$bytes = [System.IO.File]::ReadAllBytes("certificat_ios.p12")
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File -Encoding ASCII certificat_base64.txt
```

---

### GitHub Actions échoue avec "Code signing failed"

**Causes possibles :**
1. ❌ Base64 mal copié (espaces, retours à la ligne)
2. ❌ Mauvais mot de passe dans `IOS_P12_PASSWORD`
3. ❌ Certificat expiré
4. ❌ Certificat ne correspond pas au profil de provisionnement

**Solutions :**
1. Re-copier le base64 (sélectionner tout, Ctrl+A)
2. Vérifier le mot de passe (le retaper)
3. Vérifier la date d'expiration sur Apple Developer
4. Re-télécharger le profil de provisionnement

---

## 📝 CHECKLIST COMPLÈTE

### Avant de commencer

- [ ] J'ai le fichier `.cer` téléchargé
- [ ] Le certificat est valide (pas expiré)
- [ ] J'ai OpenSSL installé
- [ ] Je suis dans le bon répertoire

### Conversion

- [ ] `.cer` converti en `.pem`
- [ ] J'ai la clé privée `.pem` ou `.key`
- [ ] `.p12` créé avec succès
- [ ] Mot de passe défini et noté
- [ ] `.p12` vérifié avec `openssl pkcs12 -info`

### Base64

- [ ] `.p12` converti en base64
- [ ] Fichier `certificat_base64.txt` créé
- [ ] Contenu vérifié (pas vide)

### GitHub Secrets

- [ ] Secret `IOS_P12_BASE64` créé
- [ ] Secret `IOS_P12_PASSWORD` créé
- [ ] Secrets vérifiés dans GitHub Settings

---

## 💡 ASTUCES PRO

### Astuce 1 : Tester le .p12 localement

```bash
# Extraire le certificat du .p12 pour vérifier
openssl pkcs12 -in certificat_ios.p12 -clcerts -nokeys -out cert.pem

# Vérifier les détails
openssl x509 -in cert.pem -text -noout
```

Vérifier :
- ✅ Nom correct
- ✅ Date d'expiration future
- ✅ Type : "Apple Distribution"

### Astuce 2 : Sauvegarder les fichiers importants

**⚠️ NE JAMAIS commit ces fichiers dans Git !**

Créer un dossier sécurisé :
```bash
mkdir -p ~/secure/c6radio-certificates
mv private_key.pem ~/secure/c6radio-certificates/
mv certificat_ios.p12 ~/secure/c6radio-certificates/
```

### Astuce 3 : Utiliser un fichier de notes

Créer `certificates-info.txt` (dans le dossier sécurisé) :
```
Certificat iOS C6Radio
----------------------
Date de création : 15/02/2026
Date d'expiration : 15/02/2027
Mot de passe .p12 : [VOTRE_MOT_DE_PASSE]
Team ID : [VOTRE_TEAM_ID]

Fichiers :
- private_key.pem
- certificat_ios.p12
- certificat_base64.txt

Note : Renouveler avant février 2027
```

### Astuce 4 : Automatiser pour l'année prochaine

Créer un script `convert-cert.sh` :
```bash
#!/bin/bash

# Script de conversion .cer → .p12 → base64
# Usage: ./convert-cert.sh certificat.cer private_key.pem

CER_FILE=$1
KEY_FILE=$2
PASSWORD="VotreMotDePasse2026"

echo "🔄 Conversion en cours..."

# .cer → .pem
openssl x509 -inform DER -in "$CER_FILE" -out temp_cert.pem

# Créer .p12
openssl pkcs12 -export \
  -inkey "$KEY_FILE" \
  -in temp_cert.pem \
  -out certificat_ios.p12 \
  -password "pass:$PASSWORD"

# Base64
base64 -w 0 certificat_ios.p12 > certificat_base64.txt

echo "✅ Terminé !"
echo "📄 Fichiers créés :"
echo "   - certificat_ios.p12"
echo "   - certificat_base64.txt"
echo "🔐 Mot de passe : $PASSWORD"

# Cleanup
rm temp_cert.pem
```

Rendre exécutable :
```bash
chmod +x convert-cert.sh
```

---

## 🎯 RÉSUMÉ : Commandes Essentielles

**Conversion complète en 3 commandes :**

```bash
# 1. .cer → .pem
openssl x509 -inform DER -in certificat.cer -out cert.pem

# 2. Créer .p12
openssl pkcs12 -export -inkey private_key.pem -in cert.pem -out cert.p12

# 3. Base64
base64 -w 0 cert.p12 > cert_base64.txt
```

**C'est tout ! 🎉**

---

## 📞 Si Vraiment Bloqué

### Option 1 : Emprunter un Mac (2-3h)

Un ami, bibliothèque, Apple Store... Juste pour exporter le .p12.

### Option 2 : Mac virtuel en ligne

Services payants (~$30/mois) :
- **MacinCloud** : https://www.macincloud.com
- **MacStadium** : https://www.macstadium.com

Prendre 1 mois juste pour la config initiale.

### Option 3 : Support Apple Developer

Contacter le support Apple Developer, ils peuvent vous guider.

### Option 4 : Reporter cette étape

Continuer sur d'autres phases (Phase 6 - Bannières) en attendant de résoudre.

---

## ✅ Validation Finale

**Une fois le .p12 converti et en base64 :**

```bash
# Taille du fichier base64 (devrait être > 2000 caractères)
wc -c certificat_base64.txt

# Premiers et derniers caractères (pour vérifier)
head -c 50 certificat_base64.txt
echo ""
tail -c 50 certificat_base64.txt
```

**Si tout est OK → Copier dans GitHub Secrets ! 🎉**

---

**Document créé le :** 15 février 2026  
**Contexte :** Configuration GitHub Actions pour TestFlight  
**Difficulté :** ⭐⭐ Moyenne

**Vous allez y arriver ! 💪**

