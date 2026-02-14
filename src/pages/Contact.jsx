/**
 * Page Contact - C6Radio
 * 
 * Page simple avec informations de contact.
 * Plus tard, nous pourrons ajouter un formulaire de contact.
 */

import './Contact.css';

function Contact() {
  return (
    <div className="page-container contact-page">
      <main className="main-content">
        <h1>Contactez-Nous</h1>

        <section className="content-section">
          <h2>Nous Écrire</h2>
          <p>
            Vous avez une question, une suggestion de programmation ou
            simplement envie de nous dire bonjour ? N'hésitez pas à nous
            contacter !
          </p>
        </section>

        <section className="content-section contact-info">
          <h2>Informations de Contact</h2>
          <div className="contact-item">
            <strong>Email :</strong>
            <p>contact@c6radio.fr</p>
          </div>
          <div className="contact-item">
            <strong>Téléphone :</strong>
            <p>+33 (0)1 23 45 67 89</p>
          </div>
          <div className="contact-item">
            <strong>Adresse :</strong>
            <p>123 Rue de la Musique<br />75001 Paris, France</p>
          </div>
        </section>

        <section className="content-section">
          <h2>Réseaux Sociaux</h2>
          <p>
            Suivez-nous sur les réseaux sociaux pour rester informé de nos
            dernières actualités et découvertes musicales.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">Instagram</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contact;
