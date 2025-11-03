/**
 * Objeto Ovni (Inimigo Padrão)
 */
function Ovni(context, imagem, imgExplosao) {
    this.context = context;
    this.imagem = imagem;
    this.imgExplosao = imgExplosao;
    this.x = 0;
    this.y = 0;
    this.velocidade = 0;
    this.vPontos = 1500; 

    // --- ADICIONADO ---
    this.escala = 1.25; // Aumenta 25%
    this.largura = imagem.width * this.escala;
    this.altura = imagem.height * this.escala;
}
Ovni.prototype = {
    atualizar: function() {
        this.y += this.velocidade * this.animacao.decorrido / this.vPontos;

        // Aumenta a velocidade conforme a pontuação do jogador
        if (painel.pontuacao >= 500) {
            this.vPontos = 800;
        } else if (painel.pontuacao >= 300) {
            this.vPontos = 900;
        } else if (painel.pontuacao >= 200) {
            this.vPontos = 1000;
        }else if (painel.pontuacao >= 100) {
            this.vPontos = 1200;
        }

        // Excluir o Ovni quando ele sai da tela
        if (this.y > this.context.canvas.height) {
            this.animacao.excluirSprite(this);
            this.colisor.excluirSprite(this);
        }
    },
    desenhar: function() {
        var ctx = this.context;
        // --- MUDANÇA AQUI ---
        // Desenha com o novo tamanho
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    },
    retangulosColisao: function() {
        // --- MUDANÇA NA COLISÃO (ESCALADA) ---
        // Valores originais: 20, 1, 25, 10 / 2, 11, 60, 12 / 20, 23, 25, 7
        var rets = [
            { x: this.x + (20 * this.escala), y: this.y + (1 * this.escala), largura: 25 * this.escala, altura: 10 * this.escala },
            { x: this.x + (2 * this.escala), y: this.y + (11 * this.escala), largura: 60 * this.escala, altura: 12 * this.escala },
            { x: this.x + (20 * this.escala), y: this.y + (23 * this.escala), largura: 25 * this.escala, altura: 7 * this.escala },
        ];
        return rets;
    },
    colidiuCom: function(outro) {
        // Se colidiu com um Tiro, ambos são destruídos
        if (outro instanceof Tiro) {
            this.animacao.excluirSprite(this);
            this.colisor.excluirSprite(this);
            this.animacao.excluirSprite(outro);
            this.colisor.excluirSprite(outro);

            var explosao = new Explosao(this.context, this.imgExplosao, this.x, this.y);
            this.animacao.novoSprite(explosao);
        }
    }
}

// ===================================================================
// INIMIGO TANQUE (Sem Escala, mantém tamanho fixo)
// ===================================================================

function InimigoTanque(context, imagem, imgExplosao) {
    this.context = context; 
    this.imagem = imagem;         
    this.imgExplosao = imgExplosao; 
    this.x = 0;
    this.y = 0;
    this.velocidade = 120;        
    this.largura = 100; // Tamanho fixo
    this.altura = 100;  // Tamanho fixo          
    this.vida = 100;                
    this.vidaMaxima = 100;
    this.vPontos = 1000;          
    this.yParada = 50; 
    this.tempoParaPrimeiroTiro = 3000;
    this.intervaloTiro = 1000;
    this.ultimoTiro = new Date().getTime(); 
}
// ... (O restante de InimigoTanque e TiroInimigo são iguais aos arquivos anteriores) ...
InimigoTanque.prototype = {
    atualizar: function() {
        if (this.y < this.yParada) {
            var incremento = this.velocidade * this.animacao.decorrido / this.vPontos;
            this.y += incremento;
            if (this.y > this.yParada) {
                this.y = this.yParada;
            }
        }
        if (painel.pontuacao >= 500) this.vPontos = 700;
        else if (painel.pontuacao >= 400) this.vPontos = 800;
        else if (painel.pontuacao >= 300) this.vPontos = 900;
        else if (painel.pontuacao >= 200) this.vPontos = 1000;
        else if (painel.pontuacao >= 100) this.vPontos = 1200;
        
        var agora = new Date().getTime();
        if (this.tempoParaPrimeiroTiro > 0) {
            this.tempoParaPrimeiroTiro -= this.animacao.decorrido;
        }
        else {
            if (agora - this.ultimoTiro > this.intervaloTiro) {
                this.atirar();
                this.ultimoTiro = agora;
            }
        }
    },
    desenhar: function() {
        var ctx = this.context;
        var img = this.imagem; 
        ctx.save(); 
        ctx.drawImage(img, this.x, this.y, this.largura, this.altura); 
        var barraLargura = 60;
        var barraAltura = 7;
        var barraX = (this.x + this.largura / 2) - (barraLargura / 2);
        var barraY = this.y - 15; 
        ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        ctx.fillRect(barraX, barraY, barraLargura, barraAltura);
        var vidaPercent = this.vida / this.vidaMaxima;
        if (vidaPercent > 0.6) ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
        else if (vidaPercent > 0.3) ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
        else ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.fillRect(barraX, barraY, barraLargura * vidaPercent, barraAltura);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barraX, barraY, barraLargura, barraAltura);
        ctx.restore(); 
    },
    atirar: function() {
        var xTiro = this.x + this.largura / 2 - 2;
        var yTiro = this.y + this.altura; 
        var tiro = new TiroInimigo(this.context, xTiro, yTiro);
        this.animacao.novoSprite(tiro);
        this.colisor.novoSprite(tiro);
    },
    retangulosColisao: function() {
        var rets = [ 
            {x: this.x + 30, y: this.y + 10, largura: 40, altura: 20},
            {x: this.x + 10, y: this.y + 30, largura: 80, altura: 40},
            {x: this.x + 30, y: this.y + 70, largura: 40, altura: 20},
        ];
        return rets;
    },
    colidiuCom: function(outro) {
        if (outro instanceof Tiro) {
            this.vida--; 
            this.animacao.excluirSprite(outro);
            this.colisor.excluirSprite(outro);
            if (this.vida <= 0) {
                this.animacao.excluirSprite(this);
                this.colisor.excluirSprite(this);
                var explosao = new Explosao(this.context, this.imgExplosao, 
                                            this.x, this.y);
                this.animacao.novoSprite(explosao);
            }
        }
    }
}

function TiroInimigo(context, x, y) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.largura = 4;
    this.altura = 15;
    this.velocidade = 150;
    this.cor = 'red';
}
TiroInimigo.prototype = {
    atualizar: function() {
        this.y += this.velocidade * this.animacao.decorrido / 1000;
        if (this.y > this.context.canvas.height) {
            this.animacao.excluirSprite(this);
            this.colisor.excluirSprite(this);
        }
    },
    desenhar: function() {
        var ctx = this.context;
        ctx.save();
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        ctx.restore();
    },
    retangulosColisao: function() {
        return [ {x: this.x, y: this.y, largura: this.largura, altura: this.altura} ];
    },
    colidiuCom: function(outro) {}
}