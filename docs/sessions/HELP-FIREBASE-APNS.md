# 🔍 Où trouver APNs Authentication Key dans Firebase

## Navigation exacte dans Firebase Console

### Étape 1 : Accès aux paramètres
1. Va sur **https://console.firebase.google.com**
2. Sélectionne ton projet **C6Radio**
3. Clique sur l'**icône engrenage ⚙️** en haut à gauche (à côté de "Vue d'ensemble du projet")
4. Clique sur **"Paramètres du projet"** / **"Project settings"**

### Étape 2 : Section Cloud Messaging
1. En haut, tu verras plusieurs onglets : **Général**, **Comptes de service**, **Cloud Messaging**, etc.
2. Clique sur l'onglet **"Cloud Messaging"**

### Étape 3 : Scroll vers le bas
1. Scroll un peu vers le bas de la page
2. Tu verras plusieurs sections :
   - **Configuration de l'API Cloud Messaging** (en haut)
   - **Certificats de configuration des applications**
   - **Certificats APNs** ← C'EST ICI !

### Étape 4 : Section APNs
Tu devrais voir une section intitulée :
- **"Certificats APNs"** ou **"APNs Certificates"**

Avec deux options :
1. **Clé d'authentification APNs** (recommandé) ← UTILISE CELLE-CI
2. **Certificats APNs** (legacy)

---

## 🎯 Si tu ne vois pas cette section

### Cause possible : Pas d'app iOS enregistrée dans Firebase

1. Retourne sur l'onglet **"Général"**
2. Scroll jusqu'à **"Vos applications"** / **"Your apps"**
3. Tu devrais voir :
   - 🌐 Une app Web (déjà configurée)
   - 📱 Une app iOS (à ajouter si pas encore fait)

### Ajouter l'app iOS dans Firebase :

1. Clique sur le bouton **"Ajouter une application"** > **iOS**
2. **ID du bundle iOS** : `fr.c6media.radio`
   _(vérifie dans Xcode > App target > Signing & Capabilities > Bundle Identifier)_
3. **Surnom de l'app** (optionnel) : `C6Radio iOS`
4. Clique sur **"Enregistrer l'application"**
5. **Télécharge GoogleService-Info.plist** (tu en auras besoin)
6. Clique sur **Suivant** > **Suivant** > **Continuer vers la console**

**Maintenant**, retourne dans l'onglet **Cloud Messaging** et tu devrais voir la section APNs !

---

## 📸 À quoi ça ressemble

La section "Clé d'authentification APNs" affiche :
```
Clé d'authentification APNs
----------------------------
[ Aucune clé téléversée ]

[Bouton : Importer]
```

Ou si tu as déjà une clé :
```
Clé d'authentification APNs
----------------------------
✅ Clé ID : ABC123XYZ
   Team ID : DEF456
   
[Bouton : Modifier]
```

---

## ⚠️ Note importante

**Tu ne pourras uploader la clé APNs que APRÈS avoir :**
1. Créé l'app iOS dans Firebase
2. Généré la clé APNs sur developer.apple.com

---

## 🔑 Génération de la clé APNs sur Apple Developer

**Avant d'uploader dans Firebase, tu dois d'abord créer la clé sur Apple :**

1. Va sur **https://developer.apple.com/account/resources/authkeys/list**
2. Connecte-toi avec ton compte Apple Developer
3. Clique sur **"+"** (créer une nouvelle clé)
4. Nom : `C6Radio Push Notifications`
5. ✅ **Coche "Apple Push Notifications service (APNs)"**
6. Clique sur **Continue** puis **Register**
7. **Télécharge le fichier .p8** (tu ne pourras le télécharger qu'une fois !)
8. Note le **Key ID** (ex: `ABC123XYZ`)
9. Note le **Team ID** (affiché en haut à droite)

**Ensuite**, retourne dans Firebase > Cloud Messaging > APNs et upload cette clé.

---

## 🆘 Tu es où exactement ?

Dis-moi :
- ✅ As-tu déjà créé l'app iOS dans Firebase ?
- ✅ As-tu un compte Apple Developer actif (payant, 99$/an) ?
- ✅ Es-tu sur l'onglet Cloud Messaging et tu ne vois toujours pas la section APNs ?

Je t'aide selon ta situation ! 👍
