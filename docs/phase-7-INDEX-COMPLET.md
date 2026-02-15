# 📚 INDEX - Phase 7 : Déploiement iOS TestFlight

**Date** : 15 février 2026  
**Projet** : C6Radio Web  
**Bundle ID** : `fr.c6debug.app`

---

## 🎯 PAR OÙ COMMENCER ?

### 🆕 Si tu pars de ZÉRO (aucune config faite)

**📖 COMMENCE ICI** : [`phase-7-DE-ZERO-A-TESTFLIGHT.md`](./phase-7-DE-ZERO-A-TESTFLIGHT.md)

**Contenu** :
- Guide complet étape par étape
- Configuration de A à Z
- Commandes Linux à copier/coller
- Explications pour débutants
- Durée : 45-60 minutes

**Tu vas créer** :
1. App ID sur Apple Developer
2. Certificat de distribution
3. Profil de provisionnement
4. App sur App Store Connect
5. Clé API
6. 7 secrets GitHub
7. Premier déploiement automatique

---

### ✅ Si tu veux une CHECKLIST rapide

**📖 UTILISE** : [`phase-7-CHECKLIST-RAPIDE.md`](./phase-7-CHECKLIST-RAPIDE.md)

**Contenu** :
- Checklists pour tout vérifier
- Format "case à cocher"
- Vérifications Apple Developer
- Vérifications GitHub
- Tests sur iPhone
- Dépannage rapide

**Utilise-le pour** :
- Vérifier que rien ne manque
- Valider chaque étape
- Diagnostiquer des problèmes

---

### 🔴 Si le workflow est en ERREUR

**📖 CONSULTE** : [`phase-7-AIDE-MEMOIRE-RAPIDE.md`](./phase-7-AIDE-MEMOIRE-RAPIDE.md)

**Contenu** :
- Erreurs courantes et solutions
- Commandes de diagnostic
- Fixes rapides
- Logs à vérifier

**Erreurs couvertes** :
- "No profiles found"
- "No signing certificate found"
- "Authentication credentials invalid"
- "Bundle identifier mismatch"
- "Cloud signing permission error"

---

### 📊 Si tu veux une VUE D'ENSEMBLE

**📖 LIS** : [`phase-7-SYNTHESE-COMPLETE.md`](./phase-7-SYNTHESE-COMPLETE.md)

**Contenu** :
- Résumé du problème actuel
- Vue d'ensemble du workflow
- Points critiques
- Procédure de test
- Statistiques du projet

**Utilise-le pour** :
- Comprendre comment tout fonctionne
- Voir la big picture
- Connaître les points d'attention

---

## 📂 TOUS LES DOCUMENTS DISPONIBLES

### 🟢 Guides principaux (COMMENCEZ ICI)

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **phase-7-DE-ZERO-A-TESTFLIGHT.md** | Guide complet étape par étape | Configuration initiale |
| **phase-7-CHECKLIST-RAPIDE.md** | Checklists de vérification | Validation et diagnostic |
| **phase-7-SYNTHESE-COMPLETE.md** | Vue d'ensemble et résumé | Comprendre le workflow |

### 🟡 Guides de dépannage

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **phase-7-AIDE-MEMOIRE-RAPIDE.md** | Solutions aux erreurs courantes | Workflow en erreur |
| **phase-7-DIAGNOSTIC-COMPLET.md** | Analyse détaillée des problèmes | Problème complexe |

### 🔵 Guides techniques détaillés

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **phase-7-GUIDE-ETAPE-PAR-ETAPE.md** | Instructions avec screenshots simulés | Besoin de détails visuels |
| **phase-7-GUIDE-VISUEL.md** | Schémas et diagrammes | Comprendre visuellement |
| **phase-7-FLOWCHART.md** | Organigrammes de décision | Suivre un processus |

### 🟣 Guides spécialisés

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **phase-7-CONVERT-CER-TO-P12-SANS-MAC.md** | Convertir certificat sans Mac | Conversion de certificat |
| **phase-7-secrets-github-QUICK.md** | Configuration secrets GitHub | Setup secrets rapide |
| **phase-7-FIX-*.md** | Fixes spécifiques | Erreurs particulières |

### 📝 Documentation générale

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **phase-7-mobile-testflight-GUIDE.md** | Guide TestFlight complet | Comprendre TestFlight |
| **phase-7-mobile-testflight-RESUME.md** | Résumé TestFlight | Vue rapide TestFlight |
| **PHASE7-README.md** | README général Phase 7 | Vue d'ensemble phase |

---

## 🎬 SCÉNARIOS D'UTILISATION

### Scénario 1 : Je pars de zéro

```
1. Lis : phase-7-DE-ZERO-A-TESTFLIGHT.md
2. Suis les étapes 1 à 11
3. Utilise : phase-7-CHECKLIST-RAPIDE.md pour valider
4. Teste sur iPhone
```

