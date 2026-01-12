-- Migration: Alterar last_login de DATE para DATETIME
-- Execute este script no MySQL Workbench para atualizar a estrutura da tabela

USE dashboard_saas;

-- Alterar o tipo da coluna last_login de DATE para DATETIME
ALTER TABLE platform_users 
MODIFY COLUMN last_login DATETIME NULL;

-- Atualizar registros existentes que têm apenas data para incluir hora (meio-dia como padrão)
-- Isso é apenas para dados existentes, novos logins terão o horário correto
UPDATE platform_users 
SET last_login = CONCAT(last_login, ' 12:00:00')
WHERE last_login IS NOT NULL AND TIME(last_login) = '00:00:00';
