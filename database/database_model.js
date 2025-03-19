const sequile = require("sequelize");

const conection = new sequile(
  "ProjetoPerguntaERespostas",
  "root",
  "nova_senha",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = conection;
