// pages/login.js
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../styles/Login.module.css';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home'); // Redireciona para '/home' se estiver autenticado
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!result.error) {
      router.push('/home'); // Redireciona para '/home' após login bem-sucedido
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
      <button onClick={() => router.push('/register')} className={styles.registerButton}>
        Não tem cadastro? Cadastre-se
      </button>
    </div>
  );
}
