# 📊 Dashboard SaaS - Sistema Administrativo Profissional

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

Dashboard web responsivo desenvolvido para empresas SaaS, fintechs e plataformas de dados. Interface moderna e corporativa com backend completo, autenticação JWT e banco de dados MySQL.

[🚀 Funcionalidades](#-funcionalidades) • [📸 Screenshots](#-screenshots) • [🏗️ Arquitetura](#️-arquitetura) • [🛠️ Instalação](#️-instalação) • [📚 Documentação](#-documentação)

</div>

---

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- ✅ **Login/Cadastro** com validação completa
- ✅ **Autenticação JWT** com tokens seguros
- ✅ **Hash de senhas** com bcryptjs
- ✅ **Proteção de rotas** privadas
- ✅ **Middleware de autenticação** no backend

### 📊 Dashboard e Métricas
- ✅ **4 KPIs principais** (Usuários Ativos, Faturamento, Novos Cadastros, Taxa de Conversão)
- ✅ **Gráficos interativos** com Recharts (faturamento mensal)
- ✅ **Tabela de usuários** com busca em tempo real
- ✅ **Último acesso** com data e horário
- ✅ **CRUD completo** de usuários (Criar, Ler, Atualizar, Deletar)

### 🎨 Interface e UX
- ✅ **Design moderno** e corporativo
- ✅ **Totalmente responsivo** (desktop, tablet, mobile)
- ✅ **Feedback visual** em todas as ações
- ✅ **Estados de loading** e tratamento de erros
- ✅ **Paleta de cores** profissional

---

## 🏗️ Arquitetura

### Stack Tecnológica

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
├─────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite + Tailwind CSS + Recharts │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST API
                       │ (JWT Authentication)
┌──────────────────────▼──────────────────────────────────┐
│                    BACKEND (Node.js)                     │
├─────────────────────────────────────────────────────────┤
│  Express.js + JWT + bcryptjs + MySQL2                   │
└──────────────────────┬──────────────────────────────────┘
                       │ SQL Queries
┌──────────────────────▼──────────────────────────────────┐
│                  BANCO DE DADOS (MySQL)                  │
├─────────────────────────────────────────────────────────┤
│  users | platform_users | transactions | monthly_metrics│
└─────────────────────────────────────────────────────────┘
```

### Estrutura do Projeto

```
dashboard-saas/
├── 📁 frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas (Login, Dashboard)
│   │   ├── hooks/          # Custom hooks (useAuth, etc)
│   │   ├── services/       # API service
│   │   ├── types/          # TypeScript interfaces
│   │   └── styles/         # Estilos globais
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 backend/
│   ├── routes/             # Rotas da API (auth, users, metrics)
│   ├── middleware/         # Middleware (autenticação)
│   ├── config/             # Configurações (database)
│   ├── database/           # Scripts SQL
│   ├── server.js           # Servidor Express
│   └── package.json
│
└── 📁 screenshots/         # Screenshots do projeto
```

### Fluxo de Autenticação (JWT)

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│  Login  │────────▶│ Backend │────────▶│   JWT   │
│  Form   │  POST   │  Auth   │  Token  │  Token  │
└─────────┘         └─────────┘         └────┬────┘
                                               │
                                               ▼
┌─────────┐         ┌─────────┐         ┌─────────┐
│Dashboard│◀────────│  API    │◀────────│  Token  │
│  Page   │  Data   │ Request │  Valid │ Storage │
└─────────┘         └─────────┘         └─────────┘
```

**Passos:**
1. Usuário faz login → Backend valida credenciais
2. Backend gera JWT token → Retorna para frontend
3. Frontend armazena token → localStorage
4. Próximas requisições → Token no header `Authorization: Bearer <token>`
5. Middleware valida token → Permite acesso às rotas protegidas

---

## 🗄️ Banco de Dados

### Diagrama ER Simplificado

```
┌─────────────────┐
│     users       │  (Usuários do sistema - autenticação)
├─────────────────┤
│ id              │
│ email (UNIQUE)  │
│ password (hash) │
│ name            │
│ role            │
└────────┬────────┘
         │
         │ 1:1 (mesmo email)
         │
┌────────▼────────┐
│ platform_users  │  (Usuários da plataforma - dashboard)
├─────────────────┤
│ id              │
│ name            │
│ email (UNIQUE)  │
│ role            │
│ status          │
│ created_at      │
│ last_login      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│  transactions   │
├─────────────────┤
│ id              │
│ platform_user_id│
│ amount          │
│ type            │
│ status          │
│ transaction_date│
└─────────────────┘

┌─────────────────┐
│monthly_metrics  │
├─────────────────┤
│ id              │
│ month_year      │
│ active_users    │
│ revenue         │
│ new_registrations│
└─────────────────┘
```

### Tabelas Principais

| Tabela | Descrição | Campos Importantes |
|--------|-----------|-------------------|
| `users` | Usuários do sistema (login) | email, password (hash), role |
| `platform_users` | Usuários da plataforma (dashboard) | name, email, status, last_login |
| `transactions` | Transações financeiras | amount, type, status, transaction_date |
| `monthly_metrics` | Métricas mensais para gráficos | month_year, revenue, active_users |

---

## 🛠️ Instalação

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/))
- **MySQL Workbench** (opcional, para gerenciar banco)
- **Git** (para clonar o repositório)