**Durée** : 1-2 heures

---

### Scénario 2 : J'ai déjà fait une partie de la config

```
1. Ouvre : phase-7-CHECKLIST-RAPIDE.md
2. Coche ce que tu as déjà fait
3. Identifie ce qui manque
4. Retourne au guide complet pour les étapes manquantes
```

**Durée** : 15-45 minutes

---

### Scénario 3 : Le workflow est en erreur

```
1. Va sur GitHub Actions → Clique sur le workflow en erreur
2. Note l'étape en rouge et le message d'erreur
3. Ouvre : phase-7-AIDE-MEMOIRE-RAPIDE.md
4. Cherche ton erreur dans la liste
5. Applique la solution
6. Re-push pour relancer
```

**Durée** : 5-30 minutes selon l'erreur

---

### Scénario 4 : Je veux comprendre comment ça marche

```
1. Lis : phase-7-SYNTHESE-COMPLETE.md (vue d'ensemble)
2. Lis : phase-7-GUIDE-VISUEL.md (schémas)
3. Lis : phase-7-FLOWCHART.md (processus)
4. Expérimente avec le workflow
```

**Durée** : 30-60 minutes

---

### Scénario 5 : Le build fonctionne, je veux tester

```
1. Attends que GitHub Actions soit vert ✅
2. Va sur App Store Connect → TestFlight
3. Attends 15-30 min que le build soit "Ready to Test"
4. Utilise : phase-7-CHECKLIST-RAPIDE.md (section tests iPhone)
5. Installe et teste
```

**Durée** : 1 heure (surtout de l'attente)

---

## 🔧 FICHIERS TECHNIQUES

### Workflow GitHub Actions

**Fichier** : `.github/workflows/ios-testflight.yml`

**Description** :
- Workflow automatique de build et déploiement
- Se déclenche à chaque push sur `main`
- 14 étapes de build à upload
- Durée : 10-15 minutes

**Étapes principales** :
1. Checkout du code
2. Build React + Vite
3. Sync Capacitor
4. Sign avec certificat
5. Build Xcode
6. Export IPA
7. Upload TestFlight

---

### Configuration Capacitor

**Fichier** : `capacitor.config.json`

**Points clés** :
```json
{
  "appId": "fr.c6debug.app",  ← DOIT correspondre à App ID Apple
  "appName": "C6Radio",
  "webDir": "dist"
}
```

---

### Projet Xcode

**Dossier** : `ios/App/`

**Fichiers importants** :
- `App.xcodeproj/project.pbxproj` (config projet)
- `App/Info.plist` (métadonnées app)

**Point clé** :
- `PRODUCT_BUNDLE_IDENTIFIER` doit être `fr.c6debug.app`

---

## 🔐 SECRETS GITHUB

### Les 7 secrets nécessaires

| Secret | Description | Format | Source |
|--------|-------------|--------|--------|
| `IOS_P12_BASE64` | Certificat de signature | Base64 | Apple Developer |
| `IOS_P12_PASSWORD` | Mot de passe du certificat | Texte | Toi (choisi à la création) |
| `IOS_MOBILEPROVISION_BASE64` | Profil de provisionnement | Base64 | Apple Developer |
| `APPLE_TEAM_ID` | Team ID Apple | 10 car. | Apple Developer |
| `ASC_API_KEY_ID` | Key ID de la clé API | ~10 car. | App Store Connect |
| `ASC_API_ISSUER_ID` | Issuer ID | UUID | App Store Connect |
| `ASC_API_PRIVATE_KEY_BASE64` | Clé API privée | Base64 | App Store Connect |

**Configuration** :  
GitHub → Settings → Secrets and variables → Actions

---

## 🌍 RESSOURCES EXTERNES

### Portails Apple

- **Apple Developer** : https://developer.apple.com/account
  - Certificats, identifiers, profiles
  - Team ID
  
- **App Store Connect** : https://appstoreconnect.apple.com
  - Apps, builds, TestFlight
  - Clés API

### GitHub

- **Actions** : `https://github.com/TON_USERNAME/c6radio-web/actions`
  - Workflows, logs
  
- **Settings** : `https://github.com/TON_USERNAME/c6radio-web/settings`
  - Secrets, variables

### Documentation officielle

- **Capacitor iOS** : https://capacitorjs.com/docs/ios
- **TestFlight** : https://developer.apple.com/testflight/
- **Xcodebuild** : https://developer.apple.com/documentation/xcode

---

## 🎯 OBJECTIFS DE LA PHASE 7

### Phase 7a : Déploiement automatique ✅ (en cours)

- [x] Workflow GitHub Actions créé
- [x] Documentation complète
- [ ] Configuration Apple Developer complète
- [ ] 7 secrets GitHub configurés
- [ ] Premier build réussi
- [ ] App sur TestFlight
- [ ] Tests sur iPhone

**Statut** : Configuration en cours

---

### Phase 7b : Audio en arrière-plan (si nécessaire)

- [ ] Test audio lockscreen
- [ ] Si bloqué → Configuration background modes
- [ ] Plugins Capacitor audio
- [ ] Tests approfondis

**Statut** : À faire après Phase 7a

---

## 📊 MÉTRIQUES

### Temps estimés

| Tâche | Durée |
|-------|-------|
| Setup initial complet | 45-60 min |
| Correction d'une erreur | 5-30 min |
| Build automatique | 10-15 min |
| Traitement Apple | 15-30 min |
| Tests sur iPhone | 30-60 min |

### Fréquence

| Action | Fréquence |
|--------|-----------|
| Setup initial | **1 fois** (puis jamais) |
| Push → Build auto | **À chaque push** |
| Tests iPhone | **Après chaque build** |
| Renouveler certificat | **1 fois/an** |
| Renouveler profil | **1 fois/an** |

---

## ✅ VALIDATION COMPLÈTE

### Pour considérer la Phase 7 comme terminée :

#### Configuration ✅

- [ ] Tous les éléments créés sur Apple Developer
- [ ] Tous les éléments créés sur App Store Connect
- [ ] Tous les secrets configurés sur GitHub
- [ ] Bundle ID cohérent partout

#### Build ✅

- [ ] Workflow GitHub Actions passe au vert
- [ ] Build arrive sur TestFlight
- [ ] Build status : "Ready to Test"

#### Tests ✅

- [ ] App installable via TestFlight
- [ ] App se lance sans crash
- [ ] Navigation fonctionne
- [ ] Audio fonctionne
- [ ] Podcasts fonctionnent

#### Audio avancé ⚠️

- [ ] Audio continue en arrière-plan (peut nécessiter Phase 7b)
- [ ] Contrôles lockscreen fonctionnent

---

## 🚀 PROCHAINES ÉTAPES

### Après Phase 7 :

1. **Phase 8** : Build production (App Store)
2. **Phase 9** : Beta testing avec vrais utilisateurs
3. **Phase 10** : Soumission App Store
4. **Phase 11** : Publication publique

### Améliorations futures :

- [ ] Workflow pour branches de feature
- [ ] Tests automatisés avant build
- [ ] Notifications Slack/Discord
- [ ] Changelog automatique
- [ ] Screenshots automatiques

---

## 💡 CONSEILS GÉNÉRAUX

### Pour réussir :

1. **Lis les guides dans l'ordre** (ne saute pas d'étapes)
2. **Coche les checklists** (pour ne rien oublier)
3. **Sauvegarde les fichiers** (backup `~/apple-certificates/`)
4. **Note les mots de passe** (gestionnaire de mots de passe)
5. **Lis les erreurs** (les logs sont explicites)

