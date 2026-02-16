/**
 * Page d'accueil - C6Radio
 * 
 * Cette page simple affiche un message de bienvenue.
 * Plus tard, nous y ajouterons du contenu dynamique depuis WordPress.
 *
 * PHASE 6 : Les bannières publicitaires sont maintenant gérées system-wide dans App.jsx
 */

import './Home.css';

function Home() {
  return (
    <div className="page-container home-page">
      <main className="main-content">
        <section className="hero">
          <h1>Bienvenue sur C6Radio</h1>
          <p className="tagline">
            La radio alternative de Rock & Chanson Française
          </p>
        </section>

        <section className="content-section">
          <h2>À propos de C6Radio</h2>
          <p>
            C6Radio est votre destination pour découvrir le meilleur de la scène
            rock alternative et de la chanson française. Écoutez-nous en direct
            via le player ci-dessous !
          </p>
        </section>

        <section className="content-section">
          <h2>Programmation</h2>
          <p>
            Du rock énergique, des découvertes musicales, et les meilleurs
            artistes francophones. Une sélection unique 24h/24 et 7j/7.
          </p>
        </section>

      </main>
    </div>
  );
}

export default Home;
