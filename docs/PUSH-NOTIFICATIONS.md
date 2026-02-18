# 📱 Notifications PUSH - C6Radio

## 🎯 Vue d'ensemble

Système de notifications push multiplateforme pour l'application C6Radio utilisant **Firebase Cloud Messaging (FCM) API v1** avec OAuth 2.0.

### Fonctionnalités
- ✅ **Notifications automatiques** à chaque publication d'article
- ✅ **Notifications manuelles** déclenchables par les admins WordPress
- ✅ **Support multiplateforme** : Web, iOS, Android
- ✅ **Gestion centralisée** via interface WordPress
- ✅ **Protection anti-doublon** pour les envois automatiques
- ✅ **Historique complet** des notifications envoyées

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Firebase FCM   │  ← Service d'envoi de notifications
└────────┬────────┘
         │
    ┌────▼─────┐
    │ WordPress │  ← Backend : gestion tokens + envoi
    │  Plugin   │     (OAuth 2.0 + Service Account)
    └────┬─────┘
         │
    ┌────▼─────────────────────────┐
    │  React App (Capacitor)       │
    ├──────────────────────────────┤
    │ • Web: Firebase JS SDK       │
    │ • iOS: Firebase iOS SDK      │
    │ • Android: Firebase Android  │
    └──────────────────────────────┘
```

---

## 📦 Composants

### 1. Frontend React
- **`/src/services/pushNotifications.js`** - Service principal (web + native)
- **`/src/config/firebase.config.js`** - Configuration Firebase
- **`/public/firebase-messaging-sw.js`** - Service Worker (web)

### 2. Backend WordPress
- **Plugin** : `/docs/sessions/c6radio-push-notifications.zip` (v2.1.0)
  - `c6radio-push-notifications.php` - Fichier principal
  - `includes/class-fcm-sender.php` - Envoi FCM avec OAuth 2.0
  - `includes/class-token-manager.php` - Gestion BDD tokens
  - `includes/class-admin-ui.php` - Interface admin WordPress
  - `assets/admin.css` - Styles admin

### 3. Configuration iOS
- **`/ios/App/App/AppDelegate.swift`** - Initialisation Firebase + APNS
- **`/ios/App/App/Info.plist`** - UIBackgroundModes
- **`/ios/App/App/App.entitlements`** - Push Notifications capability
- **`/ios/App/CapApp-SPM/Package.swift`** - Dépendances Firebase

### 4. CI/CD
- **`/.github/workflows/ios-build-unsigned.yml`** - Build iOS avec Firebase

---

## 🔧 Configuration Firebase

### 1. Créer le projet Firebase
1. Console Firebase : https://console.firebase.google.com
2. Créer projet : **c6radio-push**
3. Ajouter 3 applications :
   - 🌐 Web App
   - 🍎 iOS App (Bundle ID: `fr.c6media.radio`)
   - 🤖 Android App

### 2. Activer Cloud Messaging API v1
1. Google Cloud Console : https://console.cloud.google.com
2. Activer **Cloud Messaging API**
3. Créer **Service Account** avec rôle "Firebase Admin SDK Administrator"
4. Télécharger **clé JSON** du Service Account

### 3. Configuration Web
```javascript
// src/config/firebase.config.js
export const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "c6radio-push.firebaseapp.com",
  projectId: "c6radio-push",
  storageBucket: "c6radio-push.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

