# 📻 C6Radio Web App

**Application mobile et web pour C6Radio**  
**Status** : 🎉 Phase 7 Complétée - Notifications Push ✅  
**Dernière mise à jour** : 17 février 2026

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

### Build Mobile
```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

---

## 📱 DÉPLOIEMENT MOBILE

**Web** : ✅ Notifications Push fonctionnelles  
**Android** : ✅ Notifications Push fonctionnelles (manuelles & automatiques)  
**iOS** : ⏳ En attente d'accès Mac

---

## 📚 Documentation

**Phase 7 - Notifications Push :** 
- Configuration Android : `docs/ANDROID_SETUP.md` ← **NOUVEAU !**
- Configuration iOS : En attente (nécessite Mac)

**Phase 6 - Bannières :** `docs/phase-6-bannieres-RESUME.md`  
**Guide reprise projet** : `docs/REPRISE-PROCHAINE-SESSION.md`  
**Index documentation** : `docs/README.md`

---

## 🏗️ Architecture

- **Framework** : React 19 + Vite 7
- **Mobile** : Capacitor 8
- **Audio** : GlobalAudioContext (gestion unifiée)
- **CMS** : WordPress REST API
- **Bannières** : Rotation automatique + Cache
- **Push Notifications** : Firebase Cloud Messaging (Web + Android) + APNs (iOS)

---

## ✅ Phases Complétées

- ✅ Phase 0 : Setup & Validation
- ✅ Phase 1 : Audio Core
- ✅ Phase 2 : Barre de Contrôle
- ✅ Phase 3 : Pages & Navigation
- ✅ Phase 4 : WordPress Actualités
- ✅ Phase 5 : Podcasts WordPress
- ✅ Phase 6 : Bannières Publicitaires
- ✅ Phase 7 : Notifications Push (Web ✅ + Android ✅ + iOS ⏳) 🆕
- ⏳ Phase 8 : Polish & Tests
- ⏳ Phase 9 : Optimisations Production

---

## 🎯 Prochaines Étapes

1. **iOS Notifications** : Configuration iOS (nécessite Mac)
2. **Phase 8** : Polish UI/UX + Tests exhaustifs
3. **Phase 9** : Optimisations production
4. **Déploiement** : Production

**Progression MVP** : 80% (7/9 phases)

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

- **Lignes de code** : ~5500 (production)
- **Documentation** : ~20000 lignes
- **Guides Phase 7** : 9 fichiers
- **Progression MVP** : 80%
- **Plateformes** : Web ✅ + Android ✅ + iOS ⏳

---

## 🆘 Besoin d'Aide ?

**Workflow bloqué ?** → `PHASE7-README.md`  
**Reprise projet ?** → `docs/REPRISE-PROCHAINE-SESSION.md`  
**Vue d'ensemble ?** → `docs/README.md`

---

**Développé avec ❤️ pour C6Radio**
