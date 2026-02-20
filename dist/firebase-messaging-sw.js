// Service Worker pour Firebase Cloud Messaging (Notifications Web)
// Ce fichier doit être à la racine du site (public/)

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuration Firebase (doit correspondre à src/config/firebase.config.js)
const firebaseConfig = {
  apiKey: "AIzaSyCHqtJXWjToHqncgvrbI4UKaizpUnc9KdU",
  authDomain: "c6radio-push.firebaseapp.com",
  projectId: "c6radio-push",
  storageBucket: "c6radio-push.firebasestorage.app",
  messagingSenderId: "295851914513",
  appId: "1:295851914513:web:8b0bf6a47f596b289e48b0"
};

// Initialiser Firebase dans le Service Worker
firebase.initializeApp(firebaseConfig);

// Récupérer l'instance de messaging
const messaging = firebase.messaging();

// Gérer les notifications en arrière-plan (quand l'app est fermée/minimisée)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification?.title || 'C6Radio';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.image || '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data,
    tag: 'c6radio-notification',
    requireInteraction: false,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer le clic sur la notification
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification cliquée:', event.notification);

  event.notification.close();

  const data = event.notification.data || {};
  const articleSlug = data.articleSlug || data.slug;

  // Ouvrir ou focus la fenêtre de l'app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si une fenêtre est déjà ouverte, la focus
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            if (articleSlug) {
              // Envoyer un message pour naviguer vers l'article
              client.postMessage({
                type: 'NAVIGATE_TO_ARTICLE',
                slug: articleSlug,
              });
            }
            return client.focus();
          }
        }

        // Sinon, ouvrir une nouvelle fenêtre
        const url = articleSlug 
          ? `${self.registration.scope}news/${articleSlug}`
          : self.registration.scope;
        
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
