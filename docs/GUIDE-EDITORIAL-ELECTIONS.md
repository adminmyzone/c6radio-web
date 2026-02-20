# Guide Éditorial - Sections Contextuelles Élections

## 🎯 Pour qui ?

Ce guide est destiné à **l'équipe éditoriale** de C6Radio qui publie du contenu dans WordPress.  
Pas besoin de connaissances techniques ! Suivez simplement les étapes.

---

## 📚 Table des matières

1. [Configuration initiale (une seule fois)](#1-configuration-initiale)
2. [Ajouter une nouvelle commune](#2-ajouter-une-nouvelle-commune)
3. [Publier un article électoral](#3-publier-un-article-électoral)
4. [Vérifier que tout fonctionne](#4-vérifier-que-tout-fonctionne)
5. [FAQ - Questions fréquentes](#5-faq)

---

## 1️⃣ Configuration initiale

> ⚠️ **À faire UNE SEULE FOIS** par un administrateur WordPress

### Étape 1.1 : Vérifier le champ ACF

1. Connectez-vous à WordPress Admin
2. Allez dans **Custom Fields** (menu latéral)
3. Vérifiez qu'un groupe "**Sections Contextuelles**" existe
4. Si absent, suivez le guide `docs/ACF-CONTEXTUAL-SECTIONS.md`

✅ **Vous devez voir** : Un champ "Section contextuelle" avec options "Élections" et "Événements"

---

## 2️⃣ Ajouter une nouvelle commune

### Étape 2.1 : Créer la catégorie

**WordPress Admin → Articles → Catégories → Ajouter**

Remplissez :

| Champ | Valeur à entrer | Exemple |
|-------|-----------------|---------|
| **Nom** | Élection - [Nom commune] | `Elections - Le Haillan` |
| **Slug** | elections-[commune-minuscules] | `elections-le-haillan` |
| **Parent** | (Aucun) | - |
| **Description** | Articles électoraux [commune] | `Articles électoraux Le Haillan` |

⚠️ **IMPORTANT - Le slug** :
- Doit commencer par `elections-`
- Pas d'espaces (utiliser tiret `-`)
- Pas d'accents (é → e, à → a)
- Tout en minuscules

✅ **Exemples corrects** :
- Le Haillan → `elections-le-haillan` ✅
- Mérignac → `elections-merignac` ✅
- Saint-Jean-d'Illac → `elections-saint-jean-dillac` ✅

❌ **Exemples incorrects** :
- `le-haillan` (manque le préfixe) ❌
- `elections le haillan` (espace au lieu de tiret) ❌
- `élections-le-haillan` (accent dans le slug) ❌

**Cliquez sur "Ajouter une nouvelle catégorie"**

---

### Étape 2.2 : Créer la page WordPress

**WordPress Admin → Pages → Ajouter**

Remplissez :

| Champ | Valeur |
|-------|--------|
| **Titre** | Nom de la commune (ex: `Le Haillan`) |
| **Slug** | Nom sans préfixe (ex: `le-haillan`) |
| **Contenu** | Optionnel - description de la commune |

**Descendez vers "Sections Contextuelles"** (encadré ACF) :

| Champ ACF | Valeur |
|-----------|--------|
| **Section contextuelle** | Sélectionner "**Élections**" |

**Descendez vers l'encadré "Menu"** (si présent) :

| Champ ACF | Valeur |
|-----------|--------|
| **Show in menu** | ❌ **Décocher** (très important !) |

**Cliquez sur "Publier"**

---

### Étape 2.3 : Vérifier

🌐 **Sur le site** : Allez sur `https://votre-site.com/elections`

✅ **Vous devez voir** : La commune apparaît dans la liste (carte cliquable)

❌ **Si la commune n'apparaît pas** :
- Vérifiez que le champ "Section contextuelle" = "Élections"
- Vérifiez que la page est bien "Publiée" (pas "Brouillon")

---

## 3️⃣ Publier un article électoral

### Étape 3.1 : Créer l'article

**WordPress Admin → Articles → Ajouter**

Remplissez comme d'habitude :
- **Titre** : Titre de l'article
- **Contenu** : Texte de l'article
- **Image à la une** : Recommandé pour un meilleur visuel

---

### Étape 3.2 : Choisir la catégorie

**Dans l'encadré "Catégories"** (à droite) :

✅ **Cochez UNIQUEMENT** la catégorie de la commune :
- Par exemple : `Élection - Beaumont`

⚠️ **NE PAS cocher** :
- ❌ "Non classé"
- ❌ "Actualités" ou autres catégories générales
- ❌ Plusieurs communes en même temps (un article = une commune)

**Pourquoi ?** Si vous cochez d'autres catégories, l'article apparaîtra aussi dans la section NEWS globale (ce qu'on veut éviter).

---

### Étape 3.3 : Publier

**Cliquez sur "Publier"**

---

### Étape 3.4 : Vérifier

🌐 **Sur le site** : Allez sur `https://votre-site.com/elections/beaumont`

✅ **Vous devez voir** : Votre article apparaît dans la liste

🌐 **Vérification isolation** : Allez sur `https://votre-site.com/news`

✅ **Vous NE devez PAS voir** : Votre article électoral (il ne doit PAS apparaître dans NEWS)

---

## 4️⃣ Vérifier que tout fonctionne

### Checklist rapide

| Vérification | Où ? | Résultat attendu |
|-------------|------|------------------|
| **Menu hamburger** | `/elections` | Liste toutes les communes |
| **Page commune** | `/elections/beaumont` | Articles de Beaumont uniquement |
| **Recherche** | `/elections/beaumont` + recherche | Fonctionne dans la commune |
| **Isolation NEWS** | `/news` | Articles électoraux absents |
| **Dropdown catégories** | `/news` | Catégories `election-*` absentes |

---

## 5️⃣ FAQ - Questions fréquentes

### ❓ J'ai créé une commune mais elle n'apparaît pas sur `/elections`

**Vérifiez** :
1. La page est bien **Publiée** (pas Brouillon)
2. Le champ ACF "Section contextuelle" = "**Élections**"
3. Le slug de la page est correct (ex: `beaumont` pas `election-beaumont`)

### ❓ Mon article apparaît dans NEWS alors qu'il ne devrait pas

**Vérifiez** :
1. Vous avez coché **UNIQUEMENT** la catégorie `election-[commune]`
2. Vous n'avez PAS coché "Actualités", "Non classé" ou autre

**Pour corriger** :
1. Éditez l'article
2. Décochez toutes les catégories sauf `election-[commune]`
3. Mettre à jour

### ❓ Peut-on publier le même article dans plusieurs communes ?

❌ **Non recommandé** - Un article = une commune

✅ **Si vraiment nécessaire** : Dupliquez l'article et changez la catégorie

### ❓ Comment renommer une commune ?

**Catégorie** :
1. Articles → Catégories
2. Survoler la catégorie → Modification rapide
3. Changer le nom (attention au slug !)

**Page** :
1. Pages → Toutes les pages
2. Éditer la page
3. Changer le titre

⚠️ **NE PAS changer le slug** si des articles existent déjà (ça casserait les URLs)

### ❓ Comment supprimer une commune ?

**Étape 1** : Supprimer ou re-catégoriser les articles

**Étape 2** : Mettre la page en brouillon (ou supprimer)

**Étape 3** : Optionnel - Supprimer la catégorie

### ❓ Puis-je ajouter des photos/vidéos dans les articles ?

✅ **Oui !** Comme pour n'importe quel article WordPress normal.

### ❓ Les articles électoraux sont-ils partagés sur les réseaux sociaux ?

✅ **Oui !** Le bouton de partage fonctionne normalement.

---

## 📞 Support

**Problème technique ?** Contactez l'équipe technique C6Radio.

**Question éditoriale ?** Contactez le rédacteur en chef.

---

## 🎓 Récapitulatif visuel

```
WORDPRESS                           SITE WEB
=========                           ========

Catégorie                          
┌─────────────────────┐            
│ election-beaumont   │───────┐    
└─────────────────────┘       │    
                              │    
Page                          │    /elections
┌─────────────────────┐       │    ┌──────────────────┐
│ Beaumont            │       │    │ ☰ Menu           │
│ context: elections  │───────┼───▶│                  │
│ show_in_menu: false │       │    │ [Beaumont]       │
└─────────────────────┘       │    │ [Clermont]       │
                              │    └──────────────────┘
Articles                      │    
┌─────────────────────┐       │    /elections/beaumont
│ Article 1           │       │    ┌──────────────────┐
│ Catégorie:          │       └───▶│ Article 1        │
│ election-beaumont   │            │ Article 2        │
└─────────────────────┘            │ Article 3        │
┌─────────────────────┐            └──────────────────┘
│ Article 2           │            
│ Catégorie:          │            /news
│ election-beaumont   │            ┌──────────────────┐
└─────────────────────┘            │ (Articles        │
┌─────────────────────┐            │  électoraux      │
│ Article 3           │            │  EXCLUS)         │
│ Catégorie:          │            └──────────────────┘
│ election-beaumont   │            
└─────────────────────┘            
```

---

**Dernière mise à jour** : 19 février 2026  
**Version** : 1.0
