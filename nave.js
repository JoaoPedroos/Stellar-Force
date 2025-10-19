function Nave(context, teclado, imagem, imgExplosao) {
   this.context = context;
   this.teclado = teclado;
   this.imagem = imagem;
   this.x = 0;
   this.y = 0;
   this.velocidade = 200; // Aumentei um pouco para teste
   this.spritesheet = new Spritesheet(context, imagem, 3, 2);
   this.spritesheet.linha = 0;
   this.spritesheet.intervalo = 100;
   this.imgExplosao = imgExplosao;
   this.acabaramVidas = null;
   this.vidasExtras = 3;
   
   this.intervaloTiro = 100; // Aumentei para não atirar tão rápido
   
   // OTIMIZAÇÃO 3: Usar performance.now()
   this.ultimoTiro = 0;
   
   this.trocaT = 0;

   // OTIMIZAÇÃO 2: Pré-alocar os retângulos de colisão
   this._retangulosColisao = [
      { x: 0, y: 0, largura: 9, altura: 13 },
      { x: 0, y: 0, largura: 10, altura: 33 },
      { x: 0, y: 0, largura: 9, altura: 13 }
   ];
}

Nave.prototype = {
   atualizar: function () {
      var incremento = this.velocidade * this.animacao.decorrido / 1000;

      // Movimentação
      if (this.teclado.pressionada(SETA_A) && this.x > 0) this.x -= incremento;
      if (this.teclado.pressionada(SETA_D) && this.x < this.context.canvas.width - 36) this.x += incremento;
      if (this.teclado.pressionada(SETA_W) && this.y > 0) this.y -= incremento;
      if (this.teclado.pressionada(SETA_S) && this.y < this.context.canvas.height - 48) this.y += incremento;
      
      // OTIMIZAÇÃO 4: Lógica de troca de tiro separada
      if(this.teclado.pressionada(BARRA)){
         this.trocaT = 1;
      } else if(this.teclado.pressionada(PONTO)){
         this.trocaT = 2;
      } else if(this.teclado.pressionada(SETA_ESQUERDA)){
         this.trocaT = 3;
      } else if(this.teclado.pressionada(SETA_DIREITA)){
         this.trocaT = 4;
      } else {
         this.trocaT = 0;
      }

      // Lógica de Atirar
      if (this.teclado.pressionada(ESPACO)) {
         // OTIMIZAÇÃO 3: Usar performance.now()
         var agora = performance.now(); 
         if (agora - this.ultimoTiro > this.intervaloTiro) {
            this.atirar();
            this.ultimoTiro = agora;
         }
      }
   },
   desenhar: function () {
      // ... (seu código de desenhar está bom) ...
      this.spritesheet.desenhar(this.x, this.y);
      this.spritesheet.proximoQuadro();
   },
   atirar: function () {
      var t = new Tiro(this.context, this);
      this.animacao.novoSprite(t);
      this.colisor.novoSprite(t);
   },
   retangulosColisao: function () {
      // Estes valores vão sendo ajustados aos poucos
      var rets =
         [
            { x: this.x + 2, y: this.y + 19, largura: 9, altura: 13 },
            { x: this.x + 13, y: this.y + 3, largura: 10, altura: 33 },
            { x: this.x + 25, y: this.y + 19, largura: 9, altura: 13 }
         ];

      // Desenhando os retângulos para visualização
      /*
      var ctx = this.context;
      
      for (var i in rets) {
         ctx.save();
         ctx.strokeStyle = 'yellow';
         ctx.strokeRect(rets[i].x, rets[i].y, rets[i].largura, 
                        rets[i].altura);
         ctx.restore();
      }
      */
   },
   colidiuCom: function (outro) {
      // Se colidiu com um Ovni...
      if (outro instanceof Ovni) {
         this.animacao.excluirSprite(this);
         this.animacao.excluirSprite(outro);
         this.colisor.excluirSprite(this);
         this.colisor.excluirSprite(outro);

         var exp1 = new Explosao(this.context, this.imgExplosao,
            this.x, this.y);
         var exp2 = new Explosao(this.context, this.imgExplosao,
            outro.x, outro.y);

         this.animacao.novoSprite(exp1);
         this.animacao.novoSprite(exp2);

         var nave = this;
         exp1.fimDaExplosao = function () {
            nave.vidasExtras--;

            if (nave.vidasExtras < 0) {
               if (nave.acabaramVidas) nave.acabaramVidas();
            }
            else {
               // Recolocar a nave no engine
               nave.colisor.novoSprite(nave);
               nave.animacao.novoSprite(nave);

               nave.posicionar();
            }
         }
      }
   },
   posicionar: function () {
      var canvas = this.context.canvas;
      this.x = canvas.width / 2 - 18;  // 36 / 2
      this.y = canvas.height - 48;
   }
}