# Product Requirements Document - v3_c6

**Author:** DOFRECORDS
**Date:** 2026-01-28

## Success Criteria

### User Success

**Le critère ultime : l'application "s'oublie"**

Le succès se mesure par l'**invisibilité de la technologie**. Un auditeur réussi lance l'audio en 1 tap et n'y pense plus.
L'app doit rester simple, accessible à tous.

**Comportements cibles :**
- Écoute écran verrouillé sans interruption
- Contrôle depuis lockscreen/centre de contrôle intuitivement
- Titre en cours affiché naturellement
- Multitâche sans couper l'audio

**Métriques clés :**
- **Taux de démarrage : > 95%** (stream démarre presque à chaque fois)
- **Temps tap → audio : < 3s** (immédiat et sans friction)
- **Stabilité écoute : < 5% coupures**
- **"Now playing" affiché : > 80% du temps**

**Moment "Aha!" :** L'auditeur réalise que l'audio continue en arrière-plan et que les contrôles fonctionnent naturellement, sans y penser.

### Business Success

**Objectif : Établir une audience locale fidèle**

**Cible à 3 mois :**
- **50-100 auditeurs réguliers** (écoutent au moins 1x/semaine)
- **15-20 minutes d'écoute moyenne par session**
- **Taux de retour D7 : > 40%** - reviennent dans la semaine

**Cible à 12 mois :**
- **200-300 auditeurs actifs mensuels**
- **Croissance organique** via bouche-à-oreille local
- **Base stable** pour activer partenariats/sponsors locaux

**Autonomie éditoriale :**
- L'équipe C6Radio publie **actus/pages via WordPress sans intervention dev**
- **Synchronisation automatique** : Contenu visible sur site web (60s ISR) ET app mobile (au lancement)
- **Aucun rebuild nécessaire** : Workflow simplifié, pas de déploiement manuel
- Publication hebdomadaire de contenu éditorial

### Technical Success

**Efficacité et fiabilité avant tout**

**Critères MVP :**
- **Disponibilité stream : > 99%**
- **Taux d'erreur : < 2% web, < 3% mobile**
- **Latence "now playing" : < 10s** (décalage acceptable)
- **Clear buffer obligatoire** (reprise directe du stream)
- **Fallback gracieux** (UI fonctionnelle même si APIs échouent)
- **Consommation batterie raisonnable**
- **Bluetooth : "best effort"**
- **Synchronisation WordPress automatique** : Aucun rebuild/déploiement manuel requis
- **Cohérence multi-plateforme** : Site web et app mobile = même contenu WordPress

**Intégrations stables :**
- Icecast stream accessible (HTTPS, CORS)
- Libretime "now playing" (> 80% uptime)
- WordPress REST performant
- **WordPress sync automatique** : ISR web + fetch runtime mobile

### Measurable Outcomes

**Semaines 1-2 (Baseline) :**
- Collecter métriques réelles : temps démarrage, stabilité, erreurs
- Identifier patterns d'usage : horaires, durée sessions

**Mois 1 :**
- 20-30 early adopters testent régulièrement
- Taux d'erreur identifiés et corrigés
- Feedback qualitatif collecté

**Mois 3 :**
- 50-100 auditeurs réguliers atteints
- Stabilité prouvée (< 5% coupures)
- Contenu éditorial publié hebdomadairement

**Indicateur de succès global :**
Les auditeurs disent : *"Je lance C6Radio et j'oublie, ça marche juste."*

## Product Scope

### MVP - Minimum Viable Product (Livraison Rapide)

**Essentiel absolu (ne peut pas attendre) :**

**Website:**
- Site responsive mobile-first
- **🎵 Barre de contrôle footer unifiée (CRITIQUE MVP)** :
  - Toujours visible (sticky footer) sur toutes les pages
  - Gère les deux types de players : live stream ET podcasts
  - Logo/icône + Titre en cours ("now playing" live ou titre podcast)
  - Contrôles live : Play/STOP
  - Contrôles podcast : Play/Pause/STOP
  - Hauteur adaptative selon écran (mobile/desktop)
  - Basculement automatique entre live/podcast (géré par audioEngine)
- **Player stream live : Play/STOP** (pas Pause), états (loading/playing/error)
- **⚠️ CRITIQUE : Clear buffer obligatoire** (reprise directe du stream)
- Affichage "now playing" (titre + artiste, fallback si indisponible)
- Page "À propos" (simple, 1 écran)
- **Actus WordPress : liste, détail, tri par catégories et recherche**
- **Bannières publicitaires : header/footer sur mobile et desktop, sidebar sticky desktop uniquement**
  - Les bannières sont gérées via WordPress REST API, comme les articles
  - Un "slot de pub" peut contenir plusieurs images (via ACF), rotation définie par ACF également
  - Les différentes bannières doivent **être clicables** (liens gérés par ACF)

