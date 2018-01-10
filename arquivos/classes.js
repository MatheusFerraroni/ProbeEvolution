// var Neuron = synaptic.Neuron,
//     Layer = synaptic.Layer,
//     Network = synaptic.Network,
//     Trainer = synaptic.Trainer,
//     Architect = synaptic.Architect;


class Tile {
    constructor(tipo) {
        this.tipo = tipo;
        this.fertilidade = 0;
        this.qtd_comida  = 0;
        this.qtd_max_comida = 100;
        this.corpuro = [0,0,255];
        this.lastActivate = millis();
        this.txGanhaComida = 1000; // inversamente proporcional
        this.ultimaComida = millis();
        this.lastChanceExtraAtivada = millis();
        if(this.tipo==1){
            this.fertilidade = Math.random() * (0.8)+0.2;
            this.qtd_comida  = int(Math.random() * (50));
            this.corpuro = getGradienteCor([0,[214, 206, 199]],[100,[91, 77, 65]],this.fertilidade*100)
        }

    }

    getCor(){
        if(this.tipo==0){
            return getGradienteCor([0,this.corpuro],[100,[0,255,0]],this.qtd_comida)
        }else if(this.tipo==1){
            return getGradienteCor([0,this.corpuro],[100,[0,255,0]],this.qtd_comida)
        }//else if(this.tipo==2){
         //   return getGradienteCor([0,[255,255,0]],[100,[255,255,0]],this.qtd_comida)
         //}
    }

    ativa(){
        if(this.tipo==1){
            if(this.qtd_comida>this.qtd_max_comida){
                return;
            }
            this.qtd_comida = this.qtd_comida + ((millis()-this.lastActivate)/this.txGanhaComida*this.fertilidade);



            if(millis()-this.lastChanceExtraAtivada>1000){
                this.lastChanceExtraAtivada = millis();
            }
        }//else if(this.tipo==2){
         //   if(this.qtd_comida>100){
         //       return;
         //   }
         //   this.qtd_comida = this.qtd_comida + (Math.random()*(millis()-this.lastActivate)/this.txGanhaComida)*this.fertilidade*2;
        //}
        this.lastActivate = millis();
    }

    giveFood(){
        if(this.qtd_comida>0){
            if((millis()-this.ultimaComida)/1000>1){
                this.ultimaComida = millis();
            }
            this.qtd_comida -= (millis()-this.ultimaComida)/100;
            if(this.qtd_comida<-5){
                this.qtd_comida = -5;
            }
            return 1;
        }
        return 0;
    }

    draw(){
        if(this.tipo==1 || this.tipo==2){
            this.ativa();
            var novacor = this.getCor();
            var c = color(novacor[0],novacor[1],novacor[2]);  // Define color 'c'
            fill(c);  // Use color variable 'c' as fill color
            quad(
                i*20,j*20,
                i*20+20,j*20,
                i*20+20,j*20+20,
                i*20,j*20+20,
            )
        }
    }
}


class Probe{
    constructor(id,x,y,vida=100) {
        this.status = 1 // 1 = vivo; 0 = morto;
        this.id = id;
        this.x = x;
        this.y = y;
        this.vida = vida;
        this.criado = millis();
        this.lastMovimento = millis();
        this.lastPerdeVida = millis();
        this.lastGastaComida = millis();
        this.fatorMovimento = 500;
        this.angle = int(Math.random()*360);
        this.size = 15;
        this.txPerdaVida = 0.03;
        this.qtdTotalComida = 0;
        this.qtdComida = 50;
        this.txPerdaComida = 1000;// inversamente proporcional
        this.corNivelSaude = [[200,0,0],[60,200,60]];
        this.corre = 1;
        this.velocidadeGiro = 6;
        this.nome = generateRandomNameName();
        this.isTheBestViva = false;



        var numInputs = 6;
        var numOutputs = 2;
        var numHiddenLayers = 2;
        var numNeuronsPerHiddenLayer = 8;
        this.neuralNetwork = new NeuralNetwork(numInputs, numOutputs, numHiddenLayers, numNeuronsPerHiddenLayer);
        // this.neuralNetworkCome =  new NeuralNetwork(3, 1, 2, 4);

    }

    getTempoVida(){
        return millis()-this.criado;
    }

