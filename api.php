<?php
require_once 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'list':
        $stmt = $pdo->query("SELECT id, task_text, is_completed FROM tasks ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'add':
        $text = trim(strip_tags($input['task'] ?? ''));
        if (!empty($text)) {
            $stmt = $pdo->prepare("INSERT INTO tasks (task_text) VALUES (?)");
            $stmt->execute([$text]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Le texte de la tâche est requis']);
        }
        break;

    case 'toggle':
        $id = (int)($input['id'] ?? 0);
        $stmt = $pdo->prepare("UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $id = (int)($input['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action non reconnue']);
        break;
}
