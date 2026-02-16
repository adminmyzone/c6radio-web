// ============================================
// LOGGER CONFIGURÉ POUR PRODUCTION
// Active/désactive les logs selon l'environnement
// ============================================

/**
 * Détecte si on est en mode développement ou production
 * En production (import.meta.env.PROD), les logs sont désactivés
 *
 * TEMPORAIRE : Activé en production pour debug bannières
 */
const isDevelopment = true; // Force les logs même en prod (TEMPORAIRE)

/**
 * Logger intelligent qui s'adapte à l'environnement
 * En dev : affiche tout
 * En prod : désactive les logs (sauf errors)
 */
const logger = {
  /**
   * Log d'information (affiché uniquement en dev)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log d'avertissement (affiché uniquement en dev)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log d'erreur (TOUJOURS affiché, même en prod)
   * Important pour le monitoring
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Log d'information (alias)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default logger;
