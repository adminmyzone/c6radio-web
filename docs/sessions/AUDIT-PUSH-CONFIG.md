# 🔔 Audit complet - Configuration Notifications PUSH

Date : 17/02/2026

## ✅ Ce qui FONCTIONNE

### Frontend (Web)
- ✅ Firebase initialisé correctement
- ✅ Service Worker enregistré
- ✅ Token FCM généré : `cYFYTCBEdwejz-0ipNNm0Q:APA91b...`
- ✅ Token envoyé à WordPress (parfois erreur 500, mais parfois succès)

### WordPress
- ✅ Plugin "C6Radio Push Notifications" activé
- ✅ Token apparaît dans "Push Notifs" (1 appareil Web)
- ✅ Service Account JSON configuré
- ✅ Project ID configuré : `c6radio-push`

---

## ❌ Ce qui NE FONCTIONNE PAS

### Envoi de notifications
- ❌ "Notification envoyée à 0 appareils"
- ❌ Le compteur d'appareils repart à zéro après l'envoi
- ❌ Les tokens sont supprimés (marqués comme invalides par Firebase)

---

## 🔍 Points à vérifier

### 1. Firebase Cloud Messaging API activée ?

**Où vérifier** :
1. Va sur Google Cloud Console : https://console.cloud.google.com
2. Sélectionne le projet `c6radio-push`
3. Menu : **APIs & Services > Library**
4. Cherche : **"Firebase Cloud Messaging API"**
5. Vérifie que c'est **ACTIVÉ** (bouton "Manage" au lieu de "Enable")

**Si c'est désactivé** → Clique sur "Enable"

---

### 2. Service Account a les bonnes permissions ?

**Où vérifier** :
1. Google Cloud Console > **IAM & Admin > Service Accounts**
2. Trouve le service account : `firebase-adminsdk-xxxxx@c6radio-push.iam.gserviceaccount.com`
3. Vérifie qu'il a le rôle : **"Firebase Admin SDK Administrator Service Agent"**

**Si non** → Ajoute le rôle

---

### 3. Les clés correspondent bien entre frontend et backend ?

#### Frontend (`src/config/firebase.config.js`) :
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyCHqtJXWjToHqncgvrbI4UKaizpUnc9KdU",
  authDomain: "c6radio-push.firebaseapp.com",
  projectId: "c6radio-push",
  storageBucket: "c6radio-push.firebasestorage.app",
  messagingSenderId: "295851914513",
  appId: "1:295851914513:web:8b0bf6a47f596b289e48b0"
};
```

#### Backend WordPress (Paramètres) :
- **Project ID** : Doit être exactement `c6radio-push`
- **Service Account JSON** : Doit avoir le même `project_id` dans le JSON

**Vérifie** : Ouvre le Service Account JSON dans WordPress, cherche `"project_id"`, ça doit être `"c6radio-push"`

---

### 4. Le token est-il vraiment enregistré dans la base de données ?

**Test SQL** :
1. Accède à phpMyAdmin (ou adminer)
2. Base de données WordPress
3. Exécute :
```sql
SELECT * FROM wp_c6radio_push_tokens;
```

**Tu devrais voir** :
- 1 ligne avec ton token
- Platform : `web`
- Une date de création

**Si la table est vide après envoi** → Les tokens sont bien supprimés (problème d'envoi Firebase)

---

### 5. Le Service Account JSON est-il valide ?

**Vérifie que le JSON contient** :
- ✅ `"type": "service_account"`
- ✅ `"project_id": "c6radio-push"`
- ✅ `"private_key": "-----BEGIN PRIVATE KEY-----\n..."`
- ✅ `"client_email": "firebase-adminsdk-xxxxx@c6radio-push.iam.gserviceaccount.com"`
- ✅ Pas de caractères manquants ou coupés

**Surtout la `private_key`** : Elle doit commencer par `-----BEGIN PRIVATE KEY-----\n` et finir par `\n-----END PRIVATE KEY-----\n`

---

## 🧪 Test de diagnostic

### Test 1 : Vérifier que Firebase accepte le token

Depuis la console du navigateur (F12), exécute :
```javascript
fetch('https://fcm.googleapis.com/v1/projects/c6radio-push/messages:send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer TEST',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: {
      token: localStorage.getItem('pushToken'),
      notification: {
        title: 'Test',
        body: 'Test'
      }
    }
  })
}).then(r => r.text()).then(console.log);
```

**Résultat attendu** : Erreur 401 (Unauthorized) - C'est NORMAL (on n'a pas mis le vrai access token)

**Si 400 "Invalid token"** → Le token est invalide

---

### Test 2 : Token Web vs Token Natif

Les tokens FCM **Web** sont différents des tokens **iOS/Android**.

**Ton token commence par** : `cYFYTCBEdwejz-0ipNNm0Q:APA91b...`

C'est un **token web valide** ✅

---

## 🎯 Hypothèses du problème

### Hypothèse 1 : API FCM v1 pas activée dans Google Cloud
→ **Solution** : Activer "Firebase Cloud Messaging API" dans Google Cloud Console

### Hypothèse 2 : Service Account pas les bonnes permissions
→ **Solution** : Vérifier les rôles IAM du service account

### Hypothèse 3 : Private Key mal copiée
→ **Solution** : Re-télécharger le JSON et le recopier entièrement

### Hypothèse 4 : Quota Firebase dépassé
→ **Solution** : Vérifier les quotas dans Firebase Console

---

## 📝 Actions à faire MAINTENANT

### 1. Vérifie Google Cloud Console
- [ ] Firebase Cloud Messaging API **activée**
- [ ] Service Account a le rôle **Firebase Admin SDK Administrator**

### 2. Re-télécharge le Service Account JSON
- [ ] Firebase Console > Paramètres > Comptes de service
- [ ] "Générer une nouvelle clé privée"
- [ ] Télécharge le JSON
- [ ] Copie-le ENTIÈREMENT dans WordPress Paramètres

### 3. Teste l'enregistrement à nouveau
- [ ] Vide le localStorage : `localStorage.clear()`
- [ ] Recharge la page
- [ ] Accepte les notifications
- [ ] Vérifie que "1 appareil Web" apparaît

### 4. Envoie une notification test
- [ ] WordPress Admin > Push Notifs > Envoyer
- [ ] Note le résultat exact

---

## 🆘 Debugging avancé (si ça échoue encore)

Je peux créer une **version debug du plugin** qui :
- Log toutes les requêtes FCM
- Affiche les erreurs dans l'interface WordPress
- Teste la connexion Firebase au chargement

---

**Commence par vérifier Google Cloud Console (Firebase Cloud Messaging API activée), c'est la cause #1 ! 🔍**
