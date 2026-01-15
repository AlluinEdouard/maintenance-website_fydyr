-- Script d'initialisation de la base de données
-- Exécuté automatiquement au démarrage du conteneur MySQL

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Données de test
INSERT INTO users (name, email, password) VALUES 
    ('John Smith', 'john@example.com', 'password123'),
    ('Jane Doe', 'jane@example.com', 'securepass'),
    ('Bob Martin', 'bob@example.com', 'mypassword'),
    ('Dante Alighieri', 'dante@example.com', 'divinecomedy');

INSERT INTO tasks (user_id, title, description, status) VALUES 
    (1, 'Complete project report', 'Finish the final report for the project by end of the week.', 'in_progress'),
    (2, 'Update website', 'Revamp the homepage and add new features.', 'pending'),
    (3, 'Team meeting', 'Organize a meeting to discuss project milestones.', 'completed'),
    (4, 'Code review', 'Review code submissions from team members.', 'pending');



