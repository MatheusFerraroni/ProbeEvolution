var ground = null;
var probes = [];
var controlador = null;
var controladoraGeral = {};
controladoraGeral.probes = {};
controladoraGeral.tiles  = {};
controladoraGeral.geral  = {};
controladoraGeral.probes.qtdMaxima = 100;
controladoraGeral.probes.fator_movimento = 60;
controladoraGeral.probes.size = 60;
controladoraGeral.probes.taxa_perda_vida = 60;
controladoraGeral.probes.velocidade_giro = 60;
controladoraGeral.probes.velocidade_padrao = 60;
controladoraGeral.probes.velocidade_correndo = 60;
controladoraGeral.tiles.fator_ganha_comida  = 60;
controladoraGeral.tiles.chance_bonus  = 60;
controladoraGeral.tiles.fertilidade_modifier  = 60;
controladoraGeral.atualiza = atualizaInputsValores;

function setup() {
    probes.push(new Probe(0,int(Math.random()*1000),int(Math.random()*1000),100));
    controlador = new Controlador();
    ground = createGround(50, 50);
    createCanvas(1000, 1000);
    $("#defaultCanvas0").appendTo("#amostra_canvas_holder");
    background(80);
    frameRate(30);
}

function draw(){
    var tile;
    clear();
    background(80);
    for(i=0;i<ground.length;i++){
        for(j=0;j<ground[i].length;j++){
            tile = ground[i][j];
            tile.draw();
        }
    }

    for(i=0;i<probes.length;i++){
        if(probes[i].status==0){
            probes.splice(i,1);
        }
    }



    controlador.ativa();


    probes.forEach(function(e){
        e.ativa();
        e.showInfo();
    })




    displayTileInfo();
}

function displayTileInfo(){
    x = int(mouseX/20);
    y = int(mouseY/20);
    var tile = null;
    if(typeof ground[x]!="undefined"){
        if(typeof ground[x][y]!="undefined"){
            tile = ground[x][y];
            textSize(10);
            var c = color(255,255,255);
            fill(c);
            text("Fertilidade: "+tile.fertilidade, x*20, y*20);
            text("Comida: "+ Math.round(tile.qtd_comida*100)/100, x*20+10, y*20+10);
        }
    }
}

function atualizaInputsValores(){
    return true;
}