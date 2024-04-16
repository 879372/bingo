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
                setTimeout(function() {
                    window.location.reload(); // Recarregar a página após 1 segundo
                }, 1000);
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
            iniciarBingo(); // Inicia o bingo quando o cronômetro chegar a zero
        }
    }, 1000);
}


