#!/bin/bash
# Script pour fixer les dépendances Firebase iOS
# À exécuter sur macOS

set -e

echo "🔧 Fixing Firebase iOS dependencies..."

cd ~/WebstormProjects/c6radio-web

# 1. Nettoyer tous les caches Xcode
echo "📦 Cleaning Xcode caches..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf ios/App/.build
rm -rf ios/App/CapApp-SPM/.build
rm -rf ios/App/App.xcworkspace/xcshareddata/swiftpm

# 2. Supprimer Package.resolved pour forcer la résolution
echo "🔄 Removing Package.resolved..."
find ios/App -name "Package.resolved" -delete

# 3. Vérifier que Package.swift est correct
echo "✅ Package.swift content:"
cat ios/App/CapApp-SPM/Package.swift

echo ""
echo "✨ Nettoyage terminé !"
echo ""
echo "📱 Maintenant dans Xcode:"
echo "1. Ouvre le projet: open ios/App/App.xcworkspace"
echo "2. File → Packages → Reset Package Caches"
echo "3. File → Packages → Resolve Package Versions"
echo "4. File → Packages → Update to Latest Package Versions"
echo "5. Product → Clean Build Folder (⇧⌘K)"
echo "6. Product → Build (⌘B)"
echo ""
echo "⏳ La résolution des packages peut prendre 2-5 minutes..."
echo ""
