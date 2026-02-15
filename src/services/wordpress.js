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
 * Fetch les articles (posts) WordPress
 *
 * EXPLICATION PHASE 4 - ACTUALITÉS :
 * Cette fonction récupère les articles de blog/actualités depuis WordPress.
 *
 * DIFFÉRENCE AVEC fetchMenuPages :
 * - fetchMenuPages() → Pages statiques (À Propos, Contact, etc.)
 * - fetchPosts() → Articles de blog/actualités (changent régulièrement)
 *
 * @param {Object} options - Options de filtrage
 * @param {number} options.per_page - Nombre d'articles par page (défaut: 10)
 * @param {number} options.page - Numéro de page pour pagination (défaut: 1)
 * @param {string} options.categories - IDs catégories séparés par virgule (ex: "5,12")
 * @param {string} options.search - Terme de recherche
 * @param {boolean} options._embed - Inclure médias et catégories (défaut: true)
 * @returns {Promise<Array>} Liste des articles
 */
export async function fetchPosts(options = {}) {
  try {
    logger.log('[WordPress API] Fetching posts...', options);

    // Paramètres par défaut
    const {
      per_page = 10,
      page = 1,
      categories = null,
      search = null,
      _embed = true,  // Important : inclut images et catégories
    } = options;

    // Construction des paramètres de requête
    const params = new URLSearchParams({
      per_page: per_page.toString(),
      page: page.toString(),
      orderby: 'date',        // Trier par date
      order: 'desc',          // Plus récent d'abord
      status: 'publish',      // Seulement articles publiés
    });

    // Ajouter filtres optionnels
    if (categories) {
      params.append('categories', categories);
    }

    if (search) {
      params.append('search', search);
    }

    if (_embed) {
      params.append('_embed', 'true');  // Inclut images et catégories dans la réponse
    }

    // Fetch avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${WP_ENDPOINTS.posts}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();
    logger.log(`[WordPress API] Found ${posts.length} posts`);

    // Transformer les données WordPress en format simple
    const formattedPosts = posts.map(post => {
      // Extraire l'image à la une (featured image)
      let featuredImage = null;
      if (post._embedded?.['wp:featuredmedia']?.[0]) {
        const media = post._embedded['wp:featuredmedia'][0];
        featuredImage = {
          url: media.source_url,
          alt: media.alt_text || decodeHTML(post.title.rendered),
          width: media.media_details?.width || null,
          height: media.media_details?.height || null,
        };
      }

      // Extraire les catégories
      let categories = [];
      if (post._embedded?.['wp:term']?.[0]) {
        categories = post._embedded['wp:term'][0].map(cat => ({
          id: cat.id,
          name: decodeHTML(cat.name),
          slug: cat.slug,
        }));
      }

      // Retourner objet formaté
      return {
        id: post.id,
        slug: post.slug,
        title: decodeHTML(post.title.rendered),
        excerpt: post.excerpt.rendered || '',      // Résumé HTML
        content: post.content.rendered || '',      // Contenu complet HTML
        date: post.date,                           // Date ISO (ex: "2026-02-15T10:30:00")
        modified: post.modified,                   // Date dernière modification
        featuredImage,                             // Image à la une (objet ou null)
        categories,                                // Tableau catégories
        link: post.link,                           // URL WordPress originale
      };
    });

    return formattedPosts;

  } catch (error) {
    logger.error('[WordPress API] Error fetching posts:', error);

    // En cas d'erreur, retourner tableau vide
    // Le composant React affichera un message "Aucune actualité"
    return [];
  }
}

/**
 * Fetch un article WordPress par son slug
 *
 * EXPLICATION :
 * Similaire à fetchPageBySlug, mais pour les articles (posts).
 * Utilisé pour la page détail d'une actualité.
 *
 * @param {string} slug - Le slug de l'article (ex: "concert-ce-weekend")
 * @returns {Promise<Object|null>} Objet article ou null si non trouvé
 */
export async function fetchPostBySlug(slug) {
  try {
    logger.log(`[WordPress API] Fetching post: ${slug}`);

    // Paramètres : chercher par slug + inclure médias
    const params = new URLSearchParams({
      slug: slug,
      status: 'publish',
      _embed: 'true',  // Inclure images et catégories
    });

    // Fetch avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${WP_ENDPOINTS.posts}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();

    // L'API retourne un tableau, même pour 1 résultat
    if (posts.length === 0) {
      logger.log(`[WordPress API] Post not found: ${slug}`);
      return null;
    }

    const post = posts[0];

    // Extraire l'image à la une
    let featuredImage = null;
    if (post._embedded?.['wp:featuredmedia']?.[0]) {
      const media = post._embedded['wp:featuredmedia'][0];
      featuredImage = {
        url: media.source_url,
        alt: media.alt_text || decodeHTML(post.title.rendered),
        width: media.media_details?.width || null,
        height: media.media_details?.height || null,
      };
    }

    // Extraire les catégories
    let categories = [];
    if (post._embedded?.['wp:term']?.[0]) {
      categories = post._embedded['wp:term'][0].map(cat => ({
        id: cat.id,
        name: decodeHTML(cat.name),
        slug: cat.slug,
      }));
    }

    logger.log(`[WordPress API] Post loaded: ${post.title.rendered}`);

    // Retourner données formatées
    return {
      id: post.id,
      slug: post.slug,
      title: decodeHTML(post.title.rendered),
      excerpt: post.excerpt.rendered || '',
      content: post.content.rendered || '',
      date: post.date,
      modified: post.modified,
      featuredImage,
      categories,
      link: post.link,
    };

  } catch (error) {
    logger.error(`[WordPress API] Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch les catégories WordPress
 *
 * EXPLICATION :
 * Récupère la liste des catégories pour les filtres.
 * Utilisé dans le composant NewsFilters.
 *
 * @returns {Promise<Array>} Liste des catégories
 */
export async function fetchCategories() {
  try {
    logger.log('[WordPress API] Fetching categories...');

    // Paramètres : toutes les catégories, ordre alphabétique
    const params = new URLSearchParams({
      per_page: '50',         // Max 50 catégories (largement suffisant)
      orderby: 'name',        // Ordre alphabétique
      order: 'asc',
      hide_empty: 'true',     // Masquer catégories vides (sans articles)
    });

    // Fetch avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${WP_ENDPOINTS.categories}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const categories = await response.json();
    logger.log(`[WordPress API] Found ${categories.length} categories`);

    // Transformer en format simple
    return categories.map(cat => ({
      id: cat.id,
      name: decodeHTML(cat.name),
      slug: cat.slug,
      count: cat.count,  // Nombre d'articles dans cette catégorie
    }));

  } catch (error) {
    logger.error('[WordPress API] Error fetching categories:', error);
    return [];
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
 * - Endpoint posts : /wp-json/wp/v2/posts
 * - Endpoint categories : /wp-json/wp/v2/categories
 * - Filtres disponibles : status, orderby, order, per_page, etc.
 *
 * PARAMÈTRE _embed :
 * Par défaut, WordPress ne retourne que les IDs des médias et catégories.
 * Avec _embed=true, WordPress inclut les données complètes dans _embedded.
 * Évite de faire des requêtes supplémentaires pour chaque image !
 */