export const vapidKey = "BH3x..."; // Clé publique Web Push
```

### 4. Configuration iOS
- Télécharger **GoogleService-Info.plist**
- Ajouter à Xcode dans le target App (drag & drop)
- Activer **Push Notifications** capability

### 5. Configuration Android
- Télécharger **google-services.json**
- Placer dans `/android/app/`

---

## 🚀 Installation

### 1. Frontend

#### Dépendances déjà installées
```json
{
  "@capacitor/push-notifications": "^6.0.2",
  "firebase": "^10.7.1"
}
```

#### Service Worker
Le Service Worker `/public/firebase-messaging-sw.js` gère les notifications en arrière-plan.

**Important** : Le SW doit être à la racine du domaine (`/firebase-messaging-sw.js`).

### 2. Backend WordPress

#### Installation du plugin
1. WordPress Admin > Extensions > Ajouter > Téléverser
2. Choisir `/docs/sessions/c6radio-push-notifications.zip`
3. Activer le plugin
4. Aller dans **Push Notifs > Paramètres**

#### Configuration WordPress
1. **Project ID** : `c6radio-push`
2. **Service Account JSON** : Coller le contenu du fichier JSON téléchargé
3. **Envoi auto** : ✅ Cocher pour activer les notifications automatiques

#### Tables créées automatiquement
```sql
wp_c6radio_push_tokens   -- Stockage des tokens FCM
wp_c6radio_push_history  -- Historique des envois
```

---

## 📱 Utilisation

### Notifications manuelles
1. WordPress Admin > **Push Notifs > Envoyer**
2. Remplir :
   - **Titre** (max 65 caractères)
   - **Message** (max 240 caractères)
   - **Article** (optionnel) - pour lien deep linking
   - **Image URL** (optionnel)
3. Cliquer **Envoyer**

### Notifications automatiques
À chaque publication d'article :
- **Titre** : "Nouvel article C6Radio"
- **Message** : Titre de l'article
- **Image** : Image mise en avant de l'article
- **Deep link** : Vers l'article (`/article/{slug}`)

Protection anti-doublon : 60 secondes entre deux envois pour le même article.

### Historique
WordPress Admin > **Push Notifs > Historique**
- Date/heure d'envoi
- Titre et message
- Nombre d'appareils touchés

### Statistiques
WordPress Admin > **Push Notifs**
- Total d'appareils enregistrés
- Répartition par plateforme (iOS / Android / Web)

---

## 🔐 Sécurité

### OAuth 2.0 Flow (FCM API v1)
```
1. Génération JWT signé avec clé privée Service Account
2. Échange JWT contre Access Token (Google OAuth)
3. Utilisation Access Token pour appeler FCM API
4. Token valide 1h, regénéré automatiquement
```

### REST API WordPress
```
POST /wp-json/c6radio/v1/register-token
POST /wp-json/c6radio/v1/unregister-token
```
- ✅ `permission_callback: '__return_true'` (pas d'auth requise)
- ✅ Tokens stockés en base avec timestamp
- ✅ Nettoyage automatique des tokens invalides

---

## 🧪 Tests

### Test Web (Chrome/Firefox)
1. Ouvrir l'app : `http://localhost:5173`
2. Autoriser les notifications (popup navigateur)
3. Vérifier dans la console :
   ```
   ✅ Firebase initialisé pour notifications web
   ✅ Service Worker enregistré
   🌐 Token FCM web: cYFYTCBEdwejz...
   ✅ Token enregistré
   ```
4. Envoyer une notification test depuis WordPress
5. **Tu devrais recevoir la notification !**

### Test iOS (simulateur ne supporte PAS les push)
**Prérequis** : Mac avec Xcode, appareil physique

1. Ouvrir le projet Xcode : `/ios/App/App.xcworkspace`
2. Signer l'app avec ton compte Apple Developer
3. Connecter un iPhone physique
4. Build & Run
5. Autoriser les notifications
6. Envoyer une notification test depuis WordPress

**Note** : L'app crash actuellement au lancement (à debugger sur Mac).

### Test Android
**Prérequis** : Android Studio, émulateur/appareil avec Google Play Services

1. `npx cap sync android`
2. Ouvrir dans Android Studio
3. Build & Run
4. Autoriser les notifications
5. Envoyer une notification test

