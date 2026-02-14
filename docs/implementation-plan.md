# Plan d'Implémentation MVP - C6Radio

**Version :** 1.3  
**Date de création :** 13 février 2026  
**Dernière mise à jour :** 15 février 2026 - 21:00  
**Basé sur :** [technical-decisions.md](technical-decisions.md) + [prd.md](prd.md)  
**Release cible :** 1er avril 2026 (6 semaines restantes)

> ℹ️ **Note importante :** Ce document a été mis à jour pour refléter les choix techniques **réellement implémentés** (Vite, JavaScript, CSS vanilla) plutôt que les recommandations initiales (Next.js, TypeScript, Tailwind).

> 🚨 **Production Readiness :** Consulter [production-readiness-checklist.md](production-readiness-checklist.md) pour les améliorations à faire avant déploiement.

---

## 📐 Architecture Technique

### Stack Implémenté

**Frontend (Web + Mobile partagé) :**
```
Vite 7+ ⚡
├── React 19+
├── JavaScript (ES modules)
├── CSS Vanilla (fichiers .css par composant)
├── React Context API (state management simple)
└── Fetch API native (data fetching)
```

**Rationale des choix :**
- **Vite vs Next.js** : Build ultra-rapide, HMR instantané, simplicité configuration (pas besoin SSR pour radio)
- **JavaScript vs TypeScript** : Approche progressive, moins de complexité pour MVP
- **CSS Vanilla** : Contrôle total, pas de dépendances CSS framework, performance optimale

**Mobile Native (Capacitor) :**
```
Capacitor 6+
├── @capacitor/ios
├── @capacitor/android
├── @capacitor/network (détection connexion)
├── capacitor-plugin-background-mode (audio background)
└── capacitor-music-controls (lockscreen)
```

**Plugins audio critiques :**
- `capacitor-plugin-media-session` (média controls natifs)
- `@capacitor/background-task` (maintien audio iOS)
- Ou alternative : `cordova-plugin-media` (plus mature)

**Tooling :**
- `npm` (gestion dépendances)
- `ESLint` (linting configuré)
- `Vite` (build + dev server)
- GitHub Actions (CI/CD - à configurer)

### Justification des Choix

**Vite :**
- ⚡ Build ultra-rapide (esbuild)
- HMR instantané en développement
- Configuration minimale, moins de complexité
- Compatible Capacitor pour mobile
- Suffisant pour site radio (pas besoin SSR)

**JavaScript (pas TypeScript) :**
- Approche progressive pour débutant
- Moins de configuration tooling
- Migration TypeScript possible en V1.1+
- Validation runtime suffisante pour MVP

**CSS Vanilla (pas Tailwind/framework) :**
- ✅ Contrôle total sur styles
- ✅ Aucune dépendance externe CSS
- ✅ Fichiers CSS par composant (isolation)
- ✅ Performance optimale (pas de purge/build CSS)
- ✅ Apprentissage CSS standard

**Capacitor vs React Native :**
- ✅ Partage 100% du code web
- ✅ Déploiement web instantané (pas de rebuild)
- ✅ Accès plugins natifs iOS/Android
- ✅ Moins de complexité config que RN
- ⚠️ Contrainte : UI doit être pensée responsive

**State Management Simple :**
- React Context API suffisant pour player global
- Custom hooks pour logique métier
- Pas besoin Zustand/Redux pour MVP

---

## 🗂️ Structure du Projet

### Structure Actuelle (Implémentée)

```
c6radio-web/                    ← Projet Vite
├── .github/
│   └── workflows/
│       ├── ci.yml              # Tests + lint (à configurer)
│       └── build-mobile.yml    # Build iOS/Android (à configurer)
│
├── public/                     # Assets statiques
│   └── vite.svg
│
├── src/
│   ├── main.jsx                # Point d'entrée Vite
│   ├── App.jsx                 # Composant racine + PlayerBar
│   ├── App.css                 # Styles App
│   ├── index.css               # Styles globaux
│   │
│   ├── services/               ✅ IMPLÉMENTÉ
│   │   ├── audioPlayer.js      # Singleton audio (play/stop live)
│   │   └── nowPlaying.js       # Client API Libretime (polling 12s)
│   │
│   ├── hooks/                  ✅ IMPLÉMENTÉ
│   │   ├── useAudioPlayer.js   # Hook React player
│   │   └── useNowPlaying.js    # Hook polling now playing
│   │
│   ├── components/             ✅ IMPLÉMENTÉ (Phase 2)
│   │   ├── PlayerBar.jsx       # Barre footer sticky
│   │   ├── PlayerBar.css       # 🎨 Styles PlayerBar
│   │   ├── NowPlaying.jsx      # Affichage titre/artwork
│   │   ├── NowPlaying.css      # 🎨 Styles NowPlaying
│   │   ├── AudioTest.jsx       # Composant test
│   │   ├── AudioTest.css       # 🎨 Styles tests
│   │   ├── PlayerButton.jsx    # Exemple démo
│   │   └── PlayerButton.css    # 🎨 Styles bouton démo
│   │
│   └── assets/                 # Images, icônes (à peupler)
│
├── package.json                # React 19 + Vite 7
├── vite.config.js              # Config Vite + plugin React
├── eslint.config.js            # Config ESLint
├── index.html                  # Template HTML
└── README.md

### Structure Cible (À implémenter)

À ajouter dans les prochaines phases :

```
src/
├── components/
│   ├── layout/                 ⏳ Phase 3
│   │   ├── Header.jsx
│   │   ├── Footer.jsx (statique, séparé de PlayerBar)
│   │   └── Navigation.jsx
│   │
│   ├── content/                ⏳ Phase 4
│   │   ├── ActuCard.jsx + ActuCard.css
│   │   ├── ActuList.jsx + ActuList.css
│   │   └── BannerAd.jsx + BannerAd.css
│   │
│   └── podcast/                ⏳ Phase 6
│       ├── PodcastCard.jsx + PodcastCard.css
│       └── PodcastList.jsx + PodcastList.css
│
├── lib/                        ⏳ Phases 1, 4
│   ├── api/
│   │   ├── wordpress.js        # Client WordPress REST
│   │   └── types.js            # Types API
│   ├── audio/
│   │   ├── reconnectionManager.js    # Backoff retry
│   │   ├── mediaSession.js           # Lockscreen/notifications
│   │   └── capacitorAudio.js         # Adapters natifs iOS/Android
│   └── utils/
│       ├── format.js           # Helpers (dates, durées...)
│       └── constants.js        # URLs, config
│
├── pages/                      ⏳ Phase 3 (React Router)
│   ├── Home.jsx
│   ├── Actus.jsx
│   ├── ActuDetail.jsx
│   ├── Podcasts.jsx
│   └── About.jsx
│
└── context/                    ⏳ Phase 1
    └── AudioContext.jsx        # Context global player
```

### Mobile (Capacitor)

À ajouter Phase 7+ :

```
ios/                            ⏳ Phase 7-8
└── App/
    └── App/
        ├── Info.plist          # Config audio background
        └── capacitor.config.json

android/                        ⏳ Phase 7-8
└── app/
    └── src/
        └── main/
            ├── AndroidManifest.xml  # Permissions
            └── res/

