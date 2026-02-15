#!/bin/bash

# 🔧 Script d'aide pour la configuration iOS TestFlight
# Projet : C6Radio Web
# Bundle ID : fr.c6debug.app

set -e  # Arrête le script en cas d'erreur

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dossier de travail
CERT_DIR="$HOME/apple-certificates"

# Fonction pour afficher un titre
print_title() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Fonction pour afficher un succès
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher une erreur
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour afficher un avertissement
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour afficher une info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Menu principal
show_menu() {
    clear
    print_title "🍎 Configuration iOS TestFlight - C6Radio"
    echo "Que veux-tu faire ?"
    echo ""
    echo "1) 🆕 Setup initial (créer le dossier)"
    echo "2) 🔑 Générer la clé privée et CSR"
    echo "3) 📜 Convertir .cer en .p12"
    echo "4) 📱 Encoder .p12 en base64"
    echo "5) 📄 Encoder .mobileprovision en base64"
    echo "6) 🔐 Encoder .p8 (clé API) en base64"
    echo "7) ✅ Vérifier le Bundle ID dans le code"
    echo "8) 📊 Afficher les fichiers créés"
    echo "9) 🧹 Nettoyer (supprimer tous les fichiers)"
    echo "0) ❌ Quitter"
    echo ""
    read -p "Choix : " choice

    case $choice in
        1) setup_initial ;;
        2) generate_key_csr ;;
        3) convert_cer_to_p12 ;;
        4) encode_p12 ;;
        5) encode_mobileprovision ;;
        6) encode_p8 ;;
        7) check_bundle_id ;;
        8) list_files ;;
        9) cleanup ;;
        0) exit 0 ;;
        *) print_error "Choix invalide" ; sleep 2 ; show_menu ;;
    esac
}