**Mobile (Capacitor iOS/Android) :**
- **Lecture audio en arrière-plan (CRITIQUE)**
- **Contrôles lockscreen/centre de contrôle (CRITIQUE)**
- Affichage "now playing" dans notifications
- **Notifications PUSH (CRITIQUE)**

**Intégrations MVP :**
- Stream Icecast : MP3 (prod : `https://radio.c6media.fr:8443/main`)
- Now playing Libretime (prod : `https://radio.c6media.fr/api/live-info`)
- WordPress REST : pages + posts + bannières pub (liste + détail) (prod: `https://exp937.fr/wp/wp-json/wp/v2`)

**Hors scope MVP (versions ultérieures) :**
- ❌ Gestion interruptions (pause/reprise automatique appels) → V1.1
- ❌ Page contact/formulaire → V1.1
- ❌ Émissions/grilles de programmes → V1.1
- ❌ Favoris/historique → V1.2
- ❌ Partage social élaboré → V1.1
- ❌ Analytics/tracking avancé → V1.1

### Growth Features (V1.1 - Post-MVP)

**Après validation MVP stable :**
- **Gestion interruptions** : pause/reprise automatique (appels, Siri, autres apps)
- Page contact avec formulaire
- Grille des programmes (simple)
- Liste des émissions
- Amélioration UX "now playing" (artwork, animations)
- Partage de la radio (lien simple)
- Analytics basiques (Matomo ou GA)
- Recherche dans actus

### Vision (V2 et au-delà)

**Si audience grandit et justifie l'investissement :**
- **Multi-flux** : qualités différentes (128k/320k), fallback stream
- **CarPlay / Android Auto** : intégration véhicule
- **Comptes utilisateurs** : favoris, historique personnalisé
- **Contenu enrichi** : pages animateurs, interviews, photos événements
- **Communauté** : commentaires, votes, sondages

### Synthèse des Exigences

**Capacités Audio & Player (critiques):**
- **🎵 Barre de contrôle footer unifiée** : sticky footer toujours visible, gère live + podcasts
- Streaming live MP3 fiable (Icecast)
- Player live avec Play/STOP et clear buffer obligatoire (live)
- Player podcast avec Play/Pause/STOP
- Une source audio à la fois (si live en cours et podcast demandé : stop live, play podcast; et inversement)
- Audio background iOS/Android (mobile critique)
- Lockscreen controls et media notifications
- Reconnexion automatique après coupure réseau
- Gestion interruptions téléphoniques (V1.1)
- Bluetooth support (best effort)
- États clairs : loading/playing/paused/stopped/error
- "Now playing" temps réel (Libretime API)

**Capacités Contenu & Découverte:**
- SEO optimisé (Google discovery)
- Landing page épurée avec CTA Play central
- Page "À propos" engageante
- Actus WordPress : page liste + page détail
- Synchronisation rapide (< 1 minute)
- Navigation intuitive mobile et desktop

**Capacités Administration:**
- WordPress back-office (interface familière)
- Publication autonome sans intervention dev
- Formats simples : titre, image, texte, catégories
- Gestion médias/images
- Synchronisation immédiate avec l'app/site

**Capacités Performance & Fiabilité:**
- Temps de démarrage audio < 3 secondes
- Lecture continue sans timeouts
- Fallback UI gracieux en cas d'erreur
- Performance web (pas de ralentissement)
- Consommation batterie raisonnable (mobile)
- Compatibilité navigateurs modernes
- Responsive design (mobile-first)

---

### Architecture & Type de Projet

C6Radio est développé comme une **Single Page Application (SPA) moderne** avec Server-Side Rendering pour le SEO. L'architecture web partage une base de code unique avec l'application mobile via Capacitor, garantissant cohérence UI et efficacité de développement.

**Architecture technique :**
- SPA avec SSR/pré-rendering
- UI partagée web/mobile (Capacitor pour packaging natif)
- Player audio continu pendant navigation
- Notifications PUSH sur mobile

### Browser Matrix

**Support navigateurs requis pour MVP :**

**Desktop (modernes uniquement) :**
- ✅ Chrome (dernières 2 versions)
- ✅ Firefox (dernières 2 versions)
- ✅ Safari (dernières 2 versions)
- ✅ Edge (dernières 2 versions)
- ✅ Chromium-based (Brave, Opera, Vivaldi)

**Mobile (critiques) :**
- ✅ **Safari iOS (dernières 2 versions)** - CRITIQUE pour audio background
- ✅ **Chrome Android (dernières 2 versions)** - CRITIQUE audience mobile
- ✅ Samsung Internet
- ✅ Firefox Mobile

**Exclusions :**
- ❌ Internet Explorer 11 (obsolète, non supporté)
- ❌ Navigateurs anciens (> 2 ans)

**Tests prioritaires :** Safari iOS et Chrome Android (utilisateurs mobiles = audience principale)

### Responsive Design Strategy

**Approche :** Mobile-first design

**Breakpoints standards :**
- **Mobile** : < 640px (priorité maximale - audience principale)
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

**Composants adaptatifs clés :**

