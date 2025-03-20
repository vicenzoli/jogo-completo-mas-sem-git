const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');
const gravidade = 0.4;
const chaoY = canvas.height - 80;
let gameOver = false;
let pontuacao = 0; // Variável para armazenar a pontuação

// Definindo os frames de animação de corrida
const framesCorrida = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

framesCorrida[0].src = 'andar1.png';
framesCorrida[1].src = 'andar2.png';
framesCorrida[2].src = 'andar3.png';
framesCorrida[3].src = 'andar4.png';
framesCorrida[4].src = 'andar5.png';
framesCorrida[5].src = 'andar6.png';
framesCorrida[6].src = 'andar7.png';
framesCorrida[7].src = 'andar8.png';
framesCorrida[8].src = 'andar9.png';

// Controla o estado das teclas pressionadas
const teclas = {
    esquerda: false,
    direita: false,
};

class Entidade {
    constructor(x, y, largura, altura, velocidadeX = 0, velocidadeY = 0) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.velocidadeX = velocidadeX;
        this.velocidadeY = velocidadeY;
    }

    atualizar() {}
    desenhar() {}
}

class Personagem extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
        this.pulando = false;
        this.viradoParaEsquerda = false;

        this.velocidadeX = 0; // Velocidade horizontal
        this.velocidadeY = 0; // Velocidade vertical (para o pulo)
        this.aceleracao = 1.0; // Aceleração para o movimento horizontal
        this.desaceleracao = 0.95; // Desaceleração quando a tecla não é pressionada

        this.hitboxLargura = 20;
        this.hitboxAltura = 80;
        this.hitboxOffsetX = 15;  // Pequeno deslocamento horizontal da hitbox
        this.hitboxOffsetY = 10;  // Pequeno deslocamento vertical da hitbox

        this.frameAtual = 0; // Começa no primeiro frame
        this.contadorFrames = 0; // Contador para alternar os frames de animação
    }

    atualizar() {
        // Movimento horizontal suave (com aceleração e desaceleração)
        if (teclas.direita) {
            this.velocidadeX += this.aceleracao;  // Aumenta a velocidade para a direita
        } else if (teclas.esquerda) {
            this.velocidadeX -= this.aceleracao;  // Aumenta a velocidade para a esquerda
        } else {
            // Desacelera se nenhuma tecla horizontal for pressionada
            this.velocidadeX *= this.desaceleracao;
        }

        // Limita a velocidade máxima
        if (this.velocidadeX > 5) this.velocidadeX = 5;
        if (this.velocidadeX < -5) this.velocidadeX = -5;

        // Atualiza a posição do personagem horizontalmente
        this.x += this.velocidadeX;

        // Atualiza o frame da animação de corrida (se o personagem estiver se movendo)
        if (this.velocidadeX !== 0) {
            this.contadorFrames++;
            if (this.contadorFrames % 10 === 0) { // A cada 10 quadros, troca de frame
                this.frameAtual = (this.frameAtual + 1) % framesCorrida.length; // Alterna entre os frames
            }
        }

        // Movimento vertical (gravidade e pulo)
        if (this.pulando) {
            this.velocidadeY -= gravidade;
            this.y -= this.velocidadeY;

            if (this.y >= chaoY - this.altura) {
                this.y = chaoY - this.altura;
                this.velocidadeY = 0;
                this.pulando = false;
            }
        }
    }

    desenhar() {
        // Se o personagem estiver se movendo, utiliza a animação de corrida
        const img = framesCorrida[this.frameAtual];

        if (this.viradoParaEsquerda) {
            ctx.save();
            ctx.scale(-1, 1); // Inverte a imagem horizontalmente
            ctx.drawImage(img, -this.x - this.largura, this.y, this.largura, this.altura);
            ctx.restore();
        } else {
            ctx.drawImage(img, this.x, this.y, this.largura, this.altura);
        }
    }
}

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, velocidadeX) {
        super(x, y, largura, altura, velocidadeX);
    }

    atualizar() {
        this.x -= this.velocidadeX;
        if (this.x <= 0 - this.largura) {
            this.x = canvas.width;
            this.velocidadeX += 0.6;
            this.altura = (Math.random() * 50) + 100;
            this.y = chaoY - this.altura;

            // Aumenta a pontuação enquanto o obstáculo está se movendo
            if (!gameOver) {
                pontuacao++;
            }
        }
    }

    desenhar() {
        ctx.save(); // Salva o estado atual do contexto
        ctx.scale(-1, 1); // Inverte a imagem horizontalmente
        ctx.drawImage(imgObstaculo, -this.x - this.largura, this.y, this.largura, this.altura);
        ctx.restore(); // Restaura o estado do contexto

        this.hitboxLargura = 20;
        this.hitboxAltura = 20;
        this.hitboxOffsetX = 15;  // Pequeno deslocamento horizontal da hitbox
        this.hitboxOffsetY = 10;  // Pequeno deslocamento vertical da hitbox
    }
}

