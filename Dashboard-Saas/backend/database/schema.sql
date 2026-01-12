-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS dashboard_saas;
USE dashboard_saas;

-- Tabela de usuários do sistema (admin/login)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'editor') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de clientes/usuários da plataforma
CREATE TABLE IF NOT EXISTS platform_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATE NOT NULL,
    last_login DATETIME NULL,
    INDEX idx_status (status),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform_user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('credit', 'debit') DEFAULT 'credit',
    description VARCHAR(255) NOT NULL,
    status ENUM('completed', 'pending', 'failed') DEFAULT 'pending',
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (platform_user_id) REFERENCES platform_users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de métricas mensais (para gráficos)
CREATE TABLE IF NOT EXISTS monthly_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month_year VARCHAR(7) NOT NULL UNIQUE, -- formato: '2024-12'
    active_users INT DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0.00,
    new_registrations INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_month (month_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário admin padrão (senha: admin123 - hash bcrypt)
INSERT INTO users (email, password, name, role) VALUES
('admin@dashboard.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Inserir dados de exemplo para platform_users
INSERT INTO platform_users (name, email, role, status, created_at, last_login) VALUES
('Ana Silva', 'ana.silva@example.com', 'Administrador', 'active', '2024-01-15', '2024-12-20'),
('Carlos Santos', 'carlos.santos@example.com', 'Usuário', 'active', '2024-02-20', '2024-12-19'),
('Maria Oliveira', 'maria.oliveira@example.com', 'Editor', 'active', '2024-03-10', '2024-12-18'),
('João Pereira', 'joao.pereira@example.com', 'Usuário', 'inactive', '2024-01-05', '2024-11-15'),
('Fernanda Costa', 'fernanda.costa@example.com', 'Editor', 'active', '2024-04-12', '2024-12-20'),
('Ricardo Alves', 'ricardo.alves@example.com', 'Usuário', 'active', '2024-05-18', '2024-12-19'),
('Juliana Lima', 'juliana.lima@example.com', 'Administrador', 'active', '2024-06-22', '2024-12-20'),
('Pedro Martins', 'pedro.martins@example.com', 'Usuário', 'inactive', '2024-02-14', '2024-10-30'),
('Lucas Ferreira', 'lucas.ferreira@example.com', 'Editor', 'active', '2024-07-08', '2024-12-19'),
('Camila Souza', 'camila.souza@example.com', 'Usuário', 'active', '2024-08-15', '2024-12-18');

-- Inserir transações de exemplo
INSERT INTO transactions (platform_user_id, amount, type, description, status, transaction_date) VALUES
(1, 1500.00, 'credit', 'Assinatura Premium', 'completed', '2024-12-20'),
(2, 299.90, 'credit', 'Plano Básico', 'completed', '2024-12-19'),
(3, 750.00, 'credit', 'Assinatura Pro', 'pending', '2024-12-19'),
(5, 1500.00, 'credit', 'Assinatura Premium', 'completed', '2024-12-18'),
(6, 299.90, 'credit', 'Plano Básico', 'failed', '2024-12-18'),
(7, 750.00, 'credit', 'Assinatura Pro', 'completed', '2024-12-17'),
(1, 1500.00, 'credit', 'Assinatura Premium - Renovação', 'completed', '2024-11-20'),
(2, 299.90, 'credit', 'Plano Básico - Renovação', 'completed', '2024-11-19'),
(9, 750.00, 'credit', 'Assinatura Pro', 'completed', '2024-12-15'),
(10, 299.90, 'credit', 'Plano Básico', 'completed', '2024-12-14');

-- Inserir métricas mensais (últimos 6 meses)
INSERT INTO monthly_metrics (month_year, active_users, revenue, new_registrations) VALUES
('2024-07', 1250, 45000.00, 45),
('2024-08', 1420, 52000.00, 52),
('2024-09', 1680, 61000.00, 38),
('2024-10', 1890, 69000.00, 42),
('2024-11', 2100, 78000.00, 48),
('2024-12', 2350, 85000.00, 35)
ON DUPLICATE KEY UPDATE 
    active_users=VALUES(active_users),
    revenue=VALUES(revenue),
    new_registrations=VALUES(new_registrations);