**🎵 Barre de contrôle footer unifiée (CRITIQUE MVP) :**

**Architecture :**
- Composant global unique gérant live stream ET podcasts
- Position : `position: fixed; bottom: 0; width: 100%;` (sticky footer)
- Z-index élevé (reste au-dessus du contenu)
- Visible sur **toutes les pages** de l'app (navigation ne la masque jamais)

**Dimensions adaptatives :**
- **Mobile** : hauteur 64-72px (compact, thumb-friendly)
- **Desktop** : hauteur 80-96px (plus d'espace pour titre long)

**Contenu de la barre :**
- **Logo/icône** : C6Radio (identité visuelle)
- **Titre dynamique** :
  - Live stream : "now playing" temps réel (artiste - titre)
  - Podcast : titre de l'épisode en cours
- **Contrôles adaptés au type de player :**
  - **Live stream** : Play / STOP (pas de pause - clear buffer)
  - **Podcast** : Play / Pause / STOP
- **PAS de volume control** (géré par système)
- **PAS de progress bar** (live = temps réel, podcast = optionnel V1.1)

**Comportement :**
- Basculement automatique live ↔ podcast géré par `audioEngine.ts`
- Affichage conditionnel des contrôles selon type de player actif
- État visible : playing / paused / loading / stopped
- Animations subtiles lors changement de titre

**Intégration technique :**
- Composant global (hors routing)
- État global partagé avec `audioEngine.ts` et `mediaSession.ts`
- Synchronisation temps réel avec "now playing" API
- Responsive layout avec flexbox/grid

**Navigation en header uniquement:**
- Mobile : hamburger menu
- Desktop : navigation horizontale

**Actus :**
- Mobile : 1 colonne (liste verticale)
- Tablet : 2 colonnes
- Desktop : 2-3 colonnes (grid)

**"Now playing" :**
- Mobile : intégré au player compact
- Desktop : plus visible avec artwork plus grand

**Touch-friendly (mobile) :**
- Boutons minimum 44x44px (recommandation iOS/Android)
- Espacement suffisant entre éléments cliquables (minimum 8px)
- Zones tactiles généreuses (pas de petits boutons)
- Swipe gestures : pas requis MVP (peut être ajouté V1.1)

### Performance Targets

**Google Core Web Vitals (cibles) :**
- **LCP (Largest Contentful Paint)** : < 2.5s
- **FID (First Input Delay)** : < 100ms  
- **CLS (Cumulative Layout Shift)** : < 0.1

**Temps de chargement :**
- **Time to Interactive (TTI)** : < 3s sur 4G
- **Audio start** : < 3s après clic Play (critique)
- **Page navigation** : instantanée (SPA advantage)

**Optimisations requises :**

**Code :**
- Code splitting (charger uniquement le nécessaire par page)
- Lazy loading images (actus)
- Tree shaking (éliminer code non utilisé)
- Minification JS/CSS

**Assets :**
- Images : WebP avec fallback JPEG/PNG
- Compression : Gzip ou Brotli activé
- CDN pour assets statiques (optionnel MVP, recommandé production)

**Caching :**
- Browser caching approprié (assets statiques)
- Pas de cache agressif pour "now playing" et actus

**Budget performance (guideline) :**
- Bundle JS initial : < 200kb (gzippé)
- Images optimisées et compressées
- Fonts : max 2 familles, subset si possible

**Monitoring :**
- Google Lighthouse score > 90 (performance)
- Mesures réelles avec Google Analytics ou équivalent
- Suivi temps chargement audio (métrique custom)

### SEO Strategy

**Importance :** CRITIQUE - découvrabilité Google essentielle pour acquisition

**Implémentation technique :**

**SSR/SSG :**
- Server-Side Rendering (SSR) ou Static Site Generation (SSG)
- Pages clés pré-rendues avec HTML complet :
  - Page d'accueil (landing)
  - Page "À propos"
  - Page liste actus
  - Pages détail actus (générées dynamiquement)

**Meta tags (toutes pages) :**
```html
<title>C6Radio - Radio locale [ville]</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

**Structured data (JSON-LD) :**
- **Organization** : identité C6Radio
- **WebSite** : info site + search action
- **Article** : pour chaque actu (SEO actus)

**Fichiers SEO :**
- **sitemap.xml** : généré automatiquement, mis à jour à chaque nouvelle actu
- **robots.txt** : configuré pour autoriser indexation

**URLs sémantiques :**
- `/` - accueil
- `/about` ou `/a-propos` - à propos
- `/news` ou `/actus` - liste actus
- `/news/[slug]` ou `/actus/[slug]` - détail actu

**Pages prioritaires SEO :**
1. **Accueil** : mots-clés "radio locale", "[ville]", "streaming live"
2. **À propos** : identité, mission, équipe
3. **Actus** : contenu frais pour ranking

**KPIs SEO :**
- Indexation Google : < 1 semaine après lancement
- Ranking : première page Google pour "radio [ville]" à M3
- Trafic organique : 20-30% des visites à M3

### Real-Time Features

**"Now Playing" en temps réel :**

**Approche technique recommandée :** Polling HTTP (simple, fiable, standard)

**Implémentation :**
- **Endpoint** : `https://radio.c6media.fr/api/live-info` (Libretime)
- **Fréquence** : polling toutes les **10-15 secondes**
- **Méthode** : GET request avec fetch API
- **Timeout** : 5s max par requête

**Justification polling vs alternatives :**
- ✅ Simple à implémenter et débugger
- ✅ Fiable (pas de connexion persistante fragile)
- ✅ Charge serveur acceptable (6 req/min par utilisateur)
- ❌ Pas de WebSockets : overkill pour ce besoin, complexité non justifiée MVP
- ❌ Pas de SSE (Server-Sent Events) : Libretime ne supporte probablement pas

**Gestion erreurs :**
- Si API Libretime indisponible : afficher dernier titre connu
- Fallback UI : "Titre indisponible" si jamais de réponse
- Retry après erreur : attendre 30s avant de réessayer
- Pas de blocage UI si API lente

**UI update :**
- Transition fluide entre titres (fade in/out doux)
- Pas de "flash" ou re-render brutal
- Animation subtile lors du changement (optionnel)

**Alternative future (V1.1+) :**
- Server-Sent Events (SSE) si Libretime l'implémente
- Réduit la charge (push vs pull)
- Latence moindre

### Accessibility Level

**Niveau visé MVP :** Accessibilité basique (non WCAG 2.1 AA formellement requis)

**Implémentation minimale :**

**Navigation clavier :**
- Tab navigation fonctionnelle (tous les éléments interactifs accessibles)
- Enter/Space pour activer boutons
- Focus visible (outline ou highlight)

**Contraste et lisibilité :**
- Contraste texte/fond raisonnable (pas de gris clair illisible)
- Taille police minimum 16px pour body text
- Line-height confortable (1.5 recommandé)

**Images et médias :**
- Alt text sur toutes les images (actus)
- Icônes avec labels texte ou aria-label

**HTML sémantique :**
- Structure claire : `<header>`, `<nav>`, `<main>`, `<footer>`
- Titres hiérarchisés : `<h1>` → `<h2>` → `<h3>`
- Boutons avec texte explicite (pas seulement icônes)

**Player audio :**
- Bouton Play/Stop avec label clair
- État visible (en lecture ou arrêté)

**Non requis MVP :**
- ❌ Screen reader optimization avancée
- ❌ ARIA landmarks et roles exhaustifs
- ❌ Conformité WCAG 2.1 AA formelle
- ❌ Tests avec utilisateurs handicapés

**Post-MVP (V1.1+) :**
- Amélioration progressive selon feedback
- Tests accessibilité si demande utilisateurs
- Conformité WCAG si requis pour partenariats

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approche MVP : Validation Technique + Valeur Utilisateur**

Le MVP C6Radio se concentre sur un objectif critique : **prouver que le player radio fonctionne parfaitement** en conditions réelles. L'expérience doit être fiable, fluide, et "s'oublier".

**Validation recherchée :**
- ✅ Audio background iOS/Android fonctionne sans friction
- ✅ Stream stable même sur réseau mobile faible
- ✅ Les utilisateurs écoutent réellement et reviennent (D7 > 40%)
- ✅ L'app est performante (Capacitor ne ralentit pas l'expérience)

