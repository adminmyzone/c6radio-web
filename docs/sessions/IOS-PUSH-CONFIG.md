# 📱 Configuration iOS - Push Notifications

## Prérequis
- Compte Apple Developer (payant, 99$/an)
- Accès à l'App ID sur developer.apple.com
- Xcode installé

---

## ÉTAPE 1 : Créer la clé APNS (Apple Push Notification Service)

### Option A : Utiliser une clé APNs (RECOMMANDÉ)

1. Va sur **https://developer.apple.com/account/resources/authkeys/list**
2. Clique sur **"+"** pour créer une nouvelle clé
3. Nom : `C6Radio Push Notifications`
4. **Coche "Apple Push Notifications service (APNs)"**
5. Clique sur **Continue** puis **Register**
6. **Télécharge le fichier .p8** (tu ne pourras le télécharger qu'une seule fois !)
7. Note le **Key ID** (ex: `ABC123XYZ`)
8. Note le **Team ID** (en haut à droite de la page)

### Option B : Certificat APNS (méthode legacy)
_Moins recommandé, plus complexe_

---

## ÉTAPE 2 : Configurer la clé dans Firebase

1. Va dans **Firebase Console** > Ton projet > **⚙️ Paramètres du projet**
2. Onglet **Cloud Messaging**
3. Scroll jusqu'à **APNs Authentication Key**
4. Clique sur **Upload**
5. Upload le fichier **.p8** téléchargé
6. Entre le **Key ID** et le **Team ID**
7. Clique sur **Upload**

✅ Firebase peut maintenant envoyer des notifications iOS !

---

## ÉTAPE 3 : Activer Push Notifications dans Xcode

1. Ouvre le projet iOS :
   ```bash
   cd ios/App
   open App.xcworkspace
   ```

2. Dans Xcode, sélectionne le projet **App** dans le navigateur
3. Sélectionne le target **App**
4. Onglet **Signing & Capabilities**
5. Clique sur **"+ Capability"**
6. Ajoute **"Push Notifications"**

✅ Tu devrais voir "Push Notifications" dans la liste des capabilities

---

## ÉTAPE 4 : Modifier Info.plist

Fichier : `ios/App/App/Info.plist`

Ajoute ces lignes avant `</dict>` :

```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

---

## ÉTAPE 5 : Configurer Firebase dans le projet iOS

### 5.1 Télécharger GoogleService-Info.plist

1. Firebase Console > Ton projet > ⚙️ Paramètres
2. Section **Vos applications**
3. Clique sur l'app **iOS** (ou ajoute-la si elle n'existe pas)
4. Bundle ID : `fr.c6media.radio` (vérifie dans Xcode)
5. Télécharge **GoogleService-Info.plist**

### 5.2 Ajouter le fichier au projet

1. Dans Xcode, **drag & drop** `GoogleService-Info.plist` dans le dossier `App/App`
2. ✅ Coche "Copy items if needed"
3. ✅ Coche "Add to targets: App"

---

## ÉTAPE 6 : Modifier AppDelegate.swift

Fichier : `ios/App/App/AppDelegate.swift`

Remplace tout le contenu par :

```swift
import UIKit
import Capacitor
import FirebaseCore
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Initialiser Firebase
        FirebaseApp.configure()
        
        // Configurer les notifications
        if #available(iOS 10.0, *) {
            UNUserNotificationCenter.current().delegate = self
        }
        
        // Enregistrer pour les notifications distantes
        application.registerForRemoteNotifications()
        
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // Envoyer le token à Firebase
        Messaging.messaging().apnsToken = deviceToken
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register for remote notifications: \(error)")
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

// Extension pour gérer les notifications
@available(iOS 10, *)
extension AppDelegate: UNUserNotificationCenterDelegate {
    
    // Notification reçue quand l'app est au premier plan
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([[.banner, .sound]])
    }

    // Notification cliquée
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        completionHandler()
    }
}
```

---

## ÉTAPE 7 : Modifier le Podfile

Fichier : `ios/App/Podfile`

Ajoute ces lignes après la ligne `platform :ios, '13.0'` :

```ruby
pod 'Firebase/Messaging'
```

Le fichier devrait ressembler à :

```ruby
require_relative '../../node_modules/@capacitor/ios/scripts/pods_helpers'

platform :ios, '13.0'
use_frameworks!

# Pods Firebase
pod 'Firebase/Messaging'

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
...
```

---

## ÉTAPE 8 : Installer les dépendances

```bash
cd ios/App
pod install
```

Cela va installer Firebase Messaging.

---

## ÉTAPE 9 : Build et test

1. Dans Xcode, sélectionne un **vrai device iOS** (les notifications ne fonctionnent pas sur simulateur)
2. Clique sur **Run** (▶️)
3. L'app devrait se lancer et demander la permission pour les notifications

---

## ✅ Vérification

Une fois l'app lancée sur un vrai iPhone :
1. Accepte la permission notifications
2. Le token devrait s'enregistrer automatiquement
3. Va dans WordPress Admin > Push Notifs
4. Tu devrais voir 1 appareil iOS enregistré

---

## 🧪 Tester l'envoi

1. Dans WordPress Admin > Push Notifs > Envoyer
2. Remplis le formulaire
3. Envoie la notification
4. Tu devrais la recevoir sur ton iPhone !

---

## ⚠️ Notes importantes

- ✅ Les notifications PUSH ne fonctionnent **QUE sur un vrai iPhone** (pas simulateur)
- ✅ Il faut un **compte Apple Developer payant** (99$/an)
- ✅ Le Bundle ID doit correspondre exactement entre Xcode et Firebase
- ✅ Teste sur un device en développement avant de publier sur TestFlight/App Store

---

**Prochaine étape** : Configuration Android
