<?php
require_once 'db.php';
header('Content-Type: application/json');
require_once 'auth.php'; // Inclure les fonctions d'authentification

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($action) {
        case 'list':
            requireAuth(); // S'assurer que l'utilisateur est authentifié pour lister les tâches
            $stmt = $pdo->prepare("SELECT id, task_text, is_completed, due_at, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC, id DESC");
            $stmt->execute([$_SESSION['user_id']]);
            echo json_encode($stmt->fetchAll());
            break;

        case 'register':
            $lastname = trim(strip_tags($input['lastname'] ?? ''));
            $firstname = trim(strip_tags($input['firstname'] ?? ''));
            $username = trim(strip_tags($input['username'] ?? ''));
            $email = trim(strip_tags($input['email'] ?? ''));
            $password = $input['password'] ?? '';
            $confirm = $input['confirm_password'] ?? '';

            if (empty($lastname) || empty($firstname) || empty($username) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Tous les champs sont requis']);
                break;
            }

            if ($password !== $confirm) {
                http_response_code(400);
                echo json_encode(['error' => 'Les mots de passe ne correspondent pas']);
                break;
            }
            
            echo json_encode(registerUser($pdo, $lastname, $firstname, $username, $email, $password));
            break;

        case 'login':
            $username = trim(strip_tags($input['username'] ?? ''));
            $password = $input['password'] ?? '';
            if (empty($username) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Username and password are required']);
                break;
            }
            // Appeler une fonction de auth.php pour gérer la connexion
            echo json_encode(loginUser($pdo, $username, $password));
            break;
        case 'logout':
            echo json_encode(logoutUser());
            break;

        case 'add':
            $text = trim(strip_tags($input['task'] ?? ''));
            $due_at = (!empty($input['due_at'])) ? str_replace('T', ' ', $input['due_at']) : null;

            requireAuth(); // S'assurer que l'utilisateur est authentifié pour ajouter des tâches
            if (!empty($text)) {
                $stmt = $pdo->prepare("INSERT INTO tasks (task_text, due_at, user_id, is_completed) VALUES (?, ?, ?, 0)");
                $stmt->execute([$text, $due_at, $_SESSION['user_id']]);
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'error_task_required']);
            }
            break;

        case 'edit':
            $id = (int)($input['id'] ?? 0);
            $text = trim(strip_tags($input['task'] ?? ''));
            $due_at = (!empty($input['due_at'])) ? str_replace('T', ' ', $input['due_at']) : null;

            requireAuth(); // S'assurer que l'utilisateur est authentifié pour modifier des tâches
            if ($id > 0 && !empty($text)) {
                $stmt = $pdo->prepare("UPDATE tasks SET task_text = ?, due_at = ? WHERE id = ? AND user_id = ?");
                $stmt->execute([$text, $due_at, $id, $_SESSION['user_id']]);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'error_invalid_data']);
            }
            break;

        case 'toggle':
            $id = (int)($input['id'] ?? 0);
            requireAuth(); // S'assurer que l'utilisateur est authentifié pour basculer des tâches
            $stmt = $pdo->prepare("UPDATE tasks SET is_completed = IF(is_completed = 1, 0, 1) WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $_SESSION['user_id']]);
            echo json_encode(['success' => true]);
            break;

        case 'delete':
            $id = (int)($input['id'] ?? 0);
            requireAuth(); // S'assurer que l'utilisateur est authentifié pour supprimer des tâches
            $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $_SESSION['user_id']]);
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'error_unknown_action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
