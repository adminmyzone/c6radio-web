#!/bin/bash
# sync-ios.sh — À utiliser à la place de "npx cap sync ios" sur MacInCloud
# Synchronise le projet iOS puis injecte Firebase Messaging via SPM

set -e

echo "� Installation des dépendances npm..."
npm install

echo "�🔄 Cap sync iOS..."
npx cap sync ios

PACKAGE_SWIFT="ios/App/CapApp-SPM/Package.swift"

echo "🔥 Injection de Firebase Messaging dans Package.swift..."

# 1. Ajouter la dépendance firebase-ios-sdk
sed -i '' 's|path: "../../../node_modules/@capacitor/push-notifications")|path: "../../../node_modules/@capacitor/push-notifications"),\
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", from: "11.0.0")|' "$PACKAGE_SWIFT"

# 2. Ajouter FirebaseMessaging comme produit dans le target
sed -i '' 's|.product(name: "CapacitorPushNotifications", package: "CapacitorPushNotifications")|.product(name: "CapacitorPushNotifications", package: "CapacitorPushNotifications"),\
                .product(name: "FirebaseMessaging", package: "firebase-ios-sdk")|' "$PACKAGE_SWIFT"

echo "✅ Package.swift patché:"
grep -A2 "firebase" "$PACKAGE_SWIFT"

echo ""
echo "📦 Résolution des packages SPM..."
cd ios/App
xcodebuild -resolvePackageDependencies -project App.xcodeproj -scheme App 2>&1 | grep -E "firebase|Firebase|Resolved|resolved|Error|error" || true

echo ""
echo "✅ Prêt à builder dans Xcode (Clean Build Folder → Archive)"
