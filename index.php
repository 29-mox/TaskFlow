<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow | Gestionnaire de Tâches</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="auth-container" class="app-card">
        <header>
            <h1 id="auth-title">🚀 TaskFlow</h1>
            <p id="auth-subtitle">Connexion requise</p>
        </header>

        <!-- Formulaire de Connexion -->
        <div id="login-form">
            <div class="input-section vertical">
                <input type="text" id="login-username" placeholder="Pseudo ou Email" autocomplete="username">
                <input type="password" id="login-password" placeholder="Mot de passe">
                <button id="login-submit-btn" class="main-btn">Se connecter</button>
            </div>
            <p class="auth-switch">
                <span id="no-account-text">Pas encore de compte ?</span> 
                <a href="#" onclick="showRegister()">S'inscrire</a>
            </p>
        </div>

        <!-- Formulaire d'Inscription -->
        <div id="register-form" style="display: none;">
            <div class="input-section vertical">
                <div class="input-group">
                    <input type="text" id="reg-lastname" placeholder="Nom">
                    <input type="text" id="reg-firstname" placeholder="Prénom">
                </div>
                <input type="text" id="reg-username" placeholder="Pseudo (Nom d'utilisateur)">
                <input type="email" id="reg-email" placeholder="Adresse email">
                <input type="password" id="reg-password" placeholder="Mot de passe pour l'application">
                <input type="password" id="reg-confirm" placeholder="Confirmation du mot de passe">
                <button id="register-submit-btn" class="main-btn">Créer un compte</button>
            </div>
            <p class="auth-switch">
                <span id="already-account-text">Déjà un compte ?</span> 
                <a href="#" onclick="showLogin()">Se connecter</a>
            </p>
        </div>
        
        <div class="header-actions center">
            <button id="auth-lang-toggle" onclick="toggleLanguage()"></button>
        </div>
    </div>

    <div id="main-app" style="display: none;">
    <div class="app-card">
        <header>
            <div class="header-top">
                <h1 id="app-title">🚀 TaskFlow</h1>
                <div class="header-actions">
                    <button id="logout-btn" onclick="logout()" title="Déconnexion">↩️</button>
                    <button id="lang-toggle-btn" onclick="toggleLanguage()"></button>
                    <button type="button" id="help-btn" title="Besoin d'aide ?">?</button>
                </div>
            </div>
            <p id="app-subtitle">Simplifiez votre productivité</p>
            <div id="help-box" class="help-box">
                <strong id="help-title">📝 Comment ajouter une tâche :</strong>
                <ol>
                    <li id="help-step-1">Saisissez l'intitulé de votre tâche dans le premier champ.</li>
                    <li id="help-step-2">Cliquez sur "Date d'échéance" pour définir un rappel (optionnel).</li>
                    <li id="help-step-3">Appuyez sur "Ajouter" ou sur la touche Entrée.</li>
                </ol>
            </div>
        </header>

        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>

        <div class="input-section">
            <input type="text" id="task-input" placeholder="Ajouter une tâche..." autocomplete="off">
            <input type="text" id="task-date" placeholder="Date d'échéance" onfocus="this.type='datetime-local'; try { this.showPicker(); } catch(e) {}" onblur="if(!this.value)this.type='text'">
            <button id="add-btn" class="main-btn">Ajouter</button>
        </div>

        <div class="search-bar">
            <input type="text" id="search-input" placeholder="Rechercher une tâche..." autocomplete="off">
        </div>

        <ul id="task-list"></ul>
    </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
