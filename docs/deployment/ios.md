# 📱 Guide déploiement iOS — C6 Radio
> Capacitor 8 + Swift Package Manager (SPM) + App Store Connect

---

## 🔧 Prérequis
- Mac avec Xcode installé (ou MacInCloud)
- Compte Apple Developer actif
- Accès App Store Connect
- Node.js + npm installés

---

## 1️⃣ Build & Sync du projet

```bash
# À la racine du projet
npm install
npm run build
npx cap sync ios
```

---

## 2️⃣ Ouvrir dans Xcode

```bash
# ⚠️ Capacitor 8 utilise SPM → ouvrir le .xcodeproj (pas le .xcworkspace)
open ios/App/App.xcodeproj
```

Xcode va automatiquement résoudre les dépendances SPM au premier lancement.
Attendre que la barre de progression en haut soit terminée ✅

---

## 3️⃣ Signing & Capabilities

1. Cliquer sur le projet **"App"** dans le panneau gauche
2. Target **"App"** → onglet **"Signing & Capabilities"**
3. Vérifier :
   - ✅ **Automatically manage signing** coché
   - ✅ **Team** sélectionnée
   - ✅ **Bundle Identifier** correct (voir tableau ci-dessous)
   - ✅ Aucun ❌ rouge

### Bundle IDs
| Environnement | Bundle ID | App Name |
|---|---|---|
| 🧪 Staging/Dev | `com.c6media.c6radiostaging` | `C6 Radio Staging` |
| 🏭 Production | *(à confirmer)* | `C6 Radio` |

---

## 4️⃣ Vérifier les fichiers de config

### `capacitor.config.ts` (racine du projet)
```typescript
const config: CapacitorConfig = {
  appId: 'com.c6media.c6radiostaging', // ou bundle ID production
  appName: 'C6 Radio Staging',         // ou nom production
  webDir: 'dist',
  bundledWebRuntime: false,
};
```

### `ios/App/App/capacitor.config.json` (auto-généré par cap sync)
```json
{
  "appId": "com.c6media.c6radiostaging",
  "appName": "C6 Radio Staging",
  "webDir": "dist"
}
```

> ⚠️ Ce fichier est auto-généré par `npx cap sync`.
> Si les deux fichiers ne sont pas cohérents, le build échoue.

---

## 5️⃣ Archiver l'app

1. Dans la barre du haut de Xcode, sélectionner **"Any iOS Device (arm64)"**
   (⚠️ pas un simulateur !)
2. `Product → Clean Build Folder` (`⇧⌘K`)
3. `Product → Archive`
4. Attendre la fin du build ⏳

---

## 6️⃣ Distribuer sur App Store Connect

La fenêtre **Organizer** s'ouvre automatiquement. Sinon : `Window → Organizer`

1. Sélectionner l'archive dans la liste
2. Cliquer **"Distribute App"**
3. Choisir **"App Store Connect"**
4. Choisir **"Upload"**
5. Laisser tout en **Automatic** → cliquer **Next** jusqu'à **Upload**
6. Attendre la confirmation ✅

---

## 7️⃣ TestFlight — Test sur iPhone

1. Aller sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **My Apps** → sélectionner l'app
3. Onglet **TestFlight**
4. Attendre le traitement du build (5-15 min) ⏳
5. **Internal Testing** → **Add Testers** → ajouter les Apple ID
6. Les testeurs reçoivent un email d'invitation
7. Installer **TestFlight** sur iPhone → installer l'app ✅

---

## 8️⃣ Installation directe via Xcode (debug rapide)

1. Connecter l'iPhone au Mac (USB ou WiFi)
2. Dans Xcode, sélectionner l'iPhone dans la barre du haut
3. Appuyer sur **▶️ Play** (`⌘R`)
4. Sur iPhone : **Réglages → Général → VPN et gestion de l'appareil**
   → Faire confiance au certificat développeur

---

## 🏭 Passage en production (quand Bundle ID officiel disponible)

1. Mettre à jour `capacitor.config.ts` :
```typescript
appId: 'com.c6media.BUNDLE_ID_OFFICIEL',
appName: 'C6 Radio',
```

2. Rebuild & sync :
```bash
npm run build
npx cap sync ios
```

3. Dans Xcode → **Signing & Capabilities** → mettre à jour le Bundle Identifier
4. Reprendre à partir de l'**étape 5** (Archive)

---

## 🚨 Erreurs fréquentes & solutions

| Erreur | Cause | Solution |
|---|---|---|
| `No Podfile found` | Capacitor 8 utilise SPM | Normal ! Ouvrir `.xcodeproj` pas `.xcworkspace` |
| `Bundle ID not available` | Bundle ID pris par une autre équipe | Utiliser un Bundle ID différent |
| `App Name already in use` | Nom déjà sur l'App Store | Utiliser un nom temporaire ex: `C6 Radio Staging` |
| `Duplicate frameworks` | Conflit CocoaPods/SPM | Supprimer le dossier `ios/`, refaire `npx cap add ios` |
| `capacitor.config.json` désynchronisé | `cap sync` pas relancé | Relancer `npx cap sync ios` |

---

## 📋 Commandes utiles

```bash
# Build complet
npm run build && npx cap sync ios

# Réinitialiser iOS from scratch
rm -rf ios/
npx cap add ios
npx cap sync ios

# Ouvrir Xcode
open ios/App/App.xcodeproj

# Vérifier les Bundle IDs dans le projet
grep -r "PRODUCT_BUNDLE_IDENTIFIER" ios/
grep -r "appId" ios/App/App/capacitor.config.json
```

---

*Guide généré le 20/02/2026 — Capacitor 8.1.0 + Swift Package Manager*