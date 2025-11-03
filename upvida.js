function UpVida(context, imagem) {
    this.context = context;
    this.imagem = imagem;
    
    // Usa o tamanho da imagem carregada (botao-jogar.png)
    this.largura = 60; 
    this.altura = 55;
    this.x = 0;
    this.y = 0;
    this.velocidade = 100; // Velocidade de queda (mais lento que os OVNIs)
}
UpVida.prototype = {
    atualizar: function() {
        // Move para baixo (cronometrado)
        this.y += this.velocidade * this.animacao.decorrido / 1000;
        
        // Excluir se sair da tela
        if (this.y > this.context.canvas.height) {
            this.animacao.excluirSprite(this);
            this.colisor.excluirSprite(this);
        }
    },
    
    desenhar: function() {
        var ctx = this.context;
        // Desenha a imagem (o "botão vermelho")
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    },
    
    retangulosColisao: function() {
        // Um retângulo de colisão simples do tamanho da imagem
        return [ 
            {x: this.x, y: this.y, largura: this.largura, altura: this.altura} 
        ];
    },
    
    colidiuCom: function(outro) {
        // A lógica de "pegar" o item será tratada pela Nave
    }
}