/**
 * Service de gestion des notifications PUSH
 * Supporte iOS, Android (via Capacitor) et Web (via Firebase)
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '../config/firebase.config.js';
import { WP_PLUGIN_URL } from '../config/constants.js';

const isNativePlatform = Capacitor.isNativePlatform();

let firebaseApp = null;
let messaging = null;

/**
 * Initialise Firebase (Web uniquement)
 */
const initFirebase = () => {
  if (!isNativePlatform && !firebaseApp) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
      messaging = getMessaging(firebaseApp);
      console.log('✅ Firebase initialisé pour notifications web');
    } catch (error) {
      console.error('❌ Erreur initialisation Firebase:', error);
    }
  }
};

/**
 * Demande la permission pour les notifications
 * @returns {Promise<boolean>} true si accordée
 */
export const requestPermission = async () => {
  try {
    if (isNativePlatform) {
      // iOS/Android via Capacitor
      const result = await PushNotifications.requestPermissions();
      return result.receive === 'granted';
    } else {
      // Web via Notification API
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  } catch (error) {
    console.error('❌ Erreur demande permission:', error);
    return false;
  }
};

/**
 * Enregistre le token FCM auprès du backend WordPress
 * @param {string} token - Token FCM
 * @param {string} platform - 'ios', 'android' ou 'web'
 */
const registerTokenWithBackend = async (token, platform) => {
  try {
    const response = await fetch(`${WP_PLUGIN_URL}/register-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, platform }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Token enregistré:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur enregistrement token:', error);
    // On stocke quand même le token localement pour retry plus tard
    localStorage.setItem('pendingPushToken', JSON.stringify({ token, platform }));
  }
};

/**
 * Obtient le token FCM pour les notifications natives (Capacitor)
 */
const registerNativePush = async () => {
  try {
    // Nettoyer les anciens listeners pour éviter les doublons (ex: re-init app)
    await PushNotifications.removeAllListeners();

    // IMPORTANT: ajouter les listeners AVANT d'appeler register()

    // Écoute de la réception du token FCM
    PushNotifications.addListener('registration', async (token) => {
      console.log('📱 Token push reçu:', token.value);
      const platform = Capacitor.getPlatform(); // 'ios' ou 'android'
      await registerTokenWithBackend(token.value, platform);
      localStorage.setItem('pushToken', token.value);
    });

    // Erreur d'enregistrement
    PushNotifications.addListener('registrationError', (error) => {
      console.error('❌ Erreur enregistrement push:', error);
    });

    // Notification reçue quand l'app est au premier plan
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('🔔 Notification reçue (app active):', notification);
      // Afficher une notification in-app ou un toast
      showInAppNotification(notification);
    });

    // Notification cliquée (app en arrière-plan ou fermée)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('👆 Notification cliquée:', action);
      handleNotificationClick(action.notification);
    });

    // Démarrer l'enregistrement APRÈS avoir mis en place les listeners
    await PushNotifications.register();
  } catch (error) {
    console.error('❌ Erreur initialisation push natif:', error);
  }
};

/**
 * Obtient le token FCM pour les notifications web (Firebase)
 */
const registerWebPush = async () => {
  try {
    initFirebase();
    
    if (!messaging) {
      console.warn('⚠️ Firebase Messaging non disponible');
      return;
    }

    // Enregistrer le Service Worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('✅ Service Worker enregistré:', registration);
    }

    // Obtenir le token FCM
    const token = await getToken(messaging, { vapidKey });
    console.log('🌐 Token FCM web:', token);
    
    await registerTokenWithBackend(token, 'web');
    localStorage.setItem('pushToken', token);

    // Écouter les messages quand l'app est active
    onMessage(messaging, (payload) => {
      console.log('🔔 Message reçu (web):', payload);
      showInAppNotification(payload);
    });

    // Écouter les messages du Service Worker pour navigation
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NAVIGATE_TO_ARTICLE') {
        window.dispatchEvent(new CustomEvent('navigate-to-article', { 
          detail: { slug: event.data.slug } 
        }));
      }
    });
  } catch (error) {
    console.error('❌ Erreur enregistrement push web:', error);
    if (error.code === 'messaging/permission-blocked') {
      console.warn('🚫 Permissions notifications bloquées par l\'utilisateur');
    }
  }
};

/**
 * Initialise le système de notifications PUSH
 */
export const initPushNotifications = async () => {
  console.log('🚀 Initialisation des notifications PUSH...');

  // Vérifier si déjà enregistré
  const existingToken = localStorage.getItem('pushToken');
  if (existingToken) {
    console.log('ℹ️ Token déjà enregistré:', existingToken);
    // On peut quand même retry un pending token si il existe
    const pending = localStorage.getItem('pendingPushToken');
    if (pending) {
      try {
        const { token, platform } = JSON.parse(pending);
        await registerTokenWithBackend(token, platform);
        localStorage.removeItem('pendingPushToken');
      } catch (e) {
        console.error('Erreur retry token pending:', e);
      }
    }
  }

  // Demander la permission
  const granted = await requestPermission();
  if (!granted) {
    console.warn('⚠️ Permission notifications refusée');
    return false;
  }

  // Enregistrer selon la plateforme
  if (isNativePlatform) {
    await registerNativePush();
  } else {
    await registerWebPush();
  }

  return true;
};

/**
 * Affiche une notification in-app quand l'application est active
 * @param {Object} notification - Données de notification
 */
const showInAppNotification = (notification) => {
  // TODO: Implémenter UI (Toast, Modal, etc.)
  const title = notification.title || notification.notification?.title || 'C6Radio';
  const body = notification.body || notification.notification?.body || '';
  
  console.log(`📬 [${title}] ${body}`);
  
  // Pour l'instant, on utilise les notifications du navigateur si disponible
  if (!isNativePlatform && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    });
  }
};

/**
 * Gère le clic sur une notification (navigation)
 * @param {Object} notification - Données de notification
 */
const handleNotificationClick = (notification) => {
  const data = notification.data || {};
  const articleSlug = data.articleSlug || data.slug;

  if (articleSlug) {
    // Navigation vers l'article (React Router)
    // Note: Nécessite l'accès au router depuis App.jsx
    window.dispatchEvent(new CustomEvent('navigate-to-article', { 
      detail: { slug: articleSlug } 
    }));
  }
};

/**
 * Désactive les notifications (supprime le token)
 */
export const unregisterPushNotifications = async () => {
  try {
    const token = localStorage.getItem('pushToken');
    if (!token) return;

    // Supprimer du backend
    await fetch(`${WP_PLUGIN_URL}/unregister-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    // Désinscrire localement
    if (isNativePlatform) {
      // Capacitor n'a pas de méthode unregister, on supprime juste le token
      PushNotifications.removeAllListeners();
    }

    localStorage.removeItem('pushToken');
    console.log('✅ Notifications désactivées');
  } catch (error) {
    console.error('❌ Erreur désactivation notifications:', error);
  }
};

/**
 * Vérifie si les notifications sont activées
 * @returns {boolean}
 */
export const isPushEnabled = () => {
  return !!localStorage.getItem('pushToken');
};
