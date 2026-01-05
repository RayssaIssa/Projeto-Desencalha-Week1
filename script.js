const lista = document.getElementById('listar');
const btaddTask = document.getElementById('addNewTask');
const inputNomeTask = document.getElementById('nome');

async function semTarefas() {
    const msg = document.createElement('p');
    msg.textContent = 'Nenhuma tarefa cadastrada.';
    lista.appendChild(msg);
}

async function listarTarefas() {
    try {
        // Lendo o arquivo JSON de forma assíncrona
        const response = await fetch('http://localhost:5500/task');
        console.log('Response status:', response.status);
        console.log(response);

        const tarefas = await response.json();
        console.log(tarefas);
        
        lista.innerHTML = '';

        // Verifica se há tarefas para listar
        if (!tarefas || !Array.isArray(tarefas) || tarefas.length === 0) {
            await semTarefas();
            return;
        }

        // Usando DocumentFragment para melhorar a performance na manipulação do DOM
        const fragment = document.createDocumentFragment();

        // Itera sobre cada tarefa e cria os elementos HTML correspondentes para exibição
        for (let i = 0; i < tarefas.length; i++) {
            const item = document.createElement('div');
            item.classList.add('task');
            item.id = tarefas[i].id;

            const pNome = document.createElement('p');
            pNome.textContent = tarefas[i].nome;

            const checkConcluida = document.createElement('input');
            checkConcluida.type = 'checkbox';
            checkConcluida.classList.add('checkTask');
            checkConcluida.checked = tarefas[i].concluida;      
            
            item.appendChild(pNome);
            item.appendChild(checkConcluida);
            fragment.appendChild(item);
        }

        lista.appendChild(fragment);

    } catch(error) {
        console.error('Erro ao buscar tarefas:', error);
        await semTarefas();
    }
}

async function buscarIdUnico() {
    const dados = await fetch('http://localhost:5500/task');
    const tarefas = await dados.json();

    return tarefas.length + 1;
}
            
async function salvarTask(nome) {
    try {

        const idUnico = await buscarIdUnico();
        
        const tarefa = { 
            id: idUnico,
            nome: nome, 
            concluida: false 
        };

        // Salvando no arquivo JSON
        const response = await fetch('http://localhost:5500/task', {
            method: 'POST',
            headers: {
                'User-Agent': 'undici-stream-example',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarefa),
        });
        
        const dados = await response.json();
        if (response.ok) {
            listarTarefas();  // Atualiza a lista de tarefas após salvar uma nova
        } else {
            alert('Erro ao salvar a tarefa: ' + (dados.error || 'Erro desconhecido.'));
        }

    } catch(error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao salvar a tarefa.');
    };
}

btaddTask.addEventListener('click', function() {
    const nomeTask = inputNomeTask.value.trim();  //O método trim() remove espaços em branco do início e do fim da string
    if (nomeTask === '') {
        alert('Por favor, insira uma tarefa válida.');
        return;  
    }

    salvarTask(nomeTask);

    console.log('Tarefa adicionada: ' + nomeTask);
    inputNomeTask.value = '';   //Limpa o campo de entrada após adicionar a tarefa, assim não fica recarregando sem eu pedir
});

listarTarefas();

/*
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
    */