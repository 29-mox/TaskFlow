<?php
session_start(); // Démarre la session pour la gestion des utilisateurs

// Cette fonction sera appelée par les endpoints de l'API qui nécessitent une authentification
function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Non autorisé
        echo json_encode(['error' => 'Authentication required']);
        exit();
    }
}

// Placeholder pour la logique d'enregistrement de l'utilisateur
function registerUser($pdo, $lastname, $firstname, $username, $email, $password) {
    try {
        // Vérifier si le pseudo ou l'email existe déjà
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            return ['success' => false, 'error' => 'Pseudo ou Email déjà utilisé'];
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (lastname, firstname, username, email, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$lastname, $firstname, $username, $email, $hashedPassword]);
        
        return ['success' => true, 'message' => 'Compte créé avec succès'];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// Placeholder pour la logique de connexion de l'utilisateur
function loginUser($pdo, $username, $password) {
    try {
        // On permet la connexion via Pseudo ou Email
        $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            return ['success' => true, 'message' => 'Connexion réussie'];
        }
        
        return ['success' => false, 'error' => 'Identifiants invalides'];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function logoutUser() {
    session_unset();
    session_destroy();
    return ['success' => true, 'message' => 'Déconnecté avec succès'];
}