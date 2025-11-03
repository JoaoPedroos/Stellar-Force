/*
 * fundo.js
 * Lógica de looping contínuo (spritesheet) - CORRIGIDA
 */
function Fundo(context, imagem) {
   this.context = context;
   this.imagem = imagem;
   this.velocidade = 0;
   this.posicaoEmenda = 0; // Posição Y (0 = topo da imagem)
   
   // Propriedades para guardar o tamanho proporcional
   this.scaledHeight = 0;
}
Fundo.prototype = {
   
   // Função para calcular o tamanho proporcional
   calcularTamanho: function() {
      if (this.imagem.height == 0) return;
      
      var canvasWidth = this.context.canvas.width;
      // Calcula a altura que a imagem deve ter para 
      // caber na largura do canvas (600px) MANTENDO A PROPORÇÃO.
      this.scaledHeight = this.imagem.height * (canvasWidth / this.imagem.width);
   },

   atualizar: function() {
      // Calcula o tamanho (só por garantia, caso a imagem demore a carregar)
      if (this.scaledHeight == 0) this.calcularTamanho();
      if (this.scaledHeight == 0) return; // Sai se a imagem não carregou

      // Aplica a velocidade (cronometrada)
      this.posicaoEmenda += 
         this.velocidade * this.animacao.decorrido / 1000;
      
      // --- CORREÇÃO DO LOOP AQUI ---
      // Se a emenda passou da altura, subtrai a altura (em vez de resetar)
      // Isso faz o loop ser perfeito, sem "saltos".
      if (this.posicaoEmenda > this.scaledHeight) {
         this.posicaoEmenda -= this.scaledHeight; 
      }
      // --- FIM DA CORREÇÃO ---
   },
   
   desenhar: function() {
      // Se o tamanho ainda não foi calculado, tenta de novo
      if (this.scaledHeight == 0) this.calcularTamanho();
      if (this.scaledHeight == 0) return; // Sai se a imagem não carregou

      var img = this.imagem;
      var canvasWidth = this.context.canvas.width;
      
      // Lógica de desenhar duas vezes (conforme PDF Cap. 6.1) 
      
      // Primeira cópia (acima)
      var posicaoY = this.posicaoEmenda - this.scaledHeight;
      this.context.drawImage(img, 0, posicaoY, canvasWidth, this.scaledHeight);
      
      // Segunda cópia (principal)
      posicaoY = this.posicaoEmenda;
      this.context.drawImage(img, 0, posicaoY, canvasWidth, this.scaledHeight);     
   }
}