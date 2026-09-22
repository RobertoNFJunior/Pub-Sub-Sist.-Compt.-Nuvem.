const lampada = document.getElementById("lampada");
const status = document.getElementById("status");
const botao = document.getElementById("botao");
const sensorPresenca = document.getElementById("sensor-presenca");
const sensorFumaca = document.getElementById("sensor-fumaca");
const campainha = document.getElementById("campainha");

let ligada = false;

// URL do nosso backend
const BACKEND_URL = "http://localhost:3000/evento";

async function enviarEvento(dados) {

    try {

        const resposta = await fetch(BACKEND_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao enviar evento");
        }

        console.log("Evento enviado:", dados);

    } catch (erro) {

        console.error(
            "Não foi possível enviar o evento:",
            erro
        );
    }
}

botao.addEventListener("click", async () => {

    // Inverte o estado
    ligada = !ligada;

    // Atualiza a interface
    if (ligada) {

        lampada.classList.remove("apagada");
        lampada.classList.add("acessa");

        status.textContent = "Lâmpada ligada";
        botao.textContent = "DESLIGAR";

    } else {

        lampada.classList.remove("acessa");
        lampada.classList.add("apagada");

        status.textContent = "Lâmpada desligada";
        botao.textContent = "LIGAR";
    }

    // Define o evento
    const evento = ligada
        ? "LuzLigada"
        : "LuzDesligada";

    // Dados enviados para o backend
    const dados = {
        evento: evento,
        dispositivo: "Lâmpada da sala",
        lampada: "Sala",
        estado: ligada,
        mensagem: ligada
            ? "Lâmpada ligada"
            : "Lâmpada desligada",
        data: new Date().toISOString()
    };

    await enviarEvento(dados);

});

sensorPresenca.addEventListener("click", async () => {

    // Dados enviados para o backend
    const dados = {
        evento: "SensorPresencaAcionado",
        dispositivo: "Sensor de presença",
        estado: true,
        mensagem: "sensor do quarto acionado",
        data: new Date().toISOString()
    };

    status.textContent = dados.mensagem;

    await enviarEvento(dados);
});

sensorFumaca.addEventListener("click", async () => {

    // Dados enviados para o backend
    const dados = {
        evento: "SensorFumacaAcionado",
        dispositivo: "Sensor de fumaça",
        estado: true,
        mensagem: "sensor de fumaça acionado",
        data: new Date().toISOString()
    };

    status.textContent = dados.mensagem;

    await enviarEvento(dados);
});

campainha.addEventListener("click", async () => {

    // Dados enviados para o backend
    const dados = {
        evento: "CampainhaAcionada",
        dispositivo: "Campainha",
        estado: true,
        mensagem: "Alguem esta na porta",
        data: new Date().toISOString()
    };

    status.textContent = dados.mensagem;

    await enviarEvento(dados);
});
