# ⚡ QUICK START - IPA Non Signé (2 minutes)

**Solution simple pour tester sur iPhone sans Apple Developer**

---

## 🎯 CE QUI A ÉTÉ FAIT

✅ **Nouveau workflow créé** : `.github/workflows/ios-build-unsigned.yml`  
✅ **Ancien workflow désactivé** : `ios-testflight.yml.disabled`  
✅ **Documentation complète** : `docs/phase-7-SOLUTION-SIMPLE-IPA.md`

---

## 🚀 ACTIONS IMMÉDIATES (2 min)

### 1. Commit et push

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: workflow IPA non signé pour sideload (solution simple)"

# Push
git push origin main
```

### 2. Surveiller le build (10 min)

Ouvre : https://github.com/TON_USERNAME/c6radio-web/actions

Tu devrais voir :
- ✅ Workflow "iOS Build IPA (Non signé)" en cours
- ⏱️ Durée : ~10 minutes

### 3. Télécharger l'IPA

Quand le workflow est terminé (vert ✅) :
1. Clique sur le workflow
2. Descends à "Artifacts"
3. Clique sur `C6Radio-unsigned-XXX` pour télécharger
4. Dézippe le fichier → Tu obtiens `C6Radio-unsigned.ipa`

### 4. Installer avec Sideloadly

**Sur PC Windows/Linux** :
1. Télécharge Sideloadly : https://sideloadly.io
2. Installe et lance Sideloadly
3. Connecte ton iPhone en USB
4. Glisse-dépose `C6Radio-unsigned.ipa` dans Sideloadly
5. Entre ton Apple ID (gratuit OK)
6. Clique "Start"
7. Attends 2-3 minutes

**Sur iPhone** :
1. Réglages → Général → VPN et gestion de l'appareil
2. Sélectionne ton Apple ID
3. Fais confiance
4. Lance C6Radio ! 🎉

---

## ✅ AVANTAGES

✅ **Simple** : Pas de config Apple Developer  
✅ **Rapide** : 10 min de build  
✅ **Fonctionnel** : Teste sur iPhone réel  
✅ **Automatique** : Nouveau build à chaque push

---

## ⚠️ LIMITATIONS

⚠️ **Validité 7 jours** (Apple ID gratuit)  
⚠️ **Installation manuelle** (réinstaller chaque semaine)  
⚠️ **Toi uniquement** (pas de distribution)

**Mais c'est parfait pour développer et tester !** 💪

---

## 📚 GUIDE COMPLET

Pour plus de détails : `docs/phase-7-SOLUTION-SIMPLE-IPA.md`

---

## 🎉 RÉSULTAT

```
git push
    ↓
10 min de build
    ↓
Télécharge IPA
    ↓
Sideloadly (3 min)
    ↓
📱 App sur iPhone ! 🎉
```

**Total : 15 minutes du push au test sur iPhone !** ⚡

---

**👉 COMMENCE : git add . && git commit && git push**

**LET'S GO ! 🚀**

