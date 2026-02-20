/**
 * Composant SocialShare - Boutons de partage social
 *
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * Ce composant affiche des boutons pour partager un article
 * sur les réseaux sociaux (Facebook, Twitter, WhatsApp, LinkedIn)
 * + un bouton pour copier le lien.
 *
 * PROPS :
 * - url : L'URL complète de l'article à partager
 * - title : Le titre de l'article
 *
 * COMMENT ÇA MARCHE ?
 * Chaque bouton ouvre une URL spéciale du réseau social
 * avec les paramètres pré-remplis (URL + titre).
 */

import { useState } from 'react';
import './SocialShare.css';

export default function SocialShare({ url, title }) {
  // État pour le feedback "Copié !" du bouton clipboard
  const [copied, setCopied] = useState(false);

  /**
   * Encode l'URL et le titre pour les passer dans les URLs de partage
   * 
   * POURQUOI ENCODER ?
   * Les URLs ne peuvent pas contenir d'espaces ou caractères spéciaux.
   * encodeURIComponent() transforme "Hello World!" en "Hello%20World%21"
   */
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  /**
   * URLS DE PARTAGE SOCIAL
   * 
   * Chaque réseau social a sa propre URL avec paramètres :
   * - Facebook : ?u= (URL)
   * - Twitter : ?url= et &text= (URL + texte)
   * - WhatsApp : ?text= (texte + URL combinés)
   * - LinkedIn : ?url= (URL)
   */
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  /**
   * Ouvre une fenêtre popup pour partager
   * 
   * PARAMÈTRES window.open :
   * - URL : L'URL à ouvrir
   * - target : '_blank' = nouvelle fenêtre
   * - features : Taille et position de la popup
   */
  const handleShare = (platform) => {
    const shareUrl = shareUrls[platform];
    
    // Ouvrir popup centrée (600x400 pixels)
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      shareUrl,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  /**
   * Copie le lien dans le presse-papiers
   * 
   * EXPLICATION :
   * navigator.clipboard.writeText() est une API moderne du navigateur
   * qui permet de copier du texte dans le presse-papiers.
   */
  const handleCopyLink = async () => {
    try {
      // Copier l'URL dans le presse-papiers
      await navigator.clipboard.writeText(url);
      
      // Afficher "Copié !" pendant 2 secondes
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
    } catch (err) {
      console.error('Erreur lors de la copie du lien:', err);
      // Fallback si clipboard API non disponible : sélectionner le texte
      alert(`Copiez ce lien : ${url}`);
    }
  };

  return (
    <div className="social-share">
      <h3 className="social-share__title">Partager cet article</h3>
      
      <div className="social-share__buttons">
        {/* Bouton Facebook */}
        <button
          className="social-share__button social-share__button--facebook"
          onClick={() => handleShare('facebook')}
          aria-label="Partager sur Facebook"
          type="button"
        >
          <span className="social-share__icon">📘</span>
          <span className="social-share__label">Facebook</span>
        </button>

        {/* Bouton Twitter */}
        <button
          className="social-share__button social-share__button--twitter"
          onClick={() => handleShare('twitter')}
          aria-label="Partager sur Twitter"
          type="button"
        >
          <span className="social-share__icon">🐦</span>
          <span className="social-share__label">Twitter</span>
        </button>

        {/* Bouton WhatsApp */}
        <button
          className="social-share__button social-share__button--whatsapp"
          onClick={() => handleShare('whatsapp')}
          aria-label="Partager sur WhatsApp"
          type="button"
        >
          <span className="social-share__icon">💬</span>
          <span className="social-share__label">WhatsApp</span>
        </button>

        {/* Bouton LinkedIn */}
        <button
          className="social-share__button social-share__button--linkedin"
          onClick={() => handleShare('linkedin')}
          aria-label="Partager sur LinkedIn"
          type="button"
        >
          <span className="social-share__icon">💼</span>
          <span className="social-share__label">LinkedIn</span>
        </button>

        {/* Bouton Copier le lien */}
        <button
          className="social-share__button social-share__button--copy"
          onClick={handleCopyLink}
          aria-label="Copier le lien"
          type="button"
        >
          <span className="social-share__icon">🔗</span>
          <span className="social-share__label">
            {copied ? 'Copié !' : 'Copier le lien'}
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * NOTES TECHNIQUES :
 * ------------------
 * 
 * URLS DE PARTAGE :
 * - Ces URLs sont officielles et documentées par chaque plateforme
 * - Elles ouvrent l'interface de partage native du réseau social
 * - Pas besoin de SDK ou d'authentification
 * 
 * POPUP vs NOUVEL ONGLET :
 * - window.open() avec dimensions = popup centrée
 * - Plus UX-friendly qu'un nouvel onglet plein écran
 * - L'utilisateur reste sur notre site après partage
 * 
 * CLIPBOARD API :
 * - Moderne et sécurisée (nécessite HTTPS en production)
 * - Fallback avec alert() si non disponible
 * - Feedback visuel "Copié !" pour confirmer l'action
 * 
 * ACCESSIBILITÉ :
 * - aria-label pour screen readers
 * - type="button" pour éviter submit de form
 * - Icônes + labels texte pour clarté
 */
