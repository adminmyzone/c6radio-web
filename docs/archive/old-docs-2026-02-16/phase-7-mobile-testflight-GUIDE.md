# 📱 Phase 7 - Déploiement iOS avec TestFlight

**Date :** 15 février 2026  
**Status :** ✅ Configuration terminée  
**Difficulté :** ⭐⭐⭐ Intermédiaire

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Comment ça marche](#comment-ça-marche)
3. [Configuration requise](#configuration-requise)
4. [Étape par étape : Configuration des secrets GitHub](#étape-par-étape--configuration-des-secrets-github)
5. [Lancer un build TestFlight](#lancer-un-build-testflight)
6. [Installer l'app sur votre iPhone](#installer-lapp-sur-votre-iphone)
7. [Problèmes courants et solutions](#problèmes-courants-et-solutions)
8. [Architecture technique](#architecture-technique)

---

## 🎯 Vue d'ensemble

### Qu'est-ce que c'est ?

Cette Phase 7 permet de **déployer automatiquement** votre application C6Radio sur TestFlight (la plateforme de test d'Apple) **sans avoir besoin de Mac** ! 

### Le problème

Normalement, pour créer une app iOS, il faut :
- ✅ Un Mac avec Xcode
- ✅ Compiler manuellement
- ✅ Uploader manuellement sur TestFlight

**Mais vous n'avez pas de Mac !** 😅

### La solution

**GitHub Actions** = ordinateurs gratuits dans le cloud  
→ GitHub nous donne accès à des Mac virtuels  
→ On configure un "workflow" (script automatique)  
→ À chaque commit, GitHub compile et déploie automatiquement !

### Résultat final

```
Vous faites un commit sur GitHub
         ↓
GitHub Actions détecte le nouveau commit
         ↓
GitHub compile votre app sur un Mac virtuel
         ↓
GitHub envoie l'app sur TestFlight
         ↓
Vous recevez une notification sur votre iPhone
         ↓
Vous installez et testez l'app ! 🎉
```

**Durée du processus :** ~10-15 minutes par build

---

## 🔧 Comment ça marche

### Les technologies utilisées

#### 1. **Capacitor** 
- C'est un "wrapper" qui transforme votre app web en app mobile
- Votre code React reste identique
- Capacitor ajoute juste une "coquille" iOS autour

#### 2. **Vite Build**
- Vite compile votre code React en fichiers HTML/CSS/JS optimisés
- Ces fichiers sont placés dans le dossier `dist/`

#### 3. **Capacitor Sync**
- Copie le dossier `dist/` dans le projet iOS
- Met à jour les plugins iOS si nécessaire

#### 4. **Xcode Build**
- Xcode compile le projet iOS
- Crée un fichier `.ipa` (l'équivalent d'un `.exe` pour iOS)

#### 5. **TestFlight Upload**
- Le fichier `.ipa` est envoyé sur les serveurs Apple
- Apple le rend disponible dans l'app TestFlight

### Schéma du workflow

```
┌─────────────────┐
│  Votre Code     │
│  React + Vite   │
└────────┬────────┘
         │
         │ npm run build
         ↓
┌─────────────────┐
│  Dossier dist/  │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │
         │ npx cap sync ios
         ↓
┌─────────────────┐
│  Projet iOS     │
│  (Xcode)        │
└────────┬────────┘
         │
         │ xcodebuild archive
         ↓
┌─────────────────┐
│  Fichier .ipa   │
└────────┬────────┘
         │
         │ altool --upload-app
         ↓
┌─────────────────┐
│   TestFlight    │
│   (Apple)       │
└─────────────────┘
```

---

## ⚙️ Configuration requise

### Comptes Apple

Vous avez déjà ✅ :
- [x] Compte Apple Developer Premium (99$/an)
- [x] iPhone 13 mini pour tester

### Ce qu'il faut créer dans App Store Connect

1. **Une app dans App Store Connect**
   - Bundle ID : `fr.c6radio.app`
   - Nom : "C6Radio"

2. **Un certificat de signature iOS**
   - Type : "iOS Distribution"
   - Format : fichier .p12

3. **Un profil de provisionnement**
   - Type : "App Store"
   - Format : fichier .mobileprovision

4. **Une clé API App Store Connect**
   - Permissions : "App Manager"
   - Format : fichier .p8

### Ce qu'il faut configurer dans GitHub

8 secrets à ajouter dans votre repository GitHub (voir section suivante)

---

## 🔐 Étape par étape : Configuration des secrets GitHub

### Pourquoi des secrets ?

Les secrets GitHub sont des **variables sécurisées** qui contiennent des informations sensibles (mots de passe, certificats, clés API). Ils ne sont **jamais visibles publiquement** et GitHub les protège.

### Liste des 8 secrets requis

| Secret | Description | Où le trouver |
|--------|-------------|---------------|
| `IOS_P12_BASE64` | Certificat de signature (encodé en base64) | Apple Developer → Certificates |
| `IOS_P12_PASSWORD` | Mot de passe du certificat | Créé par vous lors de l'export |
| `IOS_MOBILEPROVISION_BASE64` | Profil de provisionnement (encodé en base64) | Apple Developer → Profiles |
| `APPLE_TEAM_ID` | ID de votre équipe Apple Developer | Apple Developer → Membership |
| `PROVISIONING_PROFILE_NAME` | Nom du profil de provisionnement | Apple Developer → Profiles |
| `ASC_API_KEY_ID` | ID de la clé API App Store Connect | App Store Connect → Keys |
| `ASC_API_ISSUER_ID` | Issuer ID de la clé API | App Store Connect → Keys |
| `ASC_API_PRIVATE_KEY_BASE64` | Clé privée API (encodée en base64) | Fichier .p8 téléchargé |

---

### 📝 Guide détaillé : Créer les secrets un par un

#### **Secret 1 : APPLE_TEAM_ID**

**Le plus simple, commençons par lui !**

1. Aller sur https://developer.apple.com/account
2. Se connecter avec votre Apple ID
3. Cliquer sur "Membership" dans le menu de gauche
4. Copier le **Team ID** (format : `ABC123XYZ`)

**Ajouter dans GitHub :**
1. GitHub → Votre repository → Settings → Secrets and variables → Actions
2. Cliquer "New repository secret"
3. Name : `APPLE_TEAM_ID`
4. Value : Coller votre Team ID (ex: `ABC123XYZ`)
5. Cliquer "Add secret"

---

#### **Secret 2 & 3 : Certificat de signature iOS**

**Ce certificat prouve que l'app vient bien de vous.**

##### Étape 1 : Créer le certificat (si pas déjà fait)

1. Aller sur https://developer.apple.com/account/resources/certificates
2. Cliquer le "+" pour créer un nouveau certificat
3. Choisir **"Apple Distribution"**
4. Suivre les instructions pour créer un CSR (Certificate Signing Request)
5. Télécharger le certificat (fichier `.cer`)

##### Étape 2 : Exporter en format .p12

**⚠️ Cette étape est normalement faite sur Mac, mais on peut la simuler :**

**Option A : Si vous avez accès à un Mac temporairement**
1. Double-cliquer le fichier `.cer` → s'ouvre dans Keychain Access
2. Clic droit sur le certificat → Export
3. Choisir format `.p12`
4. Définir un mot de passe (à retenir !)

**Option B : Si vous n'avez pas de Mac**
1. Demander à quelqu'un avec un Mac de faire l'export
2. OU utiliser un service en ligne (Google "convert cer to p12 online")
3. ⚠️ Attention : ne jamais uploader des certificats réels sur des sites inconnus
   - Créer un certificat de test d'abord pour vérifier que ça marche

##### Étape 3 : Convertir en base64

```bash
# Sur Linux ou Mac
base64 -i votre_certificat.p12 -o certificat_base64.txt

# Sur Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("votre_certificat.p12")) | Out-File certificat_base64.txt
```

##### Étape 4 : Ajouter les secrets dans GitHub

**Secret `IOS_P12_BASE64` :**
1. GitHub → Settings → Secrets → New repository secret
2. Name : `IOS_P12_BASE64`
3. Value : Coller tout le contenu du fichier `certificat_base64.txt`
4. Add secret

**Secret `IOS_P12_PASSWORD` :**
1. New repository secret
2. Name : `IOS_P12_PASSWORD`
3. Value : Le mot de passe que vous avez défini lors de l'export
4. Add secret

---

#### **Secret 4 & 5 : Profil de provisionnement**

**Ce profil autorise votre app à être installée sur des iPhones.**

##### Étape 1 : Créer le profil

1. Aller sur https://developer.apple.com/account/resources/profiles
2. Cliquer le "+" pour créer un nouveau profil
3. Choisir **"App Store"** (pour TestFlight et production)
4. Sélectionner l'App ID : `fr.c6radio.app` (créer si nécessaire)
5. Sélectionner le certificat de signature créé précédemment
6. Donner un nom : `C6Radio App Store Profile`
7. Télécharger (fichier `.mobileprovision`)

##### Étape 2 : Convertir en base64

```bash
# Sur Linux ou Mac
base64 -i votre_profil.mobileprovision -o profil_base64.txt

# Sur Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("votre_profil.mobileprovision")) | Out-File profil_base64.txt
```

##### Étape 3 : Ajouter les secrets

**Secret `IOS_MOBILEPROVISION_BASE64` :**
1. GitHub → Settings → Secrets → New repository secret
2. Name : `IOS_MOBILEPROVISION_BASE64`
3. Value : Coller le contenu de `profil_base64.txt`
4. Add secret

**Secret `PROVISIONING_PROFILE_NAME` :**
1. New repository secret
2. Name : `PROVISIONING_PROFILE_NAME`
3. Value : Le nom exact du profil (ex: `C6Radio App Store Profile`)
4. Add secret

---

#### **Secret 6, 7 & 8 : Clé API App Store Connect**

**Cette clé permet au workflow d'uploader sur TestFlight automatiquement.**

##### Étape 1 : Créer la clé API

1. Aller sur https://appstoreconnect.apple.com/access/api
2. Se connecter avec votre Apple ID
3. Cliquer "Keys" puis le "+" pour créer une clé
4. Name : `GitHub Actions C6Radio`
5. Access : Choisir **"App Manager"**
6. Cliquer "Generate"

##### Étape 2 : Noter les informations

**⚠️ IMPORTANT : Vous ne pourrez télécharger la clé qu'UNE SEULE FOIS !**

- **Issuer ID** : Affiché en haut de la page (format UUID)
- **Key ID** : Affiché dans la liste des clés
- **Fichier .p8** : Télécharger immédiatement et garder précieusement

##### Étape 3 : Convertir la clé en base64

```bash
# Sur Linux ou Mac
base64 -i AuthKey_XXXXXX.p8 -o api_key_base64.txt

# Sur Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("AuthKey_XXXXXX.p8")) | Out-File api_key_base64.txt
```

##### Étape 4 : Ajouter les secrets

**Secret `ASC_API_KEY_ID` :**
1. GitHub → Settings → Secrets → New repository secret
2. Name : `ASC_API_KEY_ID`
3. Value : Le Key ID (ex: `AB12CD34EF`)
4. Add secret

**Secret `ASC_API_ISSUER_ID` :**
1. New repository secret
2. Name : `ASC_API_ISSUER_ID`
3. Value : L'Issuer ID (format UUID)
4. Add secret

**Secret `ASC_API_PRIVATE_KEY_BASE64` :**
1. New repository secret
2. Name : `ASC_API_PRIVATE_KEY_BASE64`
3. Value : Coller le contenu de `api_key_base64.txt`
4. Add secret

---

### ✅ Vérification finale

Dans GitHub → Settings → Secrets and variables → Actions, vous devez voir **8 secrets** :

```
✓ APPLE_TEAM_ID
✓ ASC_API_ISSUER_ID
✓ ASC_API_KEY_ID
✓ ASC_API_PRIVATE_KEY_BASE64
✓ IOS_MOBILEPROVISION_BASE64
✓ IOS_P12_BASE64
✓ IOS_P12_PASSWORD
✓ PROVISIONING_PROFILE_NAME
```

**Si vous avez les 8, vous êtes prêt ! 🎉**

---

## 🚀 Lancer un build TestFlight

### Méthode automatique (recommandée)

**À chaque commit sur la branche `main`, un build est automatiquement créé !**

```bash
# Dans votre projet
git add .
git commit -m "Fix: Correction du bug de lecture audio"
git push origin main
```

→ Le workflow se déclenche automatiquement  
→ Rendez-vous sur GitHub → Actions pour suivre le build

### Méthode manuelle

1. Aller sur GitHub → Votre repository
2. Cliquer sur l'onglet **"Actions"**
3. Dans la liste de gauche, cliquer sur **"iOS TestFlight Deploy"**
4. Cliquer sur **"Run workflow"** (bouton à droite)
5. Sélectionner la branche `main`
6. Cliquer **"Run workflow"** (bouton vert)

### Suivre le build en direct

1. Dans l'onglet Actions, cliquer sur le workflow en cours
2. Cliquer sur le job `build-and-deploy`
3. Vous voyez les étapes en temps réel :

```
✓ Checkout du code
✓ Configuration Node.js
✓ Installation des dépendances
⏳ Build React + Vite (en cours...)
- Synchronisation Capacitor iOS
- Build Xcode
- Upload TestFlight
```

**Durée totale :** ~10-15 minutes

### Notifications

**En cas de succès :**
- ✅ Le workflow affiche "Success" en vert
- 📧 Vous recevez un email GitHub (si notifications activées)
- ⏱️ L'app sera disponible sur TestFlight dans 5-30 minutes

**En cas d'échec :**
- ❌ Le workflow affiche "Failed" en rouge
- Cliquer sur l'étape qui a échoué pour voir l'erreur
- Consulter la section "Problèmes courants" ci-dessous

---

## 📱 Installer l'app sur votre iPhone

### Étape 1 : Installer TestFlight

1. Ouvrir l'App Store sur votre iPhone
2. Rechercher **"TestFlight"**
3. Installer l'app TestFlight (gratuite)

### Étape 2 : S'ajouter comme testeur interne

1. Aller sur https://appstoreconnect.apple.com
2. Se connecter avec votre Apple ID
3. Cliquer sur votre app **"C6Radio"**
4. Onglet **"TestFlight"**
5. Section **"Internal Testing"**
6. Cliquer **"Add Internal Testers"**
7. Ajouter votre Apple ID
8. Sauvegarder

### Étape 3 : Voir l'app dans TestFlight

1. Ouvrir l'app **TestFlight** sur votre iPhone
2. Se connecter avec le même Apple ID
3. L'app **"C6Radio"** devrait apparaître automatiquement
4. Cliquer dessus

### Étape 4 : Installer la version de test

1. Cliquer **"Install"** (ou "Installer")
2. Accepter les conditions
3. L'app s'installe comme une app normale
4. Une fois installée, cliquer **"Open"** (ou "Ouvrir")

### Tester l'app

**Fonctionnalités à tester en priorité :**

✅ **Audio en direct**
- Appuyer sur "Écouter le direct"
- Vérifier que l'audio joue
- Vérifier les métadonnées "Now Playing"

✅ **Audio en arrière-plan**
- Lancer l'audio
- Appuyer sur le bouton Home (revenir à l'écran d'accueil)
- ⚠️ **CRITIQUE** : L'audio doit continuer à jouer !
- Verrouiller l'écran → Audio doit continuer
- Ouvrir une autre app → Audio doit continuer

✅ **Lock Screen (écran verrouillé)**
- Lancer l'audio
- Verrouiller l'iPhone
- Les contrôles doivent apparaître sur l'écran verrouillé
- Pouvoir mettre en pause / reprendre

✅ **Navigation**
- Tester toutes les pages (Accueil, Actualités, À propos, Contact)
- Vérifier que les pages WordPress se chargent
- Tester les podcasts (si articles avec audio)

✅ **Responsive**
- Tourner l'iPhone en mode paysage
- Vérifier que tout s'affiche correctement

---

## 🐛 Problèmes courants et solutions

### Build échoue à l'étape "Build React + Vite"

**Symptôme :**
```
Error: Command failed: npm run build
```

**Causes possibles :**
- Erreur dans votre code React
- Dépendance manquante

**Solution :**
1. Tester le build en local : `npm run build`
2. Corriger les erreurs affichées
3. Recommit et push

---

### Build échoue à l'étape "Build Xcode"

**Symptôme :**
```
xcodebuild: error: Code signing failed
```

**Causes possibles :**
- Certificat invalide ou expiré
- Profil de provisionnement incorrect
- Bundle ID ne correspond pas

**Solutions :**
1. Vérifier que le certificat n'est pas expiré (Apple Developer → Certificates)
2. Vérifier que le profil de provisionnement correspond au certificat
3. Vérifier que `BUNDLE_ID` dans le workflow = Bundle ID dans le profil

---

### Build échoue à l'étape "Upload TestFlight"

**Symptôme :**
```
Error: Unable to upload app
```

**Causes possibles :**
- Clé API invalide
- L'app n'existe pas dans App Store Connect
- Problème réseau Apple (ça arrive !)

**Solutions :**
1. Vérifier que l'app existe bien dans App Store Connect
2. Vérifier que la clé API a les permissions "App Manager"
3. Attendre 5 minutes et relancer (parfois c'est juste Apple qui bug)
4. Le workflow réessaie automatiquement 3 fois, donc patience !

---

### L'app n'apparaît pas dans TestFlight

**Symptôme :**
Le build réussit, mais l'app n'apparaît pas dans TestFlight iPhone.

**Causes possibles :**
- Vous n'êtes pas ajouté comme testeur interne
- Vous utilisez un Apple ID différent
- L'app est en cours de traitement chez Apple

**Solutions :**
1. Vérifier que vous êtes bien dans "Internal Testing" dans App Store Connect
2. Utiliser le même Apple ID partout (Developer account + TestFlight)
3. Attendre 30 minutes (Apple peut mettre du temps)
4. Rafraîchir l'app TestFlight (tirer vers le bas)

---

### L'audio s'arrête quand je verrouille l'écran

**Symptôme :**
L'audio joue bien, mais s'arrête dès que je verrouille l'iPhone.

**Cause :**
iOS coupe l'audio des apps web par défaut pour économiser la batterie.

**Solution :**
Nous devrons ajouter des **plugins Capacitor** spécifiques dans une prochaine itération :
- `@capacitor-community/background-mode`
- Configuration dans `Info.plist` pour "Audio Background Mode"

**Pour l'instant :**
C'est un problème connu et attendu. Nous allons le résoudre dans les prochains commits.

---

## 🔧 Architecture technique

### Fichiers créés/modifiés

#### Configuration Capacitor

**`capacitor.config.json`**
```json
{
  "appId": "fr.c6radio.app",
  "appName": "C6Radio",
  "webDir": "dist",
  "server": {
    "url": "https://c6radio.fr"
  },
  "ios": {
    "contentInset": "always"
  }
}
```

**Explication :**
- `appId` : Identifiant unique de l'app (Bundle ID)
- `appName` : Nom affiché sur l'iPhone
- `webDir` : Dossier où Vite génère les fichiers compilés
- `server.url` : URL du site web (pour le fallback)
- `ios.contentInset` : Active le support des safe areas (notch, home indicator)

---

#### Workflow GitHub Actions

**`.github/workflows/ios-testflight.yml`**

**14 étapes principales :**

1. **Checkout** → Récupère le code
2. **Setup Node.js** → Installe Node.js 20
3. **Install dependencies** → `npm ci`
4. **Build Vite** → `npm run build` (génère `dist/`)
5. **Sync Capacitor** → `npx cap sync ios` (copie vers iOS)
6. **Increment build** → Numéro de version auto
7. **Import certificate** → Certificat de signature
8. **Install profile** → Profil de provisionnement
9. **Export options** → Config pour TestFlight
10. **API key** → Clé App Store Connect
11. **Build archive** → Compile Xcode
12. **Export IPA** → Crée le fichier .ipa
13. **Upload** → Envoie sur TestFlight (avec retry)
14. **Success** → Message de confirmation

---

#### CSS Safe Areas iOS

**Modifications dans `src/index.css` :**
```css
:root {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
  --safe-area-left: env(safe-area-inset-left);
  --safe-area-right: env(safe-area-inset-right);
}
```

**Pourquoi ?**
- iOS a des zones "dangereuses" (notch, home indicator)
- Si on ne fait rien, notre header/footer sont cachés
- `safe-area-inset-*` donne les marges sécurisées
- On les stocke dans des variables CSS pour les réutiliser

**Modifications dans `src/components/Header.css` :**
```css
.site-header {
  padding-top: var(--safe-area-top, 0);
}
```

**Modifications dans `src/components/PlayerBar.css` :**
```css
.player-bar {
  padding-bottom: var(--safe-area-bottom, 0);
}
```

**Résultat :**
- Sur navigateur web → padding = 0 (pas de safe area)
- Sur iPhone avec notch → padding automatique pour éviter le notch
- Sur iPhone avec home indicator → padding automatique en bas

---

#### Scripts NPM ajoutés

**`package.json` :**
```json
{
  "scripts": {
    "build:ios": "vite build && npx cap sync ios",
    "cap:sync": "npx cap sync",
    "cap:open:ios": "npx cap open ios"
  }
}
```

**Explication :**
- `build:ios` : Build Vite + sync iOS (tout en une commande)
- `cap:sync` : Synchronise les changements vers iOS/Android
- `cap:open:ios` : Ouvre Xcode (si vous avez un Mac)

---

### Structure du projet après Phase 7

```
c6radio-web/
├── .github/
│   └── workflows/
│       └── ios-testflight.yml    ← Nouveau ! Workflow automatique
├── ios/                           ← Nouveau ! Projet iOS
│   └── App/
│       ├── App.xcodeproj
│       └── App/
│           └── public/            ← Contenu web synchronisé ici
├── src/                           ← Votre code React (inchangé)
├── dist/                          ← Généré par Vite build
├── capacitor.config.json          ← Nouveau ! Config Capacitor
├── package.json                   ← Scripts Capacitor ajoutés
└── docs/
    └── phase-7-mobile-testflight-GUIDE.md ← Ce fichier !
```

---

## 📊 Checklist de validation Phase 7

### Configuration

- [ ] Capacitor installé (`npm install` réussi)
- [ ] Projet iOS généré (dossier `ios/` existe)
- [ ] Workflow créé (`.github/workflows/ios-testflight.yml`)
- [ ] 8 secrets GitHub configurés

### Build

- [ ] Build local fonctionne : `npm run build`
- [ ] Sync local fonctionne : `npm run build:ios`
- [ ] Workflow GitHub déclenché manuellement
- [ ] Workflow réussit (statut vert)

### TestFlight

- [ ] App créée dans App Store Connect
- [ ] Build apparaît dans TestFlight (App Store Connect)
- [ ] Statut "Ready to Test" (peut prendre 30 min)
- [ ] Testeur interne ajouté

### iPhone

- [ ] TestFlight installé sur iPhone
- [ ] App C6Radio visible dans TestFlight
- [ ] App installée sur iPhone
- [ ] App se lance sans crash

### Tests critiques

- [ ] Audio en direct joue correctement
- [ ] Navigation fonctionne (toutes les pages)
- [ ] Podcasts jouent correctement (si articles avec audio)
- [ ] Métadonnées "Now Playing" s'affichent
- [ ] Design responsive correct (portrait + paysage)
- [ ] Safe areas respectées (pas de contenu caché)

### Tests audio arrière-plan (⚠️ Probablement KO pour l'instant)

- [ ] Audio continue en arrière-plan (écran d'accueil)
- [ ] Audio continue écran verrouillé
- [ ] Contrôles lock screen fonctionnent

**Si ces 3 derniers tests échouent, c'est normal !**  
→ Nous allons les corriger dans une prochaine étape avec des plugins spécifiques.

---

## 🎯 Prochaines étapes

### Phase 7a : Audio en arrière-plan (À venir)

**Problème à résoudre :**
L'audio s'arrête quand on verrouille l'écran ou change d'app.

**Solution :**
1. Installer `@capacitor-community/background-mode`
2. Configurer `Info.plist` pour "Audio Background Mode"
3. Tester sur device réel

### Phase 7b : Icône et Splash Screen

**Actuellement :**
L'app utilise les icônes par défaut Capacitor.

**À faire :**
1. Créer une icône 1024x1024 px
2. Générer toutes les tailles iOS avec un outil
3. Remplacer dans `ios/App/App/Assets.xcassets/`

### Phase 7c : App Store Metadata

**Pour la release finale :**
- Screenshots (requis par Apple)
- Description de l'app
- Mots-clés
- Catégorie
- Informations de confidentialité

---

## 💡 Conseils pour débutants

### Comprendre le workflow

**Analogie simple :**

Imaginez que GitHub Actions est comme une **recette de cuisine** :

```
Recette du "Build iOS"
─────────────────────────
1. Prendre le code source (checkout)
2. Préparer les outils (setup Node.js)
3. Rassembler les ingrédients (install dependencies)
4. Mélanger et cuire (build Vite)
5. Mettre dans un moule iOS (cap sync)
6. Décorer avec un certificat (code signing)
7. Emballer dans une boîte .ipa (export)
8. Livrer chez Apple (upload TestFlight)
```

Chaque étape dépend de la précédente. Si une étape échoue, la recette s'arrête.

### Comprendre les secrets GitHub

**Analogie simple :**

Les secrets GitHub sont comme un **coffre-fort** :

```
🔐 Coffre-fort GitHub Secrets
──────────────────────────────
📜 Certificat iOS       → Clé de votre maison
🔑 Mot de passe         → Code du cadenas
🎫 Clé API              → Carte d'accès Apple
👤 Team ID              → Votre carte d'identité
```

GitHub garde ces secrets en sécurité. Le workflow peut les utiliser, mais **personne ne peut les voir** (même pas vous après les avoir entrés !).

### Comprendre Capacitor

**Analogie simple :**

Capacitor est comme un **adaptateur de prise électrique** :

```
Votre App Web (React)  =  Appareil français (prise EU)
            ↓
        Capacitor      =  Adaptateur universel
            ↓
        iOS / Android  =  Prises US, UK, etc.
```

Votre code React ne change pas. Capacitor "traduit" juste pour que iOS/Android comprennent.

---

## 📚 Ressources utiles

### Documentation officielle

- **Capacitor** : https://capacitorjs.com/docs
- **GitHub Actions** : https://docs.github.com/actions
- **App Store Connect** : https://developer.apple.com/app-store-connect/
- **TestFlight** : https://developer.apple.com/testflight/

### Tutoriels recommandés

- Capacitor Getting Started : https://capacitorjs.com/docs/getting-started
- iOS App Distribution : https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases

### Communauté

- **Discord Ionic** (pour questions Capacitor) : https://ionic.link/discord
- **Forum Capacitor** : https://forum.ionicframework.com/c/capacitor/

---

## 🎉 Conclusion

**Félicitations ! Vous avez configuré la Phase 7 ! 🚀**

**Ce que vous avez maintenant :**
- ✅ Projet Capacitor iOS configuré
- ✅ Workflow GitHub Actions automatique
- ✅ Déploiement TestFlight sans Mac
- ✅ Support des safe areas iOS
- ✅ Build incrémenté automatiquement

**Ce qu'il reste à faire :**
- ⏳ Audio en arrière-plan (Phase 7a)
- ⏳ Icône et splash screen (Phase 7b)
- ⏳ Tests intensifs sur device réel

**Prochaine session :**
Tester l'app sur votre iPhone 13 mini et identifier les bugs !

---

**Document créé le :** 15 février 2026  
**Version :** 1.0  
**Auteur :** GitHub Copilot  
**Status :** ✅ Configuration terminée

**Bon courage pour les tests ! 📱🎉**

