# 🐛 Installation du Plugin DEBUG

## Fichiers créés

J'ai créé 2 fichiers de debug :
1. `/tmp/class-fcm-sender-debug.php` - Version debug du sender
2. `/tmp/debug-ui-addon.php` - Interface debug WordPress

## 📥 Installation

### Méthode rapide (via FTP/SFTP)

1. **Remplace le fichier FCM sender** :
   ```bash
   # Copie le fichier debug vers :
   /wp-content/plugins/c6radio-push-notifications/includes/class-fcm-sender.php
   ```
   
2. **Ajoute l'interface debug** dans `class-admin-ui.php` :
   - Ouvre `/wp-content/plugins/c6radio-push-notifications/includes/class-admin-ui.php`
   - Trouve la fonction `add_admin_menu()`
   - Ajoute APRÈS la ligne `'c6radio-push-settings'` :
   ```php
   add_submenu_page(
       'c6radio-push',
       'Debug Logs',
       '🐛 Debug',
       'manage_options',
       'c6radio-push-debug',
       array($this, 'render_debug_page')
   );
   ```
   
   - Puis ajoute à la FIN de la classe (avant le `}` final) :
   ```php
   public function render_debug_page() {
       ?>
       <div class="wrap c6radio-push-wrap">
           <h1>🐛 Debug Logs</h1>
           
           <div style="background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 13px; max-height: 600px; overflow-y: auto;">
               <?php
               $logs = get_option('c6radio_push_debug_logs', array());
               if (empty($logs)) {
                   echo '<p style="color: #888;">Aucun log. Envoie une notification.</p>';
               } else {
                   foreach ($logs as $log) {
                       $color = '#d4d4d4';
                       if (strpos($log, '✅') !== false) $color = '#4ec9b0';
                       if (strpos($log, '❌') !== false) $color = '#f48771';
                       if (strpos($log, '🚀') !== false) $color = '#dcdcaa';
                       
                       echo '<div style="color: ' . $color . '; margin-bottom: 5px;">' . esc_html($log) . '</div>';
                   }
               }
               ?>
           </div>
           
           <p style="margin-top: 20px;">
               <a href="?page=c6radio-push-debug&clear=1" class="button">🗑️ Vider les logs</a>
               <a href="?page=c6radio-push-debug" class="button button-primary">🔄 Rafraîchir</a>
           </p>
       </div>
       <?php
       
       if (isset($_GET['clear'])) {
           delete_option('c6radio_push_debug_logs');
           echo '<div class="notice notice-success"><p>✅ Logs vidés</p></div>';
       }
   }
   ```

## 🧪 Utilisation

1. Va dans **WordPress Admin > Push Notifs**
2. Tu devrais voir un nouveau menu : **🐛 Debug**
3. Clique dessus
4. Va dans **Push Notifs > Envoyer**
5. Envoie une notification de test
6. Retourne dans **🐛 Debug**
7. **LIS LES LOGS** qui s'affichent !

Les logs te diront EXACTEMENT où ça bloque :
- ✅ Vert = OK
- ❌ Rouge = Erreur
- 🚀 Jaune = Info
- 📤 Bleu = Envoi en cours

## 📋 Ce que tu vas voir

Exemple de logs normaux :
```
[17:05:23] 🚀 Début envoi notification: 'Test' à 1 tokens
[17:05:23] ✅ Service account chargé: firebase-adminsdk-xxxxx@c6radio-push.iam...
[17:05:23] ✅ JWT généré, échange contre access token...
[17:05:24] ✅ Access token obtenu
[17:05:24] 📤 Envoi au token #1: cYFYTCBEdwejz-0ipNNm...
[17:05:25] ✅ Token #1 OK
[17:05:25] 📊 RÉSULTAT: 1 réussis, 0 échecs
```

Exemple avec erreur :
```
[17:05:23] 🚀 Début envoi notification: 'Test' à 1 tokens
[17:05:23] ✅ Service account chargé: firebase-adminsdk-xxxxx@c6radio-push.iam...
[17:05:23] ✅ JWT généré, échange contre access token...
[17:05:24] ✅ Access token obtenu
[17:05:24] 📤 Envoi au token #1: cYFYTCBEdwejz-0ipNNm...
[17:05:25] ❌ Token #1 ÉCHEC: HTTP 404: Requested entity was not found
[17:05:25] 🗑️ Token #1 marqué comme invalide
[17:05:25] 🧹 1 tokens invalides supprimés de la base
[17:05:25] 📊 RÉSULTAT: 0 réussis, 1 échecs
```

---

## 🆘 Si tu ne veux pas modifier manuellement

Je peux créer un **nouveau ZIP du plugin complet** avec le debug intégré.

**Tu veux que je fasse ça ?** 📦
