# 🤖 Configuration Android - Push Notifications

## Prérequis
- Compte Google (gratuit)
- Android Studio installé (optionnel, pour tester)

---

## ÉTAPE 1 : Télécharger google-services.json

1. Va dans **Firebase Console** > Ton projet
2. Clique sur **⚙️ Paramètres du projet**
3. Section **Vos applications**
4. Clique sur l'app **Android** (ou ajoute-la si elle n'existe pas encore)

### Si tu dois créer l'app Android :
1. Clique sur **"Ajouter une application" > Android**
2. **Nom du package Android** : `fr.c6media.radio`
   _(doit correspondre à l'`applicationId` dans `android/app/build.gradle`)_
3. Clique sur **Enregistrer l'application**
4. **Télécharge google-services.json**
5. Clique sur **Suivant** puis **Terminer**

---

## ÉTAPE 2 : Ajouter google-services.json au projet

1. Copie le fichier `google-services.json` téléchargé
2. Colle-le dans : `android/app/google-services.json`

Vérification :
```bash
ls android/app/google-services.json
```

Tu devrais voir le fichier. ✅

---

## ÉTAPE 3 : Modifier android/build.gradle

Fichier : `android/build.gradle`

Ajoute le plugin Google Services dans `dependencies` :

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.0'
        classpath 'com.google.gms:google-services:4.4.0'  // ← AJOUTER CETTE LIGNE
    }
}
```

---

## ÉTAPE 4 : Modifier android/app/build.gradle

Fichier : `android/app/build.gradle`

### 4.1 Ajouter le plugin (EN HAUT du fichier, après les autres plugins)

```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'  // ← AJOUTER CETTE LIGNE
```

### 4.2 Ajouter les dépendances Firebase

Dans la section `dependencies` (tout en bas du fichier), ajoute :

```gradle
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.core:core-splashscreen:1.0.1'
    implementation project(':capacitor-android')
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging'
    
    // Autres dépendances existantes...
}
```

---

## ÉTAPE 5 : Modifier AndroidManifest.xml

Fichier : `android/app/src/main/AndroidManifest.xml`

Ajoute ces permissions **avant** la balise `<application>` :

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions pour les notifications -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <application
        ...
```

Puis, **dans** la balise `<application>`, ajoute le service Firebase :

```xml
<application
    ...>
    
    <activity ...>
        ...
    </activity>

    <!-- Service Firebase Cloud Messaging -->
    <service
        android:name="com.google.firebase.messaging.FirebaseMessagingService"
        android:exported="false">
        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>
    </service>

    <!-- Métadonnées Firebase -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_icon"
        android:resource="@mipmap/ic_launcher" />
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_color"
        android:resource="@color/colorPrimary" />

</application>
```

---

## ÉTAPE 6 : Synchroniser Capacitor

Depuis la racine du projet :

```bash
npx cap sync android
```

---

## ÉTAPE 7 : Build et test

### Option A : Via Android Studio

1. Ouvre Android Studio :
   ```bash
   npx cap open android
   ```

2. Attends que Gradle sync se termine
3. Connecte un appareil Android ou lance un émulateur
4. Clique sur **Run** (▶️)

### Option B : Via CLI

```bash
npx cap run android
```

---

## ÉTAPE 8 : Tester l'enregistrement

1. Lance l'app sur un device/émulateur Android
2. Accepte la permission pour les notifications
3. Va dans **WordPress Admin > Push Notifs**
4. Tu devrais voir 1 appareil Android enregistré ✅

---

## 🧪 Tester l'envoi

1. Dans WordPress Admin > Push Notifs > Envoyer
2. Remplis le formulaire
3. Envoie la notification
4. Tu devrais la recevoir sur ton Android ! 🎉

---

## ⚠️ Notes importantes

### Permissions Android 13+ (API 33+)

Depuis Android 13, il faut demander explicitement la permission `POST_NOTIFICATIONS`.
Le plugin Capacitor le fait automatiquement, mais assure-toi que :

1. `targetSdkVersion` est au moins 33 dans `build.gradle`
2. La permission est dans le `AndroidManifest.xml` (fait à l'étape 5)

### Icône de notification

L'icône par défaut est `@mipmap/ic_launcher` (icône de l'app).

Pour personnaliser :
1. Crée une icône transparente PNG (24x24dp)
2. Place-la dans `android/app/src/main/res/drawable/ic_notification.png`
3. Change la méta-donnée :
   ```xml
   android:resource="@drawable/ic_notification"
   ```

### Couleur de notification

Change la couleur de l'icône en modifiant `@color/colorPrimary` dans :
`android/app/src/main/res/values/colors.xml`

```xml
<resources>
    <color name="colorPrimary">#FF0000</color>
</resources>
```

---

## 🐛 Dépannage

### Erreur "google-services.json not found"
- Vérifie que le fichier est bien dans `android/app/`
- Run `npx cap sync android` à nouveau

### Gradle sync failed
- Vérifie la version du plugin : `com.google.gms:google-services:4.4.0`
- Clean le projet : Android Studio > Build > Clean Project

### Notifications ne s'affichent pas
- Vérifie que les permissions sont accordées dans les paramètres Android
- Vérifie les logs : `adb logcat | grep Firebase`

---

## ✅ Checklist finale

- [ ] `google-services.json` dans `android/app/`
- [ ] Plugin Google Services ajouté dans `build.gradle`
- [ ] Dépendances Firebase ajoutées
- [ ] Permissions dans `AndroidManifest.xml`
- [ ] Service Firebase dans `AndroidManifest.xml`
- [ ] `npx cap sync android` exécuté
- [ ] App testée sur un device Android
- [ ] Notification de test reçue

---

**Prochaine étape** : Tests complets iOS + Android + Web !
