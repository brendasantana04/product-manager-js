//evento da tabela
function listarProdutos() {
    let url = "http://localhost:3000/produtos";
    fetch(url)
        .then(res => res.json())
        .then(saida => {
            //vamos criar as linhas da tabela
            let tabela = document.getElementById("tabela");

            tabela.innerHTML = "";

            for (let i = 0; i < saida.length; i++) {
                //criando a linha
                let linha = document.createElement("tr");
                
                //criando as colunas
                let c0 = document.createElement("td");
                c0.textContent = saida[i].id;

                let c1 = document.createElement("td");
                c1.textContent = saida[i].descricao;

                let c2 = document.createElement("td");
                c2.textContent = saida[i].categoria;
                
                let c3 = document.createElement("td");
                c3.textContent = saida[i].preco.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"});

                //exibindo icone de acordo com a categoria do produto
                let c4 = document.createElement("td");
                //mapeando categoria e seu icone respectivo
                const iconemap = {
                    "Alimentação": "restaurant",
                    "Limpeza": "sanitizer",
                    "Vestuário": "checkroom",
                    "Higiene": "soap",
                    "Papelaria": "description",
                    "Veículo": "directions_car" 
                };
                let icone = iconemap[c2.textContent];
                c4.innerHTML = `<i class="material-icons">${icone}</i>`;

                linha.appendChild(c0);
                linha.appendChild(c1);
                linha.appendChild(c4);
                linha.appendChild(c2);
                linha.appendChild(c3);

                tabela.appendChild(linha);
            }
        });
}
// chamando a função
listarProdutos();


