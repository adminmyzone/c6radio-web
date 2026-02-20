# 🎉 SOLUTION SIMPLE - IPA Non Signé avec Sideloadly

**Date** : 15 février 2026  
**Approche** : Build IPA non signé + Sideload manuel  
**Avantages** : Simple, rapide, pas besoin de config Apple Developer

---

## 🎯 POURQUOI CETTE APPROCHE ?

### Problèmes avec TestFlight
- ❌ Configuration complexe (App ID, Profils, Certificats, Secrets)
- ❌ Nombreuses erreurs de signature
- ❌ Prise de tête avec Apple Developer Portal

### Avantages de l'IPA non signé
- ✅ **SIMPLE** : Pas de configuration Apple Developer nécessaire
- ✅ **RAPIDE** : Build en 10 minutes
- ✅ **FONCTIONNEL** : Tu testes sur ton iPhone réel
- ✅ **ITÉRATIF** : Nouveau build à chaque push

---

## 📋 COMMENT ÇA MARCHE

### 1. Workflow GitHub Actions

À chaque `git push` :
1. ✅ Build React + Vite
2. ✅ Sync Capacitor iOS
3. ✅ Build Xcode **sans signature**
4. ✅ Génère l'IPA
5. ✅ Upload comme artifact sur GitHub

### 2. Tu télécharges l'IPA

Sur GitHub Actions :
1. Clique sur le workflow terminé
2. Descends à la section "Artifacts"
3. Télécharge : `C6Radio-unsigned-XXX.zip`
4. Dézippe → Tu obtiens `C6Radio-unsigned.ipa`

### 3. Tu installes avec Sideloadly

Sur ton PC :
1. Ouvre Sideloadly
2. Connecte iPhone en USB
3. Glisse-dépose l'IPA
4. Entre ton Apple ID gratuit
5. Installe !

---

## 🚀 MISE EN PLACE (5 minutes)

### Étape 1 : Désactiver l'ancien workflow

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Renommer l'ancien workflow pour le désactiver
mv .github/workflows/ios-testflight.yml .github/workflows/ios-testflight.yml.disabled
```

### Étape 2 : Commit le nouveau workflow

```bash
git add .github/workflows/ios-build-unsigned.yml
git add .github/workflows/ios-testflight.yml.disabled
git commit -m "feat: workflow IPA non signé pour sideload"
git push origin main
```

### Étape 3 : Surveiller le build

Ouvre : https://github.com/TON_USERNAME/c6radio-web/actions

Le workflow devrait :
- ✅ Build en ~10 minutes
- ✅ Créer un artifact téléchargeable

---

## 📱 INSTALLATION SUR IPHONE

### Option A : Avec Sideloadly (Recommandé)

**1. Télécharge Sideloadly**
- Windows : https://sideloadly.io
- Linux : Utilise une VM Windows ou Wine

**2. Télécharge l'IPA depuis GitHub**
- GitHub Actions → Workflow terminé → Artifacts
- Télécharge `C6Radio-unsigned-XXX.zip`
- Dézippe → `C6Radio-unsigned.ipa`

**3. Installe sur iPhone**
```
1. Ouvre Sideloadly
2. Connecte iPhone en USB
3. Glisse l'IPA dans Sideloadly
4. Entre ton Apple ID (gratuit OK)
5. Entre le mot de passe
6. Si 2FA : entre le code
7. Clique "Start"
8. Attends 2-3 minutes
9. Sur iPhone : Réglages → Général → VPN et gestion de l'appareil
10. Fais confiance à ton Apple ID
11. Lance C6Radio !
```

### Option B : Avec AltStore

**1. Installe AltStore**
- Sur PC : https://altstore.io
- Sur iPhone : Via AltServer

**2. Installe l'IPA**
```
1. AltStore sur iPhone → My Apps → +
2. Sélectionne C6Radio-unsigned.ipa
3. Installe !
```

### Option C : Avec Xcode (si tu as un Mac)

```bash
# Sur Mac avec Xcode
open -a Simulator
xcrun simctl install booted C6Radio-unsigned.ipa
```

---

## ⏱️ DURÉE DE VALIDITÉ

### Avec Apple ID gratuit
- ✅ **7 jours** de validité
- Après 7 jours : Réinstalle une nouvelle version
- Solutions :
  - Réinstalle chaque semaine
  - OU utilise un compte Apple Developer (99€/an → 1 an de validité)

### Avec Apple Developer (payant)
- ✅ **1 an** de validité
- Pas besoin de réinstaller pendant 1 an

---

## 🔄 WORKFLOW DE DÉVELOPPEMENT

### Cycle quotidien

```bash
# 1. Tu codes
vim src/components/MonComposant.jsx

# 2. Tu commit et push
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 3. Workflow build automatique (10 min)

# 4. Tu télécharges le nouvel IPA depuis GitHub Actions

# 5. Tu réinstalles sur iPhone avec Sideloadly (2-3 min)

