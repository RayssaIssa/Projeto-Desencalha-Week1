// Começando a requisição para obter os dados do arquivo JSON
var requestURL = 'dados.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);    //Configura a requisição: método GET e passando a URL

request.responseType = 'json';  //Define o tipo de resposta esperada como JSON
request.send();

request.onload = function() {
    var tarefas = request.response;  //Armazena a resposta JSON 
    listarTarefas(tarefas);
}

// A LISTAGEM ESTA FUNCIONANDO! PRECISO FAZER O SALVAMENTO FUNCIONAR TAMBEM

var tamanhoTarefas = tarefas.length;

function listarTarefas(tarefas) {
    const lista = document.getElementById('listar');
    lista.innerHTML = '';

    console.log(tarefas); 
    // Verifica se há tarefas para listar
    if (!tarefas || !Array.isArray(tarefas) || tarefas.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = 'Nenhuma tarefa cadastrada.';
        lista.appendChild(msg);
        return;
    }

    // Itera sobre cada tarefa e cria os elementos HTML correspondentes para exibição
    for (let i = 0; i < tarefas.length; i++) {
        const item = document.createElement('div');
        item.className = 'task';

        const pNome = document.createElement('p');
        pNome.textContent = tarefas[i].nome;
        pNome.id = 'task_' + i + '_' + tarefas[i].nome;

        const checkConcluida = document.createElement('input');
        checkConcluida.type = 'checkbox';
        checkConcluida.id = tarefas[i].id;
        checkConcluida.className = 'checkTask';
        checkConcluida.checked = tarefas[i].concluida;      
        
        item.appendChild(pNome);
        item.appendChild(checkConcluida);
        lista.appendChild(item);
    }
}

async function salvarTask(nome) {
    const tarefa = { 
        nome: nome, 
        concluida: false 
    }

    try{
        // Enviando para o servidor
        const resposta = await fetch('http://localhost:5500/salvar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });

        if(resposta.ok) {
            alert('Tarefa salva com sucesso!');
        } else {
            alert('Erro ao salvar a tarefa.');
        } 
    }catch(error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao salvar a tarefa.');
    }
}

const btaddTask = document.getElementById('addNewTask');
const inputNomeTask = document.getElementById('nome');

btaddTask.addEventListener('click', function() {
    const nomeTask = inputNomeTask.value.trim();  //O método trim() remove espaços em branco do início e do fim da string
    if (nomeTask === '') {
        alert('Por favor, insira uma tarefa válida.');
        return;  
    }

    salvarTask(nomeTask);

    console.log('Tarefa adicionada: ' + nomeTask);
    inputNomeTask.value = '';   //Limpa o campo de entrada após adicionar a tarefa, assim não fica recarregando sem eu pedir
})

document.addEventListener('change', function (event) {
    if (event.target.classList.contains('checkTask')) {
        const tarefaNome = event.target.nome;
        const tarefaId = event.target.id;
        const isChecked = event.target.checked;

        console.log('Evento disparou', tarefaNome, isChecked);
        atualizarTarefaConcluida(tarefaNome, tarefaId, isChecked);
    }
});

async function atualizarTarefaConcluida(tarefaNome, tarefaId, concluida) {
    const tarefa = {
        nome: tarefaNome,
        concluida: concluida
    }
    
    try{
        // Enviando para o servidor
        const resposta = await fetch('http://localhost:5500/salvar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });

        if(resposta.ok) {
            alert('Tarefa salva com sucesso!');
        } else {
            alert('Erro ao salvar a tarefa.');
        }
    }catch(error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao salvar a tarefa.');
    }
}