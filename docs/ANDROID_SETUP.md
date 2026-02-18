# Configuration Android - C6Radio

## Prérequis

- **Android Studio** installé
- **JDK 17** ou supérieur
- Un appareil Android physique OU un émulateur

## Configuration Firebase

### 1. Ajouter l'application Android dans Firebase Console

1. Ouvrir [Firebase Console](https://console.firebase.google.com)
2. Sélectionner le projet C6Radio
3. Cliquer sur l'icône **Android** (⚙️ Paramètres du projet → Applications)
4. Cliquer sur **Ajouter une application**
5. Renseigner:
   - **Package Android**: `com.c6media.c6media`
   - **Surnom de l'app** (optionnel): C6Radio Android
   - **Certificat de signature SHA-1** (optionnel pour debug)

### 2. Télécharger google-services.json

1. Après l'ajout de l'app, télécharger le fichier `google-services.json`
2. Le placer dans: `android/app/google-services.json`

```bash
# Vérifier que le fichier est présent
ls -l android/app/google-services.json
```

> ⚠️ **Important**: Ce fichier est déjà dans `.gitignore` et ne sera pas commité

### 3. Obtenir le certificat SHA-1 (pour debug)

Si vous avez besoin du SHA-1 pour le debug (optionnel):

```bash
# Sur Linux/Mac
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copier la valeur `SHA1` et l'ajouter dans Firebase Console (Paramètres → Applications → Android → Certificats).

## Build et déploiement

### 1. Build l'application

```bash
npm run build:android
```

### 2. Ouvrir dans Android Studio

```bash
npm run cap:open:android
```

### 3. Tester sur émulateur ou appareil

1. Dans Android Studio, sélectionner un appareil (émulateur ou physique)
2. Cliquer sur le bouton **Run** (▶️)
3. L'app devrait se lancer et demander la permission pour les notifications

### 4. Vérifier les notifications

Ouvrez la console Chrome DevTools:
1. Dans Android Studio, cliquer sur **Run → Debug 'app'**
2. Ouvrir **Logcat** (onglet en bas)
3. Filtrer par `C6Radio` ou `pushToken`
4. Vous devriez voir le token FCM s'afficher

Exemple de log:
```
📱 Token push reçu: fR4bC...
✅ Token enregistré: {success: true, token_id: 123}
```

## Tester l'envoi de notifications

### Via WordPress

1. Connectez-vous au back-office WordPress
2. Allez dans **Articles → Publier un article**
3. Cochez **"Envoyer une notification push"**
4. Publiez l'article
5. La notification devrait arriver sur l'app Android

### Via Firebase Console (test manuel)

1. Ouvrir Firebase Console → **Cloud Messaging**
2. Cliquer sur **"Envoyer votre premier message"**
3. Renseigner:
   - **Titre**: Test Android
   - **Texte**: Notification de test
4. Dans **"Cible"**, sélectionner l'application Android
5. Envoyer
6. La notification devrait arriver

## Problèmes courants

### Pas de token FCM

**Symptôme**: Aucun token ne s'affiche dans les logs

**Solutions**:
- Vérifier que `google-services.json` est présent dans `android/app/`
- Rebuild le projet: `npm run build:android`
- Nettoyer le cache Gradle: `cd android && ./gradlew clean`
- Vérifier que la permission notifications est accordée

### Permission refusée

**Symptôme**: `⚠️ Permission notifications refusée`

**Solution**: Sur Android 13+, l'app demande la permission au runtime. Si refusée:
1. Aller dans **Paramètres → Applications → C6Radio**
2. Activer **Notifications**
3. Redémarrer l'app

### Gradle build failed

**Symptôme**: Erreur de compilation Gradle

**Solutions**:
- Vérifier que JDK 17+ est installé: `java -version`
- Nettoyer le projet: `cd android && ./gradlew clean`
- Invalider les caches Android Studio: **File → Invalidate Caches / Restart**

## Scripts npm disponibles

```bash
# Build et sync
npm run build:android

# Ouvrir Android Studio
npm run cap:open:android

# Sync uniquement (sans rebuild web)
npx cap sync android
```

## Architecture

- **Code source web**: `src/` (React)
- **Service notifications**: `src/services/pushNotifications.js`
- **Config Firebase**: `src/config/firebase.config.js`
- **Projet Android**: `android/` (Gradle + Capacitor)
- **Manifest**: `android/app/src/main/AndroidManifest.xml`
- **Build config**: `android/app/build.gradle`

## Permissions déclarées

Dans `AndroidManifest.xml`:
- `android.permission.INTERNET` - Requêtes réseau
- `android.permission.POST_NOTIFICATIONS` - Notifications (Android 13+)

## Ressources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/android/client)
