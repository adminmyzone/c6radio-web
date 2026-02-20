#!/bin/bash

# Script d'encodage du profil de provisionnement
# Usage: ./encode-profile.sh FICHIER.mobileprovision

echo "🔧 Encodage du profil de provisionnement pour GitHub"
echo "=================================================="
echo ""

# Vérifier qu'un fichier est fourni
if [ -z "$1" ]; then
    echo "❌ Erreur : Aucun fichier fourni"
    echo ""
    echo "Usage:"
    echo "  ./encode-profile.sh FICHIER.mobileprovision"
    echo ""
    echo "Exemple:"
    echo "  ./encode-profile.sh ~/Downloads/C6Radio_Debug_TestFlight.mobileprovision"
    echo ""
    exit 1
fi

PROFILE_FILE="$1"

# Vérifier que le fichier existe
if [ ! -f "$PROFILE_FILE" ]; then
    echo "❌ Erreur : Fichier '$PROFILE_FILE' introuvable"
    echo ""
    echo "Fichiers .mobileprovision disponibles :"
    find ~/Downloads -name "*.mobileprovision" -type f 2>/dev/null
    echo ""
    exit 1
fi

# Vérifier l'extension
if [[ ! "$PROFILE_FILE" =~ \.mobileprovision$ ]]; then
    echo "⚠️  Attention : Le fichier ne se termine pas par .mobileprovision"
    echo "   Êtes-vous sûr que c'est le bon fichier ?"
    echo ""
fi

echo "📄 Fichier : $PROFILE_FILE"
echo ""

# Encoder
OUTPUT_FILE="profil_base64.txt"
echo "🔄 Encodage en cours..."
base64 -w 0 "$PROFILE_FILE" > "$OUTPUT_FILE" 2>/dev/null

# Vérifier le succès
if [ $? -eq 0 ]; then
    SIZE=$(cat "$OUTPUT_FILE" | wc -c)

    if [ $SIZE -gt 5000 ]; then
        echo "✅ Encodage réussi !"
        echo ""
        echo "📊 Statistiques :"
        echo "   - Taille encodée : $SIZE caractères"
        echo "   - Fichier créé : $OUTPUT_FILE"
        echo ""
        echo "🔍 Vérification du bundle ID :"
        # Décoder temporairement pour vérifier
        base64 -d "$OUTPUT_FILE" 2>/dev/null | strings | grep -E "fr\.(c6debug|c6radio)\.app" | head -3
        echo ""
        echo "✅ Si vous voyez 'fr.c6debug.app' ci-dessus, c'est bon !"
        echo ""
        echo "📋 Prochaines étapes :"
        echo "   1. Ouvrir le fichier : cat $OUTPUT_FILE"
        echo "   2. Sélectionner TOUT le contenu (Ctrl+A)"
        echo "   3. Copier (Ctrl+C)"
        echo "   4. GitHub → Settings → Secrets → IOS_MOBILEPROVISION_BASE64"
        echo "   5. Update → Coller → Update secret"
        echo ""
        echo "🚀 Ensuite : git add . && git commit -m 'fix: Update profil' && git push"
        echo ""
    else
        echo "❌ Erreur : Fichier encodé trop petit ($SIZE caractères)"
        echo "   Un profil valide fait généralement > 5000 caractères"
        echo "   Le fichier source est peut-être corrompu."
        echo ""
        exit 1
    fi
else
    echo "❌ Erreur lors de l'encodage"
    echo "   Vérifiez que la commande 'base64' est disponible"
    echo ""
    exit 1
fi

