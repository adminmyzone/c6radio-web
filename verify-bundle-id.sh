nno#!/bin/bash

# Script de vérification du Bundle ID
# Vérifie que com.c6media.c6media est utilisé partout

echo "🔍 Vérification du Bundle ID..."
echo ""

EXPECTED_BUNDLE_ID="com.c6media.c6media"
ALL_OK=true

# Vérifier capacitor.config.json
echo "📱 Vérification de capacitor.config.json..."
if grep -q "\"appId\": \"$EXPECTED_BUNDLE_ID\"" capacitor.config.json; then
    echo "✅ capacitor.config.json : OK"
else
    echo "❌ capacitor.config.json : INCORRECT"
    current=$(grep "appId" capacitor.config.json)
    echo "   Actuel : $current"
    echo "   Attendu : \"appId\": \"$EXPECTED_BUNDLE_ID\""
    ALL_OK=false
fi
echo ""

# Vérifier project.pbxproj
echo "🍎 Vérification de project.pbxproj..."
if grep -q "PRODUCT_BUNDLE_IDENTIFIER = $EXPECTED_BUNDLE_ID;" ios/App/App.xcodeproj/project.pbxproj; then
    count=$(grep -c "PRODUCT_BUNDLE_IDENTIFIER = $EXPECTED_BUNDLE_ID;" ios/App/App.xcodeproj/project.pbxproj)
    echo "✅ project.pbxproj : OK ($count occurrences)"
else
    echo "❌ project.pbxproj : INCORRECT"
    echo "   Occurrences trouvées :"
    grep "PRODUCT_BUNDLE_IDENTIFIER" ios/App/App.xcodeproj/project.pbxproj | head -3
    ALL_OK=false
fi
echo ""

# Vérifier workflow (optionnel, car le workflow utilise les variables d'environnement)
echo "⚙️  Vérification du workflow..."
if grep -q "BUNDLE_ID:" .github/workflows/ios-testflight.yml; then
    workflow_bundle=$(grep "BUNDLE_ID:" .github/workflows/ios-testflight.yml | head -1)
    echo "ℹ️  Workflow : $workflow_bundle"
    if echo "$workflow_bundle" | grep -q "$EXPECTED_BUNDLE_ID"; then
        echo "✅ Workflow : OK"
    else
        echo "⚠️  Workflow : Bundle ID différent (mais c'est OK, c'est juste pour info)"
    fi
else
    echo "ℹ️  Workflow n'a pas de variable BUNDLE_ID explicite (c'est OK)"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ALL_OK" = true ]; then
    echo "✅ TOUT EST OK !"
    echo ""
    echo "Bundle ID configuré partout : $EXPECTED_BUNDLE_ID"
    echo ""
    echo "📋 PROCHAINES ÉTAPES :"
    echo "1. Crée l'App ID sur Apple Developer : $EXPECTED_BUNDLE_ID"
    echo "2. Crée le Profil App Store Connect lié à cet App ID"
    echo "3. Crée l'App sur App Store Connect avec ce Bundle ID"
    echo "4. Mets à jour le secret GitHub IOS_MOBILEPROVISION_BASE64"
    echo ""
    echo "📖 Guide détaillé : docs/phase-7-FIX-BUNDLE-ID-CORRECT.md"
else
    echo "❌ DES CORRECTIONS SONT NÉCESSAIRES"
    echo ""
    echo "Consulte les erreurs ci-dessus et corrige les fichiers."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

