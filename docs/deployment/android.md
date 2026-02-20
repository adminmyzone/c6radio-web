# 🤖 Guide déploiement Android — C6 Radio
> Capacitor 8 + Android Studio + Google Play Store

---

## 🔧 Prérequis
- PC Windows/Linux avec Android Studio installé
- Compte Google Play Console (25$ une seule fois)
- Node.js + npm installés
- Câble USB + téléphone Android pour tester

---

## 1️⃣ Configurer les variables d'environnement

### Windows
1. `Windows + R` → `sysdm.cpl` → **Variables d'environnement**
2. Dans **"Variables système"** → **"Nouvelle"** :

| Variable | Valeur |
|---|---|
| `ANDROID_HOME` | `C:\Users\TON_USER\AppData\Local\Android\Sdk` |

3. Dans **"Path"** → **"Modifier"** → **"Nouveau"** → ajouter :
```
C:\Users\TON_USER\AppData\Local\Android\Sdk\platform-tools
C:\Users\TON_USER\AppData\Local\Android\Sdk\tools
```

4. Redémarre VS Code et vérifie :
```powershell
echo $env:ANDROID_HOME
adb --version
```

---

## 2️⃣ Build & Sync du projet

```bash
# À la racine du projet
npm install
npm run build
npx cap sync android
```

---

## 3️⃣ Ouvrir dans Android Studio

```bash
npx cap open android
```

Attendre que le **Gradle sync** soit terminé en bas ⏳

---

## 4️⃣ Tester sur un vrai device (debug rapide)

### Activer le mode développeur sur Android
1. **Paramètres → À propos du téléphone → Informations sur le logiciel**
2. Appuyer **7 fois** sur **"Numéro de build"**
3. ✅ "Vous êtes maintenant développeur !"

### Activer le débogage USB
1. **Paramètres → Options développeur**
2. Activer **"Débogage USB"** ✅
3. Connecter le téléphone au PC via **câble USB**
4. Accepter la popup **"Autoriser le débogage USB"** sur le téléphone

### Vérifier que le téléphone est détecté
```powershell
adb devices
# Résultat attendu :
# List of devices attached
# XXXXXXXX    device
```

### Lancer l'app
Dans Android Studio :
1. Sélectionner le device dans la barre du haut
2. Appuyer sur **▶️ Play** (`⇧F10`)
3. L'app s'installe directement sur le téléphone ✅

---

## 5️⃣ Générer un AAB signé (Play Store)

### Créer un Keystore (une seule fois !)
```
Build → Generate Signed Bundle / APK
→ Android App Bundle (AAB) ✅
→ Create new keystore
```

| Champ | Valeur |
|---|---|
| **Key store path** | `C:\...\c6radio.keystore` |
| **Password** | *(mot de passe fort à sauvegarder !)* |
| **Alias** | `c6radio` |
| **Validity** | `25` ans |

> ⚠️ **CRITIQUE** : Sauvegarde le fichier `.keystore` et les mots de passe en lieu sûr !
> Sans eux, impossible de mettre à jour l'app sur le Play Store !

### Générer le AAB
```
Build → Generate Signed Bundle / APK
→ Android App Bundle ✅
→ Sélectionner le keystore existant
→ Release
→ Finish
```

Le fichier `.aab` est généré dans :
```
android/app/release/app-release.aab
```

---

## 6️⃣ Publier sur Google Play Console

1. Aller sur [play.google.com/console](https://play.google.com/console)
2. **Créer une application**
3. Remplir les infos :
   - 📝 Nom, description
   - 📸 Screenshots (obligatoire)
   - 🏷️ Catégorie
   - 🔞 Classification du contenu
4. **Production → Releases → Create release**
5. Uploader le fichier `.aab`
6. Soumettre pour review ✅

---

## 7️⃣ Config du Bundle ID Android

### `capacitor.config.ts` (racine du projet)
```typescript
const config: CapacitorConfig = {
  appId: 'com.c6media.c6radiostaging', // ou bundle ID production
  appName: 'C6 Radio Staging',
  webDir: 'dist',
  bundledWebRuntime: false,
};
```

### Bundle IDs
| Environnement | Bundle ID | App Name |
|---|---|---|
| 🧪 Staging/Dev | `com.c6media.c6radiostaging` | `C6 Radio Staging` |
| 🏭 Production | *(à confirmer)* | `C6 Radio` |

---

## 🚨 Erreurs fréquentes & solutions

| Erreur | Cause | Solution |
|---|---|---|
| `ANDROID_HOME not set` | Variable d'environnement manquante | Configurer `ANDROID_HOME` dans les variables système |
| `adb: command not found` | platform-tools pas dans le PATH | Ajouter `Sdk\platform-tools` au PATH |
| `Gradle sync failed` | Dépendances manquantes | `File → Sync Project with Gradle Files` |
| `No devices found` | Débogage USB non activé | Activer débogage USB + accepter popup |
| `App not installed` | Version incompatible | Désinstaller l'ancienne version sur le téléphone |
| `Upload failed` | Mauvais keystore | Utiliser le même keystore que la version précédente |

---

## 📋 Commandes utiles

```bash
# Build complet
npm run build && npx cap sync android

# Réinitialiser Android from scratch
rm -rf android/
npx cap add android
npx cap sync android

# Ouvrir Android Studio
npx cap open android

# Vérifier les devices connectés
adb devices

# Installer un APK manuellement
adb install app-release.apk

# Voir les logs de l'app en temps réel
adb logcat
```

---

## 📋 Récap des différences iOS vs Android

| | iOS | Android |
|---|---|---|
| 💰 Compte développeur | 99$/an | 25$ une seule fois |
| 🛠️ IDE | Xcode (Mac uniquement) | Android Studio (Win/Mac/Linux) |
| 📦 Format de publication | `.ipa` | `.aab` (ou `.apk`) |
| 🔑 Signature | Certificats Apple | Keystore `.jks` |
| ⏱️ Review | 1-3 jours | Quelques heures |
| �� Test interne | TestFlight | Play Console Internal Testing |
| 📦 Dépendances | SPM (Capacitor 8) | Gradle |

---

*Guide généré le 20/02/2026 — Capacitor 8.1.0 + Android Studio*