### En cas de problème :

1. **Reste calme** (c'est normal d'avoir des erreurs)
2. **Lis les logs** (GitHub Actions)
3. **Consulte les guides** (solutions déjà documentées)
4. **Vérifie les checklists** (peut-être qu'il manque quelque chose)
5. **Teste étape par étape** (isole le problème)

---

## 📞 AIDE RAPIDE

### J'ai une erreur, que faire ?

```
1. Va sur GitHub Actions
2. Clique sur le workflow en erreur
3. Clique sur l'étape rouge
4. Copie le message d'erreur
5. Cherche dans phase-7-AIDE-MEMOIRE-RAPIDE.md
6. Applique la solution
```

### Je ne sais pas par où commencer

```
1. Lis ce fichier INDEX (tu es déjà dessus !)
2. Identifie ton scénario (ci-dessus)
3. Ouvre le guide recommandé
4. Suis les étapes
```

### Je veux comprendre avant de faire

```
1. Lis : phase-7-SYNTHESE-COMPLETE.md
2. Lis : phase-7-GUIDE-VISUEL.md
3. Lis : phase-7-DE-ZERO-A-TESTFLIGHT.md
4. Commence la config
```

---

## 🎊 CONCLUSION

Tu as maintenant **TOUT** ce qu'il faut pour déployer ton app sur TestFlight :

✅ **Guide complet** étape par étape  
✅ **Checklists** pour valider  
✅ **Dépannage** pour résoudre les erreurs  
✅ **Schémas** pour comprendre  
✅ **Workflow** prêt à l'emploi

**Il ne te reste plus qu'à suivre le guide !** 🚀

---

**👉 COMMENCE ICI** : [`phase-7-DE-ZERO-A-TESTFLIGHT.md`](./phase-7-DE-ZERO-A-TESTFLIGHT.md)

Bon courage ! 💪

