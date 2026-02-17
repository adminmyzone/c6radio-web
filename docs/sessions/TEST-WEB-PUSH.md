# 🌐 Test des Notifications PUSH Web

## ✅ Fichiers créés

- ✅ `/public/firebase-messaging-sw.js` - Service Worker Firebase
- ✅ `/src/services/pushNotifications.js` - Mis à jour avec enregistrement SW
- ✅ `/src/config/firebase.config.js` - Configuration Firebase

---

## 🚀 Étapes de test

### 1. Lance le serveur de développement

```bash
cd /home/dofrecords/WebstormProjects/c6radio-web
npm run dev
```

Tu devrais voir :
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

### 2. Ouvre Chrome/Firefox

Va sur **http://localhost:5173**

⚠️ **Important** : Les notifications web nécessitent **HTTPS** OU **localhost**. 
En dev, localhost fonctionne ! ✅

---

### 3. Ouvre la console du navigateur

Appuie sur **F12** > Onglet **Console**

Tu devrais voir :
```
🚀 Initialisation des notifications PUSH...
✅ Service Worker enregistré: ServiceWorkerRegistration {...}
🌐 Token FCM web: fXXXXXXXXXXXXXXXXXXX...
✅ Token enregistré: {success: true, ...}
```

---

### 4. Accepte les permissions

Une popup devrait apparaître :
```
┌────────────────────────────────────┐
│ localhost souhaite                 │
│ Afficher des notifications         │
│                                    │
│  [Bloquer]  [Autoriser]           │
└────────────────────────────────────┘
```

Clique sur **Autoriser** ✅

---

### 5. Vérifie WordPress

Va dans **WordPress Admin > Push Notifs**

Tu devrais voir :
```
📊 Total Devices: 1
🌐 Web: 1
```

🎉 **Ton navigateur est enregistré !**

---

### 6. Envoie une notification de test

1. WordPress Admin > **Push Notifs > Envoyer**
2. Remplis :
   - **Titre** : `Test Web`
   - **Message** : `Ceci est un test de notification web`
3. Clique sur **🚀 Envoyer à tous**

---

### 7. Reçois la notification !

**Si l'app est active (onglet ouvert)** :
- Une notification navigateur s'affiche en haut à droite
- La console affiche : `🔔 Message reçu (web): {...}`

**Si l'app est en arrière-plan (onglet fermé/minimisé)** :
- Une notification système Windows/Linux s'affiche
- Au clic → Ouvre l'onglet et navigue vers l'article (si lié)

---

## 🧪 Test automatique

Publie un article dans WordPress :
1. WordPress Admin > **Articles > Ajouter**
2. Écris un article
3. Clique sur **Publier**
4. 🎉 **La notification arrive automatiquement !**

---

## 🐛 En cas de problème

### Pas de demande de permission
→ Vérifie la console (F12) pour les erreurs

### Permission refusée
→ Réinitialise :
1. Chrome : `chrome://settings/content/notifications`
2. Trouve `localhost:5173`
3. Change "Bloquer" → "Autoriser"
4. Recharge la page

### Token non enregistré
→ Vérifie dans la console :
- `✅ Token enregistré` doit apparaître
- Si erreur 500 → Vérifie que WordPress est accessible

### Notification ne s'affiche pas
→ Vérifie :
1. Notifications système activées (paramètres OS)
2. Chrome a les permissions
3. La console affiche bien `🔔 Message reçu`

---

## 📋 Checklist finale

- [ ] `npm run dev` lancé
- [ ] Page ouverte sur http://localhost:5173
- [ ] Permission notifications accordée
- [ ] Console affiche "Token enregistré"
- [ ] WordPress affiche "1 appareil Web"
- [ ] Notification test reçue
- [ ] Notification auto après publication d'article

---

**Prêt ?** Lance `npm run dev` et teste ! 🚀
