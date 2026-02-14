import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Initialiser le player audio (reconnexion + media session)
import { initializeAudioPlayer } from "./services/audioPlayer.js";
initializeAudioPlayer();

/**
 * EXPLICATION POUR DÉBUTANTS :
 * ----------------------------
 * RouterProvider = Composant de React Router qui active la navigation
 * router = Configuration des routes (définie dans router.jsx)
 * 
 * AVANT : On affichait juste <App />
 * MAINTENANT : RouterProvider gère App + toutes les pages
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
