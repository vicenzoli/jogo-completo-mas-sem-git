const canva = document.getElementById('jogo2d')
const ctx = canva.getContext('2d')
let gameOver = false 
 
class Entidade {
    #gravidade
    constructor(x, y, largura, altura){
    this.x  = x
    this.y = y
    this.largura = largura
    this.altura = altura
    this.#gravidade = 0.5
    
}
get gravidade(){
    return this.#gravidade
}
}

desenhar = function (cor){
    ctx.fillStyle = cor
    ctx.fillRect(this.x, this.y, this.largura, this.altura)

}



class personagem extends Entidade {
    constructor (x, y, largura, altura){
        super (x, y, largura, altura)
    }
}

class obstaculo extends Entidade{
    constructor (x, y, largura, altura){
        super (x, y, largura, altura)
    }
}

const personagem = new personagem(100, canvas.height - 230, 150, 150) 
    
   


const x = new Entidade (10, 20, 30, 50)
console.log(x.gravidade)

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

function loop() {
    if (gameover == false){

    
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
}
loop();