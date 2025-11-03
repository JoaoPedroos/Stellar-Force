// (Arquivo NOVO: tela-info.js)

function TelaInfo(context, teclado, titulo, imagem, textos) {
    this.context = context;
    this.teclado = teclado;
    this.titulo = titulo;
    this.imagem = imagem; // Imagem (para tela de Opções)
    this.textos = textos; // Array de textos (para Créditos)
    
    // Configura o teclado (ENTER para voltar)
    this.configurarTeclado();
}

TelaInfo.prototype = {
    configurarTeclado: function() {
        var tela = this;
        
        // Limpa outras ações
        this.teclado.disparou(ENTER, null);
        this.teclado.disparou(SETA_ACIMA, null);
        this.teclado.disparou(SETA_ABAIXO, null);
        
        // ENTER volta ao menu principal
        this.teclado.disparou(ENTER, function() {
            iniciarMenu(); // (Função do index.html)
        });
    },

    atualizar: function() {
        // Nada para atualizar, é uma tela estática
    },

    desenhar: function() {
        var ctx = this.context;
        ctx.save();
        
        var xCentro = ctx.canvas.width / 2;

        // --- 1. Título ---
        // (Usamos fonte segura 'monospace' para evitar tela preta)
        ctx.font = '50px "Press Start 2P", monospace';
        ctx.fillStyle = 'orange';
        ctx.textAlign = 'center';
        ctx.fillText(this.titulo, xCentro, 120);

        // --- 2. Desenha a Imagem (Se existir) ---
        if (this.imagem && this.imagem.width > 0) {
            var img = this.imagem;
            // Centraliza a imagem
            var xImg = (ctx.canvas.width - img.width) / 2;
            ctx.drawImage(img, xImg, 180);
        }
        
        // --- 3. Desenha os Textos (Se existir) ---
        if (this.textos) {
            ctx.font = '16px "Press Start 2P", monospace';
            ctx.fillStyle = '#FFF';
            ctx.textAlign = 'center';
            
            var yTexto = 250; // Posição Y inicial
            for (var i = 0; i < this.textos.length; i++) {
                ctx.fillText(this.textos[i], xCentro, yTexto);
                yTexto += 40; // Próxima linha
            }
        }
        
        // --- 4. Instrução para Voltar ---
        ctx.font =  '16px "Press Start 2P", monospace';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.fillText("Pressione [ENTER] para Voltar", xCentro, ctx.canvas.height - 40);

        ctx.restore();
    },

    // Funções obrigatórias para ser um 'sprite'
    retangulosColisao: function() { return []; },
    colidiuCom: function(outro) { }
}