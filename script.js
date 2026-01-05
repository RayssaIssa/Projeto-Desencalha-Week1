listarTarefas();

const lista = document.getElementById('listar');
const btaddTask = document.getElementById('addNewTask');
const inputNomeTask = document.getElementById('nome');

// Começando a requisição para obter os dados do arquivo JSON
const url = 'dados.json';

function listarTarefas() {
    fetch(url, {
        method: 'GET'

    }).then(response => {
        return response.json();

    }).then(tarefas => {
        lista.innerHTML = '';
        console.log(tarefas);

        // Verifica se há tarefas para listar
        if (!tarefas || !Array.isArray(tarefas) || tarefas.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'Nenhuma tarefa cadastrada.';
            lista.appendChild(msg);
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

    }).catch(error => {
        console.error('Erro ao buscar tarefas:', error);
        lista.innerHTML = '<p>Erro ao carregar tarefas.</p>';
    });
}

function buscarIdUnico() {
    fetch(url)
    .then(response => response.json())
    .then(tarefas => {  
        let maxId = 0;
        tarefas.forEach(tarefa => {
            if (tarefa.id > maxId) {
                maxId = tarefa.id;
            }
        });

        return maxId + 1;
    });
}

function salvarTask(nome) {
    
    buscarIdUnico().then(id => {
        const tarefa = { 
            id: id,
            nome: nome, 
            concluida: false 
        }
    });
    
    // Enviando para o servidor
    const resposta = {
        method: 'POST',
        body: JSON.stringify(tarefa),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        })
    };

    fetch(url, resposta).then(response => {
        if(response.ok) {
            listarTarefas();
            alert('Tarefa salva com sucesso!');
        } else {
            alert('Erro ao salvar a tarefa.');
        } 
    }).catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao salvar a tarefa.');
    });
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
})
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