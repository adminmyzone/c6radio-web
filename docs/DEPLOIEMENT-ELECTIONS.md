# Checklist Déploiement - Sections Contextuelles Élections

## 🎯 Objectif

Guide pour déployer la fonctionnalité "Sections Contextuelles" en production de manière sécurisée.

---

## 📋 Prérequis

- [ ] Tous les tests d'intégration passent (voir `TESTS-INTEGRATION-ELECTIONS.md`)
- [ ] Code mergé dans branche `main`
- [ ] Build de production testé localement (`npm run build`)
- [ ] Backup WordPress complet effectué

---

## 🚀 Étapes de déploiement

### Phase 1 : Préparation WordPress (Production)

#### ✅ Étape 1.1 : Vérifier plugin ACF

**Connexion** : WordPress Admin Production

**Vérifications** :
- [ ] Plugin "Advanced Custom Fields" installé
- [ ] Version ACF ≥ 6.0
- [ ] Plugin activé

**Si absent** :
1. WordPress Admin → Extensions → Ajouter
2. Rechercher "Advanced Custom Fields"
3. Installer + Activer

---

#### ✅ Étape 1.2 : Créer champ ACF `context_section`

**Suivre le guide** : `docs/ACF-CONTEXTUAL-SECTIONS.md`

**Résumé rapide** :
1. Custom Fields → Ajouter un groupe
2. Nom groupe : "Sections Contextuelles"
3. Ajouter champ :
   - Label : "Section contextuelle"
   - Nom : `context_section`
   - Type : Select
   - Choix : `elections : Élections` et `evenements : Événements`
   - Autoriser null : Oui
4. Règle affichage : Type de publication = Page
5. Publier

**Vérification** :
- [ ] Éditer une page → Champ "Section contextuelle" visible

---

#### ✅ Étape 1.3 : Créer catégories élections

**Pour chaque commune** :

WordPress Admin → Articles → Catégories → Ajouter

| Champ | Exemple |
|-------|---------|
| Nom | Élection - Beaumont |
| Slug | `election-beaumont` |
| Description | Articles électoraux Beaumont |

**Communes à créer** (adapter selon votre territoire) :
- [ ] election-beaumont
- [ ] election-clermont
- [ ] election-riom
- [ ] ... (autres communes)

⚠️ **IMPORTANT** : Le slug DOIT commencer par `election-` (minuscules, sans accent)

---

#### ✅ Étape 1.4 : Créer pages communes

**Pour chaque commune** :

WordPress Admin → Pages → Ajouter

| Champ | Exemple |
|-------|---------|
| Titre | Beaumont |
| Slug | `beaumont` |
| Section contextuelle (ACF) | **Élections** |
| Show in menu (ACF) | ❌ Décocher |
| Statut | **Publier** |

**Pages à créer** :
- [ ] Beaumont (context: elections)
- [ ] Clermont (context: elections)
- [ ] Riom (context: elections)
- [ ] ... (autres communes)

---

### Phase 2 : Déploiement code React

#### ✅ Étape 2.1 : Build production

**Local** :
```bash
npm run build
```

**Vérifications** :
- [ ] Build réussit sans erreur
- [ ] Dossier `dist/` créé
- [ ] Taille bundle raisonnable (< 5MB)

---

#### ✅ Étape 2.2 : Upload fichiers

**Méthode FTP/SSH** :

1. Sauvegarder ancien `dist/` (renommer en `dist-backup/`)
2. Upload nouveau `dist/` vers serveur
3. Vérifier permissions (644 fichiers, 755 dossiers)

**Méthode Git** (si configuré) :

```bash
git push origin main
# SSH sur serveur
cd /chemin/vers/site
git pull origin main
npm ci --production
npm run build
```

---

#### ✅ Étape 2.3 : Tester en production

**URL à tester** :

