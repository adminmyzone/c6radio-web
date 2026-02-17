/**
 * Configuration Firebase pour les notifications PUSH
 * 
 * INSTRUCTIONS :
 * 1. Créer un projet Firebase sur console.firebase.google.com
 * 2. Aller dans Project Settings > General
 * 3. Sous "Your apps", ajouter une Web App
 * 4. Copier la configuration Firebase et remplacer les valeurs ci-dessous
 * 5. Aller dans Cloud Messaging et noter le "Server Key" (pour WordPress)
 */

export const firebaseConfig = {
  apiKey: "AIzaSyCHqtJXWjToHqncgvrbI4UKaizpUnc9KdU",
  authDomain: "c6radio-push.firebaseapp.com",
  projectId: "c6radio-push",
  storageBucket: "c6radio-push.firebasestorage.app",
  messagingSenderId: "295851914513",
  appId: "1:295851914513:web:8b0bf6a47f596b289e48b0"
};

// VAPID Key pour notifications web (Cloud Messaging > Web Push certificates)
export const vapidKey = "BAd8QnXXC96dqLj5634q22W3Woi4sAWhaCoi1JVhBXmYj-axUVOpk3Xam0haKtqzxBiH6ROlP-2H5jB3owKw4hg";
