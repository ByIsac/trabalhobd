import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'trabalhobd',
});

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
        const user = rows[0];

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    session: async (session, user) => {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
    jwt: async (token, user) => {
      if (user) {
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
  },
});
