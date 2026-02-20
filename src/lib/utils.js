/**
 * Utilitaires divers - C6Radio
 * 
 * Fonctions helper utilisées dans toute l'application
 */

/**
 * Décode les entités HTML
 * 
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * WordPress renvoie parfois des caractères encodés en HTML :
 * - &#8211; → – (tiret cadratin)
 * - &#8217; → ' (apostrophe typographique)
 * - &amp; → &
 * - &quot; → "
 * - etc.
 * 
 * Cette fonction les décode pour afficher les vrais caractères.
 * 
 * COMMENT ÇA MARCHE :
 * On crée un élément HTML temporaire, on y met le texte encodé,
 * et le navigateur décode automatiquement les entités.
 * 
 * @param {string} html - Texte avec entités HTML
 * @returns {string} Texte décodé
 */
export function decodeHTML(html) {
  if (!html) return '';
  
  // Créer un élément temporaire pour décoder
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/**
 * EXEMPLES D'UTILISATION :
 * ------------------------
 * decodeHTML('A Propos &#8211; C6? Kesako ?')
 * → "A Propos – C6? Kesako ?"
 * 
 * decodeHTML('L&#8217;histoire de C6')
 * → "L'histoire de C6"
 * 
 * decodeHTML('Rock &amp; Roll')
 * → "Rock & Roll"
 */

/**
 * NOTES TECHNIQUES :
 * ------------------
 * Pourquoi textarea et pas div ?
 * - textarea.value décode automatiquement les entités HTML
 * - Plus simple que DOMParser
 * - Fonctionne dans tous les navigateurs
 * - Sécurisé (pas d'exécution de scripts)
 * 
 * Alternative avec DOMParser :
 * const parser = new DOMParser();
 * const doc = parser.parseFromString(html, 'text/html');
 * return doc.documentElement.textContent;
 */
