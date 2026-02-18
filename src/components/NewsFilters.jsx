/**
 * Composant NewsFilters - Barre de recherche et filtre catégorie
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche :
 * 1. Une barre de recherche (input texte)
 * 2. Un menu déroulant de catégories (select)
 *
 * PROPS :
 * - searchTerm : Le mot recherché actuellement (string)
 * - onSearchChange : Fonction appelée quand on tape dans la recherche
 * - selectedCategory : L'ID de catégorie sélectionnée (string ou null)
 * - onCategoryChange : Fonction appelée quand on change de catégorie
 * - categories : Liste des catégories disponibles (array)
 *
 * COMMENT ÇA MARCHE ?
 * Parent (News.jsx) → passe les valeurs et fonctions via props
 * NewsFilters → affiche les inputs et appelle les fonctions au changement
 * Parent → reçoit les nouveaux filtres et refetch les articles
 */

import { useState, useEffect } from 'react';
import './NewsFilters.css';

export default function NewsFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = []
}) {
  // État local pour la barre de recherche (debouncing)
  const [inputValue, setInputValue] = useState(searchTerm || '');

  /**
   * DEBOUNCING : Technique pour éviter trop de requêtes API
   * 
   * PROBLÈME :
   * Si on appelle onSearchChange à chaque lettre tapée,
   * on envoie une requête API pour "r", "ra", "rad", "radi", "radio"
   * = 5 requêtes inutiles !
   * 
   * SOLUTION :
   * On attend 500ms après que l'utilisateur arrête de taper
   * avant d'envoyer la requête.
   */
  useEffect(() => {
    // Timer de 500ms
    const timer = setTimeout(() => {
      // Après 500ms sans changement, on déclenche la recherche
      if (inputValue !== searchTerm) {
        onSearchChange(inputValue);
      }
    }, 500);

    // Cleanup : Si l'utilisateur tape à nouveau, on annule le timer précédent
    return () => clearTimeout(timer);
  }, [inputValue, searchTerm, onSearchChange]);

  /**
   * Gestion du changement dans l'input de recherche
   */
  const handleSearchInput = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Gestion du changement de catégorie
   */
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    // Si "all" est sélectionné, passer null (= toutes les catégories)
    onCategoryChange(value === 'all' ? null : value);
  };

  /**
   * Bouton pour effacer la recherche
   */
  const handleClearSearch = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className="news-filters">
      {/* Barre de recherche */}
      <div className="news-filters__search">
        <div className="search-input-wrapper">
          {/* Icône loupe */}
          <span className="search-icon">🔍</span>
          
          {/* Input de recherche */}
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un article..."
            value={inputValue}
            onChange={handleSearchInput}
            aria-label="Rechercher dans les articles"
          />
          
          {/* Bouton pour effacer (visible seulement si texte saisi) */}
          {inputValue && (
            <button
              className="search-clear"
              onClick={handleClearSearch}
              aria-label="Effacer la recherche"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtre par catégorie */}
      <div className="news-filters__category">
        <label htmlFor="category-select" className="category-label">
          Catégorie :
        </label>
        
        <select
          id="category-select"
          className="category-select"
          value={selectedCategory || 'all'}
          onChange={handleCategoryChange}
        >
          {/* Option par défaut : Toutes les catégories */}
          <option value="all">Toutes les catégories</option>
          
          {/* Liste dynamique des catégories depuis WordPress */}
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * DEBOUNCING :
 * - Sans debouncing : 1 requête par lettre tapée
 * - Avec debouncing (500ms) : 1 requête seulement quand on arrête de taper
 * - Économise de la bande passante et améliore la performance
 * 
 * ACCESSIBILITÉ :
 * - aria-label pour screen readers
 * - <label> associé au <select> avec htmlFor/id
 * - Bouton effacer avec type="button" (évite submit de form)
 * 
 * REACT PROPS :
 * - Ce composant est "contrôlé" par le parent (News.jsx)
 * - Il ne fait que afficher les valeurs et signaler les changements
 * - Le parent décide quoi faire avec ces changements (refetch articles)
 */