### MVP Feature Set (Phase 1) - Périmètre Essentiel

**Must-Have Capabilities (Non négociables MVP) :**

**🎵 Barre de contrôle footer unifiée (CRITIQUE) :**
- Sticky footer visible sur toutes les pages
- Gestion unifiée des deux types de players (live + podcast)
- Logo + Titre dynamique ("now playing" ou titre podcast)
- Contrôles adaptés : Play/STOP (live) ou Play/Pause/STOP (podcast)
- Basculement automatique entre players (audioEngine.ts)
- Hauteur adaptative mobile/desktop
- États visuels clairs : playing/paused/loading/stopped

**Player Audio (CRITIQUE) :**
- Play/STOP avec clear buffer obligatoire (live)
- Play/Pause/STOP pour podcasts
- Lecture audio background iOS/Android
- Lockscreen controls et media notifications
- États visuels clairs : loading/playing/error
- Reconnexion automatique après coupure réseau
- "Now playing" temps réel (polling Libretime 10-15s)
- Fallback UI gracieux si API indisponible

**Contenu & Découverte :**
- **SEO optimisé** - SSR/pré-rendering pour découvrabilité Google
- Landing page épurée avec bouton Play central et articles en vedette
- **Actus WordPress : liste ET détail** - contenu frais pour engagement et SEO
- "Now playing" visible dès l'arrivée sur le site

