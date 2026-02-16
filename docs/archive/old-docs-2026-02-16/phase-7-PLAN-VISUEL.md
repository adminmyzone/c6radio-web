# 🎯 Phase 7 - iOS TestFlight : PLAN D'ACTION VISUEL

**Bundle ID** : `fr.c6debug.app`  
**Objectif** : App sur iPhone via TestFlight automatiquement

---

## 📍 TU ES ICI

```
✅ Phase 5 Podcasts TERMINÉE
         ↓
    [TU ES ICI]
         ↓
   🚀 Phase 7 Mobile
         ↓
   Nouveau départ propre
```

---

## 🗺️ LA ROUTE À SUIVRE

```
┌─────────────────────────────────────────────────────────┐
│                  PHASE 7 - WORKFLOW                     │
└─────────────────────────────────────────────────────────┘

1️⃣  LIS LA DOC (10 min)
    └─→ docs/phase-7-START-HERE.md
    └─→ docs/phase-7-DE-ZERO-A-TESTFLIGHT.md

2️⃣  LANCE LE SCRIPT (5 min)
    └─→ ./setup-ios-helper.sh
    └─→ Option 1 : Setup initial

3️⃣  APPLE DEVELOPER (20 min)
    └─→ Crée App ID : fr.c6debug.app
    └─→ Crée Certificat : Apple Distribution
    └─→ Crée Profil : App Store Connect

4️⃣  APP STORE CONNECT (10 min)
    └─→ Crée App : C6Radio Debug
    └─→ Crée Clé API : Rôle "App Manager"

5️⃣  GITHUB SECRETS (10 min)
    └─→ Configure 7 secrets
    └─→ Vérifie avec la checklist

6️⃣  PREMIER BUILD (10-15 min)
    └─→ git push origin main
    └─→ Surveille GitHub Actions

7️⃣  TESTFLIGHT (15-30 min)
    └─→ Attends traitement Apple
    └─→ Build "Ready to Test"

8️⃣  IPHONE (30 min)
    └─→ Installe TestFlight
    └─→ Teste l'app !

┌─────────────────────────────────────────────────────────┐
│              TOTAL : 1-2 heures                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 CHECKLIST EXPRESS

### Avant de commencer

- [ ] Compte Apple Developer actif (99€/an)
- [ ] Accès developer.apple.com
- [ ] Accès appstoreconnect.apple.com
- [ ] Accès GitHub (Admin)
- [ ] iPhone 13 mini disponible
- [ ] 1-2 heures de disponibilité

### Configuration Apple (30 min)

- [ ] App ID : fr.c6debug.app
- [ ] Certificat : Apple Distribution
- [ ] Profil : App Store Connect
- [ ] App : C6Radio Debug
- [ ] Clé API : App Manager

### Configuration GitHub (10 min)

- [ ] IOS_P12_BASE64
- [ ] IOS_P12_PASSWORD
- [ ] IOS_MOBILEPROVISION_BASE64
- [ ] APPLE_TEAM_ID
- [ ] ASC_API_KEY_ID
- [ ] ASC_API_ISSUER_ID
- [ ] ASC_API_PRIVATE_KEY_BASE64

### Tests (1 heure)

- [ ] Workflow GitHub Actions ✅
- [ ] Build sur TestFlight
- [ ] App sur iPhone
- [ ] Tests fonctionnels

---

## 🔧 OUTILS DISPONIBLES

### 📖 Guides

```
docs/
├── phase-7-START-HERE.md              ← COMMENCE ICI (2 min)
├── phase-7-DE-ZERO-A-TESTFLIGHT.md    ← GUIDE PRINCIPAL (45 min)
├── phase-7-CHECKLIST-RAPIDE.md        ← VALIDATION (tout au long)
├── phase-7-INDEX-COMPLET.md           ← NAVIGATION (vue d'ensemble)
└── phase-7-AIDE-MEMOIRE-RAPIDE.md     ← DÉPANNAGE (si erreur)
```

### 🛠️ Script

```bash
./setup-ios-helper.sh
```

Menu interactif pour :
- Générer clés et certificats
- Encoder en base64
- Vérifier le Bundle ID
- Lister les fichiers

---

## 🎯 OBJECTIF FINAL

```
┌──────────────────────────────────────────────┐
│                                              │
│   git push origin main                       │
│                                              │
│         ↓  (automatique)                     │
│                                              │
│   GitHub Actions Build (10-15 min)           │
│                                              │
│         ↓  (automatique)                     │
│                                              │
│   TestFlight Processing (15-30 min)          │
│                                              │
│         ↓  (automatique)                     │
│                                              │
│   📱 App sur iPhone ! 🎉                     │
│                                              │
└──────────────────────────────────────────────┘

✨ TOUT EST AUTOMATISÉ ✨
```

---

## 🚨 EN CAS DE PROBLÈME

### Workflow en erreur ?

```
1. Va sur GitHub Actions
2. Clique sur le workflow rouge
3. Note le message d'erreur
4. Consulte : phase-7-AIDE-MEMOIRE-RAPIDE.md
5. Applique la solution
6. Re-push
```

### Pas sûr d'avoir tout ?

```
1. Ouvre : phase-7-CHECKLIST-RAPIDE.md
2. Coche ce qui est fait
3. Identifie ce qui manque
4. Retourne au guide pour cette étape
```

### Besoin d'aide générale ?

```
1. Lis : phase-7-INDEX-COMPLET.md
2. Identifie ton scénario
3. Ouvre le guide recommandé
```

---

## 💡 CONSEIL PRO

### ⚡ Pour aller vite

1. Lis le guide en diagonal d'abord (10 min)
2. Lance le script helper
3. Suis les étapes dans l'ordre
4. Coche la checklist au fur et à mesure

### 🎯 Pour ne pas se tromper

1. Ne saute AUCUNE étape
2. Copie/colle les commandes Linux
3. Vérifie chaque élément avec la checklist
4. Note tous les mots de passe

### 🔥 Pour dépanner rapidement

1. Lis toujours l'erreur complète
2. Cherche dans l'aide-mémoire
3. Vérifie la checklist
4. Recommence l'étape si besoin

---

## 📊 MÉTRIQUES

| Étape | Durée |
|-------|-------|
| Lecture docs | 10 min |
| Config Apple | 30 min |
| Config GitHub | 10 min |
| Premier build | 10-15 min |
| Traitement Apple | 15-30 min |
| Tests iPhone | 30 min |
| **TOTAL** | **1-2 heures** |

---

## 🎉 RÉSULTAT

Après ces 1-2 heures :

✅ Workflow fonctionnel  
✅ Build automatique  
✅ App sur TestFlight  
✅ App sur iPhone  
✅ Tests validés

**Et après, ZÉRO EFFORT : chaque `git push` = nouveau build ! 🚀**

---

## 🚀 DÉMARRER MAINTENANT

```bash
# 1. Lis le point d'entrée
cat docs/phase-7-START-HERE.md

# 2. Lis le guide principal
cat docs/phase-7-DE-ZERO-A-TESTFLIGHT.md

# 3. Lance le script
./setup-ios-helper.sh

# 4. Suis le guide étape par étape

# 5. Utilise la checklist pour valider
cat docs/phase-7-CHECKLIST-RAPIDE.md
```

---

**👉 COMMENCE PAR** : `docs/phase-7-START-HERE.md`

**LET'S GO ! 💪🚀**

