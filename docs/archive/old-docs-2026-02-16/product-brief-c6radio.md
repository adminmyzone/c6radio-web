# Product Brief: C6Radio

## Executive Summary

C6Radio est une **webradio locale** (streaming live) qui doit être accessible en un geste sur **web** et surtout sur **mobile**, avec une exigence critique : **lecture audio en arrière-plan** et contrôles “media” (lockscreen / centre de contrôle).

La V1 vise une expérience **simple, fiable, rapide** : lancer le live, afficher le “now playing”, consulter quelques pages essentielles (à propos/contact) et des contenus éditoriaux (actus / émissions) alimentés par **WordPress**. Les données de diffusion (stream + “now playing”) proviennent de **Libretime/Icecast**.

Décision de delivery (confirmée) : livrer **site + app en parallèle** avec une **UI partagée** (une base de code front), et une app mobile packagée via **Capacitor** pour couvrir les capacités audio natives nécessaires.

---

## Core Vision

### Problem Statement

- Les auditeurs veulent **écouter immédiatement** le live sur mobile et web, sans friction, et continuer l’écoute **écran verrouillé**.
- L’équipe C6Radio veut publier/mettre à jour **actus, pages, programmes** via un back-office (WordPress) **sans dépendre du développement**.

### Problem Impact

- Sans app adaptée, la lecture live est **fragile** (perte audio, interruptions) et l’adoption chute.
- Sans “now playing” fiable, l’expérience paraît **moins vivante** et moins engageante.
- Sans CMS simple, l’équipe édite moins, le site/app devient vite **obsolète**.

### Why Existing Solutions Fall Short

- Une PWA seule est souvent **insuffisante sur iOS** pour garantir l’audio en arrière-plan.
- Les lecteurs génériques n’intègrent pas bien la **marque**, les contenus éditoriaux, ni la cohérence “site + app”.
- Les intégrations “now playing” sont parfois **fragiles** (CORS, latence, payload variable) et nécessitent une stratégie de fallback.

### Proposed Solution

- Un **site public** (SEO + responsive ) centré sur un player live.
- Une **app iOS/Android** (wrapper Capacitor) pour assurer :
  - lecture audio en arrière-plan,
  - contrôles lockscreen/media,
  - (si possible) Bluetooth et gestion des interruptions.
- Intégrations :
  - **Stream Icecast** lu directement côté client,
  - **Now playing** via endpoint Libretime,
  - **Contenu** via WordPress REST.

### Key Differentiators

- “**1 tap to listen**” (temps d’accès au live minimal, UX épurée).
- **Fiabilité mobile** (background audio comme requirement, pas un bonus).
- **Socle éditorial** (WordPress) pour une radio “vivante” et à jour.
- **Code partagé** web/mobile (vitesse de delivery + cohérence UI).

---

## Target Users

### Primary Users

1) **Auditeur mobile “en mouvement”**
- Contexte : trajets, voiture (via Bluetooth), écoute au casque.
- Besoin : lancer le live vite, garder l’audio en arrière-plan, voir le titre en cours.
- Frustrations : coupures, player qui s’arrête écran verrouillé, absence d’info “now playing”.

2) **Auditeur desktop “au bureau/à la maison”**
- Contexte : écoute longue pendant le travail.
- Besoin : player stable, page qui ne se perd pas, informations sur la programmation.

### Secondary Users

3) **Équipe éditoriale / admin**
- Besoin : publier actus/pages/éventuellement émissions via WordPress, sans développement.
- Attente : formats simples, champs clairs (titre, image, extrait, contenu, catégories).

### User Journey

- **Découverte** : bouche-à-oreille, réseaux sociaux, QR/affiches locales, recherche web.
- **Onboarding** : accès au site, puis proposition “Installer” (PWA) et/ou téléchargement de l’app.
- **Usage cœur** : bouton Play/Pause, affichage “now playing”, retour automatique après interruption.
- **Aha moment** : l’audio continue écran verrouillé + contrôles lockscreen/Bluetooth.
- **Long terme** : actus, émissions, grilles → habitude d’écoute et retour régulier.

---

## Success Metrics

### User Success Metrics

- **Taux de démarrage du stream** (play success rate) et temps moyen “tap → audio”.
- **Stabilité d’écoute** : taux de coupure / reconnexion, reprise après interruptions (appels, Siri).
- **Engagement** : minutes d’écoute par jour/semaine, sessions par utilisateur.
- **Rétention** : D1/D7/D30 (app), “retour hebdo” (web).
- **Consultation contenu** : pages vues actus/émissions, CTR depuis le player.

### Business Objectives

- Augmenter l’audience locale et la notoriété de C6Radio.
- Créer un support stable pour activer partenaires/sponsors (si applicable).
- Réduire la charge technique : l’équipe publie via WordPress en autonomie.

### Key Performance Indicators

- Installations app (iOS/Android) + utilisateurs actifs mensuels.
- Volume d’écoute (heures totales / mois) et moyenne par utilisateur.
- Taux d’erreur player (web + mobile) et disponibilité perçue.

Note : les **cibles chiffrées** (ex : D30, heures d’écoute) sont à fixer après 2–4 semaines de baseline.

---

