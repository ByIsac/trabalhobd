// pages/api/users.js
import { db } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT id, nome_completo, email, nome_usuario FROM usuarios');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro interno ao buscar usuários' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ message: 'Erro interno ao excluir usuário' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
