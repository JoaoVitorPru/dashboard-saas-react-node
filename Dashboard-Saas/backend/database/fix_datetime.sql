-- Script para corrigir o campo last_login e garantir que está como DATETIME
-- Execute este script no MySQL Workbench

USE dashboard_saas;

-- Passo 1: Verificar a estrutura atual
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dashboard_saas' 
AND TABLE_NAME = 'platform_users' 
AND COLUMN_NAME = 'last_login';

-- Passo 2: Alterar o tipo da coluna last_login para DATETIME se necessário
ALTER TABLE platform_users 
MODIFY COLUMN last_login DATETIME NULL;

-- Passo 3: Limpar dados antigos que podem estar com horário 00:00:00
-- Isso remove registros que têm apenas data sem horário real
UPDATE platform_users 
SET last_login = NULL
WHERE last_login IS NOT NULL 
AND (TIME(last_login) = '00:00:00' OR TIME(last_login) IS NULL);

-- Passo 4: Verificar novamente a estrutura
DESCRIBE platform_users;

-- Passo 5: Testar inserção de um registro com horário
-- (Execute manualmente para testar se está funcionando)
-- UPDATE platform_users SET last_login = NOW() WHERE id = 1;
-- SELECT id, name, email, last_login, TIME(last_login) FROM platform_users WHERE id = 1;
