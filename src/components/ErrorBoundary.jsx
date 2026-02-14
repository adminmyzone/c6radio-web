import { Component } from 'react';
import logger from '../lib/logger.js';

/**
 * Error Boundary pour capturer les erreurs React
 * Empêche l'app de crasher complètement
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher le fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Logger l'erreur
    logger.error('React Error Boundary:', error, errorInfo);
    
    // Optionnel : envoyer à un service de monitoring
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  render() {
    if (this.state.hasError) {
      // UI de secours
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Oups, une erreur est survenue 😕</h2>
          <p>Veuillez rafraîchir la page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px', 
              background: '#16a34a', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Rafraîchir
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
