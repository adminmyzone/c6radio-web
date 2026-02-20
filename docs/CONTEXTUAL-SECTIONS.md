# Guide - Sections Contextuelles

## 🎯 Qu'est-ce qu'une section contextuelle ?

Une **section contextuelle** est une zone thématique du site C6Radio dédiée à un sujet spécifique (Élections, Événements, Sports, etc.), avec :
- **Navigation dédiée** : Menu hamburger avec sous-sections
- **Contenu isolé** : Articles n'apparaissent PAS dans la section NEWS globale
- **Flexibilité** : Réutilisable pour différents contextes

## 📋 Cas d'usage

### Élections municipales
- **Section** : `/elections`
- **Sous-sections** : Communes (Beaumont, Clermont, Riom...)
- **Articles** : Actualités électorales par commune

### Événements spéciaux
- **Section** : `/evenements`
- **Sous-sections** : Événements (Festival 2026, Concert été...)
- **Articles** : Infos pratiques, programme, live

### Quartiers (futur)
- **Section** : `/quartiers`
- **Sous-sections** : Quartiers (Centre-ville, Gare...)
- **Articles** : Vie locale, commerces

## 🏗️ Architecture

### Convention de nommage des catégories

**Format** : `[context]-[subcategory]`

**Exemples élections :**
- `elections-le-haillan` → Articles du Haillan
- `elections-merignac` → Articles de Mérignac
- `elections-saint-jean-dillac` → Articles de Saint Jean d'Illac

**Exemples événements :**
- `event-festival2026` → Festival 2026
- `event-concert-ete` → Concert d'été

**Exemples quartiers :**
- `quartier-centre` → Centre-ville
- `quartier-gare` → Quartier de la Gare

### Règles importantes

✅ **Slugs en minuscules** sans accents ni espaces  
✅ **Tiret pour séparer** les mots (kebab-case)  
✅ **Préfixe obligatoire** pour isolation (elections-, evenements-, etc.)  
❌ **Pas d'accents** : `elections-merignac` (pas `élections-mérignac`)  
❌ **Pas d'espaces** : `evenements-festival2026` (pas `evenements festival 2026`)

## 📝 Procédure éditeur WordPress

### 1️⃣ Créer les catégories

**WordPress Admin → Articles → Catégories → Ajouter**

| Champ | Valeur | Exemple |
|-------|--------|---------|
| **Nom** | Nom complet | Élection - Le Haillan |
| **Slug** | Format: context-subcategory | elections-le-haillan |
| **Parent** | (Aucun) | - |
| **Description** | Usage interne | Articles électoraux Le Haillan |

**⚠️ Important** : Le **slug** est crucial, il doit respecter le format `context-subcategory`.

### 2️⃣ Créer les pages de sous-sections

**WordPress Admin → Pages → Ajouter**

| Champ ACF | Valeur | Exemple |
|-----------|--------|---------|
| **Titre** | Nom de la commune/sous-section | Le Haillan |
| **Slug** | Slug de la sous-catégorie | le-haillan |
| **Contenu** | Optionnel (description) | Actualités électorales du Haillan |
| **Section contextuelle** (ACF) | Sélectionner contexte | Élections |
| **Show in menu** (ACF) | ❌ Décocher | false |
| **Statut** | Publié | - |

**Résultat** : La page n'apparaît PAS dans le menu principal, mais sera listée dans le menu "Élections".

### 3️⃣ Publier des articles

**WordPress Admin → Articles → Ajouter**

| Champ | Valeur |
|-------|--------|
| **Titre** | Titre de l'article |
| **Contenu** | Contenu habituel |
| **Catégorie** | ✅ Sélectionner `elections-le-haillan` |
| **Image à la une** | Recommandé |
| **Statut** | Publié |

**⚠️ Important** : 
- L'article N'APPARAÎT PAS dans la section NEWS globale
- Visible uniquement dans `/elections/le-haillan`

## 🎨 Exemples complets

### Exemple : Élections municipales

**Étape 1 - Créer 3 catégories :**

| Nom | Slug | Description |
|-----|------|-------------|
| Élection - Beaumont | `election-beaumont` | Articles électoraux Beaumont |
| Élection - Clermont | `election-clermont` | Articles électoraux Clermont |
| Élection - Riom | `election-riom` | Articles électoraux Riom |

**Étape 2 - Créer 3 pages :**