### Passo a Passo

#### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/dashboard-saas.git
cd dashboard-saas
```

#### 2️⃣ Configure o Banco de Dados

1. Abra o **MySQL Workbench**
2. Conecte-se ao servidor MySQL
3. Execute o script: `backend/database/schema.sql`
4. (Opcional) Execute: `backend/database/fix_datetime.sql` se necessário

#### 3️⃣ Configure o Backend

```bash
cd backend

# Instale as dependências
npm install

# Crie o arquivo .env
cp env.example.txt .env

# Edite o .env com suas credenciais:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha
# DB_NAME=dashboard_saas
# JWT_SECRET=seu_secret_aqui
# PORT=3001

# Inicie o servidor
npm run dev
```

✅ Backend rodando em: `http://localhost:3001`

#### 4️⃣ Configure o Frontend

```bash
# Volte para a raiz do projeto
cd ..

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

✅ Frontend rodando em: `http://localhost:5173`

#### 5️⃣ Acesse a Aplicação

1. Abra: `http://localhost:5173`
2. Faça login com:
   - **Email:** `admin@dashboard.com`
   - **Senha:** `admin123`
3. Ou crie uma nova conta

---

## 📚 Documentação

### Scripts Disponíveis

#### Frontend
```bash
npm run dev      # Desenvolvimento (localhost:5173)
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Linter
```

#### Backend
```bash
npm run dev      # Desenvolvimento com watch
npm start        # Produção
```

### API Endpoints

#### Autenticação
```
POST   /api/auth/login      # Login
POST   /api/auth/register   # Cadastro
```

#### Usuários
```
GET    /api/users           # Listar todos
GET    /api/users/:id       # Buscar por ID
POST   /api/users           # Criar novo
PUT    /api/users/:id       # Atualizar
DELETE /api/users/:id       # Deletar
```

#### Métricas
```
GET    /api/metrics/dashboard    # KPIs do dashboard
GET    /api/metrics/chart        # Dados para gráfico
GET    /api/metrics/transactions # Listar transações
```

### Variáveis de Ambiente

#### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=dashboard_saas
DB_PORT=3306
JWT_SECRET=seu_jwt_secret_super_seguro
PORT=3001
```

#### Frontend (.env) - Opcional
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🚀 Deploy

### Build para Produção

```bash
# Frontend
npm run build

# Backend
cd backend
npm start
```

### Variáveis de Ambiente em Produção

Certifique-se de configurar:
- ✅ `JWT_SECRET` forte e único
- ✅ `DB_PASSWORD` seguro
- ✅ `DB_HOST` correto (não use localhost)
- ✅ CORS configurado para o domínio de produção

---

## 🧪 Testes

```bash
# Frontend (quando implementado)
npm run test

# Backend (quando implementado)
cd backend
npm test
```

---

## 📦 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.2.2 | Tipagem estática |
| Vite | 5.0.8 | Build tool |
| Tailwind CSS | 3.3.6 | Estilização |
| Recharts | 2.10.3 | Gráficos |
| React Router | 6.20.0 | Roteamento |

### Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 18+ | Runtime |
| Express | 4.18.2 | Framework web |
| MySQL2 | 3.6.5 | Driver MySQL |
| JWT | 9.0.2 | Autenticação |
| bcryptjs | 2.4.3 | Hash de senhas |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.

---

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Perfil](https://linkedin.com/in/seu-perfil)
- Email: seu.email@example.com

---

## 🙏 Agradecimentos

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Express](https://expressjs.com)

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela! ⭐**

Made with ❤️ using React + TypeScript + Node.js

</div>
