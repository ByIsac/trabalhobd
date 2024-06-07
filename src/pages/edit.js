// pages/edit.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Edit.module.css';

export default function Edit() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const userData = await res.json();
        setUsers(userData);
        setLoading(false);
      } else {
        console.error('Erro ao buscar usuários:', res.status);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const updatedUsers = users.filter(user => user.id !== id);
          setUsers(updatedUsers);
          alert('Usuário excluído com sucesso');
        } else {
          console.error('Erro ao excluir usuário:', res.status);
          alert('Erro ao excluir usuário');
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário');
      }
    }
  };

  const handleEdit = (id) => {
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, editing: true };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleSave = async (id) => {
    try {
      const userToSave = users.find(user => user.id === id);
      const { senha, ...userDataWithoutPassword } = userToSave; // Remove a senha do objeto
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataWithoutPassword), // Envie apenas os dados necessários, sem a senha
      });
      if (res.ok) {
        alert('Salvo com sucesso');
        const updatedUsers = users.map(user => {
          if (user.id === id) {
            return { ...user, editing: false };
          }
          return user;
        });
        setUsers(updatedUsers);
      } else {
        console.error('Erro ao salvar usuário:', res.status);
        alert('Erro ao salvar usuário');
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário');
    }
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, [name]: value };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setSelectedUser(null);
    setShowPasswordModal(false);
    setNewPassword('');
  };

  const handlePasswordChange = async () => {
    try {
      const res = await fetch(`/api/users/password/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senha: newPassword }),
      });
      if (res.ok) {
        alert('Senha alterada com sucesso');
        closePasswordModal();
      } else {
        console.error('Erro ao alterar senha:', res.status);
        alert('Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.editContainer}>
      <h1 className={styles.title}>Editar Usuários</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome Completo</th>
            <th>Email</th>
            <th>Nome de Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.editing ? (
                  <input
                    type="text"
                    name="nome_completo"
                    value={user.nome_completo}
                    onChange={(e) => handleChange(user.id, e)}
                  />
                ) : (
                  user.nome_completo
                )}
              </td>
              <td>
                {user.editing ? (
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={(e) => handleChange(user.id, e)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {user.editing ? (
                  <input
                    type="text"
                    name="nome_usuario"
                    value={user.nome_usuario}
                    onChange={(e) => handleChange(user.id, e)}
                  />
                ) : (
                  user.nome_usuario
                )}
              </td>
              <td className={styles.actions}>
                {user.editing ? (
                  <button onClick={() => handleSave(user.id)} className={styles.saveButton}>
                    Salvar
                  </button>
                ) : (
                  <button onClick={() => handleEdit(user.id)} className={styles.editButton}>
                    Editar
                  </button>
                )}
                <button onClick={() => handleDelete(user.id)} className={styles.deleteButton}>
                  Excluir
                </button>
                <button onClick={() => openPasswordModal(user)} className={styles.editButton}>
                  Mudar Senha
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/home">
        <button className={styles.button}>Voltar para a Página Inicial</button>
      </Link>
      
      {showPasswordModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Alterar Senha de {selectedUser.nome_completo}</h2>
            <input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange} className={styles.saveButton}>
              Salvar
            </button>
            <button onClick={closePasswordModal} className={styles.button}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
