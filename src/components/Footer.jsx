/**
 * Footer - Pied de page du site
 * 
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Le Footer est la barre en bas de chaque page.
 * Il contient généralement :
 * - Copyright et année
 * - Liens vers réseaux sociaux
 * - Liens vers pages légales (mentions légales, CGU, etc.)
 * 
 * Le Footer est STATIQUE pour le moment (hardcodé).
 * En Phase 3B, on pourra le rendre dynamique avec WordPress.
 */

import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Section principale du footer */}
        <div className="footer-content">
          
          {/* Colonne 1 : À propos */}
          <div className="footer-column">
            <h3>C6Radio</h3>
            <p className="footer-description">
              La radio alternative de Rock & Chanson Française. Écoutez-nous 24h/24, 7j/7.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="footer-column">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/about">À Propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Réseaux sociaux */}
          <div className="footer-column">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <span>Facebook</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span>Twitter</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Barre de copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} C6Radio. Tous droits réservés.</p>
          <div className="footer-legal">
            <Link to="#">Mentions Légales</Link>
            <span className="separator">•</span>
            <Link to="#">Politique de Confidentialité</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

/**
 * NOTES TECHNIQUES :
 * ------------------
 * - const currentYear = new Date().getFullYear();
 *   → Obtient l'année actuelle automatiquement (2026, 2027, etc.)
 *   
 * - aria-label sur les liens sociaux
 *   → Pour l'accessibilité (lecteurs d'écran pour malvoyants)
 *   
 * - Les liens vers réseaux sociaux ont href="#" pour le moment
 *   → À remplacer par les vraies URLs quand disponibles
 */
