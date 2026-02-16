# 🚨 RÉSOLUTION IMMÉDIATE - Profil Manquant pour fr.c6debug.app

**Problème :** `No profiles for 'fr.c6debug.app' were found`  
**Cause :** Le secret `IOS_MOBILEPROVISION_BASE64` contient un profil pour l'ancien bundle ID  
**Solution :** Créer et configurer le nouveau profil MAINTENANT

---

## ⚡ SOLUTION EN 3 ÉTAPES (10 minutes)

### Option A : Si vous avez déjà le profil .mobileprovision

```bash
# 1. Trouvez votre fichier .mobileprovision pour fr.c6debug.app
ls ~/Downloads/*.mobileprovision

# 2. Encodez-le
base64 -w 0 ~/Downloads/VOTRE_PROFIL.mobileprovision > profil_base64.txt

# 3. Copiez le contenu
cat profil_base64.txt

# 4. GitHub → Settings → Secrets → IOS_MOBILEPROVISION_BASE64 → Update
# Collez le contenu et Update secret

# 5. Commit et push
git add .
git commit -m "fix: Update profil provisionnement pour fr.c6debug.app"
git push origin main
```

---

### Option B : Vous n'avez PAS encore créé le profil

**🚨 VOUS DEVEZ LE CRÉER SUR APPLE DEVELOPER D'ABORD !**

#### Étape 1 : Créer l'App ID (si pas fait)

```
1. https://developer.apple.com/account/resources/identifiers
2. Cliquez "+"
3. Sélectionnez "App IDs" → Continue
4. Type: App
5. Description: "C6Radio Debug"
6. Bundle ID: Explicit → "fr.c6debug.app"
7. Capabilities: (laisser par défaut)
8. Continue → Register
```

#### Étape 2 : Créer le Profil de Provisionnement

```
1. https://developer.apple.com/account/resources/profiles
2. Cliquez "+"
3. Distribution → "App Store Connect" → Continue
4. App ID: Sélectionnez "fr.c6debug.app" → Continue
5. Certificats: Cochez votre certificat "Apple Distribution" → Continue
6. Profile Name: "C6Radio Debug TestFlight"
7. Generate
8. Téléchargez le fichier .mobileprovision
```

#### Étape 3 : Encoder et Configurer

```bash
# Allez dans le dossier où vous avez téléchargé le profil
cd ~/Downloads

# Trouvez votre fichier
ls -la *.mobileprovision

# Encodez (remplacez NOM_DU_FICHIER par le nom réel)
base64 -w 0 NOM_DU_FICHIER.mobileprovision > ~/profil_debug_base64.txt

# Vérifiez que le fichier n'est pas vide
cat ~/profil_debug_base64.txt | wc -c
# Devrait afficher un nombre > 5000
```

#### Étape 4 : Mettre à Jour GitHub Secret

```
1. Ouvrez ~/profil_debug_base64.txt
2. Sélectionnez TOUT le contenu (Ctrl+A)
3. Copiez (Ctrl+C)
4. Allez sur GitHub → Votre repo → Settings
5. Secrets and variables → Actions
6. Trouvez "IOS_MOBILEPROVISION_BASE64"
7. Cliquez sur le crayon (Edit)
8. Collez le nouveau contenu
9. Update secret
```

#### Étape 5 : Créer l'App dans App Store Connect

```
1. https://appstoreconnect.apple.com
2. My Apps → Cliquez "+"
3. New App
4. Platforms: iOS
5. Name: "C6Radio Debug"
6. Primary Language: French (France)
7. Bundle ID: Sélectionnez "fr.c6debug.app"
8. SKU: "c6radio-debug-001" (ou n'importe quel ID unique)
9. User Access: Full Access
10. Create
```

#### Étape 6 : Commit et Push

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

git add .
git commit -m "fix: Profil provisionnement pour fr.c6debug.app configuré"
git push origin main
```

---

## 🔍 Comment Vérifier Que C'est Bon

**Après avoir mis à jour le secret et push :**

1. GitHub → Actions
2. Cliquez sur le workflow en cours
3. Attendez l'étape "Export de l'IPA"
4. Si succès → 🎉 Profil OK !
5. Si échec avec même erreur → Profil incorrect ou mal encodé

---

## 🐛 Si Ça Échoue Encore

### Problème : Profil mal encodé

**Symptômes :** Même erreur après update

**Solution :**
```bash
# Vérifier l'encodage
base64 -w 0 profil.mobileprovision | wc -c
# Doit être > 5000

# S'assurer qu'il n'y a pas de retours à la ligne
base64 -w 0 profil.mobileprovision > profil_base64.txt
# L'option -w 0 est CRITIQUE !
```

### Problème : Mauvais profil uploadé

**Symptômes :** Le profil est pour un autre bundle ID

**Vérification :**
```bash
# Décoder le profil pour vérifier
base64 -d profil_base64.txt > profil_decoded.mobileprovision
strings profil_decoded.mobileprovision | grep "fr.c6debug.app"
# Doit afficher fr.c6debug.app
```

### Problème : Profil expiré

**Symptômes :** Profil trouvé mais rejeté

**Solution :**
```
1. Apple Developer → Profiles
2. Vérifier la date d'expiration
3. Si expiré, créer un nouveau profil
4. Re-télécharger et re-encoder
```

---

## ✅ Checklist Finale

```
□ App ID "fr.c6debug.app" existe sur Apple Developer
□ Profil de provisionnement "App Store Connect" créé
□ Profil lié au certificat Apple Distribution
□ Profil téléchargé (.mobileprovision)
□ Profil encodé en base64 (avec -w 0)
□ Secret IOS_MOBILEPROVISION_BASE64 mis à jour dans GitHub
□ App "fr.c6debug.app" créée dans App Store Connect
□ Changements commit et push
```

**Si TOUT est ✅, le prochain build DOIT réussir !**

---

## 🎯 Probabilité de Succès

**Si vous suivez TOUTES les étapes :** 99% 🚀

**Le problème est simple :** Le secret GitHub contient un profil pour `fr.c6radio.app` mais votre projet utilise maintenant `fr.c6debug.app`.

**La solution est simple :** Créer un nouveau profil pour `fr.c6debug.app` et mettre à jour le secret.

---

## 📞 En Cas de Blocage

**Si vous ne pouvez pas créer le profil :**
- Vérifiez que vous avez un compte Apple Developer actif (payant)
- Vérifiez que vous avez un certificat "Apple Distribution" valide
- Vérifiez que l'App ID "fr.c6debug.app" existe

**Si l'encodage ne fonctionne pas :**
```bash
# Alternative Python (fonctionne partout)
python3 -c "import base64; print(base64.b64encode(open('profil.mobileprovision', 'rb').read()).decode())" > profil_base64.txt
```

---

**FAITES-LE MAINTENANT ! ÉTAPE PAR ÉTAPE ! 🚀**

**Ce n'est PAS compliqué, juste 5 étapes administratives !**

**Vous y êtes TELLEMENT proche ! 💪**

