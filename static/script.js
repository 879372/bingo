var countdownSpan = document.getElementById("countdown");
var countdown = 30;
countdownSpan.textContent = "Tempo restante: " + countdown + " segundos";

var countdownInterval = setInterval(function() {
    countdown--;
    countdownSpan.textContent = "Tempo restante: " + countdown + " segundos";
    if (countdown <= 0) {
        clearInterval(countdownInterval);
        if (parseInt(document.getElementById("quantidade_cartelas").value) >= 1) {
            iniciarBingo(); // Inicia o bingo se houver mais de uma cartela gerada
        } else {
            reiniciarCronometro(); // Reinicia o cronômetro se houver apenas uma cartela gerada
        }
    }
}, 1000);

function gerarCartelas() {
    var quantidadeCartelas = document.getElementById("quantidade_cartelas").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.error) {
                alert(response.error); // Exibir mensagem de erro, se houver
            } else {
                renderizarCartelas(response.cartelas); // Renderizar as cartelas na página
            }
        }
    };
    xhttp.open("POST", "/gerar_cartelas", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("quantidade_cartelas=" + quantidadeCartelas);
}



function iniciarBingo() {
    sortearAutomatico(); // Inicia o bingo automaticamente
}

function sortearAutomatico() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.body.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "/sortear_numero", true);
    xhttp.send();
    
}


function reiniciarCronometro() {
    countdown = 30;
    countdownSpan.textContent = "Tempo restante: " + countdown + " segundos";
    countdownInterval = setInterval(function() {
        countdown--;
        countdownSpan.textContent = "Tempo restante: " + countdown + " segundos";
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            // iniciarBingo(); // Inicia o bingo quando o cronômetro chegar a zero
        }
    }, 1000);
}


function renderizarCartelas(cartelas) {
    // Seleciona a div onde as cartelas serão renderizadas
    var cartelasDiv = document.getElementById("cartelas-geradas");
    
    // Limpa qualquer conteúdo anterior dentro da div
    cartelasDiv.innerHTML = "";
    
    // Itera sobre o array de cartelas
    cartelas.forEach(function(cartela, index) {
        // Cria um elemento div para representar a cartela
        var cartelaDiv = document.createElement("div");
        cartelaDiv.classList.add("cartela");
        
        // Cria um elemento h2 para o título da cartela
        var tituloCartela = document.createElement("h2");
        tituloCartela.textContent = "Cartela " + (index + 1);
        cartelaDiv.appendChild(tituloCartela);
        
        // Cria uma tabela para representar a cartela
        var tabelaCartela = document.createElement("table");
        
        // Adiciona as letras B, I, N, G e O no topo das colunas
        var cabecalhoTr = document.createElement("tr");
        ["B", "I", "N", "G", "O"].forEach(function(letra) {
            var letraTh = document.createElement("th");
            letraTh.textContent = letra;
            cabecalhoTr.appendChild(letraTh);
        });
        tabelaCartela.appendChild(cabecalhoTr);
        
        // Itera sobre as linhas da cartela
        cartela.forEach(function(linha) {
            // Cria uma linha na tabela
            var linhaTr = document.createElement("tr");
            
            // Itera sobre os números da linha
            linha.forEach(function(numero) {
                // Cria uma célula na linha
                var numeroTd = document.createElement("td");
                numeroTd.textContent = numero;
                
                // Adiciona a célula à linha
                linhaTr.appendChild(numeroTd);
            });
            
            // Adiciona a linha à tabela
            tabelaCartela.appendChild(linhaTr);
        });
        
        // Adiciona a tabela à div da cartela
        cartelaDiv.appendChild(tabelaCartela);
        
        // Adiciona a cartela renderizada à div principal
        cartelasDiv.appendChild(cartelaDiv);
    });
}

