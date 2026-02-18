# 🔥 Fix Firebase iOS - Erreur "unable to find module FirebaseCore"

## ✅ Changements effectués

### 1. Package.swift mis à jour
- ✅ Firebase iOS SDK version: **11.0.0** (au lieu de 10.0.0)
- ✅ Ajout de **FirebaseCore** dans les dépendances
- ✅ **FirebaseMessaging** également présent

### 2. Script de nettoyage créé
Fichier: `fix-ios-firebase.sh`

## 🚀 Instructions sur macOS

### Option 1: Script automatique
```bash
cd ~/WebstormProjects/c6radio-web
./fix-ios-firebase.sh
```

### Option 2: Commandes manuelles
```bash
cd ~/WebstormProjects/c6radio-web

# Nettoyer TOUS les caches
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf ios/App/.build
rm -rf ios/App/CapApp-SPM/.build
rm -rf ios/App/App.xcworkspace/xcshareddata/swiftpm
find ios/App -name "Package.resolved" -delete

# Fermer Xcode COMPLÈTEMENT (Cmd+Q)

# Rouvrir
open ios/App/App.xcworkspace
```

### Dans Xcode (IMPORTANT - faire dans l'ordre!)
1. **Attendre** que Xcode finisse de charger le projet
2. **File** → **Packages** → **Reset Package Caches**
3. **File** → **Packages** → **Update to Latest Package Versions**
4. **Attendre** 2-5 minutes que Xcode télécharge Firebase (~150 MB)
5. Vérifier dans **Project Navigator** (gauche) → **Package Dependencies** → tu dois voir:
   - capacitor-swift-pm
   - CapacitorPushNotifications
   - **firebase-ios-sdk** ⬅️ IMPORTANT
6. **Product** → **Clean Build Folder** (⇧⌘K)
7. **Product** → **Build** (⌘B)

## 🔍 Diagnostic

### Si "firebase-ios-sdk" n'apparaît pas dans Package Dependencies
1. **File** → **Packages** → **Resolve Package Versions**
2. Attendre la résolution complète
3. Si échec, vérifier la console Xcode pour les erreurs réseau

### Si erreur "Could not resolve package dependencies"
1. Vérifier connexion internet (Firebase SDK = ~150 MB)
2. **File** → **Packages** → **Reset Package Caches** (encore)
3. Redémarrer Xcode complètement

### Si build échoue avec "Command SwiftCompile failed"
1. Regarder l'erreur exacte dans le Report Navigator (⌘9)
2. Si c'est toujours FirebaseCore: vérifier que le package est bien résolu
3. Essayer **Product** → **Clean Build Folder** + rebuild

## 📝 Vérification finale

Le build doit réussir ET tu dois voir dans les logs:
```
✅ Build succeeded
```

Pas d'erreur "unable to find module FirebaseCore" ou "FirebaseMessaging"

## 🐛 Si ça ne marche toujours pas

### Dernière tentative: Supprimer et re-ajouter le package
1. Dans Xcode, **Project Navigator** → clic sur le projet "App"
2. Onglet **Package Dependencies**
3. Clic sur "firebase-ios-sdk" → bouton **"-"** (supprimer)
4. Bouton **"+"** → **Add Package Dependency**
5. URL: `https://github.com/firebase/firebase-ios-sdk.git`
6. Dependency Rule: **Up to Next Major Version** → 11.0.0
7. **Add Package**
8. Cocher **FirebaseCore** et **FirebaseMessaging**
9. **Add Package**

### Alternative: Vérifier manuellement Package.swift
```bash
cd ~/WebstormProjects/c6radio-web
cat ios/App/CapApp-SPM/Package.swift
```

Tu dois voir:
```swift
dependencies: [
    // ...
    .package(url: "https://github.com/firebase/firebase-ios-sdk.git", from: "11.0.0")
],
targets: [
    .target(
        name: "CapApp-SPM",
        dependencies: [
            // ...
            .product(name: "FirebaseCore", package: "firebase-ios-sdk"),
            .product(name: "FirebaseMessaging", package: "firebase-ios-sdk")
        ]
    )
]
```

## 💡 Note importante

⚠️ **NE PAS** exécuter `npx cap sync ios` après ce fix !
Ça va régénérer Package.swift et supprimer Firebase.

Si tu dois faire `cap sync`, tu devras réappliquer les changements Firebase.

## ✅ Success indicators

Quand tout fonctionne, tu verras:
1. ✅ Xcode Project Navigator → Package Dependencies → **firebase-ios-sdk** visible
2. ✅ Build réussit sans erreur
3. ✅ AppDelegate.swift compile sans erreur sur les imports
4. ✅ L'app peut lancer (peut crash après mais c'est un autre problème)