//evento do botao de adicionar produto
document.getElementById("btnIncluir").addEventListener('click', function() {
    //obtendo os valores dos campos de entrada
    let descricao = document.getElementById("descricao").value;
    let categoria = document.getElementById("categoria").value;
    let preco = parseFloat(document.getElementById("preco").value);
    
    // validacao
    if (!descricao || !categoria || !preco) {
      alert("Insira todos os dados necessários no formulário!!");
      return;
    }

    //endpoint
    let url = "http://localhost:3000/produtos";

    let produto = JSON.stringify({
        descricao: descricao,
        categoria: categoria,
        preco: preco
    });

    fetch(url, {
        method: 'POST',
        body: produto,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(x => {
        listarProdutos();
        window.alert('Produto adicionado com sucesso')
    })
    .catch(e => window.alert(e))
});


//adicionando botao de remover dado
document.getElementById("btnRemover").addEventListener('click', function() {
    // obtendo o id do produto a ser removido
    let id = prompt("Insira o ID do produto que deseja remover: ")
  
    // validacao
    if (!id) {
      alert("O produto que voce quer remover não foi informado!!");
      return;
    }

    // endpoint
    let url = `http://localhost:3000/produtos/${id}`;
    let produto = JSON.stringify({
        descricao: descricao,
        categoria: categoria,
        preco: preco
    });
    
    //adicionando o valor ao historico antes de removelo
    addHistorico(id, descricao, categoria, preco);

    //tentando fazer a remoção do valor desejado
    fetch(url, {
      method: 'DELETE',
      body: produto,
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(x => {
        listarProdutos();
        alert("Produto removido com sucesso!");
        return;
      })
      .catch(e => window.alert(e))
  });

  
//criando evento para editar algum dado da tabela
document.getElementById("btnEditar").addEventListener('click', function () {
    //id para ser editado
    let id = prompt("Insira o ID do produto que quer editar: ");
    let descricaoNovo = prompt("Insira uma nova descrição: ");
    //criando um menu no prompt pro usuário escolher a categoria correta
    let categoriaNova = prompt("De qual categoria ele pertence? (Selecione o número)\n"+
                            "1 - Alimentação\n" +
                            "2 - Limpeza\n" +
                            "3 - Vestuário\n" +
                            "4 - Higiene\n" +
                            "5 - Papelaria\n" +
                            "6 - Veículo\n")

    //verificando se a categoria e valida
    if (categoriaNova < 1 || categoriaNova > 6) {
        alert("Insira uma categoria entre 1 e 6!");
        return;
    }
    let precoNovo = parseFloat(prompt("Insira o novo preço do produto: "));

    // utilizando a tecnica de mapeamento
    const categoriaDescricaoMap = {
        1: "Alimentação",
        2: "Limpeza",
        3: "Vestuário",
        4: "Higiene",
        5: "Papelaria",
        6: "Veículo"
    };

    let categoriaDescricao = categoriaDescricaoMap[categoriaNova];

    //valindando entrada
    if (!id || !descricaoNovo || !categoriaDescricao || !precoNovo) {
        alert("Insira todos os dados corretamente!!");
        return;
    }

    //endpoint
    let url = `http://localhost:3000/produtos/${id}`
    
    //montando produto
    let produto = JSON.stringify({
        id: id,
        descricao: descricaoNovo,
        categoria: categoriaDescricao,
        preco: precoNovo
    });

    //fazendo a requisição para editar o arquivo
    fetch (url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: produto,
    })
    .then(res => res.json())
    .then(x => {
        listarProdutos();
        alert("Produto editado com sucesso!");
        return;
    })
    .catch(e => window.alert(e))
})

function addHistorico(id) {
    let url = `http://localhost:3000/produtos/${id}`;
    fetch(url)
      .then(res => res.json())
      .then(produto => {
        let historico = JSON.stringify({
          id: produto.id,
          descricao: produto.descricao,
          categoria: produto.categoria,
          preco: produto.preco
        });
  
        let hist = "http://localhost:3000/historico";
        fetch(hist, {
          method: 'POST',
          body: historico,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })
          .then(x => {
            alert("Produto adicionado ao histórico");
          })
          .catch(e => alert(e));
      });
  }
  
// document.getElementById("btnHistorico").addEventListener('click', function () {
//     const btnHistorico = document.getElementById('btnHistorico');
//     const tabela2 = document.getElementById('tabela2');
    
//     if (tabela2.classList.contains('hidden')) {
//         tabela2.classList.remove('hidden');
//         listarHistorico();
//         btnHistorico.textContent = 'Esconder Histórico';
//     } else {
//         tabela2.classList.add('hidden');
//         btnHistorico.textContent = 'Mostrar Histórico';
//     }
// })

// //evento do historico
// function listarHistorico() {
//     let url = "http://localhost:3000/historico";
//     fetch(url)
//         .then(res => res.json())
//         .then(saida => {
//             //vamos criar as linhas da tabela
//             let tabela2 = document.getElementById("tabela2");

//             tabela2.innerHTML = "";

//             for (let i = 0; i < saida.length; i++) {
//                 //criando a linha
//                 let linha = document.createElement("tr");
                
//                 //criando as colunas
//                 let c0 = document.createElement("td");
//                 c0.textContent = saida[i].id;

//                 let c1 = document.createElement("td");
//                 c1.textContent = saida[i].descricao;

//                 let c2 = document.createElement("td");
//                 c2.textContent = saida[i].categoria;
                
//                 let c3 = document.createElement("td");
//                 c3.textContent = saida[i].preco.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"});

//                 //exibindo icone de acordo com a categoria do produto
//                 let c4 = document.createElement("td");
//                 //mapeando categoria e seu icone respectivo
//                 const iconemap = {
//                     "Alimentação": "restaurant",
//                     "Limpeza": "sanitizer",
//                     "Vestuário": "checkroom",
//                     "Higiene": "soap",
//                     "Papelaria": "description",
//                     "Veículo": "directions_car" 
//                 };
//                 let icone = iconemap[c2.textContent];
//                 c4.innerHTML = `<i class="material-icons">${icone}</i>`;

//                 linha.appendChild(c0);
//                 linha.appendChild(c1);
//                 linha.appendChild(c4);
//                 linha.appendChild(c2);
//                 linha.appendChild(c3);

//                 tabela2.appendChild(linha);
//             }
//         });
// }