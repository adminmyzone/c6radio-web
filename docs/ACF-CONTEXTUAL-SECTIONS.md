# Configuration ACF - Sections Contextuelles

## 🎯 Objectif

Ce document explique comment configurer le champ ACF (Advanced Custom Fields) pour activer les **sections contextuelles** dans WordPress (Élections, Événements, etc.).

## 📋 Prérequis

- Plugin **Advanced Custom Fields** (ACF) installé et activé dans WordPress
- Accès administrateur WordPress

## 🔧 Configuration du champ ACF

### 1. Créer un nouveau champ ACF

**Emplacement :** WordPress Admin → Custom Fields → Add New

**Paramètres du groupe de champs :**
- **Titre du groupe** : Sections Contextuelles
- **Emplacement** : 
  - Règle : `Type de publication` est égal à `Page`

### 2. Ajouter le champ `context_section`

**Paramètres du champ :**

| Paramètre | Valeur |
|-----------|--------|
| **Label du champ** | Section contextuelle |
| **Nom du champ** | `context_section` |
| **Type de champ** | Select (Sélection) |
| **Choix** | Voir ci-dessous |
| **Valeur par défaut** | (vide) |
| **Autoriser null** | Oui ✅ |
| **Multiple** | Non |
| **Retourner le format** | Value (Valeur) |
| **Instructions** | Sélectionner le contexte de cette page (vide = menu principal) |

**Choix disponibles :**

```
elections : Élections
evenements : Événements
patrimoine : Patrimoine & Découverte
```

Format dans ACF :
```
elections : Élections
evenements : Événements
patrimoine : Patrimoine & Découverte
```

> **Note :** Laisser vide = page normale affichée dans menu principal

### 3. Règles d'affichage

**Afficher ce groupe de champs si :**
- Type de publication → est égal à → Page

### 4. Paramètres du groupe

- **Position** : Normal (après le contenu)
- **Style** : Défaut
- **Actif** : Oui

## ✅ Vérification

Après configuration, lors de l'édition d'une **page WordPress**, vous devriez voir :

```
┌─────────────────────────────────────────┐
│ Sections Contextuelles                  │
├─────────────────────────────────────────┤
│ Section contextuelle                    │
│ ┌─────────────────────────────────────┐ │
│ │ -- Sélectionnez --                  │ │
│ │ Élections                           │ │
│ │ Événements                          │ │
│ │ Patrimoine & Découverte             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Sélectionner le contexte de cette page │
│ (vide = menu principal)                 │
└─────────────────────────────────────────┘
```

## 🎨 Utilisation

### Pages normales (menu principal)

- Laisser le champ **vide** ou sélectionner "-- Sélectionnez --"
- La page apparaîtra dans le menu principal (si `show_in_menu` = true)

### Pages contextuelles (Élections)

1. Créer une nouvelle page WordPress
2. Titre : Nom de la commune (ex: "Beaumont", "Clermont")
3. **Section contextuelle** : Sélectionner "Élections"
4. **Show in menu** (champ ACF existant) : Décocher (false)
5. Publier

**Résultat :** La page n'apparaît PAS dans le menu principal, mais sera listée dans le menu contextuel "Élections".

### Pages contextuelles (Événements)

Même procédure, sélectionner "Événements" dans `context_section`.

### Pages contextuelles (Patrimoine)

Même procédure, sélectionner "Patrimoine & Découverte" dans `context_section`.

## 📝 Export ACF (pour développeurs)

Si vous utilisez **ACF → Exporter**, voici le code PHP généré :

```php
<?php
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
    'key' => 'group_contextual_sections',
    'title' => 'Sections Contextuelles',
    'fields' => array(
        array(
            'key' => 'field_context_section',
            'label' => 'Section contextuelle',
            'name' => 'context_section',
            'type' => 'select',
            'instructions' => 'Sélectionner le contexte de cette page (vide = menu principal)',
            'required' => 0,
            'conditional_logic' => 0,
            'choices' => array(
                'elections' => 'Élections',
                'evenements' => 'Événements',
                'patrimoine' => 'Patrimoine & Découverte',
            ),
            'default_value' => false,
            'allow_null' => 1,
            'multiple' => 0,
            'ui' => 0,
            'return_format' => 'value',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'page',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
));

endif;
```

## 🔄 Ajout de nouveaux contextes

Pour ajouter un nouveau contexte (ex: "Sports") :

1. WordPress Admin → Custom Fields → Modifier "Sections Contextuelles"
2. Cliquer sur le champ "Section contextuelle"
3. **Choix** : Ajouter une ligne
   ```
   sports : Sports
   ```
4. Enregistrer

## ⚠️ Points d'attention

- ⚠️ Ne **jamais supprimer** une valeur utilisée (ex: "elections" si des pages existent)
- ⚠️ Les slugs (`elections`, `evenements`) doivent être en **minuscules sans accents**
- ✅ Les labels ("Élections") peuvent contenir accents et majuscules
- ✅ Une page ne peut appartenir qu'à **un seul contexte** (pas de multi-sélection)

## 🚀 Prochaine étape

Après avoir configuré ce champ ACF, consultez :
- `docs/CONTEXTUAL-SECTIONS.md` - Guide complet utilisation sections contextuelles
- `docs/EDITORIAL-GUIDE.md` - Guide éditorial pour créer contenu élections

---

**Besoin d'aide ?** Contactez l'équipe technique C6Radio.
