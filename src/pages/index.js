// pages/api/users/index.js
import { db } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT id, nome_completo, email, nome_usuario FROM usuarios');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro interno ao buscar usuários' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido` });
  }
}
