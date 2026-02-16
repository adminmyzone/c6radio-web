# Actualités WordPress - Guide Rapide

## 🚀 Démarrage rapide

```bash
npm run dev
```

Ouvrir : `http://localhost:5173/news`

## 📁 Fichiers principaux

- `src/pages/News.jsx` - Liste actualités
- `src/pages/NewsDetail.jsx` - Détail article
- `src/hooks/useWordPressPosts.js` - Logique fetch + cache
- `src/components/NewsCard.jsx` - Carte actualité

## 🔧 Configuration WordPress

### Prérequis
1. Articles publiés (status = publish)
2. Images à la une définies
3. Catégories assignées
4. API REST accessible

### Vérifier l'API
```
https://exp937.fr/wp/wp-json/wp/v2/posts
```

## 🎨 Fonctionnalités

✅ Grille responsive (1/2/3 colonnes)  
✅ Lazy loading images  
✅ Cache localStorage (5 min)  
✅ États loading/error/empty  
✅ Navigation fluide  

## 📚 Documentation complète

- **Plan détaillé :** `docs/phase-4-actualites-wordpress.md`
- **Récapitulatif :** `docs/phase-4-actualites-recap.md`
- **Tests :** `docs/phase-4-actualites-tests.md`

## 🐛 Problèmes courants

### Aucune actualité affichée
- Vérifier que WordPress a des articles publiés
- Tester l'URL API dans le navigateur
- Vérifier Console pour erreurs CORS

### Images ne chargent pas
- Vérifier "Featured Image" définie dans WordPress
- Vérifier Console pour erreurs 404

### Cache ne se met pas à jour
```javascript
// Console navigateur
localStorage.removeItem('wp_posts_cache');
location.reload();
```

## ⚡ Performance

- **Lazy loading :** Images chargent au scroll
- **Cache :** 5 minutes localStorage
- **Lighthouse :** Score > 80 attendu

## 📝 Prochaines améliorations

- [ ] Filtres par catégorie
- [ ] Barre de recherche
- [ ] Pagination / Infinite scroll

