# 🚨 URGENT - Nouveau Bundle ID : fr.c6debug.app

**Date :** 15 février 2026  
**Problème :** Le profil de provisionnement est pour `fr.c6radio.app` mais le bundle ID est maintenant `fr.c6debug.app`  
**Solution :** Créer un nouveau profil pour le nouveau bundle ID

---

## 🔍 Le Problème

```
error: exportArchive No profiles for 'fr.c6radio.app' were found
```

**Cause :**
- Vous avez changé le bundle ID en `fr.c6debug.app` ✅
- MAIS le profil de provisionnement est toujours pour `fr.c6radio.app` ❌

---

## ✅ Solution : Créer Nouveau Profil + App ID

### Étape 1 : Créer l'App ID sur Apple Developer

**⚠️ Si pas déjà fait :**

```
1. https://developer.apple.com/account/resources/identifiers
2. Cliquer "+"
3. Choisir "App IDs"
4. Continue
5. Description : "C6Radio Debug"
6. Bundle ID : "fr.c6debug.app"  ← IMPORTANT !
7. Capabilities : (laisser par défaut)
8. Continue → Register
```

### Étape 2 : Créer le Profil de Provisionnement

```
1. https://developer.apple.com/account/resources/profiles
2. Cliquer "+"
3. Type : "App Store Connect"  ← Pour TestFlight
4. Continue
5. App ID : Sélectionner "fr.c6debug.app"  ← CRITIQUE !
6. Continue
7. Certificat : Sélectionner votre certificat "Apple Distribution"
8. Continue
9. Nom du profil : "C6Radio Debug TestFlight"
10. Generate
11. Télécharger le fichier .mobileprovision
```

### Étape 3 : Encoder en Base64

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Encoder le nouveau profil
base64 -w 0 ~/Downloads/C6Radio_Debug_TestFlight.mobileprovision > profil_debug_base64.txt

# Vérifier
cat profil_debug_base64.txt | wc -c
# Devrait afficher > 5000
```

### Étape 4 : Mettre à Jour le Secret GitHub

```
1. GitHub → Repository → Settings
2. Secrets and variables → Actions
3. Trouver "IOS_MOBILEPROVISION_BASE64"
4. Cliquer "Update"
5. Coller le nouveau contenu de profil_debug_base64.txt
6. Update secret
```

### Étape 5 : Créer l'App dans App Store Connect

**⚠️ Très important aussi !**

```
1. https://appstoreconnect.apple.com
2. My Apps → "+"
3. New App
4. Platforms : iOS
5. Name : "C6Radio Debug"
6. Primary Language : French
7. Bundle ID : Sélectionner "fr.c6debug.app"  ← CRITIQUE !
8. SKU : "c6radio-debug-001"
9. User Access : Full Access
10. Create
```

---

## 🚀 Une Fois Tout Fait

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Vérifier que cap sync a été fait
git status

# Tout commit
git add .
git commit -m "fix: Nouveau bundle ID fr.c6debug.app + profil correspondant"
git push origin main
```

---

## ✅ Checklist Complète

**Avant de push, vérifier :**

- [ ] App ID `fr.c6debug.app` créé sur Apple Developer
- [ ] Profil de provisionnement créé pour `fr.c6debug.app`
- [ ] Profil encodé en base64
- [ ] Secret `IOS_MOBILEPROVISION_BASE64` mis à jour dans GitHub
- [ ] App `fr.c6debug.app` créée dans App Store Connect
- [ ] `capacitor.config.json` a `appId: "fr.c6debug.app"` ✅ (déjà fait)
- [ ] `npx cap sync ios` exécuté ✅ (déjà fait)
- [ ] Workflow mis à jour ✅ (déjà fait)

---

## 🎯 Pourquoi fr.c6debug.app ?

**Bonne pratique :**
- `fr.c6radio.app` = App de production
- `fr.c6debug.app` = App de debug/test

**Avantages :**
- Les deux peuvent coexister sur le même iPhone
- Tests sans risquer la prod
- Plus facile à identifier

---

## ⏱️ Temps Estimé

**Si vous faites tout maintenant :**
- Créer App ID : 2 minutes
- Créer profil : 3 minutes
- Encoder + update secret : 2 minutes
- Créer app App Store Connect : 5 minutes
- **Total : ~15 minutes**

---

## 🚨 Important

**Le certificat (.p12) peut rester le même !**
- Pas besoin de nouveau certificat
- Juste nouveau profil pour le nouveau bundle ID

**Les autres secrets restent identiques :**
- ✅ `APPLE_TEAM_ID` (même team)
- ✅ `IOS_P12_BASE64` (même certificat)
- ✅ `IOS_P12_PASSWORD` (même mot de passe)
- ⚠️ `IOS_MOBILEPROVISION_BASE64` (À CHANGER !)
- ✅ `ASC_API_KEY_ID` (même clé API)
- ✅ `ASC_API_ISSUER_ID` (même issuer)
- ✅ `ASC_API_PRIVATE_KEY_BASE64` (même clé)

**1 seul secret à changer !**

---

**Document créé le :** 15 février 2026  
**Urgence :** 🔴 Critique  
**Action requise :** Créer profil pour fr.c6debug.app

