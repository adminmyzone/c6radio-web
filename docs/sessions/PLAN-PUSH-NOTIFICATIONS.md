# Plan d'implémentation : Notifications PUSH

## 📋 Contexte du projet

**Application** : C6Radio Web - Application radio avec articles WordPress  
**Stack** : React 19 + Vite + Capacitor 8.1  
**Backend** : WordPress REST API (exp937.fr)  
**État actuel** : Aucun système de notifications PUSH ni d'authentification admin

---

## 🎯 Objectifs

1. ✅ **Notification automatique** à chaque publication d'un nouvel article
2. ✅ **Déclenchement manuel** par les administrateurs
3. ✅ Support **iOS et Android** (via Capacitor)
4. ✅ Support **Web** (optionnel, via Service Worker)

---

## 🏗️ Architecture proposée

### Option A : Solution complète avec Backend custom (RECOMMANDÉE)
**Avantages** : Contrôle total, sécurité, gestion admin complète  
**Stack** : Firebase Cloud Messaging (FCM) + Backend Node.js/Express + Admin Panel

### Option B : Solution WordPress-centrée (SIMPLE)
**Avantages** : Utilise l'infrastructure WordPress existante  
**Stack** : Plugin WordPress + Firebase Cloud Messaging

**CHOIX RECOMMANDÉ** : **Option B** pour démarrer rapidement, migration vers A si besoin

---

## 📝 Plan d'implémentation (Option B)

### **PHASE 1 : Configuration Firebase** 🔥

