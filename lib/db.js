import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Substitua pelo seu usuário do MySQL
  password: '', // Substitua pela sua senha do MySQL
  database: 'trabalhobd',
});