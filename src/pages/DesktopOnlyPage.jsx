/**
 * DesktopOnlyPage - Pages réservées aux ordinateurs
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant est un "gardien" : il vérifie si l'utilisateur est
 * sur mobile ou sur ordinateur, puis agit en conséquence.
 *
 * SUR MOBILE (< 768px) :
 * → Affiche un message d'information "Cette page est sur PC uniquement"
 *
 * SUR DESKTOP (≥ 768px) :
 * → Charge et affiche le contenu de la page WordPress normalement
 *   (en réutilisant DynamicPage qui existe déjà)
 *
 * ASTUCE TECHNIQUE :
 * On réutilise entièrement DynamicPage pour la partie "chargement WordPress".
 * Pas besoin de réécrire cette logique, juste de la déléguer !
 *
 * PAGES CONCERNÉES :
 * - /partenaires
 * - /prestations
 * - /contact
 * - /appli
 */

import { useEffect, useState } from 'react';
import DynamicPage from './DynamicPage';
import './DesktopOnlyPage.css';

/**
 * Seuil en pixels entre "mobile" et "desktop"
 * Doit correspondre au breakpoint du Header.css (768px)
 */
const MOBILE_BREAKPOINT = 768;

export default function DesktopOnlyPage() {
  /**
   * isMobile : true si l'écran est plus petit que MOBILE_BREAKPOINT
   *
   * On initialise directement avec la taille actuelle de la fenêtre.
   * Ensuite, on écoute les changements de taille (si l'utilisateur
   * redimensionne son navigateur, la valeur se met à jour en temps réel).
   */
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    // Fonction appelée à chaque redimensionnement de la fenêtre
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // S'abonner à l'événement "resize" du navigateur
    window.addEventListener('resize', handleResize);

    // Nettoyage : se désabonner quand le composant est retiré
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── SUR MOBILE : message de blocage ───────────────────────────────────────
  if (isMobile) {
    return (
      <div className="desktop-only-block">
        <div className="desktop-only-block__inner">
          <span className="desktop-only-block__icon" aria-hidden="true">🖥️</span>
          <h2 className="desktop-only-block__title">
            Page disponible sur ordinateur
          </h2>
          <p className="desktop-only-block__text">
            Cette section est optimisée pour une expérience sur grand écran.
            Consulte-la depuis ton ordinateur !
          </p>
        </div>
      </div>
    );
  }

  // ─── SUR DESKTOP : afficher le contenu WordPress normalement ───────────────
  //
  // On délègue entièrement à DynamicPage.
  // DynamicPage lit l'URL (/partenaires, /prestations, etc.) et charge
  // automatiquement la page correspondante depuis WordPress.
  return <DynamicPage />;
}
