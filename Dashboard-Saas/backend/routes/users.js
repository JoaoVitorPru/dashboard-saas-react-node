import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar todos os usuários da plataforma
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, status, created_at, last_login FROM platform_users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Buscar usuário por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.execute(
      'SELECT * FROM platform_users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Criar novo usuário
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Nome, email e função são obrigatórios' });
    }

    const [result] = await pool.execute(
      'INSERT INTO platform_users (name, email, role, status, created_at, last_login) VALUES (?, ?, ?, ?, CURDATE(), NOW())',
      [name, email, role, status || 'active']
    );

    res.status(201).json({ id: result.insertId, message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, last_login } = req.body;

    await pool.execute(
      'UPDATE platform_users SET name = ?, email = ?, role = ?, status = ?, last_login = ? WHERE id = ?',
      [name, email, role, status, last_login || null, id]
    );

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM platform_users WHERE id = ?', [id]);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
