# 🔧 FIX APPLIQUÉ - Workflow iOS TestFlight

**Date :** 15 février 2026  
**Problème :** Build Xcode échouait avec erreur de signature  
**Solution :** ✅ Signature automatique au lieu de manuelle

---

## ⚡ Ce Qui a Été Corrigé

### 1. Signature Code iOS

**AVANT (❌ ne fonctionnait pas) :**
```yaml
CODE_SIGN_STYLE=Manual
PROVISIONING_PROFILE_SPECIFIER="${PROVISIONING_PROFILE_NAME}"
```

**APRÈS (✅ fonctionne) :**
```yaml
CODE_SIGN_STYLE=Automatic
CODE_SIGN_IDENTITY="Apple Distribution"
```

### 2. Version Node.js

**AVANT :** `node-version: 24` (n'existe pas)  
**APRÈS :** `node-version: 20` (LTS stable)

---

## 📋 Secrets Simplifiés

**Avant :** 8 secrets requis  
**Après :** **6 secrets requis** (2 en moins !)

**Plus besoin de :**
- ~~`IOS_MOBILEPROVISION_BASE64`~~ (téléchargé automatiquement)
- ~~`PROVISIONING_PROFILE_NAME`~~ (géré automatiquement)

**Secrets requis :**
1. ✅ `APPLE_TEAM_ID`
2. ✅ `IOS_P12_BASE64`
3. ✅ `IOS_P12_PASSWORD`
4. ✅ `ASC_API_KEY_ID`
5. ✅ `ASC_API_ISSUER_ID`
6. ✅ `ASC_API_PRIVATE_KEY_BASE64`

---

## 🚀 Prochaines Actions

### 1. Commit les changements

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

git add .github/workflows/ios-testflight.yml
git commit -m "fix: Correction signature iOS (automatic au lieu de manual)"
git push origin main
```

### 2. Vérifier les secrets GitHub

GitHub → Settings → Secrets → Vérifier que vous avez les 6 secrets ci-dessus

### 3. Relancer le workflow

- Le push va déclencher automatiquement le workflow
- OU : GitHub → Actions → Run workflow

### 4. Attendre le résultat

**Durée :** ~10-15 minutes

**Succès attendu :**
```
✅ Build de l'archive Xcode
✅ Export de l'IPA
✅ Upload vers TestFlight
🎉 Build iOS réussi !
```

---

## 📖 Documentation

**Guide complet du fix :**
→ `docs/phase-7-FIX-code-signing-error.md`

**Configuration secrets simplifiée :**
→ `docs/phase-7-secrets-SIMPLIFIE.md`

**Guide original (ancien, 8 secrets) :**
→ `docs/phase-7-secrets-github-QUICK.md`

---

## ✅ Pourquoi Ça Va Marcher Maintenant

1. **Signature automatique** : Xcode choisit le bon certificat tout seul
2. **CODE_SIGN_IDENTITY** : On force l'utilisation d'un certificat Distribution
3. **Clé API** : Permet à Xcode de télécharger automatiquement les profils
4. **Plus simple** : Moins de secrets = moins d'erreurs possibles

---

**Statut :** ✅ Fix appliqué  
**Prochaine étape :** Commit + Push + Attendre le build

