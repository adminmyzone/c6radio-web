# 🔧 Fix Bannières Multi-Positions

**Date :** 16 février 2026  
**Problème résolu :** Bannières avec plusieurs positions (header + footer)

---

## 🐛 Problème Identifié

### Symptôme
Une bannière WordPress avec les positions **header** ET **footer** cochées ne s'affichait que sur le **header**, pas sur le **footer**.

### Cause
Le code prenait **seulement le premier élément** du tableau `banner_position` :
```javascript
// ❌ AVANT (incorrect)
bannerPosition = acf.banner_position[0]; // Prend seulement "header"
```

Donc une bannière avec `["header", "footer"]` était traitée comme `"header"` seulement.

---

## ✅ Solution Appliquée

### Changement
Le code vérifie maintenant si la position demandée **est présente dans le tableau** :

```javascript
// ✅ APRÈS (correct)
let bannerPositions = acf.banner_position; // Garde tout le tableau ["header", "footer"]

// Vérifie si la position demandée est dans le tableau
const shouldDisplay = 
  position === 'all' || 
  bannerPositions.includes('all') || 
  bannerPositions.includes(position); // ← Vérifie présence dans tableau
```

---

## 📊 Exemple Concret

### Bannière X : Header + Footer
**WordPress ACF :**
```
banner_position: ☑ header
                 ☑ footer
```

**Tableau reçu :**
```javascript
["header", "footer"]
```

**Affichage :**
- ✅ Page avec `<BannerAd position="header" />` → **Affichée** (header est dans le tableau)
- ✅ Page avec `<BannerAd position="footer" />` → **Affichée** (footer est dans le tableau)

---

### Bannière Y : Header seulement
**WordPress ACF :**
```
banner_position: ☑ header
```

**Tableau reçu :**
```javascript
["header"]
```

**Affichage :**
- ✅ Page avec `<BannerAd position="header" />` → **Affichée** (header est dans le tableau)
- ❌ Page avec `<BannerAd position="footer" />` → **Pas affichée** (footer n'est pas dans le tableau)

---

## 🎯 Logique de Filtrage

### Conditions d'Affichage

Une bannière est affichée si **au moins une** de ces conditions est vraie :

1. **`position === 'all'`**  
   → Demande toutes les bannières (afficher partout)

2. **`bannerPositions.includes('all')`**  
   → Bannière configurée pour "toutes positions"

3. **`bannerPositions.includes(position)`**  
   → Position demandée est dans le tableau des positions de la bannière

---

## 🧪 Tests

### Scénario 1 : Bannière Header + Footer
```javascript
// Bannière 770
banner_position: ["header", "footer"]

// Demande header
position = "header"
→ shouldDisplay = true (header dans ["header", "footer"])
✅ AFFICHÉE

// Demande footer
position = "footer"
→ shouldDisplay = true (footer dans ["header", "footer"])
✅ AFFICHÉE
```

### Scénario 2 : Bannière Header uniquement
```javascript
// Bannière 776
banner_position: ["header"]

// Demande header
position = "header"
→ shouldDisplay = true (header dans ["header"])
✅ AFFICHÉE

// Demande footer
position = "footer"
→ shouldDisplay = false (footer PAS dans ["header"])
❌ PAS AFFICHÉE
```

### Scénario 3 : Bannière "All"
```javascript
// Bannière spéciale
banner_position: ["all"]

// Demande header
position = "header"
→ shouldDisplay = true (bannerPositions.includes('all'))
✅ AFFICHÉE

// Demande footer
position = "footer"
→ shouldDisplay = true (bannerPositions.includes('all'))
✅ AFFICHÉE
```

---

## 📝 Logs Attendus

### Avant Fix (❌ Incorrect)
```
[WordPress API] Banner 770 position mismatch (want: footer, got: header), skipping
→ Bannière 770 PAS affichée en footer (alors qu'elle devrait)
```

### Après Fix (✅ Correct)
```
[WordPress API] Banner 770 matches position footer (has: [header, footer])
[WordPress API] Banner 770 added successfully
→ Bannière 770 affichée en footer !
```

---

## 🎨 Configuration WordPress

### Pour afficher une bannière sur plusieurs positions

**Dans WordPress Admin > Posts > Bannière X > ACF :**

```
Banner Position:
☑ header
☑ footer
☐ sidebar
```

**Résultat :**
- Bannière visible sur `<BannerAd position="header" />` ✅
- Bannière visible sur `<BannerAd position="footer" />` ✅
- Bannière PAS visible sur `<BannerAd position="sidebar" />` ❌

---

## 🚀 Impact

### Avant
- Bannières limitées à **une seule position**
- Impossible d'afficher la même bannière à plusieurs endroits

### Après
- Bannières peuvent avoir **plusieurs positions**
- Flexibilité totale pour l'équipe éditoriale
- Économie de bannières (pas besoin de dupliquer)

---

## 📊 Exemple Cas d'Usage

### Partenaire Important (affichage maximal)
```
Banner Position:
☑ header
☑ footer
☑ sidebar

→ Bannière visible partout !
```

### Promotion Temporaire (header uniquement)
```
Banner Position:
☑ header

→ Bannière visible en header seulement
```

### Sponsor Secondaire (footer uniquement)
```
Banner Position:
☑ footer

→ Bannière visible en footer seulement
```

---

## ✅ Validation

**Build production :**
```bash
npm run build
✓ built in 1.13s
✅ Aucune erreur
```

**Logs corrects :**
```
[WordPress API] Banner 770 matches position footer (has: [header, footer])
[WordPress API] Banner 770 added successfully
```

---

## 🎉 Résultat

**Problème résolu !** ✅

Les bannières avec plusieurs positions s'affichent maintenant correctement sur toutes les positions configurées dans WordPress.

---

**Fichier modifié :** `src/services/wordpress.js` (fonction `fetchBanners`)  
**Lignes modifiées :** ~30 lignes  
**Test :** ✅ Build OK, logs corrects