capacitor.config.ts             ⏳ Phase 7
```

---

## 📊 État d'Avancement Actuel

**Dernière mise à jour :** 15 février 2026 - 21:00

### ✅ Phases Complétées

#### Phase 0 : Setup & Validation - ✅ TERMINÉE
- ✅ Projet Vite + React 19 initialisé
- ✅ ESLint configuré
- ✅ Structure de base créée
- ✅ Build production fonctionnel (`npm run build`)

#### Phase 1 : Audio Core - ✅ TERMINÉE (100% - 13/02/2026)

**Complété :**
- ✅ `audioPlayer.js` : Service singleton avec playLiveStream(), stop()
- ✅ `nowPlaying.js` : Client API Libretime avec polling 12s
- ✅ `useAudioPlayer.js` : Hook React pour contrôler le player
- ✅ `useNowPlaying.js` : Hook React pour polling now playing
- ✅ Machine à états (idle, loading, playing, stopped, error)
- ✅ Fallback now playing ("C6Radio en direct")
- ✅ `reconnectionManager.js` : Backoff automatique (3s/10s/30s)
- ✅ `mediaSession.js` : Media Session API pour lockscreen web
- ✅ `initializeAudioPlayer()` : Initialisation globale au démarrage
- ✅ Intégration complète reconnexion + media session
- ✅ Mise à jour automatique métadonnées Now Playing
- ✅ Documentation complète : [audio-architecture.md](audio-architecture.md)

**Note :** Adapters natifs iOS/Android (`capacitorAudio.js`) reportés à Phase 7 (setup mobile)

#### Phase 2 : Barre de Contrôle - ✅ TERMINÉE
- ✅ PlayerBar.jsx : Composant sticky footer
- ✅ PlayerBar.css : Styles CSS vanilla (palette verte/jaune/rouge)
- ✅ NowPlaying.jsx : Affichage titre/artiste/artwork
- ✅ NowPlaying.css : Styles compact/full mode
- ✅ AudioTest.jsx : Page de test complète
- ✅ AudioTest.css : Styles de test
- ✅ Migration complète Tailwind → CSS vanilla

#### Phase 3 : Pages & Navigation - ✅ TERMINÉE (100% - 15/02/2026)

**Phase 3A : Navigation & Structure (14/02/2026) :**
- ✅ React Router v7 configuré
- ✅ Structure pages (Home, About, Contact, NotFound)
- ✅ Header avec navigation responsive
- ✅ Footer avec liens et infos
- ✅ Menu hamburger mobile
- ✅ SEO basique (titres, meta)

**Phase 3B : WordPress Dynamique (14/02/2026) :**
- ✅ Service `wordpress.js` : Client API REST
- ✅ Composant `DynamicPage.jsx` : Pages génériques
- ✅ Filtre ACF éditorial (affiche_dans_menu)
- ✅ Support médias responsive (images, vidéos, audio)
- ✅ Décodage HTML entities

**Phase 3C : GlobalAudioContext (15/02/2026) :**
- ✅ `GlobalAudioContext.jsx` : Context centralisé
- ✅ Règle "un seul audio à la fois" appliquée
- ✅ Live stream ↔ Vidéos WordPress (pause automatique)
- ✅ Lazy loading vidéos (IntersectionObserver)
- ✅ Animation shimmer pour vidéos en chargement
- ✅ Intégration dans `useAudioPlayer.js` et `DynamicPage.jsx`

**Documentation :**
- ✅ [audio-COMPLETE.md](audio-COMPLETE.md) - Référence unique audio
- ✅ [session-15-fev-global-audio.md](session-15-fev-global-audio.md) - Notes session
- ✅ [phase-3-pages-navigation.md](phase-3-pages-navigation.md) - Guide détaillé
- ✅ [phase-3-recap.md](phase-3-recap.md) - Récapitulatif
- ✅ [phase-3b-test-guide.md](phase-3b-test-guide.md) - Guide tests

### ❌ Phases Non Commencées

- ❌ Phase 4 : Podcasts WordPress
- ❌ Phase 5 : Intégration WordPress - Actus (peut être fusionné avec Phase 3B)
- ❌ Phase 6 : Bannières Publicitaires
- ❌ Phase 7 : Polish & Tests Multi-Devices
- ❌ Phase 8 : Build & Soumission Stores
- ❌ Phase 9 : Beta Testing

### 🎯 Prochaines Étapes Recommandées

**Priorité 1 - Phase 4 : Podcasts WordPress :**
1. API WordPress custom post type "podcast"
2. Service `podcastService.js`
3. Pages liste + détail épisodes
4. Player podcast (réutilise `useAudioPlayer` ✅)
5. Intégration GlobalAudioContext (déjà prêt ✅)

**Priorité 2 - Mobile (Phase 7 avancée) :**
1. POC Capacitor : setup iOS/Android
2. POC Audio Background iOS (CRITIQUE)
3. POC Audio Background Android

**Priorité 3 - Phase 5 : WordPress Actus (optionnel) :**
1. Intégration posts WordPress (peut réutiliser DynamicPage)
2. Page blog/actualités
3. Archives et catégories

---

## 🛠️ Phases de Développement

### Phase 0 : Setup & Validation - ✅ COMPLÉTÉE (13 février 2026)

**Durée réelle :** 1-2 jours  
**Objectif :** Environnement web prêt + structure de base

#### Tâches Réalisées

| # | Tâche | Statut | Validation |
|---|-------|--------|------------|
| 0.1 | Initialiser projet Vite + React 19 + JavaScript | ✅ | `npm run dev` fonctionne |
| 0.2 | Configuration ESLint | ✅ | `npm run lint` sans erreur |
| 0.3 | Structure dossiers (services, hooks, components) | ✅ | Arborescence créée |
| 0.4 | Test endpoint stream live (https://radio.c6media.fr/radio.mp3) | ✅ | URL accessible |
| 0.5 | Test endpoint now playing (Libretime API) | ✅ | Données récupérées |
| 0.6 | Build production fonctionnel | ✅ | `npm run build` exit code 0 |

**Livrables :**
- ✅ Projet Vite buildable et fonctionnel
- ✅ Endpoints prod testés et validés
- ✅ Structure de base propre

**📝 Notes :**
- **Choix effectué :** Vite au lieu de Next.js (simplicité, rapidité build)
- **Choix effectué :** JavaScript au lieu de TypeScript (MVP rapide, migration possible V1.1)
- **Setup mobile (Capacitor)** : Reporté à Phase 7 (focus web d'abord)

**⏭️ Prochaines étapes :**
- Setup Capacitor pour mobile (Phase 7)
- POC Audio Background à valider sur devices physiques

---

### Phase 1 : Audio Core - 🟡 EN COURS (~60% complété)

**Durée estimée :** 5-7 jours  
**Objectif :** Player live fonctionnel web + mobile avec now playing

#### Tâches

| # | Tâche | Statut | Dépendances | Validation |
|---|-------|--------|-------------|------------|
| 1.1 | Créer `audioPlayer.js` : architecture de base | ✅ | - | Service singleton créé |
| 1.2 | Implémenter `playLiveStream()` : lecture MP3 Icecast | ✅ | 1.1 | Audio joue sur web |
| 1.3 | Implémenter `stop()` avec clear buffer | ✅ | 1.2 | Stop clear buffer OK |
| 1.4 | Gestion états (idle, loading, playing, stopped, error) | ✅ | 1.2 | Machine à états OK |
| 1.5 | `reconnectionManager.js` : backoff 3s/10s/30s | ⏳ | 1.4 | **À implémenter** |
| 1.6 | `capacitorAudio.js` : adapter natif iOS | ⏳ | 1.2, 0.5 | **À implémenter** |
| 1.7 | `capacitorAudio.js` : adapter natif Android | ⏳ | 1.2, 0.6 | **À implémenter** |
| 1.8 | `mediaSession.js` : Media Session API (web) | ⏳ | 1.4 | **À implémenter** |
| 1.9 | `mediaSession.js` : lockscreen iOS/Android | ⏳ | 1.6, 1.7 | **À implémenter** |
| 1.10 | Service `nowPlaying.js` : fetch + polling 12s | ✅ | - | Service créé |
| 1.11 | Hook `useNowPlaying()` : polling actif si playing | ✅ | 1.10 | Hook fonctionnel |
| 1.12 | Fallback now playing : "C6Radio en direct" si erreur | ✅ | 1.11 | Fallback OK |
| 1.13 | Hook `useAudioPlayer()` : interface React | ✅ | 1.4 | Hook fonctionnel |
| 1.14 | Context API : état global player (optionnel) | ⏳ | 1.13 | **À évaluer** |

**Livrables partiels :**
- ✅ Player live fonctionnel : Play/Stop sur web
- ✅ Now playing affiché et mis à jour temps réel (polling 12s)
- ✅ Machine à états robuste
- ✅ Fallback gracieux si API down
- ⏳ Reconnexion automatique (à implémenter)
- ⏳ Audio background mobile (à implémenter Phase 7)
- ⏳ Contrôles lockscreen (à implémenter Phase 7)

**📝 Notes :**
- **Fichiers créés :** `audioPlayer.js` (240 lignes), `nowPlaying.js` (95 lignes), `useAudioPlayer.js` (65 lignes), `useNowPlaying.js` (120 lignes)
- **Approche :** Singleton pattern pour garantir une seule instance audio
- **Polling :** 12 secondes (équilibre perf/fraîcheur)
- **State management :** Pas encore de Context/Zustand (hooks suffisants pour MVP)
- ✅ Contrôles lockscreen opérationnels

**Tests critiques :**
1. Lecture continue 30 min écran verrouillé (iOS + Android)
2. Coupure WiFi → reconnexion auto dans les 30s
3. Appel téléphonique entrant → pause → reprise (Android, iOS V1.1)
4. Bluetooth : connexion casque/voiture (test manuel)

---

### Phase 2 : Barre de Contrôle Unifiée - ✅ COMPLÉTÉE (13 février 2026)

**Durée réelle :** 1-2 jours  
**Objectif :** UI player footer sticky avec now playing

#### Tâches Réalisées

| # | Tâche | Statut | Validation |
|---|-------|--------|------------|
| 2.1 | Composant `PlayerBar.jsx` : structure de base sticky footer | ✅ | Footer affiché, position fixed |
| 2.2 | Intégration `useAudioPlayer()` : connexion hooks | ✅ | State synchronisé |
| 2.3 | Boutons Play/Stop avec états visuels | ✅ | Boutons fonctionnels |
| 2.4 | Intégration `NowPlaying.jsx` : titre + artiste + artwork | ✅ | Affichage dynamique |
| 2.5 | Fallback artwork : logo par défaut si pas d'image | ✅ | Fallback fonctionnel |
| 2.6 | `PlayerBar.css` : styles vanilla (palette verte/jaune/rouge) | ✅ | CSS propre, 145 lignes |
| 2.7 | `NowPlaying.css` : styles compact/full mode | ✅ | CSS propre, 88 lignes |
| 2.8 | Responsive : adaptation mobile/desktop | ✅ | Test 320px-1920px OK |
| 2.9 | `AudioTest.jsx` + `AudioTest.css` : page de test complète | ✅ | Tests exhaustifs (186 lignes CSS) |
| 2.10 | Migration complète Tailwind → CSS vanilla | ✅ | 0 dépendance CSS framework |

**Livrables :**
- ✅ Barre footer sticky 100% fonctionnelle
- ✅ Now playing automatique avec artwork Libretime
- ✅ Styles CSS vanilla optimisés (469 lignes CSS total)
- ✅ Responsive mobile-first validé
- ✅ Composants de test créés (AudioTest, PlayerButton)
- ✅ Palette couleurs : Play (vert #16a34a), Pause (jaune #eab308), Stop (rouge #dc2626)

**📝 Notes :**
- **Fichiers créés :** 
  - `PlayerBar.jsx` (133 lignes) + `PlayerBar.css` (145 lignes)
  - `NowPlaying.jsx` (50 lignes) + `NowPlaying.css` (88 lignes)
  - `AudioTest.jsx` (144 lignes) + `AudioTest.css` (186 lignes)
  - `PlayerButton.jsx` (démo) + `PlayerButton.css` (50 lignes)
- **Approche CSS :** Fichiers CSS séparés par composant, classes sémantiques
- **Migration :** Tentative Tailwind abandonnée au profit CSS vanilla (gain simplicité + perf)
- **Visibilité PlayerBar :** Conditionnel (masqué si `state === "idle"`)

**Design specs implémentés :**
- Couleurs : Palette sémantique (vert/jaune/rouge)
- Typographie : Système par défaut (roboto via index.css)
- États visuels : loading (opacity 0.7), error (rouge), playing (vert)

---

### Phase 3 : Pages & Navigation - ✅ COMPLÉTÉE (100% - 14-15 février 2026)

**Durée réelle :** 2 jours  
**Objectif :** Navigation complète + Pages WordPress + Gestion audio globale

#### Phase 3A : Navigation & Structure (14/02/2026)

| # | Tâche | Statut | Validation |
|---|-------|--------|------------|
| 3.1 | Installer React Router v7 | ✅ | `npm list react-router-dom` |
| 3.2 | Créer `router.jsx` : configuration routes | ✅ | Routes définies |
| 3.3 | Créer `Header.jsx` + `Header.css` | ✅ | Navigation fonctionnelle |
| 3.4 | Menu hamburger mobile responsive | ✅ | Test mobile 320px |
| 3.5 | Créer `Footer.jsx` + `Footer.css` | ✅ | Footer affiché |
| 3.6 | Page `Home.jsx` : page d'accueil | ✅ | `/` accessible |
| 3.7 | Page `About.jsx` : page à propos | ✅ | `/about` accessible |
| 3.8 | Page `Contact.jsx` : page contact | ✅ | `/contact` accessible |
| 3.9 | Page `NotFound.jsx` : 404 | ✅ | Routes invalides → 404 |
| 3.10 | SEO basique : titres, meta descriptions | ✅ | Titres dynamiques |

#### Phase 3B : WordPress Dynamique (14/02/2026)

| # | Tâche | Statut | Validation |
|---|-------|--------|------------|
| 3.11 | Service `wordpress.js` : client API REST | ✅ | Fetch pages WordPress |
| 3.12 | `DynamicPage.jsx` : rendu pages génériques | ✅ | `/:slug` fonctionne |
| 3.13 | Filtre ACF `affiche_dans_menu` | ✅ | Menu dynamique |
| 3.14 | Support médias responsive (images, vidéos) | ✅ | Médias affichés |
| 3.15 | Décodage HTML entities | ✅ | Texte correct |
| 3.16 | Styles `DynamicPage.css` | ✅ | Design propre |
| 3.17 | Gestion erreurs et 404 | ✅ | Redirections OK |

#### Phase 3C : GlobalAudioContext (15/02/2026)

| # | Tâche | Statut | Validation |
|---|-------|--------|------------|
| 3.18 | Créer `GlobalAudioContext.jsx` | ✅ | Context créé (157 lignes) |
| 3.19 | Hook `useGlobalAudio()` | ✅ | Hook fonctionnel |
| 3.20 | Intégration dans `useAudioPlayer.js` | ✅ | Live signale au context |
| 3.21 | Intégration dans `DynamicPage.jsx` | ✅ | Vidéos signalent au context |
| 3.22 | Règle "un seul audio" appliquée | ✅ | Tests validés |
| 3.23 | Lazy loading vidéos (IntersectionObserver) | ✅ | Vidéos chargent au scroll |
| 3.24 | Animation shimmer loading vidéos | ✅ | CSS animations ajoutées |
| 3.25 | Wrapper `GlobalAudioProvider` dans `main.jsx` | ✅ | Context actif |
| 3.26 | Tests exhaustifs (live ↔ vidéo) | ✅ | Tous scénarios OK |

**Livrables :**
- ✅ Navigation complète avec React Router v7
- ✅ Header responsive avec menu mobile
- ✅ Footer avec liens
- ✅ Pages statiques (Home, About, Contact, 404)
- ✅ Pages WordPress dynamiques (via slug)
- ✅ Filtre ACF pour menu dynamique
- ✅ Support médias WordPress (images, vidéos, audio)
- ✅ GlobalAudioContext : un seul audio à la fois
- ✅ Lazy loading vidéos pour performance
- ✅ Animation loading shimmer

**Fichiers créés :**
- `src/router.jsx` (70 lignes)
- `src/components/Header.jsx` (110 lignes) + `Header.css` (180 lignes)
- `src/components/Footer.jsx` (45 lignes) + `Footer.css` (80 lignes)
- `src/pages/Home.jsx` + `Home.css`
- `src/pages/About.jsx` + `About.css`
- `src/pages/Contact.jsx` + `Contact.css`
- `src/pages/NotFound.jsx` + `NotFound.css`
- `src/pages/DynamicPage.jsx` (150 lignes) + `DynamicPage.css` (310 lignes)
- `src/services/wordpress.js` (95 lignes)
- `src/contexts/GlobalAudioContext.jsx` (157 lignes)

**Documentation créée :**
- ✅ [audio-COMPLETE.md](audio-COMPLETE.md) (1500 lignes) - Référence unique
- ✅ [session-15-fev-global-audio.md](session-15-fev-global-audio.md) (504 lignes)
- ✅ [phase-3-pages-navigation.md](phase-3-pages-navigation.md) (500+ lignes)
- ✅ [phase-3-recap.md](phase-3-recap.md) (300+ lignes)
- ✅ [phase-3b-test-guide.md](phase-3b-test-guide.md) (200+ lignes)

**Tests validés :**
- ✅ Live stream → Vidéo WordPress → Live se pause automatiquement
- ✅ Vidéo WordPress → Live stream → Vidéo se pause automatiquement
- ✅ Plusieurs vidéos sur même page → Une seule joue à la fois
- ✅ Lazy loading vidéos : chargement au scroll (50px avant visibilité)
- ✅ Animation shimmer visible pendant chargement
- ✅ Navigation entre pages : cleanup mémoire OK
- ✅ Responsive : mobile 320px → desktop 1920px

**📝 Notes :**
- **React Router v7** : Dernière version avec nouvelles APIs
- **GlobalAudioContext** : Pattern Context API + useCallback + useRef (optimisé)
- **IntersectionObserver** : API native navigateur pour lazy loading performant
- **Architecture scalable** : Prête pour Phase 4 (Podcasts)
- **Documentation exhaustive** : 3500+ lignes au total
- **Commits Git** : 3 commits propres avec messages descriptifs

**Architecture GlobalAudioContext :**
```javascript
GlobalAudioProvider (main.jsx)
    │
    ├─> useAudioPlayer (live/podcast)
    │   └─> registerPlayer('live') au play
    │
    ├─> DynamicPage (vidéos WordPress)
    │   └─> registerPlayer('wordpress-video') au play
    │
    └─> Context gère : UN SEUL actif à la fois