**Status** : Non testé (pas d'appareil Android disponible).

---

## 🐛 Résolution de problèmes

### Notifications non reçues sur Web
1. **Vérifier les permissions** : Paramètres navigateur > Site web > Notifications = Autorisé
2. **Vérifier le Service Worker** :
   - DevTools > Application > Service Workers
   - Le SW doit être actif (`firebase-messaging-sw.js`)
3. **Vérifier le token** :
   - Console : chercher `🌐 Token FCM web:`
   - WordPress Admin > Push Notifs : vérifier qu'il y a des appareils web

### Erreur "Token invalide" (HTTP 400)
- Le token a expiré ou est révoqué
- Le plugin supprime automatiquement les tokens invalides
- L'utilisateur doit rouvrir l'app pour générer un nouveau token

### Erreur "Invalid value at 'message.data'" (HTTP 400)
**RÉSOLU** : FCM API v1 exige que toutes les valeurs dans `data` soient des strings.
- Le plugin convertit maintenant tous les objets/tableaux en JSON strings

### Envoi en double sur publication d'article
**RÉSOLU** : WordPress déclenche parfois `publish_post` plusieurs fois.
- Protection ajoutée : transient de 60 secondes bloque les doublons

### iOS : "no such module 'FirebaseCore'"
**Problème** : `npx cap sync` régénère `Package.swift` et supprime Firebase.

**Solution** : Le workflow GitHub Actions réinjecte Firebase après `cap sync` :
```bash
sed -i '' '/dependencies: \[/a\
.package(url: "https://github.com/firebase/firebase-ios-sdk", from: "11.0.0"),
' ios/App/CapApp-SPM/Package.swift
```

### iOS : App crash au lancement
**Cause probable** : `GoogleService-Info.plist` manquant ou mal configuré.
**Solution** : Ouvrir Xcode, ajouter le fichier manuellement au target.

---

## 📊 Structure BDD WordPress

### Table `wp_c6radio_push_tokens`
```sql
id           BIGINT(20) AUTO_INCREMENT PRIMARY KEY
token        VARCHAR(255) UNIQUE NOT NULL
platform     ENUM('ios', 'android', 'web') NOT NULL
created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
last_used    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### Table `wp_c6radio_push_history`
```sql
id           BIGINT(20) AUTO_INCREMENT PRIMARY KEY
title        VARCHAR(255) NOT NULL
message      TEXT NOT NULL
article_id   BIGINT(20) NULL
sent_count   INT DEFAULT 0
sent_at      DATETIME DEFAULT CURRENT_TIMESTAMP
sent_by      BIGINT(20) NULL  -- User ID WordPress
```

---

## 🔄 Deep Linking

### Format de notification avec lien
```javascript
{
  notification: {
    title: "Nouvel article C6Radio",
    body: "Titre de l'article",
    image: "https://..."
  },
  data: {
    articleSlug: "mon-article",  // Pour navigation React Router
    articleId: "123"              // ID WordPress
  }
}
```

### Gestion dans l'app
**Service Worker** (web) :
```javascript
// firebase-messaging-sw.js ligne 46-73
self.addEventListener('notificationclick', (event) => {
  const articleSlug = event.notification.data?.articleSlug;
  const url = articleSlug 
    ? `${self.location.origin}/article/${articleSlug}`
    : self.location.origin;
  event.waitUntil(clients.openWindow(url));
});
```

**iOS/Android** :
- Capacitor intercepte les clics via `PushNotifications.addListener('pushNotificationActionPerformed')`
- Navigation vers `/article/{slug}` via React Router

---

## 📈 Évolutions futures

### Fonctionnalités à implémenter
- [ ] **Segmentation** : Envoyer à une plateforme spécifique (iOS only, Android only, Web only)
- [ ] **Topics** : Abonnements thématiques (Actualités, Podcasts, Lives)
- [ ] **Planification** : Programmer l'envoi de notifications
- [ ] **A/B Testing** : Tester différents titres/messages
- [ ] **Analytics** : Taux d'ouverture, engagement
- [ ] **Rich Media** : Images, boutons d'action, sons personnalisés
- [ ] **Gestion des préférences** : Permettre aux utilisateurs de choisir leurs thèmes

### Backend custom (alternative à WordPress)
Pour plus de flexibilité, créer un backend Node.js/Python :
- API REST dédiée
- Gestion avancée des segments
- Intégration avec analytics
- Rate limiting
- Queue système (Redis/RabbitMQ)

---

## 📝 Fichiers de configuration clés

### `/src/services/pushNotifications.js`
Service principal gérant :
- Détection de plateforme (web vs native)
- Initialisation Firebase Web
- Enregistrement des tokens Capacitor (iOS/Android)
- Enregistrement du Service Worker (web)
- Gestion des notifications au premier plan
- Communication avec le backend WordPress

### `/public/firebase-messaging-sw.js`
Service Worker gérant :
- Réception des notifications en arrière-plan (web)
- Affichage des notifications quand l'app est fermée
- Deep linking au clic sur notification
- Gestion du badge/icône

### WordPress Plugin `class-fcm-sender.php`
Envoi FCM avec :
- Génération JWT (RS256) avec clé privée Service Account
- Échange JWT contre Access Token OAuth 2.0
- Appel FCM API v1 (`https://fcm.googleapis.com/v1/projects/{project_id}/messages:send`)
- Gestion des erreurs HTTP (400/401/403/404/500)
- Marquage automatique des tokens invalides

### GitHub Actions `/github/workflows/ios-build-unsigned.yml`
Build iOS avec :
- Installation des dépendances SPM
- Réinjection de Firebase après `cap sync`
- Résolution des packages Swift
- Archive Xcode

---

## 🎓 Ressources

### Documentation officielle
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [FCM API v1 Migration](https://firebase.google.com/docs/cloud-messaging/migrate-v1)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Guides créés pour ce projet
- `/docs/sessions/FIREBASE-SETUP.md` - Setup Firebase initial
- `/docs/sessions/README-FCM-V1.md` - Migration vers FCM API v1
- `/docs/sessions/IOS-PUSH-CONFIG.md` - Configuration iOS
- `/docs/sessions/ANDROID-PUSH-CONFIG.md` - Configuration Android
- `/docs/sessions/TEST-WEB-PUSH.md` - Guide de test web

---

## ✅ Status implémentation

| Plateforme | Token Registration | Receive Notif | Deep Linking | Status |
|------------|-------------------|---------------|--------------|--------|
| **Web (Chrome/Firefox/Edge)** | ✅ | ✅ | ✅ | **✅ PRODUCTION** |
| **iOS** | ✅ | ❌ (crash) | ⚠️ Non testé | **⚠️ Bloqué (besoin Mac)** |
| **Android** | ⚠️ Non testé | ⚠️ Non testé | ⚠️ Non testé | **⚠️ En attente** |
| **WordPress Plugin** | ✅ | - | - | **✅ PRODUCTION v2.1.0** |
| **Notifications auto** | ✅ | ✅ | ✅ | **✅ PRODUCTION** |
| **Notifications manuelles** | ✅ | ✅ | ✅ | **✅ PRODUCTION** |
| **Protection anti-doublon** | ✅ | - | - | **✅ PRODUCTION** |

### ✅ Validé en production (17 février 2026)
- **Localhost** : Testé et fonctionnel
- **Production** (https://exp937.fr) : Testé et fonctionnel
- **Multi-utilisateurs** : Testé sur plusieurs PC/navigateurs
- **Notifications foreground** : ✅ Reçues et affichées
- **Notifications background** : ✅ Reçues même app fermée
- **Deep linking** : ✅ Redirection vers article au clic
- **Envoi automatique** : ✅ Fonctionne à la publication d'article
- **Envoi manuel** : ✅ Interface WordPress opérationnelle
- **Anti-doublon** : ✅ Protection 60s validée

---

## 🏆 Résumé

Le système de notifications push est **100% fonctionnel en PRODUCTION WEB** ! 🎉

### ✅ Ce qui fonctionne (validé le 17/02/2026)
- ✅ **Envoi manuel** : Interface WordPress opérationnelle
- ✅ **Envoi automatique** : Notification à chaque article publié
- ✅ **Deep linking** : Redirection vers l'article au clic
- ✅ **Protection anti-doublon** : Transient 60s empêche les doublons
- ✅ **Interface WordPress** : Dashboard, historique, statistiques
- ✅ **Multi-utilisateurs** : Testé sur plusieurs navigateurs/PC
- ✅ **Background notifications** : Fonctionne même app fermée
- ✅ **Production** : Déployé et testé sur https://exp937.fr

### ⏳ En attente
- ⚠️ **iOS** : Code configuré, build OK, mais crash au lancement (besoin Mac pour debug)
- ⚠️ **Android** : Configuration à faire, pas d'appareil de test disponible

### 🎯 Objectifs atteints
1. ✅ Notifications automatiques ET manuelles (les deux fonctionnent !)
2. ✅ Backend WordPress centralisé avec interface intuitive
3. ✅ Deep linking vers les articles
4. ✅ Gestion complète des tokens et historique
5. ✅ Production-ready pour le web

**Prêt pour la production Web !** 🚀

---

## 📅 Timeline du développement (17 février 2026)

### Phase 1 : Configuration initiale (matin)
- ✅ Création du projet Firebase (c6radio-push)
- ✅ Configuration des 3 apps (Web, iOS, Android)
- ✅ Activation Cloud Messaging API v1
- ✅ Création Service Account + téléchargement JSON
- ✅ Configuration VAPID key pour web

### Phase 2 : Frontend React
- ✅ Installation dépendances (firebase, @capacitor/push-notifications)
- ✅ Création `/src/config/firebase.config.js`
- ✅ Création `/src/services/pushNotifications.js`
- ✅ Création `/public/firebase-messaging-sw.js`
- ✅ Intégration dans `/src/App.jsx`

### Phase 3 : Backend WordPress
- ✅ Développement plugin v1.0 (FCM Legacy API)
- ❌ Découverte : Legacy API deprecated !
- ✅ Migration vers FCM API v1 (OAuth 2.0)
- ✅ Création classe `FCM_Sender` avec JWT generation
- ✅ Création classe `Token_Manager` pour BDD
- ✅ Création classe `Admin_UI` pour interface
- ✅ Création tables MySQL automatiques
- ✅ REST API endpoints (`/register-token`, `/unregister-token`)

### Phase 4 : Debugging (après-midi)
- 🐛 Erreur "Invalid value at 'message.data'" → **RÉSOLU** : Conversion objets en strings
- 🐛 Erreur HTTP 500 enregistrement tokens → **RÉSOLU** : Tables non créées + error logging
- 🐛 Notifications en double → **RÉSOLU** : Transient 60s anti-doublon
- 🐛 Service Worker introuvable en prod → **RÉSOLU** : Fichier non uploadé

### Phase 5 : iOS (tentatives)
- ✅ Configuration AppDelegate.swift
- ✅ Ajout Firebase iOS SDK via SPM
- ✅ Modification Info.plist + entitlements
- ✅ Workflow CI/CD avec réinjection Firebase
- ✅ Build réussit en CI/CD
- ❌ App crash au lancement (besoin Mac pour debug)

### Phase 6 : Tests et validation (soir)
- ✅ Tests localhost : Notifications reçues ✅
- ✅ Tests production (exp937.fr) : Notifications reçues ✅
- ✅ Tests multi-utilisateurs : Plusieurs PC ✅
- ✅ Tests envoi automatique : Publication article ✅
- ✅ Tests envoi manuel : Interface WordPress ✅
- ✅ Tests deep linking : Redirection article ✅

### Phase 7 : Documentation
- ✅ Création `/docs/PUSH-NOTIFICATIONS.md` (guide complet)
- ✅ Checkpoint session
- ✅ Message de commit
- ✅ Plugin production v2.1.0

---

## 🎓 Leçons apprises

1. **FCM Legacy API deprecated** : Toujours vérifier la doc officielle, l'API v1 avec OAuth 2.0 est plus complexe mais obligatoire depuis 2024
2. **Service Workers scope** : Le SW doit être à la racine du domaine pour avoir accès à toutes les routes
3. **WordPress transients** : Parfait pour anti-doublon temporaire (60s), évite les race conditions
4. **React StrictMode** : Double les useEffect en dev, attention aux side effects (enregistrement multiple)
5. **Capacitor SPM** : `cap sync` régénère Package.swift, nécessite automatisation CI/CD pour réinjecter Firebase
6. **FCM data field** : Toutes les valeurs doivent être des strings, les objets/tableaux doivent être JSON stringifiés
7. **MIME types** : Les serveurs web peuvent retourner 'text/html' pour un JS manquant, vérifier toujours l'upload complet

---

## 💡 Améliorations possibles (futures)

### Court terme
- [ ] Tester et valider Android
- [ ] Débugger crash iOS (requiert Mac)
- [ ] Ajouter option "tester la notification" dans WordPress (envoyer à soi-même)
- [ ] Permettre personnalisation du titre automatique ("Nouvel article" → customizable)

### Moyen terme
- [ ] Segmentation : Envoyer uniquement à iOS, Android ou Web
- [ ] Topics Firebase : Abonnements thématiques (Actualités, Podcasts, Lives)
- [ ] Statistiques : Taux d'ouverture, engagement par notification
- [ ] Planification : Programmer envoi à date/heure précise
- [ ] Prévisualisation : Voir à quoi ressemble la notification avant d'envoyer

### Long terme
- [ ] Rich notifications : Boutons d'action, images inline, sons personnalisés
- [ ] A/B Testing : Tester plusieurs variantes de titre/message
- [ ] Backend custom : Node.js/Python avec queue système (Redis) pour meilleures performances
- [ ] Analytics avancés : Dashboard temps réel, heatmaps de clics
- [ ] Préférences utilisateur : Gérer abonnements depuis l'app
- [ ] Push silencieuses : Mettre à jour données sans notifier l'utilisateur

**Prêt pour la production Web !** 🚀
