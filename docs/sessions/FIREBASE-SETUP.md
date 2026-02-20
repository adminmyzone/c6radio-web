# 🔥 Instructions Firebase - Notifications PUSH

## Étape 1 : Créer le projet Firebase

1. Va sur **https://console.firebase.google.com**
2. Clique sur **"Ajouter un projet"** / **"Add project"**
3. Nom du projet : `c6radio` (ou autre)
4. Désactive Google Analytics (optionnel)
5. Clique sur **"Créer le projet"**

---

## Étape 2 : Activer Cloud Messaging

1. Dans la console Firebase, clique sur l'icône **engrenage ⚙️** > **Paramètres du projet**
2. Onglet **"Cloud Messaging"**
3. Cloud Messaging API devrait être activé automatiquement

---

## Étape 3 : Configurer l'app Web

1. Dans **Paramètres du projet** > **Général**
2. Scroll vers le bas jusqu'à **"Vos applications"**
3. Clique sur l'icône **Web** `</>`
4. Nom de l'application : `C6Radio Web`
5. **COCHER** "Configurer également Firebase Hosting" (optionnel)
6. Clique sur **"Enregistrer l'application"**

---

## Étape 4 : Récupérer la configuration

Tu devrais voir un bloc de code comme ceci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "c6radio-xxxxx.firebaseapp.com",
  projectId: "c6radio-xxxxx",
  storageBucket: "c6radio-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**👉 COPIE ces valeurs et remplace-les dans le fichier :**
`/src/config/firebase.config.js`

---

## Étape 5 : Récupérer la clé VAPID (Web Push)

1. Dans **Cloud Messaging** > onglet **"Web configuration"**
2. Scroll jusqu'à **"Web Push certificates"**
3. Clique sur **"Générer une nouvelle paire de clés"**
4. Copie la **clé publique** (commence par `B...`)

**👉 Colle cette clé dans `firebase.config.js` à la place de `VOTRE_VAPID_KEY`**

---

## Étape 6 : Récupérer le Server Key (pour WordPress)

1. Toujours dans **Cloud Messaging**
2. Section **"Cloud Messaging API (Legacy)"**
3. Copie la **"Clé du serveur"** / **"Server key"**

**⚠️ IMPORTANT : Cette clé est SECRÈTE, elle sera utilisée côté WordPress**

**👉 Note-la quelque part (on l'utilisera pour le plugin WordPress)**

---

## ✅ Vérification

Ton fichier `firebase.config.js` devrait maintenant ressembler à :

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "c6radio-12345.firebaseapp.com",
  projectId: "c6radio-12345",
  storageBucket: "c6radio-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

export const vapidKey = "BKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
```

---

## 📱 Prochaines étapes (iOS/Android)

### Pour iOS (Apple Push Notification Service)
On configurera plus tard :
- Certificat APNS depuis Apple Developer
- Upload du certificat dans Firebase

### Pour Android
On configurera plus tard :
- Télécharger `google-services.json`
- Placer dans `android/app/`

---

## ❓ Besoin d'aide ?

Dis-moi si tu bloques à une étape, je t'aiderai ! 🚀
