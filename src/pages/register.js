import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Register.module.css';

export default function Register() {
  const router = useRouter();
  const [nome_completo, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [nome_usuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome_completo, email, nome_usuario, senha, cpf }),
    });

    if (res.status === 200) {
      router.push('/login');
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Nome completo: 
          <input 
            type="text" 
            value={nome_completo} 
            onChange={(e) => setNomeCompleto(e.target.value)} 
            className={styles.input} 
          />
        </label>
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
          Nome de usuário: 
          <input 
            type="text" 
            value={nome_usuario} 
            onChange={(e) => setNomeUsuario(e.target.value)} 
            className={styles.input} 
          />
        </label>
        <label className={styles.label}>
          Senha: 
          <input 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            className={styles.input} 
          />
        </label>
        <label className={styles.label}>
          CPF: 
          <input 
            type="text" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            className={styles.input} 
          />
        </label>
        <button type="submit" className={styles.registerButton}>Cadastrar</button>
      </form>
      <button onClick={() => router.push('/login')} className={styles.backButton}>
        Voltar para Login
      </button>
    </div>
  );
}