# 1. Setup initial
setup_initial() {
    print_title "Setup Initial"

    if [ -d "$CERT_DIR" ]; then
        print_warning "Le dossier $CERT_DIR existe déjà"
        read -p "Veux-tu le recréer (supprime tout) ? (y/N) " confirm
        if [[ $confirm == [yY] ]]; then
            rm -rf "$CERT_DIR"
            mkdir -p "$CERT_DIR"
            print_success "Dossier recréé"
        else
            print_info "Dossier conservé"
        fi
    else
        mkdir -p "$CERT_DIR"
        print_success "Dossier créé : $CERT_DIR"
    fi

    print_info "Tous les fichiers seront stockés dans : $CERT_DIR"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 2. Générer clé privée et CSR
generate_key_csr() {
    print_title "Génération Clé Privée et CSR"

    cd "$CERT_DIR"

    if [ -f "c6radio.key" ]; then
        print_warning "La clé privée existe déjà"
        read -p "Veux-tu la régénérer ? (y/N) " confirm
        if [[ ! $confirm == [yY] ]]; then
            read -p "Appuie sur Entrée pour continuer..."
            show_menu
            return
        fi
    fi

    print_info "Entre ton email Apple Developer :"
    read email

    print_info "Entre ton nom complet :"
    read name

    print_info "Génération de la clé privée..."
    openssl genrsa -out c6radio.key 2048
    print_success "Clé privée créée : c6radio.key"

    print_info "Génération du CSR..."
    openssl req -new -key c6radio.key -out c6radio.csr \
        -subj "/emailAddress=$email, CN=$name, C=FR"
    print_success "CSR créé : c6radio.csr"

    echo ""
    print_info "📤 PROCHAINE ÉTAPE :"
    echo "   1. Va sur https://developer.apple.com/account"
    echo "   2. Certificates → [+]"
    echo "   3. Sélectionne 'Apple Distribution'"
    echo "   4. Upload c6radio.csr"
    echo "   5. Download le fichier .cer"
    echo "   6. Reviens ici et choisis l'option 3"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 3. Convertir .cer en .p12
convert_cer_to_p12() {
    print_title "Conversion .cer vers .p12"

    cd "$CERT_DIR"

    if [ ! -f "c6radio.key" ]; then
        print_error "Erreur : c6radio.key n'existe pas"
        print_info "Lance d'abord l'option 2 (Générer clé et CSR)"
        read -p "Appuie sur Entrée pour continuer..."
        show_menu
        return
    fi

    print_info "Liste des fichiers .cer disponibles :"
    ls -1 *.cer 2>/dev/null || print_warning "Aucun fichier .cer trouvé"

    print_info "Nom du fichier .cer (ex: distribution.cer) :"
    read cer_file

    if [ ! -f "$cer_file" ]; then
        print_error "Le fichier $cer_file n'existe pas"
        print_info "Copie-le dans $CERT_DIR d'abord"
        read -p "Appuie sur Entrée pour continuer..."
        show_menu
        return
    fi

    print_info "Conversion en .pem..."
    openssl x509 -in "$cer_file" -inform DER -out distribution.pem -outform PEM
    print_success "Fichier .pem créé"

    print_info "Création du .p12..."
    print_warning "Tu vas devoir choisir un mot de passe (IMPORTANT : mémorise-le !)"
    openssl pkcs12 -export -out distribution.p12 -inkey c6radio.key -in distribution.pem
    print_success "Fichier .p12 créé : distribution.p12"

    echo ""
    print_warning "⚠️  IMPORTANT : Note le mot de passe que tu viens de choisir !"
    print_info "Tu en auras besoin pour le secret GitHub : IOS_P12_PASSWORD"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 4. Encoder .p12 en base64
encode_p12() {
    print_title "Encodage .p12 en Base64"

    cd "$CERT_DIR"

    if [ ! -f "distribution.p12" ]; then
        print_error "Le fichier distribution.p12 n'existe pas"
        print_info "Lance d'abord l'option 3 (Convertir .cer en .p12)"
        read -p "Appuie sur Entrée pour continuer..."
        show_menu
        return
    fi

    print_info "Encodage en base64..."
    base64 -w 0 distribution.p12 > distribution.p12.base64
    print_success "Fichier encodé : distribution.p12.base64"

    echo ""
    print_info "📋 COPIE LE CONTENU CI-DESSOUS :"
    echo ""
    cat distribution.p12.base64
    echo ""
    echo ""
    print_info "Sur GitHub :"
    echo "   Settings → Secrets → New repository secret"
    echo "   Name: IOS_P12_BASE64"
    echo "   Value: [colle le contenu ci-dessus]"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 5. Encoder .mobileprovision en base64
encode_mobileprovision() {
    print_title "Encodage .mobileprovision en Base64"

    cd "$CERT_DIR"

    print_info "Liste des fichiers .mobileprovision disponibles :"
    ls -1 *.mobileprovision 2>/dev/null || print_warning "Aucun fichier trouvé"

    print_info "Nom du fichier .mobileprovision :"
    read profile_file

    if [ ! -f "$profile_file" ]; then
        print_error "Le fichier $profile_file n'existe pas"
        print_info "Copie-le dans $CERT_DIR d'abord"
        print_info "1. Va sur https://developer.apple.com/account"
        print_info "2. Profiles → Ton profil → Download"
        print_info "3. Copie le fichier dans $CERT_DIR"
        read -p "Appuie sur Entrée pour continuer..."
        show_menu
        return
    fi

    print_info "Encodage en base64..."
    base64 -w 0 "$profile_file" > profile.base64
    print_success "Fichier encodé : profile.base64"

    echo ""
    print_info "📋 COPIE LE CONTENU CI-DESSOUS :"
    echo ""
    cat profile.base64
    echo ""
    echo ""
    print_info "Sur GitHub :"
    echo "   Settings → Secrets → New repository secret"
    echo "   Name: IOS_MOBILEPROVISION_BASE64"
    echo "   Value: [colle le contenu ci-dessus]"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 6. Encoder .p8 en base64
encode_p8() {
    print_title "Encodage .p8 (Clé API) en Base64"

    cd "$CERT_DIR"

    print_info "Liste des fichiers .p8 disponibles :"
    ls -1 *.p8 2>/dev/null || print_warning "Aucun fichier trouvé"

    print_info "Nom du fichier .p8 (ex: AuthKey_ABC123XYZ4.p8) :"
    read p8_file

    if [ ! -f "$p8_file" ]; then
        print_error "Le fichier $p8_file n'existe pas"
        print_info "Copie-le dans $CERT_DIR d'abord"
        print_info "1. Va sur https://appstoreconnect.apple.com"
        print_info "2. Users and Access → Integrations → Generate API Key"
        print_info "3. Download le fichier .p8 (UNE SEULE FOIS possible !)"
        print_info "4. Copie le fichier dans $CERT_DIR"
        read -p "Appuie sur Entrée pour continuer..."
        show_menu
        return
    fi

    print_info "Encodage en base64..."
    base64 -w 0 "$p8_file" > authkey.base64
    print_success "Fichier encodé : authkey.base64"

    # Extraire le Key ID du nom de fichier
    key_id=$(basename "$p8_file" .p8 | cut -d'_' -f2)

    echo ""
    print_info "📋 INFORMATIONS À COPIER :"
    echo ""
    echo "Key ID (extrait du nom de fichier) :"
    echo "$key_id"
    echo ""
    echo "Contenu base64 :"
    cat authkey.base64
    echo ""
    echo ""
    print_info "Sur GitHub, crée 3 secrets :"
    echo ""
    echo "1) Name: ASC_API_KEY_ID"
    echo "   Value: $key_id"
    echo ""
    echo "2) Name: ASC_API_ISSUER_ID"
    echo "   Value: [ton Issuer ID depuis App Store Connect]"
    echo ""
    echo "3) Name: ASC_API_PRIVATE_KEY_BASE64"
    echo "   Value: [contenu base64 ci-dessus]"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 7. Vérifier le Bundle ID
check_bundle_id() {
    print_title "Vérification du Bundle ID"

    EXPECTED_BUNDLE_ID="fr.c6debug.app"

    # Vérifier capacitor.config.json
    print_info "Vérification de capacitor.config.json..."
    if grep -q "\"appId\": \"$EXPECTED_BUNDLE_ID\"" capacitor.config.json 2>/dev/null; then
        print_success "capacitor.config.json : OK"
    else
        print_error "capacitor.config.json : INCORRECT ou fichier introuvable"
        current=$(grep "appId" capacitor.config.json 2>/dev/null || echo "Non trouvé")
        echo "   Actuel : $current"
        echo "   Attendu : \"appId\": \"$EXPECTED_BUNDLE_ID\""
    fi

    # Vérifier project.pbxproj
    print_info "Vérification de project.pbxproj..."
    if grep -q "PRODUCT_BUNDLE_IDENTIFIER = $EXPECTED_BUNDLE_ID;" ios/App/App.xcodeproj/project.pbxproj 2>/dev/null; then
        print_success "project.pbxproj : OK"
        count=$(grep -c "PRODUCT_BUNDLE_IDENTIFIER = $EXPECTED_BUNDLE_ID;" ios/App/App.xcodeproj/project.pbxproj)
        echo "   Trouvé $count occurrences"
    else
        print_error "project.pbxproj : INCORRECT ou fichier introuvable"
        echo "   Recherche de PRODUCT_BUNDLE_IDENTIFIER :"
        grep "PRODUCT_BUNDLE_IDENTIFIER" ios/App/App.xcodeproj/project.pbxproj 2>/dev/null | head -3 || echo "   Fichier non trouvé"
    fi

    echo ""
    print_info "Bundle ID attendu partout : $EXPECTED_BUNDLE_ID"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 8. Lister les fichiers créés
list_files() {
    print_title "Fichiers Créés"

    cd "$CERT_DIR"

    print_info "Contenu de $CERT_DIR :"
    echo ""

    ls -lh 2>/dev/null || print_warning "Dossier vide ou inexistant"

    echo ""
    print_info "Fichiers attendus :"
    echo "  ✅ c6radio.key (clé privée)"
    echo "  ✅ c6radio.csr (demande de certificat)"
    echo "  ✅ distribution.cer (certificat téléchargé)"
    echo "  ✅ distribution.pem (certificat converti)"
    echo "  ✅ distribution.p12 (certificat final)"
    echo "  ✅ distribution.p12.base64 (pour GitHub)"
    echo "  ✅ *.mobileprovision (profil)"
    echo "  ✅ profile.base64 (pour GitHub)"
    echo "  ✅ AuthKey_*.p8 (clé API)"
    echo "  ✅ authkey.base64 (pour GitHub)"

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# 9. Nettoyer
cleanup() {
    print_title "Nettoyage"

    print_warning "⚠️  ATTENTION : Ceci va SUPPRIMER tous les fichiers dans $CERT_DIR"
    print_warning "Assure-toi d'avoir bien copié tous les secrets sur GitHub avant !"

    read -p "Es-tu SÛR de vouloir supprimer ? (yes/N) " confirm

    if [[ $confirm == "yes" ]]; then
        rm -rf "$CERT_DIR"
        print_success "Tous les fichiers ont été supprimés"
    else
        print_info "Annulé, rien n'a été supprimé"
    fi

    read -p "Appuie sur Entrée pour continuer..."
    show_menu
}

# Vérifier les dépendances
check_dependencies() {
    if ! command -v openssl &> /dev/null; then
        print_error "OpenSSL n'est pas installé"
        print_info "Installe-le avec : sudo apt install openssl"
        exit 1
    fi

    if ! command -v base64 &> /dev/null; then
        print_error "base64 n'est pas installé"
        print_info "Installe-le avec : sudo apt install coreutils"
        exit 1
    fi
}

# Point d'entrée
main() {
    check_dependencies
    show_menu
}

main

