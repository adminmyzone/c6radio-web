# ⚡ ACTION IMMÉDIATE - Fix Workflow iOS

**Date** : 15 février 2026  
**Temps estimé** : 30 minutes  
**Objectif** : Débloquer le workflow GitHub Actions

---

## 🎯 PROBLÈME

```
❌ error: exportArchive No profiles for 'fr.c6debug.app' were found
```

---

## ✅ SOLUTION EN 4 ÉTAPES

### ÉTAPE 1 : Créer le profil de provisionnement (10 min)

1. **Va sur** : https://developer.apple.com/account
2. **Clique sur** : Certificates, Identifiers & Profiles
3. **Clique sur** : Profiles (menu de gauche)
4. **Clique sur** : Bouton **"+"** (en haut à droite)
5. **Sélectionne** : **"App Store Connect"** ⚠️ PAS "Development" !
6. **Clique** : Continue
7. **Sélectionne** : App ID → **"fr.c6debug.app"** (ou "C6Radio Debug")
8. **Clique** : Continue
9. **Coche** : Ton certificat **"Apple Distribution"**
10. **Clique** : Continue
11. **Nom** : `C6Radio Debug AppStore`
12. **Clique** : Generate
13. **Télécharge** le fichier `.mobileprovision`

---

### ÉTAPE 2 : Encoder le profil (5 min)

**Sur Linux** :
```bash
# 1. Va dans le dossier où tu as téléchargé le fichier
cd ~/Téléchargements/

# 2. Encode en base64
base64 -i C6Radio_Debug_AppStore.mobileprovision > profil.base64

# 3. Affiche le contenu
cat profil.base64
```

**Résultat** : Une TRÈS longue ligne de texte (plusieurs milliers de caractères)

**Action** : Copie TOUT le contenu (Ctrl+Shift+C)

---

### ÉTAPE 3 : Mettre à jour GitHub (5 min)

1. **Va sur** : https://github.com/TON-USERNAME/c6radio-web
2. **Clique sur** : Settings (en haut)
3. **Clique sur** : Secrets and variables (menu de gauche)
4. **Clique sur** : Actions
5. **Cherche** : `IOS_MOBILEPROVISION_BASE64`
6. **Clique sur** : Le crayon (éditer) à droite
7. **Colle** : Le contenu de `profil.base64`
8. **Clique sur** : Update secret

---

### ÉTAPE 4 : Relancer le workflow (10 min)

**Sur ton PC** :
```bash
# 1. Fais un changement mineur pour déclencher le workflow
echo "// Fix provisioning profile" >> src/App.jsx

# 2. Commit et push
git add .
git commit -m "fix: update iOS provisioning profile"
git push origin main
```

**Sur GitHub** :
1. **Va sur** : https://github.com/TON-USERNAME/c6radio-web
2. **Clique sur** : Actions (en haut)
3. **Clique sur** : Le workflow qui vient de démarrer
4. **Surveille** : Chaque étape (ça prend 10-15 minutes)

---

## ✅ SUCCÈS ?

Si le workflow se termine avec :
```
✅ Build iOS réussi !
✅ Upload réussi sur TestFlight !
```

**BRAVO ! 🎉**

**Prochaine étape** :
1. Attends 15-30 minutes
2. Va sur https://appstoreconnect.apple.com
3. My Apps → C6Radio Debug → TestFlight
4. Ton build devrait apparaître avec le statut "Ready to Test"

---

## ❌ ENCORE UNE ERREUR ?

### Erreur : "No signing certificate found"
→ **Lis** : `docs/phase-7-AIDE-MEMOIRE-RAPIDE.md` (section "Certificat")

### Erreur : "Authentication credentials invalid"
→ **Lis** : `docs/phase-7-AIDE-MEMOIRE-RAPIDE.md` (section "Clé API")

### Erreur : "Bundle identifier mismatch"
→ **Lis** : `docs/phase-7-GUIDE-ETAPE-PAR-ETAPE.md` (section "Bundle ID")

### Autre erreur
→ **Lis** : `docs/phase-7-DIAGNOSTIC-COMPLET.md`

---

## 📚 GUIDES COMPLETS

Si tu bloques, lis ces guides dans l'ordre :

1. **phase-7-SYNTHESE-COMPLETE.md** ← Commence ici (résume tout)
2. **phase-7-GUIDE-ETAPE-PAR-ETAPE.md** ← Instructions détaillées
3. **phase-7-AIDE-MEMOIRE-RAPIDE.md** ← Dépannage
4. **phase-7-DIAGNOSTIC-COMPLET.md** ← Analyse complète
5. **phase-7-GUIDE-VISUEL.md** ← Schémas

---

## 💡 POINTS CLÉS À RETENIR

### ✅ Le profil DOIT être "App Store Connect"
```
❌ iOS App Development
❌ Ad Hoc  
✅ App Store Connect  ← CORRECT
```

### ✅ Le profil DOIT être lié à "fr.c6debug.app"
```
App ID : fr.c6debug.app  ← Exactement ce texte
```

### ✅ Le profil DOIT être lié à "Apple Distribution"
```
Certificate : Apple Distribution  ← Pas "Development"
```

---

## ⏱️ TIMELINE APRÈS LE FIX

```
Maintenant        → Créer le profil (10 min)
Dans 10 min       → Encoder + GitHub (10 min)
Dans 20 min       → Push + Workflow (15 min)
Dans 35 min       → ✅ Workflow terminé !
Dans 50-65 min    → Build disponible sur TestFlight
```

**Total : ~1 heure du début à la fin**

---

## 🎯 TU ES PRESQUE LÀ !

Le problème est **SIMPLE** : il manque juste un fichier sur Apple Developer.

**5 étapes + 30 minutes = Problème résolu ! 🚀**

Bon courage ! 💪

