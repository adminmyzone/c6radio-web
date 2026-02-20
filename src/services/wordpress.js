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

import { WP_ENDPOINTS, MAX_MENU_PAGES, API_TIMEOUT, WP_API_BASE_URL } from '../config/constants.js';
import logger from '../lib/logger.js';
import { decodeHTML } from '../lib/utils.js';

/**
 * PHASE 5 - PODCASTS : Helper pour résoudre l'URL audio
 *
 * EXPLICATION :
 * Le champ ACF peut retourner soit :
 * - Un ID (nombre) : il faut fetch l'attachment pour avoir l'URL
 * - Une URL (string) : on l'utilise directement
 *
 * @param {number|string|null} audioValue - Valeur du champ ACF
 * @returns {Promise<string|null>} URL du fichier audio ou null
 */
async function resolveAudioUrl(audioValue) {
  // Pas de valeur → pas de podcast
  if (!audioValue) {
    return null;
  }

  // Si c'est déjà une URL (string), la retourner
  if (typeof audioValue === 'string') {
    return audioValue;
  }

  // Si c'est un ID (number), fetch l'attachment
  if (typeof audioValue === 'number') {
    try {
      logger.log(`[WordPress API] Fetching audio attachment ID ${audioValue}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${WP_API_BASE_URL}/media/${audioValue}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.error(`[WordPress API] Failed to fetch audio attachment ${audioValue}: ${response.status}`);
        return null;
      }

      const media = await response.json();

      // Retourner l'URL source
      if (media.source_url) {
        logger.log(`[WordPress API] Audio URL resolved: ${media.source_url}`);
        return media.source_url;
      }

      return null;

    } catch (error) {
      logger.error(`[WordPress API] Error fetching audio attachment:`, error);
      return null;
    }
  }

  // Type inconnu
  logger.warn(`[WordPress API] Unknown audio value type:`, typeof audioValue);
  return null;
}

/**
 * PHASE 6 - BANNIÈRES PUBLICITAIRES
 *
 * Fetch les bannières publicitaires depuis WordPress
 *
 * EXPLICATION :
 * Les bannières sont stockées dans WordPress via ACF (Advanced Custom Fields).
 * Chaque bannière peut contenir :
 * - Une image
 * - Un lien (URL de destination)
 * - Un titre alt
 * - Une position (header, footer, sidebar)
 * - Un ordre/priorité
 *
 * UTILISATION CÔTÉ WORDPRESS :
 * 1. Créer un Custom Post Type "banners" ou utiliser Pages/Posts avec ACF
 * 2. Ajouter champs ACF :
 *    - banner_image (image)
 *    - banner_link (URL)
 *    - banner_position (select: header/footer/sidebar)
 *    - banner_active (true/false)
 *
 * @param {string} position - Position de la bannière (header, footer, sidebar, all)
 * @returns {Promise<Array>} Liste des bannières actives
 */
export async function fetchBanners(position = 'all') {
  try {
    logger.log(`[WordPress API] Fetching banners (position: ${position})...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // Utiliser l'endpoint posts avec catégorie "bannieres" (ID 32)
    const url = `${WP_API_BASE_URL}/posts?categories=32&per_page=20&_embed`;

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error(`[WordPress API] Failed to fetch banners: ${response.status}`);
      return [];
    }

    const posts = await response.json();
    logger.log(`[WordPress API] Received ${posts.length} banner posts from WordPress`);

    // Transformer les posts en bannières
    const banners = [];

    for (const post of posts) {
      const acf = post.acf || {};

      // Vérifier si le post a un champ banner_image
      if (!acf.banner_image) {
        logger.warn(`[WordPress API] Banner ${post.id} has no banner_image, skipping`);
        continue;
      }

      // Vérifier si actif
      const isActive = acf.banner_active !== false; // Active par défaut
      if (!isActive) {
        logger.log(`[WordPress API] Banner ${post.id} is inactive, skipping`);
        continue;
      }

      // Gérer banner_position qui peut être un tableau ["header", "footer"] ou une string
      let bannerPositions = [];
      if (acf.banner_position) {
        if (Array.isArray(acf.banner_position)) {
          // C'est un tableau, garder toutes les positions
          bannerPositions = acf.banner_position.filter(p => p); // Filtrer les valeurs vides
        } else if (typeof acf.banner_position === 'string') {
          // C'est une string, la transformer en tableau
          bannerPositions = [acf.banner_position];
        }
      }

      // Si aucune position définie, considérer "all"
      if (bannerPositions.length === 0) {
        bannerPositions = ['all'];
      }

      // Filtrer par position si demandé
      // Une bannière est affichée si :
      // - position demandée = 'all' (afficher toutes)
      // - bannière a position 'all' (afficher partout)
      // - position demandée est dans le tableau des positions de la bannière
      const shouldDisplay =
        position === 'all' ||
        bannerPositions.includes('all') ||
        bannerPositions.includes(position);

      if (!shouldDisplay) {
        logger.log(`[WordPress API] Banner ${post.id} position mismatch (want: ${position}, got: [${bannerPositions.join(', ')}]), skipping`);
        continue;
      }

      logger.log(`[WordPress API] Banner ${post.id} matches position ${position} (has: [${bannerPositions.join(', ')}])`);

      // Stocker les positions pour la bannière
      const bannerPosition = bannerPositions.join(','); // Pour debug/affichage

      // Résoudre l'URL de l'image
      let imageUrl = null;

      if (typeof acf.banner_image === 'string') {
        // C'est déjà une URL
        imageUrl = acf.banner_image;
        logger.log(`[WordPress API] Banner ${post.id} image URL (string): ${imageUrl}`);
      } else if (typeof acf.banner_image === 'object' && acf.banner_image.url) {
        // C'est un objet ACF avec URL
        imageUrl = acf.banner_image.url;
        logger.log(`[WordPress API] Banner ${post.id} image URL (object): ${imageUrl}`);
      } else if (typeof acf.banner_image === 'number') {
        // C'est un ID d'attachment, il faut le résoudre
        const imageId = acf.banner_image;
        logger.log(`[WordPress API] Banner ${post.id} has image ID ${imageId}, fetching media...`);

        try {
          const mediaController = new AbortController();
          const mediaTimeoutId = setTimeout(() => mediaController.abort(), API_TIMEOUT);

          const mediaResponse = await fetch(`${WP_API_BASE_URL}/media/${imageId}`, {
            signal: mediaController.signal,
          });

          clearTimeout(mediaTimeoutId);

          if (mediaResponse.ok) {
            const media = await mediaResponse.json();
            imageUrl = media.source_url;
            logger.log(`[WordPress API] Banner ${post.id} image resolved: ${imageUrl}`);
          } else {
            logger.error(`[WordPress API] Failed to fetch media ${imageId}: ${mediaResponse.status}`);
          }
        } catch (mediaError) {
          logger.error(`[WordPress API] Error fetching media ${imageId}:`, mediaError);
        }
      }

      // Si on a réussi à obtenir une URL d'image, ajouter la bannière
      if (imageUrl) {
        banners.push({
          id: post.id,
          title: decodeHTML(post.title?.rendered || 'Bannière'),
          image: imageUrl,
          link: acf.banner_link || null,
          position: bannerPosition,
          order: acf.banner_order || 0,
        });
        logger.log(`[WordPress API] Banner ${post.id} added successfully`);
      } else {
        logger.warn(`[WordPress API] Banner ${post.id} has no valid image URL, skipping`);
      }
    }

    // Trier par ordre
    banners.sort((a, b) => a.order - b.order);

    logger.log(`[WordPress API] Found ${banners.length} active banners`);
    return banners;

  } catch (error) {
    if (error.name === 'AbortError') {
      logger.error('[WordPress API] Request timeout fetching banners');
    } else {
      logger.error('[WordPress API] Error fetching banners:', error);
    }
    return [];
  }
}

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
 * @param {string} options.categories_exclude - IDs catégories à exclure (ex: "32")
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
      categories_exclude = null,
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

    // Ajouter exclusion de catégories (ex: bannières)
    if (categories_exclude) {
      params.append('categories_exclude', categories_exclude);
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
    // Note : Utilisation de Promise.all pour résoudre les URLs audio en parallèle
    const formattedPosts = await Promise.all(posts.map(async (post) => {
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

      // PHASE 5 - PODCASTS : Résoudre l'URL audio (peut être un ID ou une URL)
      const podcastAudioUrl = await resolveAudioUrl(post.acf?.c6_podcast_audio);

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
        podcastAudioUrl,                           // URL MP3 podcast (null si pas de podcast)
      };
    }));

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

    // PHASE 5 - PODCASTS : Résoudre l'URL audio (peut être un ID ou une URL)
    const podcastAudioUrl = await resolveAudioUrl(post.acf?.c6_podcast_audio);

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
      podcastAudioUrl,                       // URL MP3 podcast (null si absent)
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

/**
 * SECTIONS CONTEXTUELLES - Fetch pages d'un contexte spécifique
 * 
 * EXPLICATION :
 * Récupère les pages WordPress qui appartiennent à une section contextuelle
 * (Élections, Événements, etc.) via le champ ACF context_section.
 * 
 * USAGE :
 * const communes = await fetchContextualPages('elections');
 * → Retourne toutes les pages avec acf.context_section = "elections"
 * 
 * @param {string} context - Le contexte à filtrer (ex: "elections", "evenements")
 * @returns {Promise<Array>} Liste des pages contextuelles
 */
export async function fetchContextualPages(context) {
  try {
    logger.log(`[WordPress API] Fetching contextual pages for: ${context}`);

    // Paramètres de la requête
    const params = new URLSearchParams({
      per_page: 100,              // Max pages (assez pour toutes les communes)
      orderby: 'title',           // Tri alphabétique par titre
      order: 'asc',               // Ordre croissant (A → Z)
      status: 'publish',          // Seulement pages publiées
      _fields: 'id,slug,title,acf', // Optimisation : seulement champs nécessaires
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
    logger.log(`[WordPress API] Found ${pages.length} total pages`);

    // Filtrer : garder seulement les pages avec context_section = context
    const contextualPages = pages
      .filter(page => page.acf?.context_section === context)
      .map(page => ({
        id: page.id,
        slug: page.slug,
        title: decodeHTML(page.title.rendered),
        context: page.acf.context_section,
      }));

    logger.log(`[WordPress API] Filtered to ${contextualPages.length} pages for context "${context}"`);
    
    return contextualPages;

  } catch (error) {
    logger.error(`[WordPress API] Error fetching contextual pages for "${context}":`, error);
    
    // En cas d'erreur, retourner tableau vide
    return [];
  }
}

/**
 * SECTIONS CONTEXTUELLES - Fetch articles d'un contexte spécifique
 * 
 * EXPLICATION :
 * Récupère les articles WordPress filtrés par préfixe de catégorie.
 * Utilisé pour les sections contextuelles (Élections, Événements, etc.)
 * 
 * USAGE :
 * // Tous les articles de Le Haillan (catégorie "elections-le-haillan")
 * const articles = await fetchPostsByContext('elections', 'le-haillan');
 * 
 * // Recherche dans les articles de Le Haillan
 * const results = await fetchPostsByContext('elections', 'le-haillan', { search: 'vote' });
 * 
 * @param {string} context - Le contexte (ex: "elections", "evenements")
 * @param {string} subcategory - La sous-catégorie (ex: "le-haillan", "merignac")
 * @param {Object} options - Options supplémentaires (search, per_page, page)
 * @returns {Promise<Array>} Articles formatés (même format que fetchPosts)
 */
export async function fetchPostsByContext(context, subcategory, options = {}) {
  try {
    logger.log(`[WordPress API] Fetching posts for context: ${context}/${subcategory}`, options);

    // Construire le slug de catégorie : context-subcategory (ex: "elections-le-haillan")
    const categorySlug = `${context}-${subcategory}`;

    // D'abord, trouver l'ID de la catégorie via son slug
    const categories = await fetchCategories();
    const category = categories.find(cat => cat.slug === categorySlug);

    if (!category) {
      logger.warn(`[WordPress API] Category "${categorySlug}" not found`);
      return [];
    }

    logger.log(`[WordPress API] Found category "${categorySlug}" with ID ${category.id}`);

    // Fetch les posts avec cette catégorie
    // Utilise fetchPosts() existante pour réutiliser la logique
    const posts = await fetchPosts({
      categories: category.id,
      categories_exclude: '32', // Toujours exclure bannières
      per_page: options.per_page || 20,
      page: options.page || 1,
      search: options.search || null,
      _embed: true,
    });

    return posts;

  } catch (error) {
    logger.error(`[WordPress API] Error fetching posts for "${context}/${subcategory}":`, error);
    return [];
  }
}
