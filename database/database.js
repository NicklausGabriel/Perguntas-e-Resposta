require("dotenv").config(); // Carrega as variáveis do .env
const { Sequelize } = require("sequelize"); // Corrigido o nome

const connection = new Sequelize(
  process.env.DB_NAME, // Nome do banco
  process.env.DB_USER, // Usuário do banco
  process.env.DB_PASSWORD, // Senha do banco
  {
    host: process.env.DB_HOST, // Host do banco
    dialect: process.env.DB_DIALECT, // Dialeto (mysql, postgres, etc.)
    port: process.env.DB_PORT, // Porta do banco
    logging: false, // Desativa logs SQL no console
  }
);

// Testa a conexão
connection
  .authenticate()
  .then(() => console.log("✅ Conectado ao banco de dados!"))
  .catch((err) => console.error("❌ Erro ao conectar no banco:", err));

module.exports = connection;
