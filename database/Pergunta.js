const sequelize = require("sequelize");
const conection = require("./database");

//==============================
// Criar tabela usando Sequelize Model
//==============================

const Pergunta = conection.define("perguntas", {
  titulo: { type: sequelize.STRING, allowNull: false },
  descricao: { type: sequelize.TEXT, allowNull: false },
});

//==============================
// sincronizar com o banco de dados, o force:false não
//recria a tabela caso exista
//==============================
Pergunta.sync({ force: false }).then(() => {
  console.log("sincronizado com o bd");
});

module.exports = Pergunta;
