#!/bin/bash
# Script helper pour installer Ruby moderne et CocoaPods sur macOS
# À exécuter AVANT setup-ios-pods.sh

set -e

echo "🍎 Installation de Ruby 3.3 et CocoaPods pour macOS..."
echo ""

# 1. Vérifier Homebrew
echo "📦 Vérification de Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew n'est pas installé."
    echo "📥 Installation de Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Ajouter Homebrew au PATH (Apple Silicon)
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    echo "✅ Homebrew installé !"
else
    echo "✅ Homebrew déjà installé: $(brew --version | head -1)"
fi

echo ""

# 2. Installer Ruby 3.3
echo "💎 Installation de Ruby 3.3..."
brew install ruby@3.3

echo ""

# 3. Configurer le PATH
echo "⚙️  Configuration du PATH..."

# Déterminer le fichier de profil
if [[ $SHELL == *"zsh"* ]]; then
    PROFILE="$HOME/.zshrc"
else
    PROFILE="$HOME/.bash_profile"
fi

# Vérifier si déjà configuré
if ! grep -q "ruby@3.3" "$PROFILE" 2>/dev/null; then
    echo "" >> "$PROFILE"
    echo "# Ruby 3.3 via Homebrew" >> "$PROFILE"
    echo 'export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"' >> "$PROFILE"
    echo 'export LDFLAGS="-L/opt/homebrew/opt/ruby@3.3/lib"' >> "$PROFILE"
    echo 'export CPPFLAGS="-I/opt/homebrew/opt/ruby@3.3/include"' >> "$PROFILE"
    echo 'export PKG_CONFIG_PATH="/opt/homebrew/opt/ruby@3.3/lib/pkgconfig"' >> "$PROFILE"
    echo "✅ PATH configuré dans $PROFILE"
else
    echo "✅ PATH déjà configuré"
fi

echo ""

# 4. Utiliser le Ruby de Homebrew pour la suite du script
echo "🔧 Configuration de l'environnement pour ce script..."
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
export LDFLAGS="-L/opt/homebrew/opt/ruby@3.3/lib"
export CPPFLAGS="-I/opt/homebrew/opt/ruby@3.3/include"

# Vérifier Ruby
echo "🔍 Vérification de Ruby..."
which ruby
ruby_version=$(ruby -v)
echo "$ruby_version"

if [[ $ruby_version == *"3.3"* ]]; then
    echo "✅ Ruby 3.3 actif !"
else
    echo "❌ Erreur : Ruby 3.3 pas actif"
    echo "Exécute manuellement : source $PROFILE && ruby -v"
    exit 1
fi

echo ""

# 5. Installer CocoaPods avec le Ruby Homebrew
echo "📦 Installation de CocoaPods..."
which gem
gem install cocoapods

echo ""

# 6. Vérifier l'installation
echo "✅ Vérification de CocoaPods..."
which pod
pod --version

echo ""
echo "✨ Installation terminée !"
echo ""
echo "🔄 Pour que Ruby 3.3 soit actif dans tous les terminaux, exécute:"
echo "   source $PROFILE"
echo ""
echo "🚀 Puis tu peux continuer avec:"
echo "   npm install && npm run build:ios && ./setup-ios-pods.sh"
echo ""

