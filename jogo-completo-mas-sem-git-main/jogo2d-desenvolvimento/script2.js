const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');
const gravidade = 0.2;
const chaoY = canvas.height - 80;
let gameOver = false;
let pontuacao = 0; // Variável para armazenar a pontuação

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

        this.hitboxLargura = 20;
        this.hitboxAltura = 80;
        this.hitboxOffsetX = 15;  // Pequeno deslocamento horizontal da hitbox
        this.hitboxOffsetY = 10;  // Pequeno deslocamento vertical da hitbox
    }

    atualizar() {
        if (this.pulando) {
            this.velocidadeY -= gravidade;
            this.y -= this.velocidadeY;
            if (this.y >= canvas.height - 230) {
                this.y = canvas.height - 230;
                this.pulando = false;
                this.velocidadeY = 0;
            }
        }
    }

    desenhar() {
        const img = this.pulando ? imgPersonagemPulo : imgPersonagem;
        if (this.viradoParaEsquerda) {
            ctx.save();
            ctx.scale(-1, 1);
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
            this.velocidadeX += 0.5;
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

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadeY = 15;
        personagem.pulando = true;
    }
    if (e.code === 'KeyD') {
        personagem.x += 10;
        personagem.viradoParaEsquerda = false;
    }
    if (e.code === 'KeyA') {
        personagem.x -= 10;
        personagem.viradoParaEsquerda = true;
    }
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (gameOver) reiniciarJogo();
});

// Carregando as imagens
const imgPersonagem = new Image();
imgPersonagem.src = 'download (1).png';

const imgPersonagemPulo = new Image();
imgPersonagemPulo.src = 'download (2).png';

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
imgPersonagem.onload = imgPersonagemPulo.onload = imgObstaculo.onload = imgGameOver.onload = () => {
    gerarObstaculos(); // Gera obstáculos ao carregar as imagens
    loop();
};