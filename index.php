<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow | Gestionnaire de Tâches</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-card">
        <header>
            <div class="header-top">
                <h1>🚀 TaskFlow</h1>
                <button type="button" id="help-btn" title="Besoin d'aide ?">?</button>
            </div>
            <p>Simplifiez votre productivité</p>
            <div id="help-box" class="help-box">
                <strong>📝 Comment ajouter une tâche :</strong>
                <ol>
                    <li>Saisissez l'intitulé de votre tâche dans le premier champ.</li>
                    <li>Cliquez sur "Date d'échéance" pour définir un rappel (optionnel).</li>
                    <li>Appuyez sur "Ajouter" ou sur la touche Entrée.</li>
                </ol>
            </div>
        </header>

        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>

        <div class="input-section">
            <input type="text" id="task-input" placeholder="Ajouter une tâche..." autocomplete="off">
            <input type="text" id="task-date" placeholder="Date d'échéance" onfocus="this.type='datetime-local'; try { this.showPicker(); } catch(e) {}" onblur="if(!this.value)this.type='text'">
            <button id="add-btn">Ajouter</button>
        </div>

        <ul id="task-list"></ul>
    </div>

    <script src="script.js"></script>
</body>
</html>