## MVP Scope

### Core Features

**Web (site public)**
- Site responsive (mobile-first) avec SEO de base.
- Player live : Play/Pause, état de chargement/erreur, reconnexion simple.
- Affichage “now playing” (titre en cours, et artwork si disponible).
- Pages essentielles : à propos, contact.
- Pages définies par équipe éditorialle sur WordPress
- Actus (WordPress REST) : liste + détail.

**Mobile (Capacitor iOS/Android)**
- Lecture audio en arrière-plan (essentiel V1).
- Contrôles lockscreen/centre de contrôle.
- Gestion interruptions (pause/reprise) + compatibilité Bluetooth “best effort”.

**Données & intégrations (V1)**
- Stream (prod) : https://radio.c6media.fr:8443/main (MP3)
- Now playing (prod) : https://radio.c6media.fr/api/live-info
- CMS : WordPress REST https://exp937.fr/wp/wp-json/wp/v2

### Out of Scope for MVP

- Comptes utilisateurs.
- Chat, playlists, favoris, téléchargements offline.
- CarPlay / Android Auto.

### MVP Success Criteria

- Lecture live fonctionne de manière fiable sur iOS/Android en arrière-plan.
- “Now playing” s’affiche correctement la majorité du temps (avec fallback UI si indisponible).
- Parcours “ouvrir → écouter” perçu comme simple (retours qualitatifs + métriques de démarrage).
- L’équipe peut publier des actus/pages via WordPress sans intervention dev.

### Future Vision

- Modèle éditorial complet : émissions, animateurs, grilles, tags.
- Intégrations véhicule (CarPlay/Android Auto) si valeur avérée.
- Multi-flux / qualités (AAC/MP3, fallback, haute qualité) si besoin.

---

## Dépendances, contraintes & hypothèses

- **Libretime/Icecast** reste la source de vérité diffusion (stream + now playing).
- **CORS/HTTPS/headers** doivent permettre l’accès web au stream et au now playing.
- Le “now playing” peut évoluer : prévoir une stratégie de mapping et de tolérance aux champs manquants.
- RGPD : définir si analytics/cookies sont activés (Matomo/GA/aucun) et si bannière consentement est requise.

## Risques principaux

- Audio background iOS : configuration et restrictions → valider très tôt via POC.
- Résilience réseau (mobile) : reconnexion / erreurs → UX de fallback obligatoire.
- Endpoints (payload/auth) pas stabilisés → besoin d’exemples payload + contrat minimal.

## Checklist de décisions (à trancher avant PRD)

Date de référence : 2026-01-28  
**✅ Toutes décisions finalisées : 2026-02-13**

| Décision | Options / attendu | Owner | Date cible | Statut | Notes |
| --- | --- | --- | --- | --- | --- |
| Stream : formats + qualités + fallback | MP3 seul vs AAC; multi-qualité (128/320); URL fallback; comportement reconnexion | DOFRECORDS (Tech) | 2026-02-04 | ✅ Décidé | **MP3 128kbps uniquement**. Reconnexion backoff 3s/10s/30s. Pas de fallback MVP. |
| Accès stream & now playing : CORS/headers | CORS OK web; headers/cache; contraintes HTTPS/TLS | DOFRECORDS (Tech) | 2026-02-04 | ✅ Décidé | **Validé : CORS OK, HTTPS, accessible public**. Tests navigateurs + mobile OK. |
| Now playing : contrat API (payload/auth/polling) | Auth oui/non; exemple payload réel; fréquence de polling; latence acceptable; champs minimum | DOFRECORDS (Tech) | 2026-02-04 | ✅ Décidé | **Public, polling 12s, timeout 5s**. Fallback UI si échec. Artist/title/artwork. |
| WordPress REST : base URL + contenus V1 | Base API; actus/pages; émissions/podcasts; pagination | DOFRECORDS (Produit/Éditorial) | 2026-02-04 | ✅ Décidé | **Base: https://exp937.fr/wp/wp-json/wp/v2**. Posts, pages, catégories, médias, bannières ACF, podcasts. |
| WordPress : champs requis + média | image, extrait, catégories, liens, (audio URL si podcasts), SEO | DOFRECORDS (Éditorial) | 2026-02-04 | ✅ Décidé | **ACF : bannière (image/lien/position), podcast (audio_url/durée/émission)**. Featured media obligatoire. |
| WordPress : auth | public-only vs Application Passwords vs JWT | DOFRECORDS (Tech) | 2026-02-04 | ✅ Décidé | **Public uniquement** (pas d'auth). Tous contenus exposés publics. |
| Analytics & RGPD | Matomo vs GA vs aucun; évènements; consentement cookies web | DOFRECORDS (Produit) | 2026-02-11 | ✅ Décidé | **Aucune analytics MVP**. Reports V1.1 (Matomo). Pas de bannière consentement. |
| Stores & distribution | iOS/Android dès V1; comptes dev; planning store review | DOFRECORDS (Produit) | 2026-02-11 | ✅ Décidé | **iOS (App Store) + Android (Play Store)**. Pas PWA. Release cible : 1er avril 2026. |

**📄 Voir détails complets :** [technical-decisions.md](technical-decisions.md)
