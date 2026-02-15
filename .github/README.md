# 🤖 GitHub Actions Workflows

Ce dossier contient les workflows GitHub Actions pour le déploiement automatique.

---

## 📋 Workflows disponibles

### `ios-testflight.yml` - Déploiement iOS sur TestFlight

**Déclenchement :**
- Automatique à chaque `push` sur la branche `main`
- Manuel via l'interface GitHub Actions

**Durée :** ~10-15 minutes

**Ce qu'il fait :**
1. Build l'app React avec Vite
2. Compile le projet iOS avec Xcode
3. Signe l'app avec votre certificat Apple
4. Upload sur TestFlight automatiquement

**Prérequis :**
8 secrets GitHub à configurer (voir `docs/phase-7-secrets-github-QUICK.md`)

---

## 🔐 Secrets requis

| Secret | Description |
|--------|-------------|
| `APPLE_TEAM_ID` | Votre Team ID Apple Developer |
| `IOS_P12_BASE64` | Certificat de signature (base64) |
| `IOS_P12_PASSWORD` | Mot de passe du certificat |
| `IOS_MOBILEPROVISION_BASE64` | Profil de provisionnement (base64) |
| `PROVISIONING_PROFILE_NAME` | Nom du profil de provisionnement |
| `ASC_API_KEY_ID` | ID de la clé API App Store Connect |
| `ASC_API_ISSUER_ID` | Issuer ID de la clé API |
| `ASC_API_PRIVATE_KEY_BASE64` | Clé privée API (base64) |

**📖 Guide de configuration :** `docs/phase-7-secrets-github-QUICK.md`

---

## 🚀 Utilisation

### Déploiement automatique

Chaque commit sur `main` déclenche automatiquement un build :

```bash
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push origin main
```

### Déploiement manuel

1. GitHub → Repository → Actions
2. Cliquer sur "iOS TestFlight Deploy"
3. Cliquer "Run workflow"
4. Sélectionner la branche `main`
5. Cliquer "Run workflow" (bouton vert)

---

## 📊 Suivre un build

1. GitHub → Actions
2. Cliquer sur le workflow en cours
3. Cliquer sur le job `build-and-deploy`
4. Voir les étapes en temps réel

**En cas d'erreur :**
- Cliquer sur l'étape qui a échoué
- Lire les logs d'erreur
- Consulter `docs/phase-7-mobile-testflight-GUIDE.md` (section Problèmes courants)

---

## ⏱️ Temps de build par étape

| Étape | Durée moyenne |
|-------|---------------|
| Checkout + Setup | ~15s |
| Install dependencies | ~30s |
| Build Vite | ~10s |
| Sync Capacitor | ~5s |
| Build Xcode | ~5-8min |
| Export + Upload | ~2-3min |
| **Total** | **~10-15min** |

---

## 💰 Coût

**GitHub Actions (macOS runners) :**
- 2000 minutes/mois gratuites
- 1 build ≈ 15 minutes
- **~130 builds gratuits/mois**

Au-delà, facturation à la minute (mais très peu probable d'atteindre la limite).

---

## 📚 Documentation complète

**Guides complets :**
- `docs/phase-7-mobile-testflight-GUIDE.md` - Guide détaillé (1000+ lignes)
- `docs/phase-7-secrets-github-QUICK.md` - Configuration des secrets
- `docs/phase-7-mobile-testflight-RESUME.md` - Résumé de la Phase 7

---

**Créé le :** 15 février 2026  
**Version :** 1.0