// Gerenciar múltiplos obstáculos
const obstaculos = [];
const numObstaculos = 5; // Número de obstáculos a serem gerados

// Função para criar obstáculos
function gerarObstaculos() {
    for (let i = 0; i < numObstaculos; i++) {
        let altura = (Math.random() * 50) + 100;
        let posX = canvas.width + (i * 300); // Espaçamento entre obstáculos
        let posY = chaoY - altura;
        let velocidadeX = 5 + (Math.random() * 2); // Velocidade aleatória para o obstáculo

        obstaculos.push(new Obstaculo(posX, posY, 130, altura, velocidadeX));
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadeY = 15;
        personagem.pulando = true;
    }
    if (e.code === 'KeyD') {
        teclas.direita = true;
    }
    if (e.code === 'KeyA') {
        teclas.esquerda = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') {
        teclas.direita = false;
    }
    if (e.code === 'KeyA') {
        teclas.esquerda = false;
    }
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (gameOver) reiniciarJogo();
});

// Carregando as imagens
const imgObstaculo = new Image();
imgObstaculo.src = 'V.png';

const imgMorte = new Image();
imgMorte.src = 'morte.png';

const imgGameOver = new Image();
imgGameOver.src = 'sofrimentio....jpg';

// Inicializando as entidades
const personagem = new Personagem(100, canvas.height - 230, 150, 150);

// Função de verificação de colisão
function verificarColisao() {
    obstaculos.forEach(obstaculo => {
        if (
            personagem.x + personagem.hitboxOffsetX < obstaculo.x + obstaculo.largura &&
            personagem.x + personagem.hitboxOffsetX + personagem.hitboxLargura > obstaculo.x &&
            personagem.y + personagem.hitboxOffsetY < obstaculo.y + obstaculo.altura &&
            personagem.y + personagem.hitboxOffsetY + personagem.hitboxAltura > obstaculo.y
        ) {
            HouveColisao();
        }
    });
}

function HouveColisao() {
    gameOver = true;
    personagem.velocidadeY = 0;
    obstaculos.forEach(obstaculo => obstaculo.velocidadeX = 0); // Para todos os obstáculos
}

function desenharGameOver() {
    ctx.drawImage(imgGameOver, canvas.width / 2 - 150, canvas.height / 2 - 75, 300, 150);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'White';
    ctx.fillText('Pontuação Final: ' + pontuacao, canvas.width / 2 - 140, canvas.height / 2 + 40);
}

function reiniciarJogo() {
    gameOver = false;
    pontuacao = 0; // Resetando a pontuação ao reiniciar o jogo
    personagem.x = 100;
    personagem.y = canvas.height - 230;
    personagem.velocidadeY = 0;
    personagem.pulando = false;
    obstaculos.length = 0; // Limpa o array de obstáculos
    gerarObstaculos(); // Gera novos obstáculos
    loop();
}

// Função para desenhar a pontuação na tela
function desenharPontuacao() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Pontuação: ' + pontuacao, 20, 40); // Exibe a pontuação no canto superior esquerdo
}

// Função principal de loop do jogo
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    obstaculos.forEach(obstaculo => {
        obstaculo.atualizar();
        obstaculo.desenhar();
    });
    personagem.atualizar();
    personagem.desenhar();
    desenharPontuacao(); // Desenha a pontuação na tela

    if (gameOver) {
        desenharGameOver();
    } else {
        verificarColisao();
        requestAnimationFrame(loop);
    }
}

// Aguardar o carregamento das imagens antes de começar o loop
framesCorrida.forEach(frame => {
    frame.onload = () => {
        if (framesCorrida.every(f => f.complete)) {
            gerarObstaculos(); // Gera obstáculos ao carregar as imagens
            loop();
        }
    };
});