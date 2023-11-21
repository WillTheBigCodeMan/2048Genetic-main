class geneManager {
    constructor() {
        this.geneList = [];
    }

    getGeneNumber(gene) {
        for (let i = 0; i < this.geneList.length; i++) {
            if (this.geneList[i][0] == gene[0] && this.geneList[i][1] == gene[1]) {
                return i;
            }
        }
        this.geneList.push([gene[0], gene[1]]);
        return this.geneList.length - 1;
    }
}

let population = new Array(200);
let gM = new geneManager();

let activationFunctions = [(x) => x, (x) => 1 / (1 + Math.pow(Math.E, -x)), (x) => Math.tanh(x), (x) => x > 0 ? 1 : -1, (x) => x > 0 ? x : 0];

for (let i = 0; i < population.length; i++) {
    let genes = new Array(10);
    for (let i = 0; i < genes.length; i++) {
        genes[i] = [Math.floor(Math.random() * 16), 16 + (Math.floor(Math.random() * 4)), Math.random() * 2 - 1, true, activationFunctions[Math.floor(Math.random() * activationFunctions.length)]];
    }
    let activations = new Array(20);
    for (let i = 0; i < activations.length; i++) {
        activations[i] = activationFunctions[Math.floor(Math.random() * activationFunctions.length)];
    }
    population[i] = [new topology(genes, 16, 4, activations), new game(), true, undefined, 5];
    population[i][1].generateStart();
    population[i][0].mutate();
}

const moves = [{
    x: 1,
    y: 0
}, {
    x: -1,
    y: 0
}, {
    x: 0,
    y: 1
}, {
    x: 0,
    y: -1
}];

setInterval(() => {
    allDead = true;
    population.map((x) => {
        if (x[2]) {
            allDead = false;
            let inputs = new Array(16);
            for (let i = 0; i < inputs.length; i++) {
                inputs[i] = 0;
            }
            for (let i = 0; i < x[1].grid.length; i++) {
                inputs[x[1].grid[i].x + x[1].grid[i].y * 4] = x[1].grid[i].val;
            }
            let output = x[0].processOutput(inputs);
            if(output == -1) console.log(inputs, x);
            if (x[3] == output) x[4]--;
            if (x[4] <= 0) x[2] = false;
            if (x[1].isDead()) x[2] = false;
            x[3] = output;
            x[1].move(moves[output]);
        }
    });
    if(allDead){
        console.log("NEW GENERATION");
        population.sort((a,b) => a[1].score - b[1].score);
        for(let i = 10; i < population.length; i++){
            population[i] = [new topology(copyGenes(population[i%10][0].genes), 16, 4, copyActivations(population[i%10][0].as)), new game(), true, undefined, 5];
            population[i][0].mutate();
            population[i][1].generateStart();
        }
    }
}, 200);

setInterval(() => {
    let x = 0;
    while(true){
        if(population[x][1].isDead()){
            x++;
        } else {
            break;
        }
    }
    render(population[x][1]);
}, 10);

const copyGenes = (genes) => {
    let x = new Array(genes.length);
    for(let i = 0; i < genes.length;i ++){
        x[i] = new Array(genes[i.length]);
        for(let j = 0; j < genes[i].length; j++){
            x[i][j] = genes[i][j];
        }
    }
    return x;
}

const copyActivations = (as) => {
    let x = new Array(as.length);
    for(let i = 0; i < as.length; i++){
        x[i] = as[i];
    }
    return x;
}