```

---

### Phase 4 : Podcasts WordPress (Semaine 5 - 3-7 mars)

**Durée estimée :** 5-7 jours  
**Objectif :** Structure pages essentielles + navigation React Router

#### Tâches

| # | Tâche | Durée | Dépendances | Validation |
|---|-------|-------|-------------|------------|
| 3.1 | Setup React Router : BrowserRouter + routes | 2h | - | Navigation fonctionnelle |
| 3.2 | Composant `Header.jsx` : logo + nav principale | 3h | - | Header responsive |
| 3.3 | Page `Home.jsx` : hero + player + intro | 4h | 2.1 | Layout cohérent |
| 3.4 | Section hero Home : CTA "Écouter en direct" | 3h | 3.3 | Bouton déclenche play |
| 3.5 | Page `About.jsx` : contenu statique | 2h | - | Contenu affiché |
| 3.6 | Composant `Footer.jsx` (séparé de PlayerBar) : liens légaux | 2h | - | Footer HTML |
| 3.7 | Navigation mobile : hamburger menu | 4h | 3.2 | Menu responsive |
| 3.8 | Transitions pages : smooth scroll | 2h | 3.1 | Navigation fluide |
| 3.9 | SEO basique : react-helmet, meta tags | 3h | 3.1-3.5 | Meta tags présents |
| 3.10 | Favicon + PWA manifest | 2h | - | Icône affichée |

**Livrables :**
- ✅ Home page avec player intégré
- ✅ Header + navigation responsive (React Router)
- ✅ Page À propos fonctionnelle
- ✅ SEO metadata de base
- ✅ Navigation mobile fluide

**Contenus requis (à fournir par client) :**
- Texte page "À propos" (mission, équipe, contact basique)
- Logo haute résolution (SVG préférable)
- Images hero/bannière home (optionnel)

---

### Phase 4 : Intégration WordPress - Actus (Semaine 4-5 - 24 fév-7 mars)

**Durée estimée :** 5-6 jours  
**Objectif :** Affichage actus WordPress avec filtres

#### Tâches

| # | Tâche | Durée | Dépendances | Validation |
|---|-------|-------|-------------|------------|
| 4.1 | Client API `wordpress.js` : fetch posts + pages | 3h | - | Requêtes retournent data |
| 4.2 | Types JSDoc (optionnel) : Post, Page, Category | 1h | 4.1 | Types documentés |
| 4.3 | Hook `useWordPress()` : fetch + cache simple | 3h | 4.1 | Cache + loading states |
| 4.4 | Page `Actus.jsx` : liste avec React Router | 4h | 4.3, 3.1 | Liste affichée |
| 4.5 | Composant `ActuCard.jsx` + CSS : image + titre + extrait | 3h | 4.2 | Cards visuels corrects |
| 4.6 | Composant `ActuList.jsx` + CSS : grid responsive | 2h | 4.5 | Grid 1/2/3 colonnes |
| 4.7 | Page `ActuDetail.jsx` : détail actu (route dynamique) | 4h | 4.3, 3.1 | Page complète affichée |
| 4.8 | Render contenu WordPress : sanitize HTML (DOMPurify) | 3h | 4.7 | Sécurité XSS + styles |
| 4.9 | Featured image : lazy loading natif | 2h | 4.5, 4.7 | Images lazy-load OK |
| 4.10 | Filtres catégories : UI + logique | 4h | 4.4 | Filtrage fonctionnel |
| 4.11 | Recherche actus : input + filtrage client-side | 4h | 4.4 | Recherche temps réel |
| 4.12 | Pagination ou Load More : infinite scroll | 4h | 4.4 | Chargement progressif |
| 4.13 | Cache navigateur : localStorage pour perf | 2h | 4.3 | Cache persistant |
| 4.14 | Gestion erreurs : 404, API down | 3h | 4.1-4.7 | Fallback UI gracieux |

**Livrables :**
- ✅ Liste actus avec images lazy-load
- ✅ Détail actu avec contenu complet
- ✅ Filtres par catégorie fonctionnels
- ✅ Recherche temps réel
- ✅ Cache localStorage pour perf
- ✅ Gestion erreurs robuste

**Validation WordPress (côté client) :**
- [ ] Champs ACF définis : featured_media, excerpt, categories
- [ ] Au moins 5-10 posts de test publiés
- [ ] Catégories créées : Actus, Événements, etc.
- [ ] Permissions CORS configurées (si nécessaire)

---

### Phase 5 : Bannières Publicitaires (Semaine 4 - 14-15 mars)

**Durée estimée :** 2-3 jours  
**Objectif :** Affichage bannières dynamiques WordPress ACF

#### Tâches

| # | Tâche | Durée | Dépendances | Validation |
|---|-------|-------|-------------|------------|
| 5.1 | Fetch bannières : endpoint WordPress ACF | 2h | 4.1 | Bannières récupérées |
| 5.2 | Types : `BanniereAd` (image, lien, position) | 1h | 5.1 | Types définis |
| 5.3 | Composant `BannerAd.tsx` : image + lien cliquable | 3h | 5.2 | Bannière affichée |
| 5.4 | Positionnement : header mobile + desktop | 2h | 5.3 | Bannière header OK |
| 5.5 | Positionnement : footer mobile + desktop | 2h | 5.3 | Bannière footer OK |
| 5.6 | Positionnement : sidebar sticky desktop uniquement | 3h | 5.3 | Sidebar desktop OK |
| 5.7 | Logique rotation : aléatoire ou priorité ACF | 2h | 5.1 | Rotation fonctionne |
| 5.8 | Tracking clics (optionnel V1) : event console.log | 1h | 5.3 | Clics trackés basique |
| 5.9 | Responsive : masquer bannières selon breakpoints | 2h | 5.4-5.6 | Affichage contextuel |

**Livrables :**
- ✅ Bannières header/footer mobile + desktop
- ✅ Sidebar sticky desktop
- ✅ Rotation dynamique depuis WordPress
- ✅ Liens cliquables avec target="_blank"
- ✅ Responsive adapté

**Validation WordPress (côté client) :**
- [ ] Champs ACF bannières créés : `banniere_image`, `banniere_lien`, `position`
- [ ] Au moins 2-3 bannières de test par position
- [ ] Images bannières 728x90 (desktop), 320x50 (mobile) recommandées

---

### Phase 6 : Podcasts/Épisodes (Semaine 5 - 17-21 mars)

**Durée estimée :** 5-6 jours  
**Objectif :** Lecture podcasts avec player adapté

#### Tâches

| # | Tâche | Durée | Dépendances | Validation |
|---|-------|-------|-------------|------------|
| 6.1 | `audioEngine.ts` : ajouter `playPodcast(url)` | 3h | 1.1 | Lecture podcast OK |
| 6.2 | `audioEngine.ts` : méthodes `pause()` et `resume()` | 3h | 6.1 | Pause/Resume fonctionnels |
| 6.3 | Logique basculement live ↔ podcast (stop + clear) | 3h | 6.1, 1.2 | Basculement propre |
| 6.4 | `PlayerControls.tsx` : afficher Pause si podcast | 2h | 6.2, 2.1 | Bouton Pause visible |
| 6.5 | Fetch podcasts WordPress : category=podcast + ACF | 2h | 4.1 | Podcasts récupérés |
| 6.6 | Types : `Podcast` (titre, audio_url, durée, émission) | 1h | 6.5 | Types définis |
| 6.7 | Page liste podcasts `app/podcasts/page.tsx` | 3h | 6.5, 6.6 | Liste affichée |
| 6.8 | Composant `PodcastCard.tsx` : image + Play podcast | 3h | 6.7 | Play déclenche lecture |
| 6.9 | Intégration barre footer : titre podcast en cours | 2h | 6.4, 2.4 | Titre podcast affiché |
| 6.10 | Metadata lockscreen : artwork + titre podcast | 3h | 1.9, 6.9 | Lockscreen update OK |
| 6.11 | (Optionnel) Progress bar podcast dans footer | 4h | 6.2 | Barre progression affichée |
| 6.12 | Gestion erreurs : URL audio invalide | 2h | 6.1 | Message erreur explicite |

**Livrables :**
- ✅ Lecture podcasts avec Play/Pause/Stop
- ✅ Liste podcasts WordPress
- ✅ Basculement live/podcast dans barre footer
- ✅ Lockscreen adapté au podcast
- ✅ (Optionnel) Progress bar

**Validation WordPress (côté client) :**
- [ ] Catégorie "Podcasts" créée
- [ ] Champs ACF podcast : `audio_url` (URL fichier MP3), `duree`, `emission`
- [ ] Au moins 2-3 podcasts de test avec audio hébergé

---

### Phase 7 : Polish & Tests Multi-Devices (Semaine 5-6 - 21-25 mars)

**Durée estimée :** 4-5 jours  
**Objectif :** Stabilisation, bugs, optimisations

#### Tâches

| # | Tâche | Durée | Priorité | Validation |
|---|-------|-------|----------|------------|
| 7.1 | Tests iOS : iPhone 12+, iOS 16+ | 4h | 🔴 Critique | Tous scénarios OK |
| 7.2 | Tests Android : Samsung/Pixel, Android 10+ | 4h | 🔴 Critique | Tous scénarios OK |
| 7.3 | Tests web : Chrome, Safari, Firefox (desktop+mobile) | 3h | 🟠 Important | Cross-browser OK |
| 7.4 | Tests réseau : 4G, 3G, WiFi lent | 3h | 🟠 Important | Reconnexion robuste |
| 7.5 | Tests Bluetooth : casque, voiture (manuel) | 2h | 🟠 Important | Audio Bluetooth OK |
| 7.6 | Optimisation performances : Lighthouse audit | 3h | 🟢 Normal | Score > 80 |
| 7.7 | Optimisation bundle : tree-shaking, code splitting | 3h | 🟢 Normal | Taille bundle réduite |
| 7.8 | Gestion mémoire : détection fuites (long play) | 3h | 🟠 Important | Pas de fuite mémoire |
| 7.9 | Messages erreurs : UX copywriting | 2h | 🟢 Normal | Messages clairs |
| 7.10 | Loading states : skeletons, spinners | 3h | 🟢 Normal | Feedback visuel partout |
| 7.11 | Animations : réduire si prefers-reduced-motion | 2h | 🟢 Normal | Accessibilité motion |
| 7.12 | Correction bugs prioritaires (backlog) | 8h | 🔴 Critique | Aucun bug bloquant |

**Livrables :**
- ✅ App stable sur devices iOS/Android physiques
- ✅ Web cross-browser sans régression
- ✅ Performances optimisées (Lighthouse > 80)
- ✅ Bugs critiques résolus
- ✅ UX polish (messages, loading, erreurs)

**Scénarios de test critiques :**
1. **Play → écran verrouillé 30 min → unlock** : audio continue ✅
2. **Play → passer à autre app → revenir** : audio continue ✅
3. **Play → coupure réseau → retour réseau** : reconnexion auto < 30s ✅
4. **Play live → Play podcast** : basculement propre ✅
5. **Lockscreen controls** : Play/Pause/Stop répondent ✅
6. **Appel entrant** : pause audio → reprise après appel (Android) ✅
7. **Bluetooth** : connexion casque pendant lecture maintient audio ✅

---

### Phase 8 : Build & Soumission Stores (Semaine 6-7 - 25-30 mars)

**Durée estimée :** 5-7 jours (+ review stores)  
**Objectif :** Builds production + soumission App Store / Play Store

#### Tâches iOS

| # | Tâche | Durée | Dépendances | Validation |
|---|-------|-------|-------------|------------|
| 8.1 | Générer icônes app (toutes tailles iOS) | 2h | - | Asset catalog complet |
| 8.2 | Splash screen iOS | 1h | - | LaunchScreen.storyboard |
| 8.3 | Configurer Info.plist : permissions, background modes | 2h | 1.6 | Audio background activé |
| 8.4 | Certificats production : distribution certificate | 2h | - | Certificat valide |
| 8.5 | Provisioning profile : App Store | 1h | 8.4 | Profile installé |
| 8.6 | Build production Xcode : Archive | 1h | 8.5 | Archive créé |
| 8.7 | Upload vers App Store Connect : Transporter | 1h | 8.6 | Build uploadé |
| 8.8 | Screenshots App Store : iPhone + iPad | 3h | - | 6-10 screenshots |
| 8.9 | Textes App Store : titre, description, keywords | 2h | - | Textes rédigés |
| 8.10 | Soumission review Apple | 1h | 8.7-8.9 | Soumis en review |

**Délai review Apple :** 24-48h généralement (prévoir marge)

#### Tâches Android

| # | Tâche | Durée | Dépendances | Validation |
|---|-------|-------|-------------|------------|
| 8.11 | Générer icônes app (toutes densités Android) | 2h | - | res/mipmap complet |
| 8.12 | Splash screen Android | 1h | - | splash.xml configuré |
| 8.13 | AndroidManifest.xml : permissions + services | 2h | 1.7 | Permissions déclarées |
| 8.14 | Keystore production : générer signing key | 1h | - | .jks créé et sauvegardé |
| 8.15 | Build release : AAB (Android App Bundle) | 1h | 8.14 | .aab généré signé |
| 8.16 | Upload vers Play Console : Internal testing | 1h | 8.15 | Build uploadé |
| 8.17 | Screenshots Play Store : phone + tablet | 3h | - | 4-8 screenshots |
| 8.18 | Textes Play Store : titre, description courte/longue | 2h | - | Textes rédigés |
| 8.19 | Fiche store : catégorie, audience, confidentialité | 1h | - | Infos complètes |
| 8.20 | Soumission review Google | 1h | 8.16-8.19 | Soumis en review |

**Délai review Google :** Quelques heures à 2 jours

#### Tâches communes

| # | Tâche | Durée | Validation |
|---|-------|-------|------------|
| 8.21 | Politique de confidentialité : page web | 2h | URL publique |
| 8.22 | Conditions d'utilisation (optionnel MVP) | 1h | URL publique |
| 8.23 | Site web présentation app (landing page) | 3h | URL publique |
| 8.24 | Email support : contact@c6radio.fr | 1h | Email fonctionnel |
| 8.25 | Tests builds production : TestFlight + Internal | 4h | Pas de régression |

**Livrables :**
- ✅ Build iOS production uploadé App Store Connect
- ✅ Build Android production uploadé Play Console
- ✅ Screenshots + textes stores finalisés
- ✅ Politique confidentialité publiée
- ✅ Email support configuré
- ✅ Apps soumises en review

**Assets requis (design) :**
- Icône app : 1024x1024px (PNG sans alpha)
- Screenshots : 6-10 par plateforme (résolutions multiples)
- Feature graphic Android : 1024x500px
- Textes stores : titre (30 char), description courte (80 char), longue (4000 char)

---

### Phase 9 : Beta Testing (Semaine 6 - 24-28 mars)

**Durée :** 5-7 jours  
**Objectif :** Tests utilisateurs réels avant release publique

#### Tâches

| # | Tâche | Durée | Validation |
|---|-------|-------|------------|
| 9.1 | Setup TestFlight : inviter 10-20 beta testers iOS | 2h | Invitations envoyées |
| 9.2 | Setup Play Internal Testing : inviter 10-20 testers | 2h | Invitations envoyées |
| 9.3 | Document test : checklist scénarios pour beta | 2h | Guide partagé |
| 9.4 | Collecte feedback : formulaire Google Forms | 1h | Formulaire créé |
| 9.5 | Monitoring beta : logs, crashs (Firebase/Sentry) | 3h | Monitoring actif |
| 9.6 | Tests quotidiens : vérifier retours beta | 1h/jour x 5 | Retours traités |
| 9.7 | Hotfix bugs critiques remontés | variable | Aucun bug bloquant |
| 9.8 | Nouvelle build beta si nécessaire | 2h | Build mise à jour |
| 9.9 | Validation finale : go/no-go release publique | 2h | Décision prise |

**Critères Go :**
- ✅ Aucun bug bloquant (crash, audio ne joue pas)
- ✅ > 80% feedback positifs sur core features
- ✅ Tests devices variés : au moins 5 modèles iOS + 5 Android
- ✅ Taux de crash < 1%

**Critères No-Go (report release) :**
- ❌ Bug critique audio (ne joue pas, coupe fréquemment)
- ❌ Crash > 5% des sessions
- ❌ Feedback majoritairement négatif sur UX

---

## 📅 Planning Global

**État actuel :** 13 février 2026 - Avance sur planning ✅

```
┌─────────────────────────────────────────────────────────────┐
│                    Gantt MVP C6Radio                        │
├─────────────────────────────────────────────────────────────┤
│ 13 fév      : [✅✅✅✅✅✅✅✅] Phase 0 - Setup (COMPLÉTÉ)     │
│               [✅✅✅✅✅✅▒▒▒▒] Phase 1 - Audio (60%)         │
│               [✅✅✅✅✅✅✅✅] Phase 2 - PlayerBar (COMPLÉTÉ) │
│                                                             │
│ Semaine 3   : [▒▒▒▒▒▒▒▒] Phase 1 - Fin Audio Core (40%)    │
│ (17-21 fév) : [████████] Phase 3 - Pages & Navigation       │
│                                                             │
│ Semaine 4   : [████████] Phase 4 - WordPress Actus         │
│ (24-28 fév) : [████] Phase 5 - Bannières                   │
│                                                             │
│ Semaine 5   : [████████] Phase 6 - Podcasts                │
│ (3-7 mars)  : [████] Phase 7 - Tests (début)               │
│                                                             │
│ Semaine 6   : [████████] Phase 7 - Polish + Tests devices  │
│ (10-14 mars): [████] Phase 8 - Setup Capacitor mobile      │
│                                                             │
│ Semaine 7   : [████████] Phase 8 - Build iOS/Android       │
│ (17-21 mars): [████] Phase 9 - Beta Testing (début)        │
│                                                             │
│ Semaine 8   : [████████] Phase 9 - Beta Testing (fin)      │
│ (24-28 mars): [████] Soumission stores + Review            │
│                                                             │
│ Semaine 9   : [██] Corrections review (si nécessaire)      │
│ (31 mar-4av): [🚀] RELEASE PUBLIQUE - 1er AVRIL 2026        │
└─────────────────────────────────────────────────────────────┘

