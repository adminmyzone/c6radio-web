/**
 * Page 404 - Page non trouvée
 * 
 * Affichée quand l'utilisateur va sur une URL qui n'existe pas
 */

import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h1>Page non trouvée</h1>
        <p>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="home-button">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
