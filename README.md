# 🚀 TaskFlow

TaskFlow is a simple web-based task management application built with PHP, MySQL, and JavaScript.

## Features

- **Task Management**: Add, edit, delete, and mark tasks as completed.
- **Deadlines & Alerts**: Date support with visual indicators for overdue or imminent tasks.
- **Search & Tracking**: Keyword filtering and a dynamic progress bar.
- **Modern UI**: Glassmorphism, animated background (parallax), and toast notifications.
- **Multilingual**: Full English/French support.

## Technologies Used

- **Backend**: PHP 8.x, MySQL
- **Frontend**: JavaScript (Vanilla), HTML5, CSS3

## Quick Start with Docker

1. **Clone the project**
    ```bash
    git clone https://github.com/29-mox/TaskFlow.git 
    ```
2. **Start with Docker**:
    ```bash
    docker-compose up --build -d
    ```
    URL: `http://localhost:8080`

## Alternative: Setup with XAMPP

1.  **Move the project**: Copy the project folder to `C:\xampp\htdocs\TaskFlow`.
2.  **Start Services**: Open the XAMPP Control Panel and start **Apache** and **MySQL**.
3.  **Database Setup**: 
    - Go to `http://localhost/phpmyadmin`.
    - Create a new database named `taskflow`.
    - Import the provided SQL schema (if applicable) or ensure your `api.php` is configured with your database credentials.
4.  **Access the app**: URL: `http://localhost/TaskFlow`