**Administration :**
- WordPress REST API intégré
- Publication autonome
- **Synchronisation automatique** : Site web (ISR 60s) + App mobile (fetch runtime)
- **Aucun rebuild nécessaire** : Contenu WordPress visible partout automatiquement
- **Cohérence parfaite** : Site web et app mobile affichent le même contenu
- Formats simples : titre, image, texte, catégories

**Performance & Fiabilité :**
- Temps démarrage audio < 3 secondes
- Responsive mobile-first
- Compatibilité navigateurs modernes
- Consommation batterie raisonnable

**Exclusions MVP (Scope Contrôlé) :**

Pour garantir livraison rapide et focus sur l'essentiel :
- ❌ **Page "À propos"** - peut être ajoutée en update future (scope reduction si contraintes ressources)
- ❌ Gestion interruptions téléphoniques automatiques → V1.1
- ❌ Page contact/formulaire → V1.1
- ❌ Émissions/grilles de programmes → V1.1
- ❌ Artwork "now playing" avancé (animations) → V1.1

### Post-MVP Features

**Phase 2: V1.1 (Croissance - Post Validation MVP)**

**Priorités absolues V1.1 (dans l'ordre) :**

1. **🔥 Gestion interruptions** (PRIORITÉ #1)
   - Pause/reprise automatique lors d'appels téléphoniques
   - Gestion Siri et autres apps audio
   - Reprise automatique après interruption
   - **Justification** : Essentiel pour expérience mobile fluide et professionnelle

2. **📊 Analytics basiques** (PRIORITÉ #2)
   - Matomo ou Google Analytics
   - Tracking : installations, sessions, durée écoute, pages vues
   - **Justification** : Mesurer métriques de succès (D7, temps d'écoute, engagement), valider product-market fit

**Autres features V1.1 :**

3. Page "À propos" complète (si absente du MVP)
4. Page contact avec formulaire
5. Grille des programmes (calendrier simple)
6. Liste des émissions (catalogue)
7. Amélioration UX "now playing" (artwork, animations fluides)
8. Partage de la radio (bouton partage, lien simple)

**Phase 3: V2 (Expansion)**

**Si audience grandit (200-300 utilisateurs actifs mensuels) :**

- **Multi-flux/qualités** : 128k/320k, fallback stream, sélection qualité
- **CarPlay / Android Auto** : intégration véhicule complète
- **Comptes utilisateurs** : favoris, historique personnalisé, préférences
- **Contenu enrichi** : pages animateurs, interviews, galerie photos événements
- **Communauté** : commentaires sur actus, votes, sondages locaux

### Risk Mitigation Strategy

**Technical Risks & Mitigations:**

**1. Audio Background iOS (CRITIQUE) :**
- **Risque** : Restrictions Safari/iOS empêchent lecture background fiable
- **Impact** : Blocage majeur, compromet valeur MVP
- **Mitigation** : 
  - POC technique très tôt (semaine 1-2 développement)
  - Tests sur devices réels iOS 16+ et iOS 17+
  - Documentation restrictions iOS et workarounds Capacitor
- **Plan B** : Si iOS bloque, pousser app native wrapper Capacitor (déjà prévu), documenter limitations clairement

**2. Stabilité Stream sur Réseau Mobile (CRITIQUE) :**
- **Risque** : Coupures fréquentes sur 3G/4G faible, expérience frustrante
- **Impact** : Abandon utilisateurs, métrique stabilité < 95%
- **Mitigation** :
  - Reconnexion automatique avec retry intelligent
  - Fallback UI gracieux ("Reconnexion...")
  - Tests réels sur 3G/4G, dans voiture, en mouvement
- **Plan B** : Buffer audio léger (2-3 secondes) pour absorber micro-coupures réseau

**3. Libretime "Now Playing" API (IMPORTANT mais flexible) :**
- **Risque** : API instable, payload complexe, latence élevée, CORS issues
- **Impact** : "Now playing" indisponible ou incorrect, expérience dégradée mais non bloquante
- **Mitigation** :
  - Polling avec timeout 5s max
  - Fallback UI : "Titre indisponible" si échec
  - Retry logic intelligent
  - Tests intégration tôt
- **Plan B** : Si trop complexe pour timing MVP, lancer sans "now playing" et ajouter en MAJ rapide (1-2 semaines post-lancement)

**4. Performance Capacitor (CRITIQUE) :**
- **Risque** : App mobile lente, consommation batterie excessive, lag UI
- **Impact** : App "lourde", ne "s'oublie" pas, abandons utilisateurs
- **Mitigation** :
  - Tests performance réguliers (profiling)
  - Optimisation bundle JS (code splitting, lazy loading)
  - Monitoring batterie sur devices réels
- **Plan B** : Code splitting agressif, optimisations natives iOS/Android si nécessaire

**Market Risks & Validation:**

**Adoption Utilisateur :**
- **Risque** : Les utilisateurs ne trouvent pas la radio (SEO faible) ou ne l'installent pas
- **Validation** : SEO optimisé dès MVP, tracking installations via analytics V1.1
- **Métriques succès** : 20-30 early adopters M1, 50-100 réguliers M3
- **Mitigation** : Communication locale (affiches, réseaux sociaux), bouche-à-oreille

**Rétention :**
- **Risque** : Les utilisateurs essaient mais ne reviennent pas (D7 faible)
- **Validation** : Mesurer D1/D7 via analytics V1.1, collecter feedback qualitatif
- **Seuil critique** : D7 > 40% pour valider product-market fit
- **Mitigation** : Si D7 bas, itérer rapidement sur UX/stabilité, améliorer contenus éditoriaux

**Contenu Éditorial :**
- **Risque** : Sophie ne publie pas régulièrement, site stagne, audience désengagée
- **Validation** : Formation WordPress, processus publication simple testé
- **Objectif** : 1-2 actus/semaine minimum
- **Mitigation** : Templates actus pré-conçus, calendrier éditorial, rappels

**Resource Risks & Contingencies:**

**Si 30% moins de ressources que prévu :**
- Éliminer **page "À propos"** du MVP → ajouter en V1.1
- Simplifier UI (pas d'animations, design minimal fonctionnel)
- **"Now playing"** en V1.1 si intégration trop lente (Plan B déjà documenté)
- Réduire scope actus : liste seulement, détails en V1.1

**Équipe minimale requise :**
- **1 dev fullstack** : React/Next.js + Capacitor + intégrations API (Icecast, Libretime, WordPress)
- **1 designer UI/UX** (temps partiel ou freelance) : maquettes, responsive, branding
- **Sophie** (community manager) : contenus WordPress, animation éditoriale

**Timeline Contingence :**
- **MVP optimal** (scope complet avec podcasts) : 10-12 semaines
- **MVP réduit** (sans "À propos", "now playing" ou podcasts simplifiés) : 8-10 semaines
- **MVP minimum** (scope ultra-réduit) : 6-8 semaines (player + stream + actus de base)

---

## Exigences Fonctionnelles

**Le scope MVP est défini. Voici maintenant LE CONTRAT précis des capacités à implémenter.**

### Purpose & Contrat

Les exigences fonctionnelles (FR) définissent **TOUTES les capacités** que C6Radio doit avoir. Elles constituent **LE CONTRAT** pour :
- **UX Designer** : conçoit uniquement ce qui est listé ici
- **Architecte** : supporte uniquement ce qui est listé ici
- **Équipe de développement** : implémente uniquement ce qui est listé ici

**Propriétés :**
- Capacité testable (vérifiable)
- Agnostique d'implémentation (QUOI, pas COMMENT)
- Spécifie QUI et QUOI, jamais les détails techniques

---

### FR1-7: Streaming & Player Live

**FR1** : Les utilisateurs peuvent démarrer la lecture du stream live en cliquant sur Play

**FR2** : Les utilisateurs peuvent arrêter la lecture du stream live en cliquant sur Stop

**FR3** : Le système vide le buffer audio lors du Stop pour garantir une reprise directe du live

**FR4** : Le système affiche l'état du player live (chargement, en lecture, erreur)

**FR5** : Le système reconnecte automatiquement le stream après une interruption réseau

**FR6** : Le système affiche un message pendant les tentatives de reconnexion

**FR7** : Les utilisateurs voient un indicateur visuel clair de l'état du player live (lecture ou arrêté)

---

### FR8-15: Player Podcast (Articles)

**FR8** : Les utilisateurs peuvent lire un podcast depuis la page détail d'un article

**FR9** : Les utilisateurs peuvent démarrer/reprendre un podcast (Play/Pause)

**FR10** : Les utilisateurs peuvent arrêter la lecture d'un podcast (Stop)

**FR11** : Les utilisateurs peuvent naviguer dans un podcast via barre de progression (seek)

**FR12** : Le système affiche la durée totale et position actuelle (ex: 15:32 / 45:00)

**FR13** : Le système arrête automatiquement le stream live quand un podcast démarre (**CRITIQUE**)

**FR14** : Le système arrête automatiquement le podcast quand le stream live démarre (**CRITIQUE**)

**FR15** : Un seul lecteur audio peut être actif à la fois (live OU podcast, jamais simultanément) (**CRITIQUE**)

---

### FR16-20: Affichage Informations Temps Réel

**FR16** : Le système affiche le titre en cours du stream live ("now playing")

**FR17** : Le système affiche l'artiste du titre en cours (si disponible)

**FR18** : Le système met à jour automatiquement le "now playing" sans action utilisateur

**FR19** : Le système affiche le titre du podcast en cours (remplace "now playing" live)

**FR20** : Le système affiche un fallback gracieux si informations indisponibles

---

### FR21-27: Découverte Contenu & Navigation

**FR21** : Les utilisateurs peuvent consulter la liste des actualités

**FR22** : Les utilisateurs voient un aperçu de chaque actualité (titre, image, extrait)

**FR23** : Les utilisateurs peuvent accéder au détail complet d'une actualité

**FR24** : Le système affiche le contenu formaté (texte, images)

**FR25** : Le système affiche un lecteur podcast sur les articles qui en ont un

**FR26** : Les articles sans podcast n'affichent pas de lecteur audio

**FR27** : Les utilisateurs naviguent entre pages sans interrompre l'audio (live ou podcast) (**CRITIQUE**)

---

### FR28-35: Expérience Mobile

**FR29** : L'audio (live ou podcast) continue en arrière-plan à l'écran verrouillé

**FR30** : L'audio (live ou podcast) continue quand l'utilisateur change d'application

**FR31** : Les utilisateurs contrôlent la lecture depuis le lockscreen

**FR32** : Les utilisateurs contrôlent la lecture depuis le centre de contrôle

**FR33** : Le système affiche les informations appropriées sur lockscreen (titre live OU podcast)

**FR34** : L'audio bascule automatiquement vers Bluetooth si périphérique connecté

**FR35** : L'interface s'adapte automatiquement à la taille d'écran (responsive)

---

### FR36-41: Gestion Contenu (Admin)

**FR36** : L'équipe éditoriale publie des actualités via WordPress

**FR36.1** : **CRITIQUE - L'équipe éditoriale choisit quelles pages sont affichées sur l'appli**
-**CRITIQUE** : Les pages séléctionnées par l'équipe doivent être affichées sur l'appli dans le menu hamburger/navigation

**FR37** : L'équipe éditoriale associe un podcast à un article (champ ACF `podcast_url`)

**FR38** : Les nouvelles actualités apparaissent automatiquement sur le site/app

**FR38.1** : **CRITIQUE - Synchronisation automatique WordPress sans rebuild**
- **Exigence absolue** : Le contenu WordPress (articles, pages, bannières) doit se synchroniser **automatiquement** sur le site web ET l'app mobile
- **Aucun déploiement manuel** : Pas de rebuild, pas de mise à jour manuelle, pas d'intervention technique
- **Cohérence parfaite** : Le site web et l'app mobile (iOS/Android) affichent **exactement le même contenu**
- **Temps de synchronisation** : 
  - Site web : ≤ 60 secondes
  - App mobile : Au prochain lancement de l'app (fetch runtime)
- **Workflow éditorial simplifié** : Publication WordPress → Visible partout automatiquement
- **Implémentation** :
  - Site web : Mode dynamique (refresh 60sec)
  - App mobile : Client Components avec fetch au runtime (pas d'export statique pour le contenu)
- **Justification** : Autonomie éditoriale totale, workflow simplifié, contenu toujours à jour sans friction technique

**FR39** : L'équipe éditoriale ajoute des images aux actualités

**FR40** : L'équipe éditoriale catégorise les actualités

**FR41** : Le système synchronise WordPress en < 1 minute (avec ou sans podcast)

---

### FR42-46: SEO & Découvrabilité

**FR42** : Les moteurs de recherche indexent la page d'accueil

**FR43** : Les moteurs de recherche indexent les pages d'actualités

**FR44** : Les pages contiennent meta tags appropriés (title, description, Open Graph)

**FR45** : Le site génère automatiquement un sitemap.xml

**FR46** : Les URLs sont sémantiques et lisibles (ex: /actus/titre-article)

---

### Synthèse des Exigences Fonctionnelles

**Total : 46 FRs MVP**

| Domaine de Capacité | Nombre FRs |
|---------------------|------------|
| Streaming & Player Live | 7 |
| Player Podcast | 8 |
| Affichage Temps Réel | 5 |
| Découverte Contenu | 7 |
| Expérience Mobile | 8 |
| Gestion Contenu | 6 |
| SEO & Découvrabilité | 5 |

---

### Future Enhancements (Post-MVP)

**Documenté pour référence, implémentation en V1.1+ :**

**V1.1 Prioritaires :**
- Gestion automatique des interruptions téléphoniques (pause/reprise automatique)
- Analytics et tracking utilisateur (métriques de succès)
- Page contact avec formulaire
- Grille des programmes
- Liste des émissions
- Amélioration UX "now playing" (artwork, animations)
- Partage de la radio (lien simple)

**V2 (si audience > 200-300 users actifs) :**
- Multi-flux/qualités (128k/320k, fallback)
- CarPlay / Android Auto
- Comptes utilisateurs (favoris, historique)
- Contenu enrichi (animateurs, interviews, galerie photos)
- Communauté (commentaires, votes, sondages)

---

## Exigences Non-Fonctionnelles

**Philosophie MVP :** Les NFRs définissent COMMENT le système doit performer (qualité), pas CE qu'il doit faire (fonctionnalités).

**Approche C6Radio :** Qualité "suffisante" pragmatique — performance raisonnable, sécurité basique conforme, accessibilité WCAG AA, compatibilité ciblée. Pas de sur-engineering.

---

### Performance

**Philosophie :** Performance raisonnable, pas hyper-optimisée. Ne pas être contraignant pour l'utilisateur.

**NFR-PERF-01 : Démarrage audio**
- Stream live & podcast : **~3s** (max 5s acceptable)
- Mesuré sur connexion 4G standard

**NFR-PERF-02 : Rafraîchissement "Now Playing"**
- Polling API Libretime : **10-15s**
- Latence acceptable (non critique)

**NFR-PERF-03 : Chargement pages**
- LCP : **~2.5s** (tous réseaux)
- Pages utilisables rapidement
- Pas d'optimisation aggressive pour MVP

---

### Fiabilité

**NFR-REL-01 : Taux de réussite stream**
- **>95%** des tentatives réussissent
- Échec : message d'erreur explicite
- Pas de retry automatique (utilisateur décide)

**NFR-REL-02 : Reconnexion stream**
- Perte connexion : **3 tentatives** automatiques
- Délai progressif : 1s, 3s, 5s
- Après 3 échecs : message d'erreur, arrêt player

**NFR-REL-03 : Gestion erreurs API**
- Libretime : afficher dernière info connue ou "info indisponible"
- WordPress : message d'erreur clair si échec

**NFR-REL-04 : Monitoring**
- Pas de monitoring temps réel pour MVP
- Logs serveur suffisants pour debug

---

### Sécurité

**NFR-SEC-01 : HTTPS obligatoire**
- Toutes pages **uniquement HTTPS**
- Redirection automatique HTTP → HTTPS

**NFR-SEC-02 : Admin WordPress**
- Accès admin HTTPS obligatoire
- Pas de 2FA pour MVP (évolution future)
- Mots de passe forts recommandés

**NFR-SEC-03 : RGPD & Analytics**
- Analytics anonymes uniquement
- Pas de cookies non essentiels
- Bandeau RGPD basique si analytics activés

**NFR-SEC-04 : APIs publiques**
- Pas de protection spécifique MVP (APIs ouvertes)
- Pas de rate limiting côté client
- Évolution si abus constatés

---

### Accessibilité

**Philosophie :** Accessibilité basique conforme, pas d'excellence MVP.

**NFR-ACC-01 : Conformité WCAG**
- Niveau **AA (WCAG 2.1)** visé
- Focus : contraste, navigation clavier, textes alternatifs

**NFR-ACC-02 : Navigation clavier**
- Player 100% contrôlable au clavier
- Navigation sections au Tab

**NFR-ACC-03 : Lecteurs d'écran**
- Labels ARIA basiques
- Annonce changements d'état
- Best effort MVP (pas tests exhaustifs)

**NFR-ACC-04 : Contraste & lisibilité**
- Ratio contraste WCAG AA (4.5:1 min)
- Taille police mobile min 16px

---

### Compatibilité

**NFR-COMP-01 : Navigateurs**
- Chrome, Firefox, Safari, Edge (2 dernières versions)
- Pas de support IE11

**NFR-COMP-02 : Mobile OS**
- **Android 10+** souhaitable (arbitrage selon Capacitor)
- **iOS 13+** souhaitable (arbitrage selon Capacitor)

**NFR-COMP-03 : Lockscreen**
- Contrôles lockscreen : stream live ET podcasts
- Affichage métadonnées (titre, artwork si disponible)

**NFR-COMP-04 : Background audio**
- Audio continue en arrière-plan
- App tuée : audio s'arrête immédiatement
- Pas de service persistant (contrainte OS)

---

### Intégration

**NFR-INT-01 : Icecast (stream)**
- URL : `https://radio.c6media.fr:8443/main` (MP3)
- Tolérance interruptions : 3 tentatives (voir NFR-REL-02)
- Pas de fallback stream MVP

**NFR-INT-02 : Libretime (Now Playing)**
- URL : `https://radio.c6media.fr/api/live-info`
- Polling : 10-15s
- Timeout : 5s max, puis dernière info connue

**NFR-INT-03 : WordPress REST**
- Endpoints actus + podcasts (ACF `c6_podcast_audio`)
- Messages clairs si API indisponible
- Pas de cache client MVP (SSR/SSG peut cacher)

**NFR-INT-04 : Format podcasts**
- MP3 hébergés sur WordPress
- Pas de validation client (WordPress fournit MP3 valides)
- Support seek/pause/resume via HTML5

---

### Résumé NFRs

| Catégorie | Nombre | Priorité MVP |
|-----------|--------|-------------|
| Performance | 3 NFRs | 🔥 Critique |
| Fiabilité | 4 NFRs | 🔥 Critique |
| Sécurité | 4 NFRs | ⚡ Importante |
| Accessibilité | 4 NFRs | ⚡ Importante |
| Compatibilité | 4 NFRs | 🔥 Critique |
| Intégration | 4 NFRs | 🔥 Critique |
| **TOTAL** | **23 NFRs** | - |

**Contrat NFR :** Ces exigences définissent les critères de qualité mesurables pour valider le MVP. Elles sont alignées avec l'approche pragmatique du projet : qualité "suffisante" pour ne pas contraindre l'utilisateur, sans sur-engineering.