- [ ] `https://votre-site.com/` (homepage OK)
- [ ] `https://votre-site.com/news` (NEWS OK, pas d'articles élections)
- [ ] `https://votre-site.com/elections` (page liste communes)
- [ ] `https://votre-site.com/elections/beaumont` (page commune)

**Console navigateur** :
- [ ] Aucune erreur 404 sur assets
- [ ] Aucune erreur JavaScript

---

### Phase 3 : Validation post-déploiement

#### ✅ Étape 3.1 : Tests fonctionnels

**Tests rapides** (5 min) :

- [ ] Menu hamburger élections fonctionne
- [ ] Navigation entre communes fonctionne
- [ ] Recherche dans commune fonctionne
- [ ] Articles électoraux absents de /news
- [ ] Responsive mobile OK

**Si problème** → Voir section "Rollback" plus bas

---

#### ✅ Étape 3.2 : Publier article test

**WordPress Admin** :

1. Articles → Ajouter
2. Titre : "TEST - Article Beaumont"
3. Catégorie : **Élection - Beaumont** uniquement
4. Publier

**Vérifications** :
- [ ] Article visible sur `/elections/beaumont`
- [ ] Article ABSENT de `/news`
- [ ] Recherche trouve l'article

**Nettoyage** :
- [ ] Supprimer article test (ou mettre en brouillon)

---

#### ✅ Étape 3.3 : Formation équipe éditoriale

**Documents à partager** :
- [ ] `docs/GUIDE-EDITORIAL-ELECTIONS.md`
- [ ] `docs/CONTEXTUAL-SECTIONS.md` (référence)

**Mini formation** (15 min) :
1. Montrer comment créer catégorie
2. Montrer comment créer page commune
3. Montrer comment publier article
4. Expliquer l'isolation NEWS

---

## 🔒 Sécurité & Performance

### ✅ Cache

**Si cache serveur actif** :

- [ ] Vider cache WordPress (plugin cache)
- [ ] Vider cache CDN (Cloudflare, etc.)
- [ ] Vider cache navigateur (Ctrl+Shift+R)

### ✅ SEO

**Vérifier robots.txt** :
- [ ] `/elections` non bloqué
- [ ] `/elections/*` non bloqué

**Sitemap** (si généré automatiquement) :
- [ ] Pages élections incluses dans sitemap
- [ ] Soumettre nouveau sitemap à Google Search Console

---

## 🐛 Rollback Plan

### Si problème critique en production

#### Option 1 : Rollback code React

**Actions** :
1. SSH sur serveur
2. `rm -rf dist/`
3. `mv dist-backup/ dist/`
4. Vérifier que site fonctionne

**Durée** : ~2 minutes

---

#### Option 2 : Désactiver temporairement

**Masquer lien menu** :

`src/components/Header.jsx` :
```javascript
// Commenter temporairement
/*
<li>
  <NavLink to="/elections" ...>
    Élections
  </NavLink>
</li>
*/
```

Rebuild + redéployer

**Durée** : ~10 minutes

---

#### Option 3 : Rollback WordPress

**Si problème ACF** :

1. WordPress Admin → Custom Fields
2. Mettre groupe "Sections Contextuelles" en brouillon
3. Les pages/articles restent intacts

**Durée** : ~1 minute

---

## 📊 Monitoring post-déploiement

### Jour 1-3 après déploiement

**Vérifier quotidiennement** :

- [ ] Erreurs JavaScript (Google Analytics / Console navigateur)
- [ ] Erreurs 404 (logs serveur)
- [ ] Temps chargement pages (Google PageSpeed)
- [ ] Feedback équipe éditoriale

### Métriques à surveiller

| Métrique | Avant | Après | Acceptable ? |
|----------|-------|-------|--------------|
| Temps chargement /elections | N/A | ___ s | < 2s ✅ |
| Temps chargement /news | ___ s | ___ s | Pas +20% ✅ |
| Taille bundle JS | ___ KB | ___ KB | < +200KB ✅ |
| Erreurs 404 | ___ /jour | ___ /jour | Pas +50% ✅ |

---

## ✅ Checklist finale

### Avant de marquer "Déployé"

- [ ] ACF configuré en production
- [ ] Au moins 3 catégories élections créées
- [ ] Au moins 3 pages communes créées
- [ ] Code React déployé
- [ ] Tests fonctionnels passent
- [ ] Article test publié + vérifié
- [ ] Équipe éditoriale formée
- [ ] Cache vidé
- [ ] Documentation partagée
- [ ] Monitoring activé

---

## 📞 Support

### En cas de problème

**Problème technique** :
- Consulter `docs/TESTS-INTEGRATION-ELECTIONS.md`
- Vérifier logs serveur
- Vérifier console navigateur

**Problème éditorial** :
- Consulter `docs/GUIDE-EDITORIAL-ELECTIONS.md`
- Vérifier slugs catégories (préfixe `election-`)
- Vérifier champ ACF rempli

**Urgence** :
- Rollback code (voir section Rollback)
- Contacter développeur principal

---

## 📝 Notes de version

### Version 1.0 (Février 2026)

**Fonctionnalités déployées** :
- ✅ Sections contextuelles (élections, événements)
- ✅ Menu hamburger navigation communes
- ✅ Isolation articles NEWS
- ✅ Recherche par commune
- ✅ Thématisation couleurs par contexte

**Limitations connues** :
- Pas de cache localStorage pour pages contextuelles (volontaire)
- Pas de pagination articles (max 20 par commune)
- Pas d'export articles (ajout futur si besoin)

**Évolutions prévues** (Phase 2) :
- Support contexte "Quartiers"
- Support contexte "Sports"
- Statistiques par commune (vues, partages)

---

**Dernière mise à jour** : 19 février 2026  
**Version** : 1.0  
**Responsable déploiement** : _________________  
**Date déploiement** : _________________  
**Statut** : ⬜ Planifié | ⬜ En cours | ⬜ Déployé | ⬜ Rollback
