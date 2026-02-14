/**
 * Configuration du routage - C6Radio
 * 
 * Ce fichier définit toutes les ROUTES (URLs) de l'application.
 * 
 * PHASE 3B - ROUTES DYNAMIQUES WORDPRESS :
 * -----------------------------------------
 * On a maintenant 2 types de routes :
 * 
 * 1. ROUTES STATIQUES (hardcodées) :
 *    - "/" = Page Home (React)
 *    - "/404" = Page not found
 * 
 * 2. ROUTES DYNAMIQUES (WordPress) :
 *    - "/:slug" = Toutes les autres URLs (About, Contact, etc.)
 *    - Le composant DynamicPage charge automatiquement depuis WordPress
 * 
 * ORDRE IMPORTANT :
 * Les routes statiques DOIVENT être AVANT la route catch-all (:slug)
 * sinon elles seraient capturées par DynamicPage.
 */

import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import DynamicPage from './pages/DynamicPage';
import NotFound from './pages/NotFound';
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

/**
 * Configuration du router
 * 
 * STRUCTURE :
 * - Route parent ("/") = App.jsx (contient Header + PlayerBar toujours visibles)
 * - Routes enfants = les différentes pages qui s'affichent dans <Outlet />
 */
export const router = createBrowserRouter([
  {
    path: '/',              // Route parent - URL de base
    element: <App />,       // Composant parent qui wraps tout
    children: [             // Pages enfants qui s'affichent dans <Outlet />
      {
        index: true,        // "index: true" = route par défaut (page d'accueil)
        element: <Home />,  // Composant de la page Home
      },
      {
        path: '404',        // Route pour page non trouvée
        element: <NotFound />,
      },
      {
        path: 'about',      // Route statique pour "About"
        element: <About />,
      },
      {
        path: 'contact',    // Route statique pour "Contact"
        element: <Contact />,
      },
      {
        path: ':slug',      // Route CATCH-ALL : capture toutes les URLs restantes
        element: <DynamicPage />, // Composant générique qui charge depuis WordPress
      },
      /**
       * EXPLICATION :slug :
       * ------------------
       * Le ":" indique un PARAMÈTRE dynamique.
       * ":slug" capture n'importe quelle URL qui n'a pas matché avant.
       * 
       * Exemples :
       * - /about → slug = "about" → DynamicPage charge page WordPress "about"
       * - /contact → slug = "contact" → DynamicPage charge page WordPress "contact"
       * - /mentions-legales → slug = "mentions-legales" → etc.
       * 
       * Dans DynamicPage.jsx, on récupère le slug avec :
       * const { slug } = useParams();
       */
    ],
  },
]);

/**
 * ANCIEN SYSTÈME (Phase 3A) - Pages hardcodées :
 * -----------------------------------------------
 * On avait une route par page :
 * { path: 'about', element: <About /> },
 * { path: 'contact', element: <Contact /> },
 * 
 * NOUVEAU SYSTÈME (Phase 3B) - Pages dynamiques :
 * ------------------------------------------------
 * UNE SEULE route catch-all qui gère TOUTES les pages !
 * { path: ':slug', element: <DynamicPage /> }
 * 
 * AVANTAGES :
 * ✅ L'équipe éditoriale peut créer des pages dans WordPress
 * ✅ Elles apparaissent automatiquement (pas de rebuild)
 * ✅ Pas besoin de toucher au code
 * ✅ Menu se met à jour automatiquement
 */

/**
 * COMMENT AJOUTER UNE ROUTE STATIQUE ?
 * -------------------------------------
 * Si vous voulez une route spéciale (ex: /podcasts avec logique custom),
 * ajoutez-la AVANT la route catch-all :
 * 
 * {
 *   index: true,
 *   element: <Home />,
 * },
 * {
 *   path: 'podcasts',       // Route statique spéciale
 *   element: <Podcasts />,  // Composant React custom
 * },
 * {
 *   path: ':slug',          // Catch-all EN DERNIER
 *   element: <DynamicPage />,
 * }
 */
