-- Script adicional para popular mais dados (opcional)
USE dashboard_saas;

-- Adicionar mais transações históricas
INSERT INTO transactions (platform_user_id, amount, type, description, status, transaction_date) VALUES
(3, 750.00, 'credit', 'Assinatura Pro', 'completed', '2024-11-15'),
(4, 299.90, 'credit', 'Plano Básico', 'completed', '2024-10-20'),
(5, 1500.00, 'credit', 'Assinatura Premium', 'completed', '2024-11-18'),
(7, 750.00, 'credit', 'Assinatura Pro', 'completed', '2024-10-25'),
(8, 299.90, 'credit', 'Plano Básico', 'failed', '2024-09-30'),
(9, 750.00, 'credit', 'Assinatura Pro', 'completed', '2024-11-10'),
(10, 299.90, 'credit', 'Plano Básico', 'completed', '2024-12-05');
