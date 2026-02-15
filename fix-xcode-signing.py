#!/usr/bin/env python3
"""Script pour corriger la configuration de signature du projet Xcode"""

import re

# Lire le fichier
with open('ios/App/App.xcodeproj/project.pbxproj', 'r') as f:
    content = f.read()

# 1. Remplacer CODE_SIGN_IDENTITY
content = content.replace(
    'CODE_SIGN_IDENTITY = "iPhone Developer";',
    'CODE_SIGN_IDENTITY = "Apple Distribution";'
)

# 2. Remplacer CODE_SIGN_STYLE
content = content.replace(
    'CODE_SIGN_STYLE = Automatic;',
    'CODE_SIGN_STYLE = Manual;'
)

# 3. Ajouter CODE_SIGN_IDENTITY, DEVELOPMENT_TEAM et PROVISIONING_PROFILE_SPECIFIER
# dans les configurations Debug et Release (après CODE_SIGN_STYLE = Manual;)

# Pour la configuration Debug
debug_pattern = r'(504EC3171FED79650016851F /\* Debug \*/ = \{[^}]*CODE_SIGN_STYLE = Manual;\n)(\s+CURRENT_PROJECT_VERSION)'
debug_replacement = r'\1\t\t\t\tCODE_SIGN_IDENTITY = "Apple Distribution";\n\2'
content = re.sub(debug_pattern, debug_replacement, content)

debug_pattern2 = r'(504EC3171FED79650016851F /\* Debug \*/ = \{[^}]*CURRENT_PROJECT_VERSION = 1;\n)(\s+INFOPLIST_FILE)'
debug_replacement2 = r'\1\t\t\t\tDEVELOPMENT_TEAM = "";\n\2'
content = re.sub(debug_pattern2, debug_replacement2, content)

debug_pattern3 = r'(504EC3171FED79650016851F /\* Debug \*/ = \{[^}]*PRODUCT_NAME = "\$\(TARGET_NAME\)";\n)(\s+SWIFT_ACTIVE_COMPILATION_CONDITIONS)'
debug_replacement3 = r'\1\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "";\n\2'
content = re.sub(debug_pattern3, debug_replacement3, content)

# Pour la configuration Release
release_pattern = r'(504EC3181FED79650016851F /\* Release \*/ = \{[^}]*CODE_SIGN_STYLE = Manual;\n)(\s+CURRENT_PROJECT_VERSION)'
release_replacement = r'\1\t\t\t\tCODE_SIGN_IDENTITY = "Apple Distribution";\n\2'
content = re.sub(release_pattern, release_replacement, content)

release_pattern2 = r'(504EC3181FED79650016851F /\* Release \*/ = \{[^}]*CURRENT_PROJECT_VERSION = 1;\n)(\s+INFOPLIST_FILE)'
release_replacement2 = r'\1\t\t\t\tDEVELOPMENT_TEAM = "";\n\2'
content = re.sub(release_pattern2, release_replacement2, content)

release_pattern3 = r'(504EC3181FED79650016851F /\* Release \*/ = \{[^}]*PRODUCT_NAME = "\$\(TARGET_NAME\)";\n)(\s+SWIFT_ACTIVE_COMPILATION_CONDITIONS)'
release_replacement3 = r'\1\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "";\n\2'
content = re.sub(release_pattern3, release_replacement3, content)

# Écrire le fichier
with open('ios/App/App.xcodeproj/project.pbxproj', 'w') as f:
    f.write(content)

print("✅ Fichier project.pbxproj corrigé avec succès!")
print("   - CODE_SIGN_IDENTITY: Apple Distribution")
print("   - CODE_SIGN_STYLE: Manual")
print("   - DEVELOPMENT_TEAM: ajouté")
print("   - PROVISIONING_PROFILE_SPECIFIER: ajouté")

