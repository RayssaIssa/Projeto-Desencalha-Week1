const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs').promises;

const port = 5500;
const url = 'dados.json';

// Middleware para habilitar CORS
const cors = require('cors');
app.use(cors());

// Rota GET para obter as tarefas
app.get('/task', async (req, res) => {  
    try {
        const data = await fs.readFile(path.join(__dirname, url), 'utf8'); 
        console.log(data);

        const tasks = JSON.parse(data);
        console.log(tasks);
        res.json(tasks);    // Envia as tarefas como resposta em formato JSON
   
    } catch (error) {
        // Em caso de erro, envia uma resposta de erro
        console.error('Erro ao ler o arquivo de tarefas:', error);
        res.status(500).json({ error: 'Erro ao ler o arquivo de tarefas.' });
    }
});

// Rota POST para adicionar uma nova tarefa
app.post('/task', express.json(), async (req, res) => { 
    try {        
        const novaTarefa = req.body;    //req.body contém a nova tarefa a ser adicionada
        const dados = await fs.readFile(path.join(__dirname, url), 'utf8');     // Lê o arquivo existente
        const tarefas = JSON.parse(dados);     // Converte o conteúdo para um array de tarefas
        tarefas.push(novaTarefa);        // Adiciona a nova tarefa ao array

        // Escreve o array atualizado de volta ao arquivo JSON
        await fs.writeFile(path.join(__dirname, url), JSON.stringify(tarefas, null, 2));
        res.status(201).json(novaTarefa);      // Envia a nova tarefa como resposta

    } catch (error) {
        console.error('Erro ao adicionar a tarefa:', error);
        res.status(500).json({ error: 'Erro ao adicionar a tarefa.' });
    }
});

app.put('/task/:id', express.json(), async (req, res) => {
    try {
        const tarefaId = Number(req.params.id);     // Obtém o ID da tarefa a ser atualizada a partir dos parâmetros da URL
        const dadosAtualizados = req.body;  // Obtém os dados atualizados da tarefa a partir do corpo da requisição

        const dados = await fs.readFile(path.join(__dirname, url), 'utf8');
        const tarefas = JSON.parse(dados);

        // Encontra o índice da tarefa a ser atualizada
        const index = tarefas.findIndex(tarefa => tarefa.id === tarefaId);
       
        // Se a tarefa for encontrada
        if (index !== -1) {
            // Atualiza a tarefa com os novos dados
            tarefas[index] = { ...tarefas[index], ...dadosAtualizados };  

            await fs.writeFile(path.join(__dirname, url), JSON.stringify(tarefas, null, 2));
            res.json(tarefas[index]);

        } else {
            // Tarefa não encontrada
            res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

    } catch (error) {
        console.error('Erro ao atualizar a tarefa:', error);
        res.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});