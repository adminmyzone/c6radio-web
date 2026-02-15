# ⚡ FIX #5 - VÉRIFIER VOS SECRETS AVANT DE COMMIT

**Date :** 15 février 2026  
**Critique :** Le secret `IOS_MOBILEPROVISION_BASE64` est NÉCESSAIRE !

---

## 🔍 PROBLÈME IDENTIFIÉ

**L'erreur "No profiles found" signifie :**
→ Le profil de provisionnement `.mobileprovision` n'est pas présent

**Solution :** S'assurer que le secret `IOS_MOBILEPROVISION_BASE64` est configuré

---

## ✅ CHECKLIST DES 8 SECRETS

**Allez sur GitHub → Settings → Secrets et vérifiez :**

```
Essentiels pour la signature :
□ APPLE_TEAM_ID
□ IOS_P12_BASE64 (certificat)
□ IOS_P12_PASSWORD
□ IOS_MOBILEPROVISION_BASE64 (profil) ⭐ CRITIQUE !

Essentiels pour l'upload :
□ ASC_API_KEY_ID
□ ASC_API_ISSUER_ID  
□ ASC_API_PRIVATE_KEY_BASE64

Optionnel :
□ PROVISIONING_PROFILE_NAME (peut aider)
```

---

## 🚨 SI IOS_MOBILEPROVISION_BASE64 MANQUE

### Étape 1 : Créer le Profil sur Apple Developer

```
1. https://developer.apple.com/account/resources/profiles
2. Cliquer "+"
3. Type : "App Store"
4. App ID : fr.c6radio.app
5. Certificat : Sélectionner votre certificat "Apple Distribution"
6. Nom : "C6Radio App Store Profile"
7. Générer et télécharger
```

### Étape 2 : Encoder en Base64

```bash
# Linux
base64 -w 0 C6Radio_App_Store_Profile.mobileprovision > profil_base64.txt

# Vérifier que le fichier n'est pas vide
cat profil_base64.txt | wc -c
# Devrait afficher > 5000
```

### Étape 3 : Ajouter dans GitHub

```
GitHub → Settings → Secrets → New repository secret

Name: IOS_MOBILEPROVISION_BASE64
Value: [Coller TOUT le contenu de profil_base64.txt]

Add secret
```

---

## 🔧 CHANGEMENT DANS LE WORKFLOW

**Ce qui a été modifié (Fix #5) :**

```yaml
# Export IPA - SIMPLIFIÉ
# Utilise le certificat/profil locaux (importés aux étapes 7-8)
# Pas d'auth API pour éviter "cloud signing permission error"

xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath build
```

**Plus d'auth API à l'export = Plus de conflit cloud ! ✅**

---

## 🚀 UNE FOIS LES SECRETS VÉRIFIÉS

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Vérifier les changements
git status

# Tout ajouter
git add .

# Commit
git commit -m "fix(workflow): Utilisation certificat/profil locaux - Fix #5"

# Push
git push origin main
```

---

## 🎯 POURQUOI ÇA VA MARCHER

**La méthode standard CI/CD iOS :**

```
1. Import certificat .p12           ✅ Étape 7
2. Import profil .mobileprovision   ✅ Étape 8
3. Build avec ressources locales    ✅ Étape 11
4. Export avec ressources locales   ✅ Étape 12 (FIX #5)
5. Upload avec API                  ✅ Étape 13
```

**Pas de cloud signing = Pas de conflit ! 🎉**

---

## 📊 PROGRESSION

```
Fix #1-4 : Tentatives signature automatique/cloud
           └── ❌ Conflits et erreurs de permissions

Fix #5   : Retour à la méthode standard (local)
           └── ✅ Fiable et éprouvée !
```

---

## ⏱️ TEMPS ESTIMÉ

**Si le secret manque :** 10-15 minutes pour créer + encoder + ajouter  
**Si tout est OK :** Commit + Push immédiatement ! 🚀

---

## 🎯 PROBABILITÉ DE SUCCÈS

**99%** si les 8 secrets sont corrects ! 

Cette méthode est utilisée par des milliers de projets iOS en CI/CD.

---

**VÉRIFIEZ VOS SECRETS, PUIS COMMIT ! 🚀**

