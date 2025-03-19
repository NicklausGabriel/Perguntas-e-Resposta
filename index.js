const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const conection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const { where } = require("sequelize");
const Resposta = require("./database/Resposta");
// ================================
// Seção de Conexão com o Banco de Dados
// ================================
conection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados: ", error);
  });

// ================================
// Seção de Middleware
// ================================
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ================================
// Seção de Rotas
// ================================

app.get("/", async (requisicao, resposta) => {
  try {
    const perguntas = await Pergunta.findAll({
      raw: true,
      order: [["id", "DESC"]], //ASC = crescente || DESC = decrescente
    });
    resposta.json(perguntas); // Agora retorna os dados corretamente
  } catch (erro) {
    console.error("Erro ao buscar perguntas:", erro);
    resposta.status(500).json({ erro: "Erro ao buscar perguntas" });
  }
});

app.post("/salvarPergunta", async (requisicao, resposta) => {
  try {
    let { titulo, descricao } = requisicao.body;

    // Verifica se os dados foram recebidos corretamente
    if (!titulo || !descricao) {
      return resposta
        .status(400)
        .json({ erro: "Título e descrição são obrigatórios!" });
    }

    // Salva no banco
    await Pergunta.create({ titulo, descricao });

    console.log("Pergunta salva com sucesso!");

    // Responde ao frontend confirmando o sucesso
    resposta.status(201).json({ mensagem: "Pergunta salva com sucesso!" });
  } catch (erro) {
    console.error("Erro ao salvar pergunta:", erro);
    resposta.status(500).json({ erro: "Erro interno ao salvar a pergunta." });
  }
});

app.get("/pergunta/:id", async (requisicao, resposta) => {
  try {
    let id = requisicao.params.id;

    const pergunta = await Pergunta.findOne({ where: { id: id } });
    if (!pergunta) {
      return undefined;
    }
    resposta.json(pergunta);
  } catch (error) {
    console.log("Error na requisição", error);
    resposta.status(500).json(error, "Erro interno ao buscar a pergunta");
  }
});
app.post("/responder", async (requisicao, resposta) => {
  try {
    let { corpo, perguntaId } = requisicao.body;

    // Verifica se os dados foram recebidos corretamente
    if (!corpo || !perguntaId) {
      return resposta
        .status(400)
        .json({ erro: "Título e descrição são obrigatórios!" });
    }

    // Salva no banco
    await Resposta.create({ corpo, perguntaId });

    console.log("Resposta salva com sucesso!");

    // Responde ao frontend confirmando o sucesso
    resposta.status(201).json({ mensagem: "Resposta salva com sucesso!" });
  } catch (erro) {
    console.error("Erro ao salvar Resposta:", erro);
    resposta.status(500).json({ erro: "Erro interno ao salvar a Resposta." });
  }
});
app.get("/respostas/:perguntaId", async (requisicao, resposta) => {
  try {
    let perguntaId = requisicao.params.perguntaId;

    // Busca todas as respostas da pergunta
    const respostas = await Resposta.findAll({
      where: { perguntaId: perguntaId },
    });

    if (!respostas || respostas.length === 0) {
      return resposta
        .status(404)
        .json({ mensagem: "Nenhuma resposta encontrada." });
    }

    resposta.json(respostas);
  } catch (error) {
    console.error("Erro ao buscar as respostas:", error);
    resposta.status(500).json({ erro: "Erro interno ao buscar as respostas" });
  }
});

// ================================
// Seção de Inicialização do Servidor
// ================================
app.listen(8000, () => {
  console.log("App rodando!");
});
