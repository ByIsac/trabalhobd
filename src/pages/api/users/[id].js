// pages/api/users/[id].js
import { db } from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Busca o usuário pelo ID
    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: 'Erro interno ao buscar usuário' });
    }
  } else if (req.method === 'PUT') {
    // Atualiza o usuário pelo ID
    const { nome_completo, email, nome_usuario, senha } = req.body;

    try {
      await db.query(
        'UPDATE usuarios SET nome_completo = ?, email = ?, nome_usuario = ?, senha = ? WHERE id = ?',
        [nome_completo, email, nome_usuario, senha, id]
      );
      res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro interno ao atualizar usuário' });
    }
  } else if (req.method === 'DELETE') {
    // Deleta o usuário pelo ID
    try {
      await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ message: 'Erro interno ao excluir usuário' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
