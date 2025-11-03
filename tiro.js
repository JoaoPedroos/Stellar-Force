var SOM_TIRO = new Audio('snd/tiro.mp3');
SOM_TIRO.volume = 0.2;
SOM_TIRO.load();

function Tiro(context, nave) {
   this.context = context;
   this.nave = nave;
   
   this.largura = 3;
   this.altura = 10;   
   
   // --- MUDANÇA AQUI ---
   // Calcula o centro da nave (que agora é maior)
   this.x = nave.x + (nave.largura / 2) - (this.largura / 2);
   // --- FIM DA MUDANÇA ---
   
   this.y = nave.y - this.altura;
   this.velocidade = 400;
   this.trocaT = nave.trocaT;
   
   this.cor = 'yellow';

   SOM_TIRO.currentTime = 0.0;
   SOM_TIRO.play();

   this._retanguloColisao = {x: 0, y: 0, largura: this.largura, altura: this.altura};
}

Tiro.prototype = {
   atualizar: function() {
      var decorrido = this.velocidade * this.animacao.decorrido / 1000;

      switch(this.trocaT) {
         case 0: // Tiro normal
            this.y -= decorrido;
            break;
         case 1: // Diagonal Direita Cima (/)
            this.y -= decorrido;
            this.x += decorrido;
            break;
         case 2: // Diagonal Esquerda Cima (.)
            this.y -= decorrido;
            this.x -= decorrido;
            break;
         case 3: // Tiro para Esquerda (Seta Esquerda)
            this.x -= decorrido;
            this.largura = 10;
            this.altura = 3;  
            break;
         case 4: // Tiro para Direita (Seta Direita)
            this.x += decorrido;
            this.largura = 10;
            this.altura = 3;  
            break;
      }

      // Excluir se sair da tela
      if (this.y < -this.altura || this.x < -this.largura || this.x > this.context.canvas.width) {
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
      var ret = this._retanguloColisao;
      ret.x = this.x;
      ret.y = this.y;
      ret.largura = this.largura;
      ret.altura = this.altura;
      
      return [ ret ]; 
   },
   colidiuCom: function(outro) {
      // Lógica de colisão
   }
}