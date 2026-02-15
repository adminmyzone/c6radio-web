# 🔧 FIX #7 - Régénération Projet iOS avec Nouveau Bundle ID

**Date :** 15 février 2026  
**Problème :** Le projet iOS gardait l'ancien bundle ID `fr.c6radio.app`  
**Solution :** ✅ Régénération complète du projet iOS

---

## 🔍 Le Problème

Même après avoir :
- ✅ Mis à jour `capacitor.config.json`
- ✅ Exécuté `npx cap sync ios`
- ✅ Mis à jour le secret `IOS_MOBILEPROVISION_BASE64`

L'erreur persistait :
```
error: exportArchive No profiles for 'fr.c6radio.app' were found
```

**Pourquoi ?**

Le projet Xcode dans `ios/` conservait des références cachées à l'ancien bundle ID dans plusieurs fichiers de configuration (`.pbxproj`, `Info.plist`, etc.).

`npx cap sync` ne change **pas** le bundle ID, il ne fait que :
- Copier les fichiers web (`dist/` → `ios/App/App/public/`)
- Mettre à jour les plugins

---

## ✅ La Solution

**Régénération complète du projet iOS :**

```bash
# 1. Supprimer l'ancien projet iOS
rm -rf ios/

# 2. Régénérer avec le nouveau bundle ID
npx cap add ios
```

**Résultat :**
- ✅ Nouveau projet iOS créé from scratch
- ✅ Bundle ID `fr.c6debug.app` partout
- ✅ Plus aucune trace de `fr.c6radio.app`

---

## 📝 Ce Qui a Été Fait

### Commandes Exécutées

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Suppression + régénération
rm -rf ios && npx cap add ios

# Vérification
grep -r "fr.c6radio.app" ios/App/     # → Aucun résultat ✅
grep -r "fr.c6debug.app" ios/App/     # → Présent partout ✅
```

### Fichiers Affectés

Le nouveau projet `ios/` contient maintenant :
- ✅ `App.xcodeproj` avec bundle ID `fr.c6debug.app`
- ✅ `Info.plist` avec bundle ID correct
- ✅ Tous les fichiers de config mis à jour

---

## 🚀 Prochaines Étapes

### 1. Vérifier le Secret GitHub

**CRITIQUE :** Le secret `IOS_MOBILEPROVISION_BASE64` doit correspondre au bundle ID `fr.c6debug.app`

**Vérifier que vous avez bien :**
- ✅ Créé un **nouveau profil de provisionnement** pour `fr.c6debug.app` sur Apple Developer
- ✅ Encodé ce profil en base64
- ✅ Mis à jour le secret `IOS_MOBILEPROVISION_BASE64` dans GitHub

**Si pas encore fait :**
→ Consultez `docs/FIX6-ACTIONS-RAPIDES.md`

### 2. Commit et Push

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Ajouter le nouveau projet iOS
git add ios/

# Ajouter les docs
git add docs/

# Commit
git commit -m "fix: Régénération projet iOS avec bundle ID fr.c6debug.app"

# Push
git push origin main
```

---

## ✅ Checklist Finale

**Avant de push :**

- [x] `capacitor.config.json` a `appId: "fr.c6debug.app"`
- [x] Projet iOS régénéré (dossier `ios/` supprimé et recréé)
- [x] Bundle ID vérifié dans le projet Xcode
- [ ] **App ID `fr.c6debug.app` créé sur Apple Developer**
- [ ] **Profil de provisionnement créé pour `fr.c6debug.app`**
- [ ] **Secret `IOS_MOBILEPROVISION_BASE64` mis à jour dans GitHub**
- [ ] **App `fr.c6debug.app` créée dans App Store Connect**

**Les 4 derniers points sont VOTRE responsabilité !** 🎯

---

## 🎯 Résumé des Fixes #1-7

```
Fix #1: Certificat iOS Development introuvable
Fix #2: Conflit signature auto/manual
Fix #3: Simplification signature
Fix #4: Profils manquants à l'export
Fix #5: Cloud signing permission error
Fix #6: Nouveau bundle ID fr.c6debug.app
Fix #7: Régénération projet iOS ✅ FAIT
```

**Il ne reste plus que la configuration Apple Developer ! 🚀**

---

## 💡 Leçon Apprise

**Quand changer de bundle ID :**

❌ **Ce qui ne suffit PAS :**
```bash
# Modifier capacitor.config.json
npx cap sync ios  # Ne change PAS le bundle ID !
```

✅ **Ce qui fonctionne :**
```bash
# Modifier capacitor.config.json
rm -rf ios/
npx cap add ios  # Régénère TOUT from scratch
```

**Le sync ne touche pas au bundle ID du projet Xcode !**

---

## 📖 Documentation

**Guides rapides :**
- `docs/FIX6-ACTIONS-RAPIDES.md` - Créer profil Apple Developer
- `docs/FIX6-NOUVEAU-BUNDLE-ID.md` - Guide complet bundle ID
- `docs/FIX7-REGENERATION-IOS.md` - Ce document

---

## 🚨 Action Requise MAINTENANT

**Avant de push, vous DEVEZ :**

1. **Créer l'App ID** `fr.c6debug.app` sur Apple Developer
2. **Créer le profil** de provisionnement pour ce bundle ID
3. **Mettre à jour** le secret GitHub `IOS_MOBILEPROVISION_BASE64`
4. **Créer l'app** dans App Store Connect

**Sans ces 4 étapes, le build échouera encore !**

**Temps estimé :** 15 minutes

**Guide :** `docs/FIX6-ACTIONS-RAPIDES.md`

---

**Document créé le :** 15 février 2026  
**Fix :** #7 (Régénération iOS)  
**Statut :** ✅ Projet iOS régénéré  
**Action requise :** Configuration Apple Developer (15 min)

