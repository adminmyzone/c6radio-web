# ✅ Checklist finale iOS - Build via GitHub Actions

## Fichiers à ajouter au repo

### 1. GoogleService-Info.plist (OBLIGATOIRE)

**Télécharger depuis Firebase** :
1. Firebase Console > ⚙️ Paramètres du projet
2. Onglet "Général"
3. Section "Vos applications" > iOS
4. Clique sur l'icône de téléchargement ⬇️
5. Télécharge **GoogleService-Info.plist**

**Ajouter au repo** :
```bash
# Copie le fichier téléchargé dans :
cp ~/Downloads/GoogleService-Info.plist ios/App/App/

# Vérifie qu'il est bien là
ls -la ios/App/App/GoogleService-Info.plist
```

---

## Fichiers déjà configurés ✅

- ✅ `ios/App/App/Info.plist` - Background notifications activé
- ✅ `ios/App/App/AppDelegate.swift` - Firebase initialisé
- ✅ `ios/App/CapApp-SPM/Package.swift` - Firebase SDK ajouté
- ✅ `ios/App/App/App.entitlements` - Push notifications capability
- ✅ `src/config/firebase.config.js` - Clés Firebase remplies

---

## Modifier le project.pbxproj pour les entitlements

Le fichier `App.entitlements` a été créé, mais il faut dire à Xcode de l'utiliser.

**Option A : Via workflow GitHub (automatique)**

Ton workflow GitHub devrait gérer ça automatiquement lors du build.

**Option B : Manuel (si nécessaire)**

Si le build échoue, il faudra modifier `ios/App/App.xcodeproj/project.pbxproj` pour ajouter :
```
CODE_SIGN_ENTITLEMENTS = App/App.entitlements;
```

Mais normalement, avec Capacitor, ça devrait être automatique.

---

## Mettre à jour le .gitignore (si nécessaire)

Vérifie que GoogleService-Info.plist ne soit PAS ignoré :

```bash
# Vérifier le .gitignore
cat ios/.gitignore | grep GoogleService

# Si c'est ignoré, retire cette ligne du .gitignore
```

⚠️ **Note** : GoogleService-Info.plist contient des infos publiques (Project ID, etc.), c'est OK de le commiter. Les vraies clés secrètes sont dans le Service Account JSON côté WordPress.

---

## Commit et push

```bash
git add ios/App/App/GoogleService-Info.plist
git add ios/App/App/App.entitlements
git add ios/App/App/Info.plist
git add ios/App/App/AppDelegate.swift
git add ios/App/CapApp-SPM/Package.swift
git add src/config/firebase.config.js

git commit -m "feat: Add push notifications support (iOS)

- Configure Firebase Cloud Messaging
- Add GoogleService-Info.plist
- Update AppDelegate for remote notifications
- Add push notifications entitlements
- Configure Info.plist for background notifications

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

git push
```

---

## Déclencher le build GitHub Actions

Selon ton workflow :
- Si auto sur push : le build démarre automatiquement
- Si manuel : Va dans GitHub > Actions > Sélectionne le workflow > Run workflow

---

## Après le build

1. Télécharge le `.ipa` depuis GitHub Actions artifacts
2. Sideload sur ton iPhone (via AltStore, Sideloadly, etc.)
3. Lance l'app
4. **Accepte la permission notifications** quand elle apparaît
5. Va dans WordPress Admin > Push Notifs
6. Tu devrais voir **1 appareil iOS** enregistré ✅

---

## Test complet

### Test manuel :
1. WordPress Admin > Push Notifs > Envoyer
2. Remplis le formulaire
3. Envoie
4. Tu reçois la notif sur ton iPhone 🎉

### Test auto :
1. WordPress Admin > Articles > Ajouter
2. Écris un article
3. Publie
4. La notif arrive automatiquement ! 🚀

---

## 🐛 En cas de problème

### Build échoue sur GitHub Actions
- Vérifie les logs d'erreur
- Vérifie que les certificats de signing sont corrects
- Vérifie que GoogleService-Info.plist est bien dans le repo

### App installe mais pas de demande de permission
- Vérifie que `App.entitlements` est bien utilisé
- Vérifie les logs Xcode dans le workflow

### Permission OK mais pas d'enregistrement dans WordPress
- Vérifie les logs de l'app (console Safari/iPhone)
- Vérifie que l'endpoint WordPress est accessible
- Vérifie firebase.config.js

---

**Prêt ?** Télécharge GoogleService-Info.plist et on commit ! 🚀
