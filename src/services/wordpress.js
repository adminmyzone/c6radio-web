/**
 * Service API WordPress - C6Radio
 * 
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce service communique avec WordPress via son API REST.
 * 
 * WORDPRESS REST API :
 * WordPress expose automatiquement une API sur :
 * https://votre-site.com/wp-json/wp/v2/
 * 
 * Cette API permet de récupérer :
 * - Les pages : /wp-json/wp/v2/pages
 * - Les articles : /wp-json/wp/v2/posts
 * - Les images : /wp-json/wp/v2/media
 * 
 * AVANTAGE :
 * L'équipe éditoriale peut modifier le contenu dans WordPress
 * et ça se met à jour automatiquement sur le site React !
 */

import { WP_ENDPOINTS, MAX_MENU_PAGES, API_TIMEOUT } from '../config/constants.js';
import logger from '../lib/logger.js';
import { decodeHTML } from '../lib/utils.js';

/**
 * Fetch toutes les pages WordPress pour le menu
 * 
 * EXPLICATION :
 * Cette fonction récupère la liste des pages depuis WordPress
 * et les transforme en format simple pour l'app React.
 * 
 * @returns {Promise<Array>} Liste des pages pour le menu
 */
export async function fetchMenuPages() {
  try {
    logger.log('[WordPress API] Fetching menu pages...');

    // Paramètres de requête
    const params = new URLSearchParams({
      per_page: MAX_MENU_PAGES,  // Max 20 pages
      orderby: 'menu_order',      // Trier par ordre menu
      order: 'asc',               // Ordre croissant (1, 2, 3...)
      status: 'publish',          // Seulement pages publiées
    });

    // Fetch avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${WP_ENDPOINTS.pages}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const pages = await response.json();
    logger.log(`[WordPress API] Found ${pages.length} pages`);

    // Transformer les données WordPress en format simple
    const menuPages = pages
      .map(page => ({
        id: page.id,
        slug: page.slug,                    // URL slug (ex: "about", "contact")
        title: decodeHTML(page.title.rendered),         // Titre décodé (entités HTML)
        menuLabel: decodeHTML(page.acf?.menu_label || page.title.rendered),  // Label décodé
        menuOrder: page.menu_order || 999,  // Ordre d'affichage
        showInMenu: page.acf?.show_in_menu, // Champ ACF show_in_menu
      }))
      // Filtrer : garder seulement les pages avec show_in_menu = true
      // Si ACF n'est pas configuré, showInMenu sera undefined → page non affichée
      .filter(page => page.showInMenu === true);

    logger.log(`[WordPress API] Filtered to ${menuPages.length} pages for menu (show_in_menu=true)`);
    
    return menuPages;

  } catch (error) {
    // Si erreur (WordPress down, timeout, etc.)
    logger.error('[WordPress API] Error fetching menu pages:', error);

    // FALLBACK : Retourner pages hardcodées par défaut
    logger.log('[WordPress API] Using fallback pages');
    return [
      { id: 1, slug: 'about', title: 'À Propos', menuLabel: 'À Propos', menuOrder: 1 },
      { id: 2, slug: 'contact', title: 'Contact', menuLabel: 'Contact', menuOrder: 2 },
    ];
  }
}

/**
 * Fetch une page WordPress par son slug
 * 
 * EXPLICATION :
 * Récupère le contenu HTML d'une page WordPress.
 * Le slug est l'identifiant unique de la page dans l'URL.
 * Exemple : slug "about" → URL /about
 * 
 * @param {string} slug - Le slug de la page (ex: "about", "contact")
 * @returns {Promise<Object|null>} Objet page ou null si non trouvée
 */
export async function fetchPageBySlug(slug) {
  try {
    logger.log(`[WordPress API] Fetching page: ${slug}`);

    // Paramètres : chercher par slug
    const params = new URLSearchParams({
      slug: slug,
      status: 'publish',
    });

    // Fetch avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${WP_ENDPOINTS.pages}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const pages = await response.json();

    // L'API retourne un tableau, même pour 1 résultat
    if (pages.length === 0) {
      logger.log(`[WordPress API] Page not found: ${slug}`);
      return null;
    }

    const page = pages[0];

    logger.log(`[WordPress API] Page loaded: ${page.title.rendered}`);

    // Retourner données formatées
    return {
      id: page.id,
      slug: page.slug,
      title: decodeHTML(page.title.rendered),           // Titre décodé (entités HTML)
      content: page.content.rendered,       // Contenu HTML complet
      excerpt: page.excerpt.rendered || '', // Résumé (optionnel)
      date: page.date,                      // Date de publication
      modified: page.modified,              // Date dernière modification
    };

  } catch (error) {
    logger.error(`[WordPress API] Error fetching page ${slug}:`, error);
    return null;
  }
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * GESTION DES ERREURS :
 * - Si WordPress est down → Fallback pages hardcodées
 * - Si timeout (>10s) → Abort + fallback
 * - Si page n'existe pas → null (404 géré par React Router)
 * 
 * SÉCURITÉ :
 * - WordPress assainit automatiquement le HTML (XSS protection)
 * - On utilise .rendered qui contient le HTML sécurisé
 * 
 * PERFORMANCE :
 * - Timeout 10s pour éviter blocages
 * - Cache possible en Phase 4 (localStorage)
 * 
 * API WORDPRESS :
 * - Documentation complète : https://developer.wordpress.org/rest-api/
 * - Endpoint pages : /wp-json/wp/v2/pages
 * - Filtres disponibles : status, orderby, order, per_page, etc.
 */
