// (Arquivo: menu.js - CORRIGIDO)
function Menu(context, teclado, animacao) {
    this.context = context;
    this.teclado = teclado;
    this.animacao = animacao;
    
    this.options = ['JOGAR', 'OPÇÕES', 'CRÉDITOS', 'SAIR'];
    this.selected = 0;
    
    // Posição do menu na tela
    this.x = 100;
    this.y = 300; // Posição Y dos botões
    
    // Cores
    this.corTexto = '#FFF';
    this.corSelecionado = 'orange';
    
    // Posição inicial da navezinha no menu
    nave.x = 400;
    nave.y = 320;

    // Configura os botões do menu
    this.configurarTeclado();
}

Menu.prototype = {
    configurarTeclado: function() {
        var menu = this;
        // Limpa teclas de pause/tiro
        this.teclado.disparou(ESPACO, null);
        this.teclado.disparou(ENTER, null);
        
        // Configura as novas ações
        this.teclado.disparou(SETA_ACIMA, function() {
            menu.opcaoAnterior();
        });
        this.teclado.disparou(SETA_ABAIXO, function() {
            menu.proximaOpcao();
        });
        this.teclado.disparou(ENTER, function() {
            menu.selecionar();
        });
    },
    
    opcaoAnterior: function() {
        this.selected--;
        if (this.selected < 0) {
            this.selected = this.options.length - 1;
        }
    },
    
    proximaOpcao: function() {
        this.selected++;
        if (this.selected >= this.options.length) {
            this.selected = 0;
        }
    },
    
    selecionar: function() {
        switch (this.selected) {
            case 0: // JOGAR
                iniciarPartida();
                break;
            case 1: // OPÇÕES
                iniciarOpcoes(); // <-- CHAMA A NOVA FUNÇÃO
                break;
            case 2: // CRÉDITOS
                iniciarCreditos(); // <-- CHAMA A NOVA FUNÇÃO
                break;
            case 3: // SAIR
                // (Opcional: Sair do jogo/fechar a aba)
                window.refresh(); 
                break;
        }
    },
    atualizar: function() {
        // Faz a "navezinha" do menu flutuar
        var agora = new Date().getTime();
        var flutuacao = Math.sin(agora / 1000) * 10; 
        nave.y = 320 + flutuacao;
    },
    
    desenhar: function() {
        var ctx = this.context;
        ctx.save();
        
        // --- TÍTULO "STELLAR FORCE" (Fonte Corrigida) ---
        ctx.font = '50px "Press Start 2P", monospace';
        ctx.fillStyle = this.corSelecionado;
        ctx.textAlign = 'center';
        var xCentro = ctx.canvas.width / 2;
        ctx.fillText('STELLAR', xCentro, 120);
        ctx.fillText('FORCE', xCentro, 190);

        // --- BOTÕES DO MENU (Fonte Corrigida) ---
        ctx.font = '24px "Press Start 2P", monospace';
        
        for (var i = 0; i < this.options.length; i++) {
            if (i == this.selected) {
                ctx.fillStyle = this.corSelecionado;
                ctx.textAlign = 'right';
                ctx.fillText('▸', this.x - 20, this.y + (i * 50));
            } else {
                ctx.fillStyle = this.corTexto;
            }
            ctx.textAlign = 'left';
            ctx.fillText(this.options[i], this.x, this.y + (i * 50));
        }
        
        ctx.restore();
    },
    
    retangulosColisao: function() { return []; },
    colidiuCom: function(outro) { }
}