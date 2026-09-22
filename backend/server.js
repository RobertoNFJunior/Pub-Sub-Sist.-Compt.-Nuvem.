const express = require("express");
const cors = require("cors");
const path = require("path");
const { PubSub } = require("@google-cloud/pubsub");

const app = express();

const PORT = 3000;

// ==============================
// CONFIGURAÇÃO DO PUB/SUB
// ==============================

const pubsub = new PubSub();

const TOPICO = "lampada-eventos";

// Permite requisições
app.use(cors());

// Permite receber JSON
app.use(express.json());

// Servir os arquivos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));


// Página inicial
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );
});


// Receber evento da lâmpada e sensores
app.post("/evento", async (req, res) => {

    const dados = req.body;

    console.log("\n===== NOVO EVENTO =====");
    console.log("Evento:", dados.evento);
    console.log("Dispositivo:", dados.dispositivo);
    console.log("Estado:", dados.estado);
    console.log("Mensagem:", dados.mensagem);
    console.log("Data:", dados.data);
    console.log("=======================\n");

    try {

        // Converter o objeto para JSON
        const mensagem = Buffer.from(
            JSON.stringify(dados)
        );

        // Publicar no Pub/Sub
        const messageId = await pubsub
            .topic(TOPICO)
            .publishMessage({
                data: mensagem
            });

        console.log(
            "Evento publicado no Pub/Sub. ID:",
            messageId
        );

        res.status(200).json({
            sucesso: true,
            mensagem: "Evento publicado no Pub/Sub",
            evento: dados.evento,
            notificacao: dados.mensagem,
            messageId: messageId
        });

    } catch (erro) {

        console.error(
            "Erro ao publicar no Pub/Sub:",
            erro
        );

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao publicar evento no Pub/Sub"
        });
    }
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
