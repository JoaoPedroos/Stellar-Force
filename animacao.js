// (Arquivo: animacao.js - CORRIGIDO)
function Animacao(context) {
   this.context = context;
   this.sprites = [];
   this.ligado = false;
   this.processamentos = [];
   this.spritesExcluir = [];
   this.processamentosExcluir = [];
   this.ultimoCiclo = 0;
   this.decorrido = 0;
   this.painel = null;
   this.colisor = null; // <-- CORREÇÃO: Adicionado
}
Animacao.prototype = {
   novoSprite: function(sprite) {
      this.sprites.push(sprite);
      sprite.animacao = this;
   },
   ligar: function() {
      this.ultimoCiclo = 0;
      this.ligado = true;
      this.proximoFrame();
   },
   desligar: function() {
      this.ligado = false;
   },
   proximoFrame: function() {
      if ( ! this.ligado ) return;
      var agora = new Date().getTime();
      if (this.ultimoCiclo == 0) this.ultimoCiclo = agora;
      this.decorrido = agora - this.ultimoCiclo;
      
      var ctx = this.context;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // --- ORDEM CORRIGIDA ---

      // 1. ATUALIZAR (Lógica, movimento, e marcar para exclusão)
      for (var i in this.sprites)
         this.sprites[i].atualizar();

      // 2. PROCESSAR EXCLUSÕES (Limpa os "fantasmas" ANTES de colidir)
      this.processarExclusoes(); 

      // 3. PROCESSAR (Testa colisões apenas com sprites vivos)
      if (this.processamentos) { 
         for (var i in this.processamentos)
            this.processamentos[i].processar();
      }

      // 4. DESENHAR (Desenha o que sobrou)
      for (var i in this.sprites)
         this.sprites[i].desenhar();
      
      // --- FIM DA ORDEM CORRIGIDA ---

      if (this.painel) {
         this.painel.atualizar(); 
         this.painel.desenhar();  
      }
      
      this.ultimoCiclo = agora;
      var animacao = this;
      requestAnimationFrame(function() {
         animacao.proximoFrame();
      });
   },
   novoProcessamento: function(processamento) {
      this.processamentos.push(processamento);
      processamento.animacao = this;
   },
   excluirSprite: function(sprite) {
      this.spritesExcluir.push(sprite);
   },
   excluirProcessamento: function(processamento) {
      this.processamentosExcluir.push(processamento);
   },
   processarExclusoes: function() {
      var novoSprites = [];
      var novoProcessamentos = [];
      for (var i in this.sprites) {
         if (this.spritesExcluir.indexOf(this.sprites[i]) == -1)
            novoSprites.push(this.sprites[i]);
      }
      for (var i in this.processamentos) {
         if (this.processamentosExcluir.indexOf(this.processamentos[i])
             == -1)
            novoProcessamentos.push(this.processamentos[i]);
      }
      this.spritesExcluir = [];
      this.processamentosExcluir = [];
      this.sprites = novoSprites;
      this.processamentos = novoProcessamentos;
      
      // --- CORREÇÃO: Limpa o colisor ---
      if (this.colisor) {
         this.colisor.processarExclusoes();
      }
      // --- FIM DA CORREÇÃO ---
   }
}