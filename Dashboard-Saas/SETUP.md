# 🚀 Guia de Configuração - Dashboard SaaS com MySQL

Este guia irá te ajudar a configurar o projeto completo com backend real conectado ao MySQL.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MySQL Server instalado e rodando
- MySQL Workbench (ou outro cliente MySQL)
- npm ou yarn

## 🗄️ Passo 1: Configurar o Banco de Dados

### 1.1. Abrir MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte-se ao seu servidor MySQL (geralmente `localhost:3306`)

### 1.2. Executar o Script SQL

1. No MySQL Workbench, abra o arquivo: `backend/database/schema.sql`
2. Execute o script completo (Execute ou F5)
3. Isso irá criar:
   - Banco de dados `dashboard_saas`
   - Todas as tabelas necessárias
   - Dados de exemplo

### 1.3. (Opcional) Atualizar para DATETIME

Se você já executou o schema.sql anteriormente e quer que o campo `last_login` armazene também o horário:

1. Execute o script: `backend/database/fix_datetime.sql`
2. Isso alterará o campo `last_login` de DATE para DATETIME e limpará dados antigos

**⚠️ IMPORTANTE**: Se você está tendo problemas com horários mostrando 00:00:00, execute este script para corrigir!

### 1.3. (Opcional) Popular mais dados

Se quiser mais dados de exemplo, execute também:
- `backend/database/seed.sql`

## ⚙️ Passo 2: Configurar o Backend

### 2.1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2.2. Configurar variáveis de ambiente

1. Crie um arquivo `.env` na pasta `backend/`
2. Copie o conteúdo de `backend/env.example.txt` para `.env`
3. Configure suas credenciais:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=dashboard_saas
DB_PORT=3306

JWT_SECRET=seu_jwt_secret_super_seguro_aqui
PORT=3001
```

**⚠️ IMPORTANTE:** 
- Substitua `sua_senha_mysql` pela senha do seu MySQL
- Mude o `JWT_SECRET` para algo seguro em produção

### 2.3. Testar conexão com o banco

```bash
cd backend
npm run dev
```

Se tudo estiver correto, você verá:
```
🚀 Servidor rodando na porta 3001
📊 API disponível em http://localhost:3001/api
```

## 🎨 Passo 3: Configurar o Frontend

### 3.1. Instalar dependências

```bash
# Na raiz do projeto
npm install
```

### 3.2. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api
```

Se não criar, o frontend usará `http://localhost:3001/api` por padrão.

## 🚀 Passo 4: Executar o Projeto

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

## 🔑 Credenciais de Teste

### Usuário Admin Padrão
- **Email:** `admin@dashboard.com`
- **Senha:** `admin123`

### Ou criar novo usuário
Você pode fazer login com qualquer email e senha (mínimo 6 caracteres). O sistema criará automaticamente um novo usuário.

## 📊 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar novo usuário

### Métricas
- `GET /api/metrics/dashboard` - Obter KPIs
- `GET /api/metrics/chart` - Dados para gráfico
- `GET /api/metrics/transactions` - Listar transações

### Usuários
- `GET /api/users` - Listar todos
- `GET /api/users/:id` - Buscar por ID
- `POST /api/users` - Criar novo
- `PUT /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Deletar

## 🐛 Solução de Problemas

### Erro de conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão no MySQL Workbench

### Erro "Cannot find module"
- Execute `npm install` novamente
- Verifique se está na pasta correta

### CORS Error
- O backend já está configurado com CORS
- Certifique-se de que o backend está rodando na porta 3001

### Dados não aparecem
- Verifique se executou o script SQL
- Confirme que há dados nas tabelas
- Veja os logs do backend para erros

## 📝 Estrutura do Banco de Dados

### Tabelas principais:
- `users` - Usuários do sistema (admin/login)
- `platform_users` - Usuários da plataforma (clientes)
- `transactions` - Transações financeiras
- `monthly_metrics` - Métricas mensais para gráficos

## ✨ Funcionalidades Adicionais

O projeto agora inclui:
- ✅ Autenticação real com JWT
- ✅ CRUD completo de usuários
- ✅ Métricas calculadas do banco
- ✅ Gráficos com dados reais
- ✅ Modal para adicionar usuários
- ✅ Validação de formulários
- ✅ Tratamento de erros

## 🎯 Próximos Passos

1. Adicionar mais validações
2. Implementar paginação
3. Adicionar filtros avançados
4. Exportar dados (CSV/PDF)
5. Adicionar testes automatizados

---

**Dúvidas?** Verifique os logs do backend e do frontend para mais detalhes sobre erros.
