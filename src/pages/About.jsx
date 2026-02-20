/**
 * Page À Propos - C6Radio
 * 
 * Cette page présente la radio et son équipe.
 */

import './About.css';

function About() {
  return (
    <div className="page-container about-page">
      <main className="main-content">
        <h1>À Propos de C6Radio</h1>

        <section className="content-section">
          <h2>Notre Mission</h2>
          <p>
            C6Radio est née de la passion pour la musique alternative et la
            chanson française. Notre mission est de faire découvrir de nouveaux
            artistes et de partager notre amour pour la musique avec vous.
          </p>
        </section>

        <section className="content-section">
          <h2>Notre Histoire</h2>
          <p>
            Depuis sa création, C6Radio s'est imposée comme une référence pour
            les amateurs de rock alternatif et de chanson française. Nous
            diffusons 24h/24 et 7j/7 une sélection musicale unique et éclectique.
          </p>
        </section>

        <section className="content-section">
          <h2>Notre Équipe</h2>
          <p>
            Une équipe de passionnés de musique sélectionne chaque jour les
            meilleurs titres pour vous offrir une expérience d'écoute
            inoubliable.
          </p>
        </section>
      </main>
    </div>
  );
}

export default About;
