#!/bin/bash
# Script pour configurer Firebase iOS avec CocoaPods
# À exécuter sur macOS

set -e

echo "🔧 Configuration Firebase iOS avec CocoaPods..."
echo ""

cd ~/WebstormProjects/c6radio-web

# 1. Vérifier si CocoaPods est installé
echo "📦 Vérification de CocoaPods..."
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods n'est pas installé."
    echo "📥 Installation de CocoaPods..."
    sudo gem install cocoapods
    echo "✅ CocoaPods installé !"
else
    echo "✅ CocoaPods déjà installé: $(pod --version)"
fi

echo ""

# 2. Installer les dépendances
echo "📥 Installation des pods Firebase..."
cd ios/App
pod install --repo-update

echo ""
echo "✨ Installation terminée !"
echo ""
echo "⚠️  IMPORTANT:"
echo "   À partir de maintenant, tu DOIS ouvrir:"
echo "   📂 ios/App/App.xcworkspace"
echo "   ❌ NE PAS ouvrir App.xcodeproj"
echo ""
echo "🚀 Commandes Xcode:"
echo "   1. Ferme Xcode complètement (Cmd+Q)"
echo "   2. open ios/App/App.xcworkspace"
echo "   3. Product → Clean Build Folder (⇧⌘K)"
echo "   4. Product → Build (⌘B)"
echo ""
