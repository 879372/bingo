from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import random
import time

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta'

# Variáveis globais
numeros_sorteados = set()
cartelas = []

usuarios = [
    {'usuario': 'admin', 'senha': 'admin'},
    {'usuario': 'usuario1', 'senha': 'senha1'},
    {'usuario': 'usuario2', 'senha': 'senha2'},
]

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        senha = request.form['senha']

        if verificar_login(usuario, senha):
            # Login bem-sucedido, redireciona para a página principal
            flash('Login bem-sucedido!', 'success')
            return redirect(url_for('pagina_principal'))
        else:
            # Login inválido, exibe mensagem de erro
            flash('Usuário ou senha inválidos.', 'error')

    return render_template('login.html')

def verificar_login(usuario, senha):
    for u in usuarios:
        if u['usuario'] == usuario and u['senha'] == senha:
            return True
    return False

# Rota para a página principal
@app.route('/principal')
def pagina_principal():
    return render_template('principal.html')

# Rota para gerar as cartelas

@app.route('/gerar_cartelas', methods=['POST'])
def gerar_cartelas():
    quantidade_cartelas = request.form.get('quantidade_cartelas')
    if quantidade_cartelas and quantidade_cartelas.isdigit() and int(quantidade_cartelas) > 0:
        global cartelas  # Referenciar a variável global cartelas
        cartelas = [gerar_cartela() for _ in range(int(quantidade_cartelas))]
        return jsonify({'cartelas': cartelas})
    else:
        return jsonify({'error': 'Quantidade de cartelas inválida.'})
    
# Função para gerar uma única cartela
def gerar_cartela():
    cartela = []
    numeros_sorteados = set()

    # Gerar números para cada linha da cartela
    for _ in range(3):  # 3 linhas na cartela
        linha = []
        for _ in range(5):  # 5 números por linha
            numero = random.randint(1, 90)
            # Garante que o número gerado não se repita na cartela
            while numero in numeros_sorteados:
                numero = random.randint(1, 90)
            numeros_sorteados.add(numero)
            linha.append(numero)
        linha.sort()  # Ordena os números na linha
        cartela.append(linha)
    print(cartela)
    return cartela


@app.route('/sala_de_espera')
def iniciar_sala_de_espera():
    return render_template('sala_de_espera.html')


@app.route('/iniciar_jogo', methods=['POST'])
def iniciar_jogo():
    global numeros_sorteados
    numeros_sorteados = set()
    return redirect(url_for('sortear_numero'))


def verificar_vencedor():
    for cartela in cartelas:
        if all(all(numero == 'X' for numero in linha) for linha in cartela):
            return True
    return False

numeros_disponiveis = list(range(1, 91))

@app.route('/sortear_numero')
def sortear_numero():
    global numeros_sorteados, numeros_disponiveis
    if not numeros_disponiveis:
        return render_template('cartelas.html', cartelas=cartelas, numero_sorteado=None)

    numero_sorteado = random.choice(numeros_disponiveis)
    numeros_disponiveis.remove(numero_sorteado)  
    numeros_sorteados.add(numero_sorteado)
    print(numero_sorteado)
    print(numeros_disponiveis)
    print(numeros_sorteados)
    for cartela in cartelas:
        for linha in cartela:
            for i, numero in enumerate(linha):
                if numero == numero_sorteado:
                    linha[i] = 'X'
        if verificar_vencedor(cartela):
            return render_template('vencedor.html')
            break  
        
    return render_template('cartelas.html', cartelas=cartelas, numero_sorteado=numero_sorteado)
    print(cartelas)
    
def verificar_vencedor(cartela):
    # Verificar se todas as linhas da cartela têm todos os números marcados ('X')
    for linha in cartela:
        if not all(numero == 'X' for numero in linha):
            return False
    return True

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