#### 1.1 Création du projet Firebase
- [ ] Créer un projet Firebase sur console.firebase.google.com
- [ ] Activer Firebase Cloud Messaging (FCM)
- [ ] Récupérer les clés :
  - Server Key (pour WordPress backend)
  - Sender ID + API Key (pour l'app)
  - Configuration web (Firebase Config Object)

#### 1.2 Configuration iOS
- [ ] Générer certificat APNS (Apple Push Notification Service)
- [ ] Uploader le certificat APNS dans Firebase Console
- [ ] Activer Push Notifications dans Xcode capabilities

#### 1.3 Configuration Android
- [ ] Télécharger `google-services.json` depuis Firebase
- [ ] Placer dans `android/app/google-services.json`

---

### **PHASE 2 : Installation côté Frontend (React App)** ⚛️

#### 2.1 Installation des dépendances
```bash
npm install @capacitor/push-notifications
npm install firebase
```

#### 2.2 Sync Capacitor
```bash
npx cap sync
```

#### 2.3 Créer le service de notifications
**Fichier** : `/src/services/pushNotifications.js`

**Fonctionnalités** :
- Initialisation FCM
- Demande de permission à l'utilisateur
- Enregistrement du token FCM
- Écoute des notifications reçues
- Gestion des actions (clic sur notification → ouvrir l'article)

#### 2.4 Intégrer dans l'application
**Fichier** : `/src/App.jsx`

**Actions** :
- Appeler `initPushNotifications()` au démarrage
- Demander permission au premier lancement
- Stocker le token FCM dans localStorage
- Envoyer le token au backend WordPress (via API)

#### 2.5 Gestion du clic sur notification
**Fichier** : `/src/services/pushNotifications.js`

**Comportement** :
- Notification contient `articleSlug` dans les données
- Au clic → Navigation vers `/news/:slug`
- Si app fermée → Ouvrir + naviguer
- Si app active → Naviguer directement

---

### **PHASE 3 : Backend WordPress** 🔌

#### 3.1 Installation du plugin WordPress
**Options** :
- **Option 1** : Plugin existant (OneSignal, Pusher, etc.)
- **Option 2** : Plugin custom développé spécifiquement

**RECOMMANDATION** : Plugin custom pour contrôle total

#### 3.2 Créer un plugin WordPress custom
**Nom** : `c6radio-push-notifications`  
**Localisation** : `/wp-content/plugins/c6radio-push-notifications/`

**Fichiers** :
```
c6radio-push-notifications/
├── c6radio-push-notifications.php (Main plugin file)
├── includes/
│   ├── class-fcm-sender.php (Envoi via FCM)
│   ├── class-token-manager.php (Gestion tokens devices)
│   └── class-admin-ui.php (Interface admin)
└── assets/
    └── admin.css
```

#### 3.3 Fonctionnalités du plugin

##### A. Enregistrement des tokens
**Endpoint REST API** : `POST /wp-json/c6radio/v1/register-token`
```json
{
  "token": "fcm_device_token_here",
  "platform": "ios" | "android" | "web"
}
```
- Stocke les tokens dans une table custom `wp_push_tokens`
- Vérifie les doublons (1 token = 1 device)

##### B. Envoi automatique lors de publication
**Hook WordPress** : `publish_post`
```php
add_action('publish_post', 'c6radio_send_push_on_publish', 10, 2);
```
- Détecte la publication d'un nouveau post
- Récupère titre, extrait, image featured
- Envoie notification à TOUS les tokens enregistrés
- Payload FCM :
  ```json
  {
    "notification": {
      "title": "Nouvel article C6Radio",
      "body": "Titre de l'article",
      "image": "URL_featured_image"
    },
    "data": {
      "articleSlug": "slug-article",
      "articleId": "123"
    }
  }
  ```

##### C. Interface admin manuelle
**Localisation** : Menu WordPress Admin → "Notifications Push"

**Fonctionnalités** :
- Liste des tokens enregistrés (nombre total iOS/Android/Web)
- Formulaire d'envoi manuel :
  - Titre de la notification
  - Message
  - Sélection d'un article (optionnel)
  - Bouton "Envoyer à tous"
- Historique des notifications envoyées
- Statistiques (nombre d'envois, erreurs)

##### D. Table base de données
**Table** : `wp_push_tokens`
```sql
CREATE TABLE wp_push_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  platform ENUM('ios', 'android', 'web') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Table** : `wp_push_history`
```sql
CREATE TABLE wp_push_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  article_id BIGINT NULL,
  sent_count INT DEFAULT 0,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_by BIGINT NULL (user_id)
);
```

---

### **PHASE 4 : Configuration native (iOS/Android)** 📱

#### 4.1 iOS (Xcode)
**Fichier** : `ios/App/App/Info.plist`
- Ajouter permissions pour notifications

**Fichier** : `ios/App/App/AppDelegate.swift`
- Configurer Firebase
- Enregistrer pour APNS

**Fichier** : `ios/App/Podfile`
```ruby
pod 'Firebase/Messaging'
```

**Commandes** :
```bash
cd ios/App
pod install
```

#### 4.2 Android
**Fichier** : `android/app/build.gradle`
```gradle
apply plugin: 'com.google.gms.google-services'
dependencies {
    implementation 'com.google.firebase:firebase-messaging'
}
```

**Fichier** : `android/build.gradle`
```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}
```

**Fichier** : `android/app/src/main/AndroidManifest.xml`
- Ajouter permissions `POST_NOTIFICATIONS` (Android 13+)
- Configurer Firebase service

---

### **PHASE 5 : Tests et déploiement** 🧪

#### 5.1 Tests unitaires
- [ ] Test enregistrement token (mock API)
- [ ] Test réception notification (Firebase Test Console)
- [ ] Test navigation au clic
- [ ] Test permissions refusées/acceptées

#### 5.2 Tests manuels
- [ ] **iOS** : Tester sur simulateur + device réel
- [ ] **Android** : Tester sur émulateur + device réel
- [ ] **Scénario 1** : App fermée → Notification reçue → Clic → Ouvre l'article
- [ ] **Scénario 2** : App active → Notification reçue → Toast ou modal
- [ ] **Scénario 3** : Publier article WordPress → Notification automatique
- [ ] **Scénario 4** : Admin envoie notification manuelle → Réception

#### 5.3 Déploiement
- [ ] Build iOS production (TestFlight puis App Store)
- [ ] Build Android production (Google Play Console)
- [ ] Installer plugin WordPress en production
- [ ] Configurer Firebase en production (clés séparées dev/prod)

---

## 📦 Livrables

### Code
- ✅ Service React : `/src/services/pushNotifications.js`
- ✅ Plugin WordPress : `c6radio-push-notifications.zip`
- ✅ Configuration iOS : modifications Xcode
- ✅ Configuration Android : modifications Gradle

### Documentation
- ✅ Guide installation plugin WordPress
- ✅ Guide configuration Firebase
- ✅ Guide utilisateur admin (comment envoyer notif manuelle)

### Tests
- ✅ Checklist de test complète
- ✅ Scénarios validés iOS/Android

---

## ⚠️ Points d'attention

### Sécurité
- ❌ **Ne JAMAIS exposer le Server Key Firebase côté client**
- ✅ Le Server Key reste uniquement côté WordPress backend
- ✅ Valider l'origine des tokens enregistrés (éviter spam)
- ✅ Nettoyer régulièrement les tokens expirés/invalides

### Performance
- ✅ Envoyer les notifications par batch (FCM supporte jusqu'à 500 tokens/requête)
- ✅ Gérer les erreurs FCM (tokens invalides → supprimer de la DB)
- ✅ Rate limiting sur l'endpoint d'enregistrement de tokens

### UX
- ✅ Demander la permission au bon moment (pas au premier lancement, mais après engagement)
- ✅ Expliquer clairement pourquoi l'utilisateur doit activer les notifications
- ✅ Permettre de désactiver dans les paramètres de l'app

### Légal (RGPD)
- ✅ Informer l'utilisateur du stockage du token
- ✅ Permettre la suppression du token (désinscription)
- ✅ Ajouter une mention dans la politique de confidentialité

---

## 🔄 Évolutions futures

### Phase 2 (après MVP)
- [ ] Notifications segmentées par catégories (Sport, Culture, etc.)
- [ ] Planification de notifications (scheduler)
- [ ] Notifications riches (images, actions boutons)
- [ ] Analytics (taux d'ouverture, clics)
- [ ] A/B testing des messages

### Phase 3 (avancée)
- [ ] Notifications personnalisées (selon préférences utilisateur)
- [ ] Géolocalisation (notifications locales)
- [ ] Backend admin dédié (dashboard analytics)

---

## 📊 Estimation temps

| Phase | Tâche | Temps estimé |
|-------|-------|--------------|
| 1 | Configuration Firebase | 1h |
| 2 | Frontend React (service + intégration) | 3h |
| 3 | Plugin WordPress custom | 5h |
| 4 | Configuration native iOS/Android | 2h |
| 5 | Tests et débogage | 3h |
| **TOTAL** | | **14h** |

---

## 🚀 Prochaines étapes

1. ✅ **Valider ce plan** avec toi
2. ⏭️ **Créer le projet Firebase**
3. ⏭️ **Développer le service frontend**
4. ⏭️ **Développer le plugin WordPress**
5. ⏭️ **Tests et mise en production**

---

**Date création** : 17-02-2026  
**Auteur** : Copilot CLI  
**Statut** : 🟡 En attente de validation
