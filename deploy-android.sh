#!/bin/bash

# Script de déploiement Android sur device physique
# Usage: ./deploy-android.sh

set -e

# Configuration de l'environnement Android
export ANDROID_SDK_ROOT=~/Android/Sdk
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/tools

# Vérification de Java
if ! command -v java &> /dev/null; then
    echo "❌ Java n'est pas installé"
    echo "   Installez-le avec: sudo apt install -y openjdk-17-jdk"
    exit 1
fi

# Vérification de la connexion du device
echo "📱 Vérification des devices connectés..."
adb devices

DEVICE_COUNT=$(adb devices | grep -w "device" | wc -l)
if [ $DEVICE_COUNT -eq 0 ]; then
    echo "❌ Aucun device Android connecté"
    echo "   1. Activez le mode développeur sur votre smartphone"
    echo "   2. Activez le débogage USB"
    echo "   3. Connectez votre téléphone via USB"
    exit 1
fi

echo "✅ Device connecté détecté"

# Build de l'application
echo "🔨 Build de l'application..."
npm run build:android

# Déploiement sur le device
echo "🚀 Déploiement sur le device..."
npx cap run android

echo "✅ Déploiement terminé !"
