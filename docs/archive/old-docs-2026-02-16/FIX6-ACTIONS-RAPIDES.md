# ⚡ ACTION IMMÉDIATE - Nouveau Profil pour fr.c6debug.app

**Temps : 10 minutes**

---

## 🎯 À FAIRE MAINTENANT

### 1. Créer App ID (2 min)

```
https://developer.apple.com/account/resources/identifiers
→ "+" → App IDs
→ Bundle ID: "fr.c6debug.app"
→ Register
```

### 2. Créer Profil (3 min)

```
https://developer.apple.com/account/resources/profiles
→ "+" → "App Store Connect"
→ App ID: "fr.c6debug.app"
→ Certificat: Votre "Apple Distribution"
→ Nom: "C6Radio Debug TestFlight"
→ Generate → Télécharger
```

### 3. Encoder (1 min)

```bash
base64 -w 0 ~/Downloads/C6Radio_Debug_TestFlight.mobileprovision > profil_base64.txt
```

### 4. Update Secret GitHub (2 min)

```
GitHub → Settings → Secrets
→ IOS_MOBILEPROVISION_BASE64
→ Update
→ Coller le nouveau base64
→ Update secret
```

### 5. Créer App dans App Store Connect (5 min)

```
https://appstoreconnect.apple.com
→ My Apps → "+"
→ Bundle ID: "fr.c6debug.app"
→ Create
```

### 6. Commit & Push (1 min)

```bash
git add .
git commit -m "fix: Nouveau bundle ID fr.c6debug.app"
git push origin main
```

---

## ✅ C'est Tout !

**1 seul secret à changer :**
- `IOS_MOBILEPROVISION_BASE64`

**Les autres restent identiques !**

---

**GO ! 🚀**

