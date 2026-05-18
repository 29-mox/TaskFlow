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
            <h1>🚀 TaskFlow</h1>
            <p>Simplifiez votre productivité</p>
        </header>

        <div class="input-section">
            <input type="text" id="task-input" placeholder="Ajouter une tâche..." autocomplete="off">
            <button id="add-btn">Ajouter</button>
        </div>

        <div class="filter-bar">
            <button class="filter-btn active" data-filter="all">Toutes</button>
            <button class="filter-btn" data-filter="active">En cours</button>
            <button class="filter-btn" data-filter="completed">Terminées</button>
        </div>

        <ul id="task-list"></ul>
    </div>

    <script src="script.js"></script>
</body>
</html>
