// (Arquivo: painel.js - CORRIGIDO)
function Painel(context, nave) {
   this.context = context;
   this.nave = nave;
   this.spritesheet = new Spritesheet(context, nave.imagem, 3, 2);
   this.pontuacao = 0;
   
   this.imagemCoracao = new Image();
   this.imagemCoracao.src = 'img/coracao.png';
}
Painel.prototype = {
   atualizar: function() {
      
   },
   desenhar: function() {
      var ctx = this.context;
      
      // 1. Desenhar corações de vida (Maiores)
      var x = 10;
      var y = 8; 
      var tamanhoCoracao = 30; 
      var espacamento = 35; 
      
      for (var i = 1; i <= this.nave.vidasExtras; i++) {
         ctx.drawImage(this.imagemCoracao, x, y, tamanhoCoracao, tamanhoCoracao);
         x += espacamento; 
      }
      
      // 2. Pontuação (Fonte Corrigida)
      ctx.save();
      ctx.fillStyle = 'white';
      
      // --- CORREÇÃO DA FONTE ---
      ctx.font = '24px "Press Start 2P", monospace'; 
      
      var xPontuacao = 10 + (3 * espacamento); 
      var yPontuacao = 31; 
      
      ctx.fillText(this.pontuacao, xPontuacao, yPontuacao);
      ctx.restore();   
   }
}