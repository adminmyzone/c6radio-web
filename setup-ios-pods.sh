#!/bin/bash
# Script pour configurer Firebase iOS avec CocoaPods
# À exécuter sur macOS

set -e

echo "🔧 Configuration Firebase iOS avec CocoaPods..."
echo ""

cd ~/WebstormProjects/c6radio-web

# 1. Vérifier la version de Ruby
echo "🔍 Vérification de Ruby..."
RUBY_VERSION=$(ruby -v | grep -oE '[0-9]+\.[0-9]+' | head -1)
echo "Ruby version: $RUBY_VERSION"

if [[ $(echo "$RUBY_VERSION < 3.0" | bc -l) -eq 1 ]]; then
    echo "⚠️  Ruby $RUBY_VERSION est trop ancien (minimum requis: 3.0)"
    echo "📥 Installation de Ruby 3.3 via Homebrew..."
    
    # Vérifier si Homebrew est installé
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew n'est pas installé."
        echo "📦 Installez Homebrew d'abord: https://brew.sh"
        echo "Commande: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Installer Ruby via Homebrew
    brew install ruby@3.3
    
    # Ajouter au PATH
    echo ""
    echo "⚠️  IMPORTANT: Ajoute ces lignes à ton ~/.zshrc ou ~/.bash_profile :"
    echo ""
    echo 'export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"'
    echo 'export LDFLAGS="-L/opt/homebrew/opt/ruby@3.3/lib"'
    echo 'export CPPFLAGS="-I/opt/homebrew/opt/ruby@3.3/include"'
    echo ""
    echo "Puis exécute: source ~/.zshrc (ou ~/.bash_profile)"
    echo "Et relance ce script."
    exit 0
fi

echo "✅ Ruby $RUBY_VERSION OK"
echo ""

# 2. Vérifier si CocoaPods est installé
echo "📦 Vérification de CocoaPods..."
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods n'est pas installé."
    echo "📥 Installation de CocoaPods..."
    gem install cocoapods
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
