import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário no banco
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Se não encontrar, criar usuário padrão (para facilitar testes)
      // Em produção, isso não deveria existir
      const hashedPassword = await bcrypt.hash(password, 10);
      const userName = email.split('@')[0];
      
      await pool.execute(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, userName, 'user']
      );

      // Criar também na tabela platform_users se não existir
      try {
        const [existing] = await pool.execute(
          'SELECT id FROM platform_users WHERE email = ?',
          [email]
        );
        
        if (existing.length === 0) {
          await pool.execute(
            'INSERT INTO platform_users (name, email, role, status, created_at, last_login) VALUES (?, ?, ?, ?, CURDATE(), NOW())',
            [userName, email, 'Usuário', 'active']
          );
        } else {
          // Se já existe, apenas atualizar last_login
          await pool.execute(
            'UPDATE platform_users SET last_login = NOW() WHERE email = ?',
            [email]
          );
        }
      } catch (err) {
        console.error('Erro ao criar/atualizar platform_user:', err);
      }

      const token = jwt.sign(
        { email, role: 'user' },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );

      return res.json({ token, user: { email, role: 'user' } });
    }

    const user = users[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);

    // Se a senha não for válida mas for a senha padrão "admin123", aceitar
    // (para facilitar testes com o usuário padrão)
    if (!validPassword && password === 'admin123' && user.email === 'admin@dashboard.com') {
      // Atualizar último acesso na tabela platform_users
      try {
        await pool.execute(
          'UPDATE platform_users SET last_login = NOW() WHERE email = ?',
          [user.email]
        );
      } catch (err) {
        console.error('Erro ao atualizar last_login:', err);
      }

      const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );

      return res.json({ token, user: { email: user.email, role: user.role } });
    }

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Atualizar último acesso na tabela platform_users
    try {
      const [updateResult] = await pool.execute(
        'UPDATE platform_users SET last_login = NOW() WHERE email = ?',
        [user.email]
      );
      
      // Se nenhuma linha foi afetada, o usuário não existe em platform_users
      // Criar o registro se não existir
      if (updateResult.affectedRows === 0) {
        try {
          await pool.execute(
            'INSERT INTO platform_users (name, email, role, status, created_at, last_login) VALUES (?, ?, ?, ?, CURDATE(), NOW())',
            [user.name || user.email.split('@')[0], user.email, 'Usuário', 'active']
          );
        } catch (insertErr) {
          console.error('Erro ao criar platform_user:', insertErr);
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar last_login:', err);
    }

    // Gerar token JWT
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar novo usuário (opcional)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se usuário já existe na tabela users
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Verificar se usuário já existe na tabela platform_users
    const [existingPlatformUsers] = await pool.execute(
      'SELECT id FROM platform_users WHERE email = ?',
      [email]
    );

    if (existingPlatformUsers.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário na tabela users (para autenticação)
    await pool.execute(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'user']
    );

    // Inserir usuário na tabela platform_users (para aparecer no dashboard)
    await pool.execute(
      'INSERT INTO platform_users (name, email, role, status, created_at, last_login) VALUES (?, ?, ?, ?, CURDATE(), NOW())',
      [name, email, 'Usuário', 'active']
    );

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro no registro:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