    getCor(){
        if(this.isTheBestViva){
            return getGradienteCor([0,this.corNivelSaude[0]],[100,[255,255,255]],this.vida)


            stroke([255,255,0]);
            noFill();
            arc(this.x, this.y, 40, 40, 0, PI*2, CLOSE);
            stroke([0,0,0]);
        }
        return getGradienteCor([0,this.corNivelSaude[0]],[100,this.corNivelSaude[1]],this.vida)
    }

    vaiFrente(){
        var novoX = this.x + cos(this.angle*PI/180) * ( this.fatorMovimento * ( (millis()-this.lastMovimento)/10000 ) )*this.corre;
        var novoY = this.y + sin(this.angle*PI/180) * ( this.fatorMovimento * ( (millis()-this.lastMovimento)/10000 ) )*this.corre;
        this.x = novoX;
        this.y = novoY;
        this.lastMovimento = millis();
    }
    vaiTras(){
        var novoX = this.x + cos(this.angle*PI/180) * -( this.fatorMovimento/2 * ( (millis()-this.lastMovimento)/10000 ) )*this.corre;
        var novoY = this.y + sin(this.angle*PI/180) * -( this.fatorMovimento/2 * ( (millis()-this.lastMovimento)/10000 ) )*this.corre;
        this.x = novoX;
        this.y = novoY;
        this.lastMovimento = millis();
    }

    viraDireita(){
        this.angle = this.angle+this.velocidadeGiro;
        if(this.angle>360){
            this.angle = 0;
        }
    }
    viraEsquerda(){
        this.angle = this.angle-this.velocidadeGiro;
        if(this.angle<0){
            this.angle = 360;
        }
    }

    getOlhoPosition(retornaCentro = false){
        var ret = [];
        if(retornaCentro){
            var novoX = this.x;
            var novoY = this.y;
            ret.push({
                x: novoX,
                y: novoY,
                size: this.size/2
            });
        }

        var novoX = this.x + cos( (this.angle+28) *PI/180) * this.size*1.1;
        var novoY = this.y + sin( (this.angle+28) *PI/180) * this.size*1.1;
        ret.push({
            x: novoX,
            y: novoY,
            size: this.size/2
        });
        
        var novoX = this.x + cos( (this.angle-28) *PI/180) * this.size*1.1;
        var novoY = this.y + sin( (this.angle-28) *PI/180) * this.size*1.1;
        ret.push({
            x: novoX,
            y: novoY,
            size: this.size/2
        });
        return ret;
    }

    ativa(){
        if(this.status==0){
            return;
        }
        this.seAlimeta();
        this.decideMovimentacao();
        var paiX = this.x;
        var paiY = this.y;
        fill(this.getCor());
        ellipse(this.x, this.y, this.size, this.size);
        fill(200,200,200); // cor do olho
        var posOlho = this.getOlhoPosition(false);
        posOlho.forEach(function(e){
            line(paiX, paiY, e.x, e.y);
        })
        posOlho.forEach(function(e){
            ellipse(e.x, e.y, e.size, e.size);
        });



        this.gastaComida();
    }

    perdeVida(qtd){
        this.vida -= qtd
        if(this.vida<=0){
            this.status = 0;
        }
    }

    gastaComida(){
        this.qtdComida -= 100*Math.random() * (millis()-this.lastGastaComida)/this.txPerdaComida;
        this.lastGastaComida = millis();
        if(this.qtdComida<=0){
            this.qtdComida = 0;

            if(millis()-this.lastPerdeVida>50){
                this.lastPerdeVida = millis();
            }
            var removerVida = (millis()-this.lastPerdeVida)*this.txPerdaVida;
            this.lastPerdeVida = millis();
            this.perdeVida(removerVida);
        }
    }


    seAlimeta(){
        var posx = Math.floor(this.x/20);
        var posy = Math.floor(this.y/20);



        if(typeof ground[posx]=="undefined"){
            this.perdeVida(7.5);
            return;
        }
        if(typeof ground[posx][posy]=="undefined"){
            this.perdeVida(7.5);
            return;
        }
        var t = ground[posx][posy];






        if(t.tipo==0){
            this.perdeVida(1.5);
            return;
        }else if(t.tipo==1){
            if(t.giveFood()==1){
                this.qtdComida+=1;
                this.qtdTotalComida+=1;
                this.vida+=2;
                if(this.vida>100){
                    this.vida = 100;
                }
                if(this.qtdComida>100){
                    this.qtdComida = 100;
                }
            }
        }

        ground[posx][posy] = t;
    }

