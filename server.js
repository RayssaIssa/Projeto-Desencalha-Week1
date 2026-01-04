
const e = require('express');
const express = require('express');
const app = express();

const PORT = 5500;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

app.use(express.static('public'));

const fs = require('fs');

const salvarDados = (dados) => {
    fs.writeFileSync('dados.json', JSON.stringify(dados, null, 2));
    if(error) {
        console.error('Erro ao salvar dados:', error);
        return;
    }
}

const lerDados = () => {
    const dadosBuffer = fs.readFileSync('dados.json');
    const dadosJSON = dadosBuffer.toString();
    return JSON.parse(dadosJSON);
}

const atualizarDados = (tarefaAtualizada) => {
    const dados = lerDados();
    const indice = dados.findIndex(tarefa => tarefa.id === tarefaAtualizada.id);
    if (indice !== -1) {
        dados[indice] = tarefaAtualizada;
        salvarDados(dados);
    }
}