| Titre | Slug | ACF context_section | ACF show_in_menu |
|-------|------|---------------------|------------------|
| Beaumont | beaumont | Élections | ❌ false |
| Clermont | clermont | Élections | ❌ false |
| Riom | riom | Élections | ❌ false |

**Étape 3 - Publier articles :**

- Article "Débat candidats Beaumont" → Catégorie `election-beaumont`
- Article "Programme liste Clermont" → Catégorie `election-clermont`
- Article "Meeting Riom" → Catégorie `election-riom`

**Résultat sur le site :**

```
/elections
  └── Menu hamburger :
      - Beaumont
      - Clermont
      - Riom

/elections/beaumont
  └── Articles avec catégorie "election-beaumont"

/news
  └── Articles SANS catégories "election-*"
```

### Exemple : Festival été 2026

**Étape 1 - Créer catégorie :**

| Nom | Slug |
|-----|------|
| Festival Été 2026 | `event-festival2026` |

**Étape 2 - Créer page :**

| Titre | Slug | ACF context_section |
|-------|------|---------------------|
| Festival Été 2026 | festival2026 | Événements |

**Étape 3 - Publier articles :**

- "Programmation Festival" → Catégorie `event-festival2026`
- "Billetterie ouverte" → Catégorie `event-festival2026`

**Résultat :** `/evenements/festival2026`

## 🔍 Vérifications

### Comment vérifier que ça fonctionne ?

1. **Isolation NEWS** :
   - Aller sur `/news`
   - Les articles avec `election-*` ou `event-*` NE doivent PAS apparaître

2. **Section contextuelle** :
   - Aller sur `/elections`
   - Le menu hamburger doit lister toutes les communes

3. **Page sous-section** :
   - Aller sur `/elections/beaumont`
   - Seuls les articles `election-beaumont` s'affichent

## ⚠️ Pièges à éviter

### ❌ Erreur 1 : Slug catégorie incorrect

```
❌ Mauvais : "Beaumont" (pas de préfixe)
✅ Correct : "election-beaumont"
```

**Conséquence** : Articles apparaissent dans NEWS global au lieu d'être isolés.

### ❌ Erreur 2 : Page avec show_in_menu = true

```
❌ Mauvais : show_in_menu coché + context_section = "elections"
✅ Correct : show_in_menu décoché + context_section = "elections"
```

**Conséquence** : Page apparaît dans le menu principal ET le menu contextuel.

### ❌ Erreur 3 : Slug page ≠ sous-catégorie

```
Page :
  - Titre : "Beaumont"
  - Slug : "beaumont"
  
Catégorie :
  - Slug : "election-beaumont"

❌ Mauvais : Slug page "beaumont-elections" (doit être "beaumont")
✅ Correct : Slug page "beaumont" (sans préfixe)
```

**Conséquence** : URL cassée `/elections/beaumont-elections` au lieu de `/elections/beaumont`.

### ❌ Erreur 4 : Mélanger contextes

```
❌ Mauvais : Article avec catégories "election-beaumont" ET "news"
✅ Correct : Article avec SEULEMENT "election-beaumont"
```

**Conséquence** : Article apparaît dans NEWS global (pas isolé).

## 🚀 Workflow recommandé

### Pour les élections (prioritaire)

1. **Créer toutes les catégories** d'un coup (election-beaumont, election-clermont...)
2. **Créer toutes les pages** ensuite (vérifier ACF context_section + show_in_menu)
3. **Tester navigation** : menu hamburger sur `/elections`
4. **Publier articles** progressivement
5. **Vérifier isolation** : articles absents de `/news`

### Ajout d'une nouvelle commune

1. Créer catégorie `election-[commune]`
2. Créer page avec context_section = "Élections"
3. Publier → Commune apparaît dans menu automatiquement

### Fin des élections (nettoyage)

**Option 1 - Archivage** :
- Dépublier pages communes (brouillon)
- Garder articles publiés (référence historique)

**Option 2 - Suppression** :
- Supprimer pages
- Supprimer ou re-catégoriser articles

## 📚 Ressources

- **Configuration ACF** : `docs/ACF-CONTEXTUAL-SECTIONS.md`
- **Plan technique** : `docs/features/plan.md`
- **Support** : Équipe technique C6Radio

---

**Besoin d'aide ?** Contactez l'équipe technique pour assistance.
