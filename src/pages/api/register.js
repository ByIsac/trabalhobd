import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nome_completo, email, nome_usuario, senha, cpf } = req.body;

    try {
      // Verifica se o CPF já está cadastrado
      const [existingUser] = await db.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'CPF já está cadastrado' });
      }

      // Criptografa a senha antes de salvar no banco de dados
      const hashedPassword = bcrypt.hashSync(senha, 10);

      // Insere o novo usuário no banco de dados
      await db.query('INSERT INTO usuarios (nome_completo, email, nome_usuario, senha, cpf) VALUES (?, ?, ?, ?, ?)', [
        nome_completo,
        email,
        nome_usuario,
        hashedPassword,
        cpf,
      ]);

      res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
