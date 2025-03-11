const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');
const gravidade = 0.3;
const chaoY = canvas.height - 80;
let gameOver = false;

const personagem = {
    x: 100,
    y: canvas.height - 230,
    altura: 150,
    largura: 150,
    velocidadey: 0,
    pulando: false,
    viradoParaEsquerda: false,
};

const obstaculo = {
    x: 850,
    y: chaoY - 100,
    largura: 130,
    altura: 100,
    velocidadex: 5,
};

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadey = 15;
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
    if (gameOver) {
        reiniciarJogo();
    }
});

const imgPersonagem = new Image();
imgPersonagem.src = 'download (1).png';

const imgPersonagemPulo = new Image();  
imgPersonagemPulo.src = 'download (2).png';

const imgObstaculo = new Image();
imgObstaculo.src = 'download (1).png'; 

const imgMorte = new Image();
imgMorte.src = 'morte.png';

const imgGameOver = new Image();
imgGameOver.src = 'sofrimentio....jpg';

function desenharObstaculo() {
    ctx.drawImage(imgObstaculo, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
}

function atualizarObstaculo() {
    obstaculo.x -= obstaculo.velocidadex;
    if (obstaculo.x <= 0 - obstaculo.largura) {
        obstaculo.x = canvas.width;
        obstaculo.velocidadex += 0.5;
        let nova_altura = (Math.random() * 50) + 100;
        obstaculo.altura = nova_altura;
        obstaculo.y = chaoY - obstaculo.altura;
    }
}

function verificarColisao() {
    if (
        personagem.x < obstaculo.x + obstaculo.largura &&
        personagem.x + personagem.largura > obstaculo.x &&
        personagem.y < obstaculo.y + obstaculo.altura &&
        personagem.y + personagem.altura > obstaculo.y
    ) {
        HouveColisao();
    }
}

function HouveColisao() {
    gameOver = true;
    personagem.velocidadey = 0;
    obstaculo.velocidadex = 0;
}

function desenharGameOver() {
    ctx.drawImage(imgGameOver, canvas.width / 2 - 150, canvas.height / 2 - 75, 300, 150);
}

function reiniciarJogo() {
    gameOver = false;
    personagem.x = 100;
    personagem.y = canvas.height - 230;
    personagem.velocidadey = 0;
    personagem.pulando = false;
    obstaculo.x = 850;
    obstaculo.velocidadex = 5;
    loop();
}

function desenharPersonagem() {
    if (personagem.viradoParaEsquerda) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(imgPersonagem, -personagem.x - personagem.largura, personagem.y, personagem.largura, personagem.altura);
        ctx.restore();
    } else {
        ctx.drawImage(imgPersonagem, personagem.x, personagem.y, personagem.largura, personagem.altura);
    }
}

function atualizarPersonagem() {
    if (personagem.pulando) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;
        if (personagem.y >= canvas.height - 230) {
            personagem.y = canvas.height - 230;
            personagem.pulando = false;
            personagem.velocidadey = 0;
        }
    }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharObstaculo();
    desenharPersonagem();
    atualizarPersonagem();
    atualizarObstaculo();
    if (gameOver) {
        desenharGameOver();
    } else {
        verificarColisao();
        requestAnimationFrame(loop);
    }
}

loop();
