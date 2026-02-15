# 📻 C6Radio Web App

**Application mobile et web pour C6Radio**  
**Status** : 🆕 Phase 7 - Configuration iOS depuis zéro (Documentation complète prête !)  
**Dernière mise à jour** : 15 février 2026

---

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Build iOS
```bash
npm run build
npx cap sync ios
```

---

## 📱 DÉPLOIEMENT iOS TESTFLIGHT

**Nouveau départ propre** - Documentation complète créée !

### Quick Start (5 minutes de lecture)
```bash
cat docs/phase-7-QUICK-START.md
```

### Guide complet (45-60 minutes de configuration)
```bash
cat docs/phase-7-DE-ZERO-A-TESTFLIGHT.md
```

### Script helper interactif
```bash
./setup-ios-helper.sh
```

**Objectif** : Déploiement automatique sur TestFlight à chaque `git push` ! 🚀

---

## 📚 Documentation

**⚡ Démarrage Phase 7** : `docs/phase-7-START-HERE.md` ← **COMMENCE ICI**  
**📖 Guide complet iOS** : `docs/phase-7-DE-ZERO-A-TESTFLIGHT.md`  
**✅ Checklist** : `docs/phase-7-CHECKLIST-RAPIDE.md`  
**📋 Index** : `docs/phase-7-INDEX-COMPLET.md`

**Guide reprise projet** : `docs/REPRISE-PROCHAINE-SESSION.md`  
**Index documentation** : `docs/README.md`

---

## 🏗️ Architecture

- **Framework** : React 18 + Vite 6
- **Mobile** : Capacitor 6
- **Audio** : GlobalAudioContext (gestion unifiée)
- **CMS** : WordPress REST API
- **CI/CD** : GitHub Actions → TestFlight

---

## ✅ Phases Complétées

- ✅ Phase 0 : Setup & Validation
- ✅ Phase 1 : Audio Core
- ✅ Phase 2 : Barre de Contrôle
- ✅ Phase 3 : Pages & Navigation
- ✅ Phase 4 : WordPress Actualités
- ✅ Phase 5 : Podcasts WordPress
- 🟡 Phase 7 : Mobile & TestFlight (85%)

---

## 🎯 Prochaines Étapes

1. Créer profil de provisionnement iOS (30 min)
2. Tester workflow GitHub Actions (15 min)
3. Installer sur iPhone 13 mini (1 heure)
4. Tests fonctionnels (1 heure)

**Voir** : `docs/phase-7-ACTION-IMMEDIATE.md`

---

## 📱 Bundle ID

- **Debug** : `fr.c6debug.app`
- **Production** : `fr.c6radio.app` (à configurer)

---

## 🔐 Secrets GitHub Requis

- `IOS_P12_BASE64` ✅
- `IOS_P12_PASSWORD` ✅
- `IOS_MOBILEPROVISION_BASE64` ❌ **À CONFIGURER**
- `APPLE_TEAM_ID` ✅
- `ASC_API_KEY_ID` ✅
- `ASC_API_ISSUER_ID` ✅
- `ASC_API_PRIVATE_KEY_BASE64` ✅

---

## 📊 Métriques

- **Lignes de code** : ~5000 (production)
- **Documentation** : ~15000 lignes
- **Guides Phase 7** : 8 fichiers
- **Progression MVP** : 65%

---

## 🆘 Besoin d'Aide ?

**Workflow bloqué ?** → `PHASE7-README.md`  
**Reprise projet ?** → `docs/REPRISE-PROCHAINE-SESSION.md`  
**Vue d'ensemble ?** → `docs/README.md`

---

**Développé avec ❤️ pour C6Radio**
