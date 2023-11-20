class geneManager{
    constructor(){
        this.geneList = [];
    }

    getGeneNumber(gene){
        for(let i = 0; i < this.geneList.length; i++){
            if(this.geneList[i][0] == gene[0]&&this.geneList[i][1] == gene[1]){
                return i;
            }
        }
        this.geneList.push([gene[0], gene[1]]);
        return this.geneList.length -1;
    }
}

let  population = new Array(10);
let gM = new geneManager();

let activationFunctions = [(x) => x, (x) => 1/(1+Math.pow(Math.E, -x)), (x) => Math.tanh(x), (x) => x>0?1:-1, (x) => x>0?x:0];

for(let i = 0; i < population.length; i++){
    let genes = new Array(10);
    for(let i = 0; i < genes.length; i++){
        genes[i] = [Math.floor(Math.random() * 16), 16 + (Math.floor(Math.random() * 4)), Math.random() * 2 - 1, true, activationFunctions[Math.floor(Math.random()*activationFunctions.length)],0];
        genes[i][5] = gM.getGeneNumber(genes[i]);
    }
    population[i] = [new topology(genes,16,4), new game()];
    population[i][1].generateStart();
}

const moves = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

setInterval(() => {
    population.map((x) => {
        let inputs = new Array(16);
        for(let i = 0; i < inputs.length; i++){
            inputs[i] = 0;
        }
        for(let i = 0; i < x[1].grid.length; i++){
            inputs[x[1].grid[i].x + x[1].grid[i].y*4] = x[1].grid[i].val;
        }
        let output = x[0].processOutput(inputs);
        x[1].move(moves[output]);
    });
}, 200);

setInterval(() => {
    render(population[0][1]);
}, 10);