    decideMovimentacao(){

        var entradas = [];

        var olhos = this.getOlhoPosition(true);
        olhos.forEach(function(e){
            var ok = true;
            var posx = Math.floor(e.x/20);
            var posy = Math.floor(e.y/20);
            if(typeof ground[posx]=="undefined"){
                entradas.push(0);
                entradas.push(0);
                ok = false;
            }
            if(ok){
                if(typeof ground[posx][posy]=="undefined"){
                    entradas.push(0);
                    entradas.push(0);
                    ok = false;
                }
            }
            if (ok){
                entradas.push(ground[posx][posy].tipo);
                entradas.push(ground[posx][posy].qtd_comida/ground[posx][posy].qtd_max_comida);

            }
        });
        

        var r = this.neuralNetwork.update(entradas);


        if(r[0]>0.5){
            this.vaiFrente();
        }else{
            this.lastMovimento = millis();
        }


        if(r[1]>0.5){
            this.viraDireita()
        }else{
            this.viraEsquerda()
        }
        if(r[2]>0.5){
            this.corre = 1.5;
            this.velocidadeGiro = 9;
        }else{
            this.corre = 1;
            this.velocidadeGiro = 6;
        }
    }

    showInfo(){
        var difx = mouseX-this.x;
        var dify = mouseY-this.y;
        if(difx<0){
            difx *= -1;
        }
        if(dify<0){
            dify *= -1;
        }
        if( (difx+dify) < 100){
            textSize(12);
            var c = color(255,255,255);
            fill(c);
            var x = this.x - this.size*3;
            var y = this.y - this.size*3;
            text(this.nome, x, y);
            text("Comida:"+ Math.round(this.qtdComida)+"/"+this.qtdTotalComida, x+10, y+10);
            text("Vida: "+ (Math.round(this.vida*100)/100), x+20, y+20);
            text("Corre: "+ this.corre, x+30, y+30);
            text("Tempo: "+ Math.round( (millis()-this.criado)/1000 )+"s", x+40, y+40);
        }
    }

    setBest(t){
        this.isTheBestViva = t;
    }
}




class Controlador{
    constructor() {
        this.bestprobe_network = probes[0].neuralNetwork;
        // this.bestprobe_networkcome = probes[0].neuralNetworkCome;
        this.bestprobe_fitness = 0;
        this.variacao = 0.15;
        this.txAleatoriedade = 0.20;
        this.bestprobe_tempoviva = 0;
        this.qtdTotalProbesCriadas = 0;
    }


    ativa(){

        var bestProbeViva = probes[0];
        for(i=0;i<probes.length;i++){
            probes[i].setBest(false);
            if(probes[i].qtdTotalComida>this.bestprobe_fitness){
                this.bestprobe_fitness = probes[i].qtdTotalComida;
                this.bestprobe_network = probes[i].neuralNetwork;
                // this.bestprobe_networkcome = probes[i].neuralNetworkCome;
                this.bestprobe_tempoviva = probes[i].getTempoVida();
            }
            if(probes[i].qtdTotalComida>bestProbeViva.qtdTotalComida){
                bestProbeViva = probes[i];
            }
        }
        bestProbeViva.setBest(true);


        while(probes.length<controladoraGeral.probes.qtdMaxima){
            this.qtdTotalProbesCriadas++;
            var probe = new Probe(this.qtdTotalProbesCriadas,int(Math.random()*1000),int(Math.random()*1000),100);
            if(Math.random()>this.txAleatoriedade){
                // probe.neuralNetwork.setWeights(this.bestprobe_network.getWeights());
                var pesos = this.bestprobe_network.getWeights();
                p = 1;
                for(var i=0;i<pesos.length;i++){
                    if(Math.random()<0.5){
                        p = -1;
                    }
                    pesos[i] += p*this.variacao;
                }
                probe.neuralNetwork.setWeights(pesos);
            }
            probes.push(probe);
        }
    }
}