# ⚡ START HERE - Fix Workflow iOS

**Si tu reviens sur ce projet et que le workflow ne fonctionne pas**

---

## 🚨 PROBLÈME

```
error: exportArchive No profiles for 'fr.c6debug.app' were found
```

---

## ✅ SOLUTION (30 MINUTES)

### 1. Crée le profil (10 min)
```
https://developer.apple.com/account
→ Certificates, Identifiers & Profiles
→ Profiles → +
→ "App Store Connect"
→ App ID : fr.c6debug.app
→ Certificate : Apple Distribution
→ Generate → Download
```

### 2. Encode (5 min)
```bash
base64 -i fichier.mobileprovision > profil.base64
cat profil.base64  # Copie tout
```

### 3. GitHub (5 min)
```
github.com → Settings → Secrets
→ IOS_MOBILEPROVISION_BASE64
→ Colle le contenu → Update
```

### 4. Push (10 min)
```bash
echo "// Fix" >> src/App.jsx
git add . && git commit -m "fix: profil" && git push
```

---

## 📚 GUIDES

1. **phase-7-ACTION-IMMEDIATE.md** ← Détails étape par étape
2. **phase-7-SYNTHESE-COMPLETE.md** ← Vue complète
3. **RAPPORT-SESSION-15-FEV-PHASE7.md** ← Contexte

---

## ✅ APRÈS

- Workflow GitHub Actions → ✅ Succès
- App Store Connect → Build visible (15-30 min)
- TestFlight → Installe sur iPhone
- 🎉 Teste !

