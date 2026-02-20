# ⚡ PRÊT À COMMIT - Fix #7 Appliqué

**Date :** 15 février 2026

---

## ✅ CE QUI A ÉTÉ FAIT (Par Moi)

1. ✅ Projet iOS supprimé et régénéré
2. ✅ Bundle ID `fr.c6debug.app` correctement configuré partout
3. ✅ Workflow mis à jour (Node 20, exportOptions corrigé)
4. ✅ Documentation complète créée

---

## 🚨 CE QU'IL VOUS RESTE À FAIRE (15 min)

**Avant de commit, vous DEVEZ configurer Apple Developer :**

### Étape 1 : App ID (2 min)
```
https://developer.apple.com/account/resources/identifiers
→ "+" → App IDs
→ Bundle ID: "fr.c6debug.app"
→ Register
```

### Étape 2 : Profil de Provisionnement (3 min)
```
https://developer.apple.com/account/resources/profiles
→ "+" → "App Store Connect"
→ App ID: "fr.c6debug.app"
→ Certificat: Votre "Apple Distribution"
→ Nom: "C6Radio Debug TestFlight"
→ Generate → Télécharger
```

### Étape 3 : Encoder (1 min)
```bash
base64 -w 0 ~/Downloads/C6Radio_Debug_TestFlight.mobileprovision > profil_debug_base64.txt
```

### Étape 4 : Update Secret GitHub (2 min)
```
GitHub → Settings → Secrets
→ IOS_MOBILEPROVISION_BASE64
→ Update
→ Coller profil_debug_base64.txt
→ Update secret
```

### Étape 5 : App Store Connect (5 min)
```
https://appstoreconnect.apple.com
→ My Apps → "+"
→ Bundle ID: "fr.c6debug.app"
→ Nom: "C6Radio Debug"
→ Create
```

---

## 🚀 UNE FOIS TOUT FAIT

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Tout commit
git add .
git commit -m "fix: Régénération iOS avec bundle ID fr.c6debug.app - Fix #7"
git push origin main

# Attendre 10-15 minutes
# Puis vérifier GitHub Actions
```

---

## ✅ Checklist

```
✅ Projet iOS régénéré
✅ Bundle ID fr.c6debug.app configuré
✅ Workflow corrigé
□ App ID créé sur Apple Developer
□ Profil créé et encodé
□ Secret GitHub mis à jour
□ App créée dans App Store Connect
```

---

## 🎯 Pourquoi Ça Va Marcher

**Le projet iOS est maintenant 100% propre :**
- ✅ Plus aucune trace de `fr.c6radio.app`
- ✅ `fr.c6debug.app` configuré partout
- ✅ Workflow prêt

**Il ne manque que le profil Apple Developer !**

---

**FAITES LES 5 ÉTAPES CI-DESSUS, PUIS COMMIT ! 🚀**

**Guides complets :**
- `docs/FIX6-ACTIONS-RAPIDES.md`
- `docs/FIX7-REGENERATION-IOS.md`

