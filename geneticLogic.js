let  population = new Array(10);

for(let i = 0; i < population.length; i++){
    let genes = new Array(10);
    for(let i = 0; i < genes.length; i++){
        genes[i] = [Math.floor(Math.random() * 16), 16 + (Math.floor(Math.random() * 4)), Math.random() * 2 - 1, true];
    }
    population[i] = [new topology(genes,16,4), new game()];
    population[i][1].generateStart();
}

const moves = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]

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
    for(let i = 0; i < 20; i ++){
        render(population[0][1]);
    }
}, 200);
