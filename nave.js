// (Arquivo: nave.js - CORRIGIDO)
function Nave(context, teclado, imagem, imgExplosao) {
   this.context = context;
   this.teclado = teclado;
   this.imagem = imagem;
   this.x = 0;
   this.y = 0;
   this.velocidade = 200;
   this.escala = 1.25; 
   var larguraBase = imagem.width / 2;
   var alturaBase = imagem.height / 3;
   this.largura = larguraBase * this.escala; 
   this.altura = alturaBase * this.escala;  
   this.spritesheet = new Spritesheet(context, imagem, 3, 2);
   this.spritesheet.linha = 0;
   this.spritesheet.intervalo = 100;
   this.spritesheet.escala = this.escala; 
   this.imgExplosao = imgExplosao;
   this.acabaramVidas = null;
   this.vidasExtras = 2; //
   this.intervaloTiro = 100; 
   this.ultimoTiro = 0;
   this.trocaT = 0;
}
Nave.prototype = {
   atualizar: function () {
      // Animação da nave parada no menu
      if (this.velocidade == 0) { 
         this.spritesheet.linha = 0;
         this.spritesheet.proximoQuadro();
         return;
      }
      
      var incremento = this.velocidade * this.animacao.decorrido / 1000;
      var canvas = this.context.canvas;

      if (this.teclado.pressionada(SETA_A) && this.x > 0) 
         this.x -= incremento;
      if (this.teclado.pressionada(SETA_D) && this.x < canvas.width - this.largura)
         this.x += incremento;
      if (this.teclado.pressionada(SETA_W) && this.y > 0) 
         this.y -= incremento;
      if (this.teclado.pressionada(SETA_S) && this.y < canvas.height - this.altura)
         this.y += incremento;
      
      if(this.teclado.pressionada(BARRA)){ this.trocaT = 1; } 
      else if(this.teclado.pressionada(PONTO)){ this.trocaT = 2; } 
      else if(this.teclado.pressionada(SETA_ESQUERDA)){ this.trocaT = 3; } 
      else if(this.teclado.pressionada(SETA_DIREITA)){ this.trocaT = 4; } 
      else { this.trocaT = 0; }
      
      // Lógica de Animação da Nave (do PDF)
      if (this.teclado.pressionada(SETA_A)) {
         this.spritesheet.linha = 1;
      } else if (this.teclado.pressionada(SETA_D)) {
         this.spritesheet.linha = 2;
      } else {
         this.spritesheet.linha = 0;
      }
      this.spritesheet.proximoQuadro();

      if (this.teclado.pressionada(ESPACO)) {
         var agora = performance.now(); 
         if (agora - this.ultimoTiro > this.intervaloTiro) {
            this.atirar();
            this.ultimoTiro = agora;
         }
      }
   },
   desenhar: function () {
      this.spritesheet.desenhar(this.x, this.y);
      // 'proximoQuadro' movido para 'atualizar'
   },
   atirar: function () {
      var t = new Tiro(this.context, this);
      this.animacao.novoSprite(t);
      this.colisor.novoSprite(t);
   },
   retangulosColisao: function () {
      var rets =
         [
            { x: this.x + (2 * this.escala), y: this.y + (19 * this.escala), largura: 9 * this.escala, altura: 13 * this.escala },
            { x: this.x + (13 * this.escala), y: this.y + (3 * this.escala), largura: 10 * this.escala, altura: 33 * this.escala },
            { x: this.x + (25 * this.escala), y: this.y + (19 * this.escala), largura: 9 * this.escala, altura: 13 * this.escala }
         ];
      return rets;
   },

   colidiuCom: function (outro) {
      
      if (outro instanceof Ovni) {
         this.animacao.excluirSprite(this);
         this.animacao.excluirSprite(outro);
         this.colisor.excluirSprite(this);
         this.colisor.excluirSprite(outro);
         var exp1 = new Explosao(this.context, this.imgExplosao, this.x, this.y);
         var exp2 = new Explosao(this.context, this.imgExplosao, outro.x, outro.y);
         this.animacao.novoSprite(exp1);
         this.animacao.novoSprite(exp2);
         var nave = this;
         exp1.fimDaExplosao = function () {
            nave.vidasExtras--;
            if (nave.vidasExtras < 0) {
               if (nave.acabaramVidas) nave.acabaramVidas();
            } else {
               nave.colisor.novoSprite(nave);
               nave.animacao.novoSprite(nave);
               nave.posicionar();
            }
         }
      }
      else if (outro instanceof InimigoTanque || outro instanceof TiroInimigo) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
         if (outro instanceof TiroInimigo) {
             this.animacao.excluirSprite(outro);
             this.colisor.excluirSprite(outro);
         }
         var exp1 = new Explosao(this.context, this.imgExplosao, this.x, this.y);
         this.animacao.novoSprite(exp1);
         var nave = this;
         exp1.fimDaExplosao = function () {
            nave.vidasExtras--; 
            if (nave.vidasExtras < 0) {
               if (nave.acabaramVidas) nave.acabaramVidas();
            } else {
               nave.colisor.novoSprite(nave);
               nave.animacao.novoSprite(nave);
               nave.posicionar();
            }
         }
      }
      
      // --- CORREÇÃO: Colisão com UpVida ---
      else if (outro instanceof UpVida) { //
          if (this.vidasExtras < 3) { // Máximo de 3 vidas
              this.vidasExtras++; 
          }
          this.animacao.excluirSprite(outro);
          this.colisor.excluirSprite(outro);
      }
      // --- FIM DA CORREÇÃO ---
   },
   
   posicionar: function () {
      var canvas = this.context.canvas;
      this.x = canvas.width / 2 - (this.largura / 2); 
      this.y = canvas.height - (this.altura + 12); 
   }
}