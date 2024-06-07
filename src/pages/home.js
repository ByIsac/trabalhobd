// pages/home.js
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      window.location.href = '/login';
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/login';
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Página Inicial</h1>
      <p className={styles.text}>Estamos trabalhando no site, em breve teremos mais recursos.</p>
      <div className={styles.buttonContainer}>
        <Link href="/edit">
          <button className={styles.button}>Editar Dados do Sistema</button>
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleLogout} className={styles.button}>
          Voltar para a Página de Login
        </button>
      </div>
    </div>
  );
}