Légende : ✅ Complété | ▒ En cours | █ Planifié
```

### Dates Clés (Révisées)

| Milestone | Date Originale | Date Réelle/Révisée | Statut |
|-----------|----------------|---------------------|--------|
| 🎬 Kickoff | 17 février 2026 | **13 février 2026** | ✅ Avance de 4 jours |
| ✅ Setup web (Phase 0) | 21 février 2026 | **13 février 2026** | ✅ COMPLÉTÉ |
| ✅ Audio Core (Phase 1) | 28 février 2026 | **13 février 2026** | ✅ COMPLÉTÉ (15 jours d'avance!) |
| ✅ PlayerBar (Phase 2) | 7 mars 2026 | **13 février 2026** | ✅ COMPLÉTÉ (22 jours d'avance!) |
| ✅ Pages & Navigation (Phase 3) | 7 mars 2026 | **14-15 février 2026** | ✅ COMPLÉTÉ (20 jours d'avance!) |
| 🎙️ Podcasts WordPress (Phase 4) | 21 mars 2026 | **~25 février 2026** | ⏳ Planifié (gain 24j) |
| 📰 WordPress Actus (Phase 5) | 14 mars 2026 | **~4 mars 2026** | ⏳ Révision -10j |
| 📱 POC Mobile Capacitor | — | **~7-10 mars 2026** | 🆕 Ajouté |
| 📱 Builds production | 25 mars 2026 | **~14 mars 2026** | ⏳ Révision -11j |
| 🧪 Beta testing | 24-28 mars 2026 | **~17-21 mars 2026** | ⏳ Révision -7j |
| 📤 Soumission stores | 28 mars 2026 | **~21 mars 2026** | ⏳ Révision -7j |
| 🚀 **RELEASE PUBLIQUE** | **1er avril 2026** | **1er avril 2026** | 🎯 **OBJECTIF MAINTENU avec marge +10j** |

**Avance globale :** +20 jours sur planning initial  
**Marge de sécurité :** 10 jours supplémentaires pour imprévus ou polish

---

## 🎯 Critères de Succès MVP

### Fonctionnels

- [x] **Lecture live MP3 stable > 30 minutes sans interruption** (✅ Testé web)
- [x] **Now playing affiché > 80% du temps (tolérance erreurs API)** (✅ Polling 12s + fallback)
- [x] **Reconnexion automatique après coupure < 30 secondes** (✅ Backoff 3s/10s/30s)
- [x] **Contrôles lockscreen web opérationnels** (✅ Media Session API)
- [x] **Navigation complète entre pages** (✅ React Router v7)
- [x] **Pages WordPress dynamiques** (✅ DynamicPage + API REST)
- [x] **Support médias responsive** (✅ Images, vidéos, audio)
- [x] **Règle "un seul audio à la fois"** (✅ GlobalAudioContext)
- [x] **Lazy loading vidéos** (✅ IntersectionObserver)
- [ ] Audio continue en arrière-plan (iOS + Android) — ⏳ Phase 7 (mobile natif)
- [ ] Contrôles lockscreen mobile natifs — ⏳ Phase 7 (Capacitor)
- [ ] Podcasts jouables avec Play/Pause — ⏳ Phase 4
- [ ] Actus WordPress affichées — ⏳ Phase 5 (optionnel, peut réutiliser DynamicPage)
- [ ] Bannières publicitaires visibles — ⏳ Phase 6

### Performance

- [x] **Bundle JS optimisé** (✅ Vite build)
- [x] **Lazy loading assets** (✅ Vidéos au scroll)
- [ ] Lighthouse score : Performance > 80, Accessibility > 90 — ⏳ À tester
- [ ] Temps démarrage app < 3 secondes (devices récents)
- [ ] Temps "tap Play → audio" < 2 secondes (réseau correct)
- [ ] Taille bundle JS < 500 KB (gzipped)
- [ ] Consommation batterie : < 10%/heure écoute live

### Qualité

- [x] **ErrorBoundary React** (✅ Protection crashes)
- [x] **Logger intelligent dev/prod** (✅ logger.js)
- [x] **Gestion erreurs robuste** (✅ Reconnexion + fallbacks)
- [x] **Documentation exhaustive** (✅ 3500+ lignes)
- [ ] Taux de crash < 1% (Firebase Crashlytics) — ⏳ Phase 7
- [ ] Aucun bug bloquant en production
- [ ] Tests passés : iOS 16+, Android 10+
- [ ] Cross-browser : Chrome/Safari/Firefox dernières versions
- [ ] Accessibilité : keyboard navigation fonctionnelle

### Business

- [ ] Apps approuvées App Store + Play Store
- [ ] Politique confidentialité publiée et conforme RGPD
- [ ] Email support fonctionnel
- [ ] Landing page app en ligne (SEO)
- [ ] Ready pour acquisition utilisateurs (liens stores)

---

## ⚠️ Risques & Mitigations

### Risques Techniques Critiques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Audio background iOS ne fonctionne pas** | 🔴 Bloquant | Moyen | POC Phase 0 obligatoire. Si échec : pivot vers Cordova ou sacrifier iOS background en V1 |
| **API Now Playing instable/CORS** | 🟠 Important | Faible | Fallback UI toujours visible ("C6Radio"). Test exhaustif Phase 0. |
| **Plugin Capacitor incompatible** | 🟠 Important | Moyen | Tester plugins dès Phase 0. Alternative : Cordova plugins (plus matures). |
| **Performance mobile médiocre** | 🟠 Important | Faible | Lazy loading, code splitting, images optimisées. Lighthouse audit continu. |
| **Certificats Apple retardés** | 🟠 Important | Moyen | Créer compte Apple Dev dès Phase 0 (délai 3-5 jours si vérif manuelle). |
| **Review stores rejet** | 🟠 Important | Moyen | Suivre guidelines strictement. Beta testing avant soumission. |

### Risques Planning

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Retard Phase 1 (Audio Core)** | 🟠 Important | Moyen | Phase 1 = 7 jours max. Si dépassement : sacrifier Phase 6 (Podcasts → V1.1). |
| **WordPress pas prêt (ACF)** | 🟢 Normal | Faible | Valider structure WordPress dès Phase 0. Données mock si retard client. |
| **Scope creep** | 🟠 Important | Élevé | Freeze features après Phase 4. Tout ajout → backlog V1.1. |
| **Bugs beta bloquants** | 🟠 Important | Moyen | Phase 7 (Testing) généreux. Buffer 3-5 jours hotfix avant release. |

### Plan B (si retard majeur)

**Scénario 1 : Retard 1-2 semaines**
- Reporter release au 15 avril 2026
- Sacrifier Phase 6 (Podcasts) → V1.1
- Maintenir audio live + actus (core MVP)

**Scénario 2 : Audio background iOS impossible**
- Lancer Android + web uniquement
- Communiquer : "iOS à venir V1.1"
- Investiguer solutions alternatives (Cordova, bridge natif)

**Scénario 3 : Rejet store (corrections mineures)**
- 2-3 jours corrections
- Nouvelle soumission : review accélérée généralement
- Release décalée 5-7 jours max

---

## 📚 Ressources & Documentation

### Documentation Technique

**Vite :**
- [Getting Started](https://vitejs.dev/guide/)
- [Plugins](https://vitejs.dev/guide/using-plugins.html)
- [Build Optimizations](https://vitejs.dev/guide/build.html)

**React + React Router :**
- [React Documentation](https://react.dev/)
- [React Router v6](https://reactrouter.com/en/main)
- [React Hooks](https://react.dev/reference/react)

**Capacitor :**
- [Background Audio iOS](https://capacitorjs.com/docs/guides/background-audio)
- [Audio Management](https://capacitorjs.com/docs/apis/audio)
- [Lifecycle Events](https://capacitorjs.com/docs/apis/app)

**WordPress REST API :**
- [Reference](https://developer.wordpress.org/rest-api/reference/)
- [Custom Fields (ACF)](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/)

**Stores :**
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

### Outils Recommandés

**Dev :**
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite DevTools](https://github.com/webfansplz/vite-plugin-vue-devtools)
- [Network throttling Chrome](https://developer.chrome.com/docs/devtools/network/reference)

**Testing :**
- [BrowserStack](https://www.browserstack.com/) (tests multi-devices cloud)
- [TestFlight](https://developer.apple.com/testflight/) (beta iOS)
- [Play Console Internal Testing](https://play.google.com/console/internal-app-sharing)

**Monitoring (V1.1 recommandé) :**
- [Sentry](https://sentry.io/) (error tracking)
- [Firebase Crashlytics](https://firebase.google.com/products/crashlytics) (mobile crashes)

---

## ✅ Checklist Pre-Launch

### 1 semaine avant release

- [ ] Builds production testés exhaustivement (devices réels)
- [ ] Politique confidentialité finalisée et publiée
- [ ] Email support fonctionnel avec auto-réponse
- [ ] Landing page app optimisée SEO
- [ ] Screenshots stores validés par équipe
- [ ] Textes stores relus (orthographe, ton)
- [ ] Comptes stores (Apple/Google) en règle (paiement, infos)
- [ ] Plan communication prêt (réseaux sociaux, email, affichage local)

### Jour de release

- [ ] Apps approuvées et "Ready for Sale" / "Production"
- [ ] Monitoring actif (logs, errors)
- [ ] Équipe disponible pour hotfix urgents
- [ ] Annonce publique coordonnée (Facebook, Instagram, site web)
- [ ] QR codes imprimés (affiches locales)
- [ ] Email newsletter (si liste existante)

### Post-release J+1 à J+7

- [ ] Monitoring quotidien : crashs, feedback stores
- [ ] Répondre avis stores (sous 24-48h)
- [ ] Collecter retours utilisateurs (formulaire, email)
- [ ] Mesurer métriques baseline : installations, sessions, écoute
- [ ] Prioriser backlog V1.1 selon feedback réel

---

## 🚀 Post-MVP : Roadmap V1.1 (avril-mai 2026)

### Features V1.1 (Priorité Haute)

1. **Gestion interruptions téléphoniques** (iOS + Android)
   - Pause automatique lors appel entrant
   - Reprise automatique après appel
   - Durée : 3-4 jours

2. **Formulaire contact** (page dédiée)
   - Formulaire simple : nom, email, message
   - Envoi email via API (SendGrid/Mailgun)
   - Durée : 2 jours

3. **Émissions & Grilles de programmes** (WordPress)
   - Custom post type "Émissions"
   - Grille hebdomadaire (design + data)
   - Durée : 5-7 jours

4. **Analytics Matomo** (auto-hébergé)
   - Setup serveur Matomo
   - Intégration tracker (sans consentement si config correcte)
   - Events : play, stop, navigation
   - Durée : 3-4 jours

### Features V1.2 (Priorité Moyenne)

5. **Historique d'écoute** (local storage)
6. **Favoris podcasts** (local storage)
7. **Partage social** (share API native)
8. **Notifications push événements** (Firebase/OneSignal)

### Features V2 (Priorité Basse)

9. **CarPlay** (iOS)
10. **Android Auto**
11. **Qualités multiples stream** (AAC, MP3 320k)
12. **Personnalisation interface** (thèmes)

---

## 📞 Support & Contacts

**Tech Lead :** DOFRECORDS  
**Repo Git :** (à créer)  
**Slack/Discord :** (si équipe)  
**Email projet :** dev@c6radio.fr (à configurer)

---

**Document créé par :** GitHub Copilot  
**Dernière mise à jour :** 13 février 2026  
**Version :** 1.1 (Révisé pour refléter stack réel : Vite + JavaScript + CSS vanilla)  
**Status :** ✅ En cours d'exécution  
**Avancement global :** Phase 0 ✅ | Phase 1 🟡 60% | Phase 2 ✅ | Phases 3-9 ⏳

---

## 📝 Historique des Révisions

### Version 1.1 - 13 février 2026
- ✅ Mise à jour stack technique réel (Vite, JavaScript, CSS vanilla)
- ✅ Ajout section "État d'Avancement Actuel"
- ✅ Phases 0 et 2 marquées comme complétées
- ✅ Phase 1 marquée 60% complétée
- ✅ Planning global révisé (3 semaines d'avance sur PlayerBar!)
- ✅ Adaptation Phase 3 pour React Router
- ✅ Adaptation Phase 4 pour Vite (pas Next.js ISR)
- ✅ Mise à jour section Ressources & Documentation

### Version 1.0 - 13 février 2026
- Document initial basé sur technical-decisions.md
- Recommandations Next.js + TypeScript + Tailwind
