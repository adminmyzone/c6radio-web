# ⚡ QUICK START - iOS TestFlight (5 minutes)

**Tu n'as que 5 minutes ? Lis juste ça !**

---

## 🎯 OBJECTIF

Déployer automatiquement ton app sur TestFlight à chaque `git push`

---

## 📍 COMMENCE ICI

### 1️⃣ Lis le point d'entrée (2 min)

```bash
cat docs/phase-7-START-HERE.md
```

### 2️⃣ Suis le guide principal (45 min)

```bash
cat docs/phase-7-DE-ZERO-A-TESTFLIGHT.md
```

### 3️⃣ Utilise le script helper

```bash
./setup-ios-helper.sh
```

### 4️⃣ Valide avec la checklist

```bash
cat docs/phase-7-CHECKLIST-RAPIDE.md
```

---

## ✅ CE QU'IL FAUT CRÉER

### Sur Apple Developer Portal (20 min)
1. **App ID** : `fr.c6debug.app`
2. **Certificat** : Apple Distribution
3. **Profil** : App Store Connect

### Sur App Store Connect (10 min)
1. **App** : C6Radio Debug
2. **Clé API** : Rôle "App Manager"

### Sur GitHub (10 min)
7 secrets à configurer

---

## 🚀 APRÈS CONFIGURATION

```bash
git push origin main
# ⏱️ 10-15 min → Build automatique
# ⏱️ 15-30 min → Traitement Apple
# 📱 App sur iPhone ! 🎉
```

---

## 📚 GUIDES DISPONIBLES

```
docs/
├── phase-7-START-HERE.md              ← LIS D'ABORD
├── phase-7-DE-ZERO-A-TESTFLIGHT.md    ← GUIDE COMPLET
├── phase-7-CHECKLIST-RAPIDE.md        ← VALIDATION
├── phase-7-PLAN-VISUEL.md             ← PLAN VISUEL
├── phase-7-INDEX-COMPLET.md           ← NAVIGATION
└── phase-7-AIDE-MEMOIRE-RAPIDE.md     ← DÉPANNAGE
```

---

## 🔧 OUTIL DISPONIBLE

```bash
./setup-ios-helper.sh
```

Assistant interactif pour :
- Générer les clés et certificats
- Encoder en base64
- Vérifier la configuration

---

## ⏱️ TEMPS TOTAL

**1-2 heures** pour la première configuration complète

Après : **10 secondes** (git push) = nouveau build ! ✨

---

## 🆘 BESOIN D'AIDE ?

### Erreur dans le workflow ?
➜ `docs/phase-7-AIDE-MEMOIRE-RAPIDE.md`

### Pas sûr d'avoir tout ?
➜ `docs/phase-7-CHECKLIST-RAPIDE.md`

### Comprendre le système ?
➜ `docs/phase-7-INDEX-COMPLET.md`

---

**👉 COMMENCE : `docs/phase-7-START-HERE.md`**

**GO ! 🚀**

