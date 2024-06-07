import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Verifica o usuário no banco de dados
        const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (user.length > 0) {
          // Verifica a senha
          const isValidPassword = bcrypt.compareSync(password, user[0].senha);
          if (isValidPassword) {
            return {
              id: user[0].id,
              name: user[0].nome_completo,
              email: user[0].email
            };
          }
        }
        
        // Retorna null se a autenticação falhar
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login' // Redireciona para a página de login em caso de erro
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
});
