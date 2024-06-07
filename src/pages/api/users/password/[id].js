// pages/api/users/password/[id].js
import { db } from '../../../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { senha } = req.body;

    try {
      // Criptografa a nova senha antes de salvar no banco de dados
      const hashedPassword = bcrypt.hashSync(senha, 10);

      // Atualiza a senha do usuário no banco de dados
      await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hashedPassword, id]);

      res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Erro ao alterar a senha' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