# 6. Tu testes !
```

**Total : 15 minutes du push au test sur iPhone !** ⚡

---

## ✅ AVANTAGES DE CETTE MÉTHODE

### Pour le développement

✅ **Pas de config Apple Developer** (0 secrets, 0 profils, 0 certificats)  
✅ **Build rapide** (10 min vs 10-15 min + traitement Apple)  
✅ **Tests immédiats** (dès que le build est prêt)  
✅ **Itération rapide** (nouveau build à chaque push)  
✅ **Pas de quota** (contrairement à TestFlight qui limite les builds)

### Pour le test

✅ **Device réel** (ton iPhone 13 mini)  
✅ **Conditions réelles** (réseau, capteurs, performances)  
✅ **Audio en conditions réelles** (lockscreen, background)  
✅ **Pas de simulateur** (test sur vraie architecture ARM)

---

## ⚠️ LIMITATIONS

### Ce que cette méthode NE fait PAS

❌ Distribution publique (pas sur App Store)  
❌ Beta testing avec plusieurs personnes (que toi)  
❌ Validité longue durée (7 jours sans compte dev)  
❌ Push notifications (nécessite certificat Apple)

### Mais c'est parfait pour

✅ **Développement** actif  
✅ **Tests** sur device réel  
✅ **Démos** rapides  
✅ **Prototypage** et validation

---

## 📊 COMPARAISON

| Critère | TestFlight | IPA Non Signé |
|---------|-----------|---------------|
| **Setup** | ❌ Complexe (1-2h) | ✅ Simple (5 min) |
| **Config Apple** | ❌ Obligatoire | ✅ Pas besoin |
| **Secrets GitHub** | ❌ 7 secrets | ✅ 0 secret |
| **Build time** | 🟡 10-15 min | ✅ 10 min |
| **Traitement** | ❌ +15-30 min Apple | ✅ Immédiat |
| **Installation** | ✅ Automatique | 🟡 Manuel (3 min) |
| **Validité** | ✅ Illimitée | ⚠️ 7 jours |
| **Distribution** | ✅ Plusieurs users | ❌ Toi uniquement |
| **Pour dev** | 🟡 OK | ✅ Parfait |
| **Pour prod** | ✅ Obligatoire | ❌ Impossible |

---

## 🎯 QUAND UTILISER QUELLE MÉTHODE

### Utilise l'IPA non signé (maintenant) 👈

- ✅ Phase de développement actif
- ✅ Tests rapides et itératifs
- ✅ Tu es le seul testeur
- ✅ Tu veux éviter la complexité Apple

### Passe à TestFlight (plus tard)

- 📅 Quand l'app est stable
- 📅 Quand tu veux distribuer à d'autres testeurs
- 📅 Avant la soumission App Store
- 📅 Pour la prod finale

---

## 🔧 DÉPANNAGE

### Le workflow échoue au build Xcode

**Erreur possible** : Signature toujours requise

**Solution** :
```bash
# Vérifier que project.pbxproj permet le build sans signature
grep "CODE_SIGNING_REQUIRED" ios/App/App.xcodeproj/project.pbxproj
# Doit retourner vide ou "NO"
```

### Sideloadly refuse l'IPA

**Erreur possible** : IPA corrompu

**Solution** :
1. Re-télécharge l'IPA depuis GitHub
2. Vérifie que tu as bien dézippé le fichier
3. Vérifie que l'extension est bien `.ipa`

### iPhone refuse l'installation

**Erreur possible** : Pas de confiance au profil

**Solution** :
```
iPhone → Réglages → Général → VPN et gestion de l'appareil
→ Sélectionne ton Apple ID → Faire confiance
```

### L'app crash au lancement

**Erreur possible** : Build Debug en mode Release

**Solution** : C'est normal, l'app est en Debug. Pour les perfs finales, on repassera à Release + TestFlight.

---

## 📚 RESSOURCES

### Outils de sideload

- **Sideloadly** : https://sideloadly.io (Recommandé)
- **AltStore** : https://altstore.io
- **iOS App Signer** : https://dantheman827.github.io/ios-app-signer/

### Documentation

- **Workflow créé** : `.github/workflows/ios-build-unsigned.yml`
- **Ce guide** : `docs/phase-7-SOLUTION-SIMPLE-IPA.md`

---

## 🎉 PROCHAINES ACTIONS

### 1. Désactive l'ancien workflow

```bash
mv .github/workflows/ios-testflight.yml .github/workflows/ios-testflight.yml.disabled
```

### 2. Commit et push

```bash
git add .
git commit -m "feat: workflow IPA non signé pour sideload"
git push origin main
```

### 3. Attends le build (10 min)

Surveille sur : https://github.com/TON_USERNAME/c6radio-web/actions

### 4. Télécharge l'IPA

GitHub Actions → Artifacts → Télécharge

### 5. Installe avec Sideloadly

PC → Sideloadly → Glisse l'IPA → Installe

### 6. Teste sur iPhone !

Lance C6Radio et profite ! 🎉

---

## 💡 CONSEIL

Cette méthode est **parfaite pour maintenant** :
- ✅ Simple
- ✅ Rapide
- ✅ Fonctionnelle

Quand ton app sera stable et prête pour plus de testeurs ou pour la prod, on pourra revenir sur TestFlight. Mais pour l'instant, concentre-toi sur le développement et les tests !

---

**👉 PROCHAINE ACTION : Désactive l'ancien workflow et push le nouveau**

**LET'S GO ! 🚀**

