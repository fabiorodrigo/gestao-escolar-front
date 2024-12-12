/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET (alunos)
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5003/alunos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.alunos.forEach(aluno =>
        addRowToTable(aluno.nome, aluno.matricula, aluno.classe, aluno.turno, aluno.email)
      );
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()

/*
  --------------------------------------------------------------------------------------
  Função para buscar um aluno específico no servidor pelo nome 
  --------------------------------------------------------------------------------------
*/
const searchItem = () => {
  let nameAluno = document.getElementById("newInputSearch").value.trim();
  let url = 'http://127.0.0.1:5003/aluno?nome=' + nameAluno;

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      // Limpa a tabela antes de adicionar o aluno encontrado
      clearTable();

      // Adiciona o aluno encontrado na tabela
      if (data && data.nome) {
        addRowToTable(data.nome, data.matricula, data.classe, data.turno, data.email);
      } else {
        alert("Aluno não encontrado!");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Ocorreu um erro ao buscar o aluno!");
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar a tabela (exceto o cabeçalho)
  --------------------------------------------------------------------------------------
*/
const clearTable = () => {
  let table = document.getElementById("myTable");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova linha na tabela
  --------------------------------------------------------------------------------------
*/
const addRowToTable = (nome, matricula, classe, turno, email) => {
  let table = document.getElementById("myTable");
  let row = table.insertRow();

  // Adiciona células à linha
  let cellNome = row.insertCell(0);
  let cellMatricula = row.insertCell(1);
  let cellClasse = row.insertCell(2);
  let cellTurno = row.insertCell(3);
  let cellEmail = row.insertCell(4);
  let cellAction = row.insertCell(5);

  // Preenche as células com os dados do aluno
  cellNome.textContent = nome;
  cellMatricula.textContent = matricula;
  cellClasse.textContent = classe;
  cellTurno.textContent = turno;
  cellEmail.textContent = email;

  // Adiciona o botão de ação (remover)
  cellAction.innerHTML = `<button class="btn btn-outline-danger">Remover</button>`;

  // Atualiza os eventos dos botões de remoção
  removeElement();
}


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo aluno com nome, matrícula, classe, turno e email
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let nome = document.getElementById("newName").value.trim();
  let matricula = document.getElementById("newMatricula").value.trim();
  let classe = document.getElementById("newClasse").value.trim();
  let turno = document.getElementById("newTurno").value.trim();
  let email = document.getElementById("newEmail").value.trim();

  if (!nome || !matricula || !classe || !turno || !email) {
    alert("Todos os campos são obrigatórios!");
  } else {
    postItem(nome, matricula, classe, turno, email);
    addRowToTable(nome, matricula, classe, turno, email);
    alert("Aluno adicionado!");
    // Limpa todos os campos do formulário
    
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir um novo aluno no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (nome, matricula, classe, turno, email) => {
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('matricula', matricula);
  formData.append('classe', classe);
  formData.append('turno', turno);
  formData.append('email', email);

  let url = 'http://127.0.0.1:5003/aluno';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
    form.reset();
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o clique no botão "Remover"
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let deleteButtons = document.getElementsByClassName("deleteButton"); // Identifica os botões de remoção
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = function () {
      let row = this.parentElement.parentElement; // Captura a linha correspondente
      const nome = row.getElementsByTagName('td')[0].innerHTML; // Captura o nome do aluno

      if (confirm("Você tem certeza de que deseja remover este aluno?")) {
        row.remove(); // Remove a linha da tabela
        deleteItem(nome); // Chama a função para deletar no backend
        alert("Aluno removido!");
      }
    };
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um aluno do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (nameAluno) => {
  let url = 'http://127.0.0.1:5003/aluno?nome=' + nameAluno;
  fetch(url, {
    method: 'delete',
  })
    .then((response) => response.json())
    .then(() => {
      // Atualiza a tabela após remoção
      clearTable();
      getList();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}