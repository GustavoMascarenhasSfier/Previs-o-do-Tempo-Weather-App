// Chave da API do OpenWeather
const key = "248ca52352915e37c0c818aee125c311";

// Chave do localStorage para salvar os dados do clima
const CHAVE_DADOS = "Dados Clima:";

// Busca os dados de uma cidade na API
async function buscarCidade(cidade) {
    const mensagemErro = document.querySelector(".erro");
    mensagemErro.textContent = ""; // limpa mensagens anteriores

    try {
        // Requisição à API (lang=pt_br → português, units=metric → °C)
        const resposta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`
        );

        // Verifica se a cidade foi encontrada
        if (!resposta.ok) {
            if (resposta.status === 404) throw new Error("Cidade não encontrada.");
            else throw new Error("Erro ao buscar dados. Tente novamente.");
        }

        const dados = await resposta.json(); // transforma JSON em objeto JS
        colocarDadosNaTela(dados);          // mostra no HTML
        salvarDados(dados, cidade);          // salva no localStorage

    } catch (erro) {
        mensagemErro.textContent = erro.message; // exibe na tela
        console.error("Erro:", erro.message);    // exibe no console
    }
}

// Atualiza os elementos HTML com os dados do clima
function colocarDadosNaTela(dados) {
    document.querySelector(".cidade").innerHTML = `${dados.name}, ${dados.sys.country}`;
    document.querySelector(".previsao").innerHTML = dados.weather[0].description;
    document.querySelector(".temp").innerHTML = `${parseInt(dados.main.temp)}<span>°C</span>`;
    document.querySelector(".tempMaxMin").innerHTML = `Min: ${parseInt(dados.main.temp_min)}°C / Max: ${parseInt(dados.main.temp_max)}°C`;
    document.querySelector(".umidade").innerHTML = `Umidade: ${dados.main.humidity}%`;
    document.querySelector(".vento").innerHTML = `Vento: ${parseInt(dados.wind.speed)} km/h`;
    document.querySelector(".icone-tempo").src = `http://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
}

// Função chamada ao clicar no botão de busca
function cliqueiNoBotao() {
    const cidade = document.getElementById("cityInput").value.trim();
    if (cidade === "") {
        document.querySelector(".erro").textContent = "Digite o nome de uma cidade!";
        return;
    }
    buscarCidade(cidade); // inicia a busca
}

// Salva os dados no localStorage de forma acumulativa
function salvarDados(dados, cidade) {
    // Recupera arrays do localStorage ou cria novos
    let cidadesSalvas = localStorage.getItem(CHAVE_DADOS);
    let cidades = localStorage.getItem("Cidade:");

    try {
        cidadesSalvas = cidadesSalvas ? JSON.parse(cidadesSalvas) : [];
        cidades = cidades ? JSON.parse(cidades) : [];

        // Garante que são arrays válidos
        if (!Array.isArray(cidades)) cidades = [];
        if (!Array.isArray(cidadesSalvas)) cidadesSalvas = [];
    } catch {
        cidadesSalvas = [];
        cidades = [];
    }

    // Adiciona a nova cidade e os dados
    cidades.push(cidade);
    cidadesSalvas.push(dados);

    // Salva novamente no localStorage
    localStorage.setItem("Cidade:", JSON.stringify(cidades, null, 2));
    localStorage.setItem(CHAVE_DADOS, JSON.stringify(cidadesSalvas, null, 2));
}

// JSON.stringify → transforma array/objeto em string para salvar
// JSON.parse → transforma string de volta em array/objeto ao recuperar