# 🚀 TaskFlow (FR / EN)

TaskFlow est une application web simple de gestion de tâches développée avec PHP, MySQL et JavaScript. / TaskFlow is a simple web task management application developed with PHP, MySQL and JavaScript.

## ✨ Fonctionnalités / Features

- **Ajout de tâches** : Saisissez rapidement de nouvelles tâches.
- **Dates d'échéance** : Associez une date et une heure à chaque tâche.
- **Indicateurs visuels** :
    - Les tâches dont l'échéance est passée s'affichent en rouge.
    - Une icône "⚠️" apparaît pour les tâches dont l'échéance est dans moins d'une heure.
- **Marquer comme terminée** : Cochez les tâches une fois qu'elles sont accomplies.
- **Édition de tâches** : Modifiez le texte ou la date d'échéance d'une tâche existante.
- **Suppression de tâches** : Retirez les tâches inutiles.
- **Recherche de tâches** : Filtrez vos tâches par mot-clé pour retrouver rapidement ce que vous cherchez. / **Task Search**: Filter your tasks by keyword to quickly find what you're looking for.
- **Barre de progression** : Suivez visuellement l'avancement de vos tâches grâce à une barre de progression dynamique. / **Progress Bar**: Visually track your task completion with a dynamic progress bar.
- **Notifications interactives** : Recevez des retours visuels pour chaque action (ajout, modification, suppression) via des notifications toast. / **Interactive Notifications**: Get visual feedback for every action (add, edit, delete) via toast notifications.
- **Effets visuels modernes** :
    - **Glassmorphism** : Un design translucide et flou pour la carte principale de l'application, offrant une esthétique contemporaine. / **Glassmorphism**: A translucent, blurred design for the main application card, offering a contemporary aesthetic.
    - **Arrière-plan animé** : Un dégradé de couleurs en mouvement lent avec un effet de parallaxe subtil au défilement, pour une expérience utilisateur immersive. / **Animated Background**: A slowly shifting color gradient with a subtle parallax effect on scroll, for an immersive user experience.
    - **Animations fluides** : Transitions douces pour l'ajout, la suppression et le changement de langue des tâches, améliorant la réactivité de l'interface. / **Smooth Animations**: Gentle transitions for task addition, deletion, and language switching, enhancing interface responsiveness.
- **Multilingue** : Support du Français et de l'Anglais. / **Multilingual**: Supports French and English.

## 🛠️ Technologies Utilisées / Technologies Used

-   **PHP** : Pour la logique métier côté serveur et l'API RESTful. / For server-side business logic and the RESTful API.
-   **MySQL** : Base de données relationnelle pour stocker les tâches. / Relational database for storing tasks.
-   **JavaScript (Vanilla)** : Pour l'interactivité côté client et la manipulation du DOM. / For client-side interactivity and DOM manipulation.
-   **HTML5** : Structure de l'application web. / Web application structure.
-   **CSS3** : Stylisation et effets visuels (animations, glassmorphism, parallaxe). / Styling and visual effects (animations, glassmorphism, parallax).

## 🚀 Démarrage Rapide avec Docker / Quick Start with Docker

Ce projet utilise Docker Compose pour faciliter la mise en place d'un environnement de développement. / This project uses Docker Compose to facilitate setting up a development environment.

1.  **Cloner le dépôt** : / **Clone the repository**:
    ```bash
    git clone https://github.com/29-mox/TaskFlow.git
    cd TaskFlow
    ```
2.  **Lancer l'application** : / **Start the application**:
    ```bash
    docker-compose up --build -d
    ```
    L'application sera accessible sur `http://localhost:8080`. La base de données MySQL sera également démarrée et ses données persisteront dans un volume Docker. / The application will be accessible at `http://localhost:8080`. The MySQL database will also be started and its data will persist in a Docker volume.
