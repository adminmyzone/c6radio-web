# Guide TestFlight (build interne)

## 1) Pré‑requis
- Compte Apple Developer actif.
- App créée dans App Store Connect avec le bundle id : `fr.c6radio.app`.
- Testeur interne ajouté dans App Store Connect.
- Workflow GitHub Actions **iOS Device Build (TestFlight)** configuré.

---

## 2) Lancer un build (GitHub Actions)
1. Ouvrir le dépôt GitHub.
2. Onglet **Actions**.
3. Workflow **iOS Device Build (TestFlight)**.
4. **Run workflow** (branche `main`).
5. Attendre le statut **success** (durée : ~10-15 min).

**Automatisations du workflow :**
- ✅ Build Next.js en mode export statique
- ✅ Sync Capacitor iOS
- ✅ Incrémentation automatique du build number (basé sur le numéro de run GitHub)
- ✅ Build et signature de l'archive Xcode
- ✅ Export IPA
- ✅ Upload vers TestFlight avec retry automatique (3 tentatives en cas d'erreur serveur Apple)

---

## 3) Vérifier le build dans App Store Connect
1. App Store Connect → **My Apps** → **C6Radio**.
2. Onglet **TestFlight**.
3. Attendre l’état **Ready to Test** (5–30 min).

---

## 4) Ajouter les testeurs internes (si nécessaire)
1. App Store Connect → **Users and Access**.
2. Ajouter l’Apple ID du testeur (rôle **App Manager** ou **Developer**).
3. Revenir dans **C6Radio → TestFlight → Internal Testing**.
4. Ajouter le testeur au **Internal Testing Group**.

---

## 5) Installer sur iPhone
1. Installer l’app **TestFlight** depuis l’App Store.
2. Ouvrir TestFlight → l’app **C6Radio** doit apparaître.
3. Cliquer **Install**.

---

## 6) Notes utiles
- Pour un lien public/invitation par code, utiliser **External Testing** (review Apple requise).
- Si le build n’apparaît pas : vérifier le bundle id et que l’upload TestFlight a bien réussi.
- En cas d’erreur d’upload : vérifier que l’app existe dans App Store Connect et que la clé API a accès à l’app.
- Le build number est auto-incrémenté à chaque run du workflow (pas besoin de le gérer manuellement).

---

## 7) Dépannage rapide
- **Pas d'email** : normal en interne. Ouvrir TestFlight directement.
- **Build bloqué en "Processing"** : attendre 30–60 min.
- **Build non visible** : vérifier l'ajout au groupe interne et l'Apple ID.
- **Erreur 500 lors de l'upload** : erreur temporaire Apple. Le workflow réessaie automatiquement 3 fois avec 60s entre chaque tentative.
- **"Bundle version already used"** : le workflow gère maintenant l'incrémentation automatique du build number.
- **Images/pubs ne s'affichent pas** : vérifier que `images.unoptimized: true` est dans next.config.ts
- **"NEXT_PUBLIC_WORDPRESS_API non défini"** : les variables d'environnement sont maintenant dans le workflow (section 10)

---

## 8) Corrections iOS Safe Areas (Build v15+)

### Problème résolu
Le header et le player footer étaient masqués par les zones système iOS (notch, status bar, home indicator).

### Changements appliqués

#### 8.1) Header.tsx
```tsx
<header className="border-b pt-[env(safe-area-inset-top)]">
```
→ Ajout du padding-top pour la safe area iOS (status bar).

#### 8.2) PlayerBar.tsx
```tsx
className="... px-4 pb-[env(safe-area-inset-bottom)] flex items-center ..."
```
→ Ajout du padding-bottom pour la safe area iOS (home indicator).

#### 8.3) layout.tsx
```tsx
className="... pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-[calc(7rem+env(safe-area-inset-bottom))]"
```
→ Ajustement du padding-bottom du body pour inclure le safe-area-inset-bottom.

**Meta viewport ajoutée :**
```tsx
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

#### 8.4) globals.css
```css
/* iOS Safe Area Support */
@supports (padding: env(safe-area-inset-top)) {
  html {
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}
```

#### 8.5) capacitor.config.ts
```typescript
ios: {
  contentInset: 'always'
}
```
→ Configuration iOS pour respecter les safe areas.

---

## 9) Configuration Next.js pour Capacitor

### next.config.ts
```typescript
const nextConfig: NextConfig = withPWA({
  turbopack: {
    root: __dirname, // Définir le root explicitement pour éviter les conflits de lockfiles
  },
  output: 'export', // Export statique pour Capacitor
  images: {
    unoptimized: true, // Requis pour output: 'export' - désactive l'optimisation d'images
    remotePatterns: [
      // ... patterns WordPress
    ],
  },
  // ...
});
```

**Changements clés :**
- `turbopack.root: __dirname` → Résout le conflit avec le lockfile parent
- `output: 'export'` → Export statique pour Capacitor iOS
- `images.unoptimized: true` → Permet l'export avec Next.js Image

### Routes statiques
- `sitemap.ts` et `robots.ts` : ajout de `export const revalidate = false`
- `/news/[slug]/page.tsx` : ajout de `generateStaticParams()` pour le SSG

---

## 10) Workflow GitHub Actions

### Configuration Node.js
- Node.js **22** requis par Capacitor CLI (migration depuis Node.js 20)

### Étapes du build
1. **Install dependencies** → `npm install`
2. **Build Next.js** → `npm run build` (génère le dossier `out/` avec les assets statiques)
3. **Sync Capacitor** → `npx cap sync ios` (copie `out/` vers `ios/App/App/public`)
4. **Increment build number** → Auto via `github.run_number`
5. **Build & Archive** → Compilation Xcode
6. **Upload TestFlight** → Avec retry logic

### Variables d'environnement requises
Le build Next.js nécessite ces variables pour générer les pages statiques :
```yaml
env:
  NEXT_PUBLIC_ICECAST_URL: https://radio.c6media.fr:8443/main
  NEXT_PUBLIC_LIBRETIME_API: https://radio.c6media.fr/api/live-info
  NEXT_PUBLIC_WORDPRESS_API: https://exp937.fr/wp/wp-json/wp/v2
  NEXT_PUBLIC_SITE_URL: https://c6radio.fr
```
→ Permet de fetch les articles WordPress et bannières publicitaires pendant le build

### Build iOS
- Utilisation de **App.xcodeproj** (Swift Package Manager) au lieu de App.xcworkspace
- Incrémentation automatique du build number via `github.run_number`
- Retry logic pour les erreurs 500 d'Apple (3 tentatives, 60s entre chaque)

### Fichiers modifiés
- `.github/workflows/ios-device-testflight.yml`
- `.github/workflows/ios-capacitor-build.yml`

---

## 11) Secrets GitHub Actions requis

Les secrets suivants doivent être configurés dans GitHub :
- `IOS_P12_BASE64` : Certificat de signature (base64)
- `IOS_P12_PASSWORD` : Mot de passe du certificat
- `IOS_MOBILEPROVISION_BASE64` : Profil de provisionnement (base64)
- `APPLE_TEAM_ID` : ID de l'équipe Apple Developer
- `PROVISIONING_PROFILE_NAME` : Nom du profil de provisionnement
- `ASC_API_KEY_ID` : ID de la clé API App Store Connect
- `ASC_API_ISSUER_ID` : Issuer ID de la clé API
- `ASC_API_PRIVATE_KEY_BASE64` : Clé privée API (base64)
