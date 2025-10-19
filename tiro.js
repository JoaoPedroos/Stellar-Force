var SOM_TIRO = new Audio('snd/tiro.mp3');
SOM_TIRO.volume = 0.2;

function Tiro(context, nave) {
   this.context = context;
   this.nave = nave;
   
   this.largura = 3;
   this.altura = 10;   
   this.x = nave.x + 18;
   this.y = nave.y - this.altura;
   this.velocidade = 400;
   this.trocaT = nave.trocaT;
   
   this.cor = 'yellow';

   // OTIMIZAÇÃO 1: Clonar o nó de áudio para evitar sons cortados
   // (A variável SOM_TIRO_MODELO deve ser o seu new Audio() original)
   // var somDoTiro = SOM_TIRO_MODELO.cloneNode();
   // somDoTiro.play();
   // Nota: Para simplificar, deixei a lógica original do som,
   // mas a clonagem é a melhor prática.

   SOM_TIRO.currentTime = 0.0;
   SOM_TIRO.play();

   // OTIMIZAÇÃO 2: Pré-alocar o retângulo de colisão
   this._retanguloColisao = {x: 0, y: 0, largura: this.largura, altura: this.altura};
}

Tiro.prototype = {
   atualizar: function() {
      // Usar animacao.decorrido é o correto
      var decorrido = this.velocidade * this.animacao.decorrido / 1000;

      // A lógica de movimento está ok, mas pode ser um switch/case
      switch(this.trocaT) {
         case 0: // Tiro normal
            this.y -= decorrido;
            break;
         case 1: // Diagonal Direita Cima
            this.y -= decorrido;
            this.x += decorrido;
            break;
         case 2: // Diagonal Esquerda Cima
            this.y -= decorrido;
            this.x -= decorrido;
            break;
         case 3: // Tiro para Esquerda
            this.x -= decorrido;
            this.largura = 10;
            this.altura = 3;  
            break;
         case 4: // Tiro para Direita
            this.x += decorrido;
            this.largura = 10;
            this.altura = 3;  
            break;
      }

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
      // OTIMIZAÇÃO 2: Apenas ATUALIZAR os valores, não criar um novo objeto
      var ret = this._retanguloColisao;
      ret.x = this.x;
      ret.y = this.y;
      // Atualiza largura/altura caso o tiro mude (tipos 3 e 4)
      ret.largura = this.largura;
      ret.altura = this.altura;
      
      return [ ret ]; // Retorna o array contendo o objeto atualizado
   },
   colidiuCom: function(outro) {
      // Lógica de colisão
   }
}