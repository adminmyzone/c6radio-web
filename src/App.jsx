import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PlayerBar from './components/PlayerBar';
import BannerAd from './components/BannerAd';

/**
 * Composant App - Layout principal de l'application
 * 
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * <Outlet /> est un composant SPÉCIAL de React Router.
 * C'est comme un "trou" où les pages vont s'afficher.
 * 
 * STRUCTURE DE LA PAGE (de haut en bas) :
 * - Header (en haut, fixe)
 * - Bannière Header (toutes pages)
 * - Container avec sidebar (desktop) + contenu principal
 * - Bannière Footer (toutes pages)
 * - Footer (pied de page, défile avec le contenu)
 * - PlayerBar (en bas, fixe par-dessus tout)
 * 
 * PHASE 6 : Bannières publicitaires intégrées system-wide
 * - Bannière header : visible sur toutes les pages
 * - Bannière footer : visible sur toutes les pages
 * - Bannière sidebar : visible uniquement sur desktop (> 1024px)
 */
function App() {
  return (
    <>
      {/* Header toujours visible en haut */}
      <Header />
      
      {/* Bannière Header - Affichée sur toutes les pages */}
      <div className="banner-container banner-header-container">
        <BannerAd
          position="header"
          rotationInterval={6000}
          showIndicators={true}
          height="120px"
        />
      </div>

      <div className="app-container">
        {/* Layout avec sidebar (desktop uniquement) */}
        <div className="content-layout">
          {/* Sidebar avec bannières (desktop uniquement) */}
          <aside className="sidebar-banners">
            <BannerAd
              position="sidebar"
              rotationInterval={8000}
              showIndicators={true}
              height="600px"
            />
          </aside>

          {/* Contenu principal - C'est ici que les pages s'affichent */}
          <main className="main-content">
            <Outlet />
          </main>

            {/* Sidebar avec bannières (desktop uniquement) */}
            <aside className="sidebar-banners">
                <BannerAd
                    position="sidebar"
                    rotationInterval={8000}
                    showIndicators={true}
                    height="600px"
                />
            </aside>
        </div>

        {/* Bannière Footer - Affichée sur toutes les pages */}
        <div className="banner-container banner-footer-container">
          <BannerAd
            position="footer"
            rotationInterval={7000}
            showIndicators={true}
            height="100px"
          />
        </div>

        {/* Footer en bas de chaque page */}
        <Footer />
      </div>
      
      {/* Player toujours visible en bas, par-dessus le reste */}
      <PlayerBar />
    </>
  );
}

export default App;
