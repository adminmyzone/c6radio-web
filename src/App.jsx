import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PlayerBar from './components/PlayerBar';

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
 * - Outlet (contenu qui change selon la page)
 * - Footer (pied de page, défile avec le contenu)
 * - PlayerBar (en bas, fixe par-dessus tout)
 * 
 * Header et PlayerBar restent TOUJOURS visibles sur toutes les pages !
 * Footer défile avec le contenu (comportement normal).
 */
function App() {
  return (
    <>
      {/* Header toujours visible en haut */}
      <Header />
      
      <div className="app-container">
        {/* C'est ici que les pages s'affichent */}
        <Outlet />
        
        {/* Footer en bas de chaque page */}
        <Footer />
      </div>
      
      {/* Player toujours visible en bas, par-dessus le reste */}
      <PlayerBar />
    </>
  );
}

export default App;
