// One gene = [fromNode (int), toNode(int), weight(float), enabled(bool), activation(function), geneNumber(int)]

class topology{
    constructor(genes, inputs, outputs, activations){
        this.genes = genes;
        this.ins = inputs;
        this.outs = outputs;
        this.nodeCount = 0;
        this.as = activations;
        for(let i = 0; i < this.genes.length; i++){
            if(this.genes[i][1] > this.nodeCount){
                this.nodeCount = this.genes[i][1];
            }
        }
        console.log(this.nodeCount);
    }

    processOutput(inputs){
        let nodeValues = new Array(this.nodeCount);
        for(let i = 0; i < this.ins; i++){
            nodeValues[i] = inputs[i];
        }
        for(let i = this.ins; i < this.ins + this.outs; i++){
            nodeValues[i] = 0;
        }
        let lastTo = this.genes[0][1];
        for(let i = 0; i < this.genes.length; i++){
            if(this.genes[i][1]!==lastTo){
                nodeValues[lastTo] = this.as[lastTo](nodeValues[lastTo]);
                lastTo = this.genes[i][1];
            }
            if(this.genes[i][3]) nodeValues[this.genes[i][1]] += nodeValues[this.genes[i][0]] * this.genes[i][2];
        }
        let output = new Array(this.outs);
        for(let i = 0; i < output.length; i++){
            output[i] = nodeValues[this.ins + i];
        }
        return output.indexOf(Math.max(...output));
    }

    mutate(){
        if(Math.random() < 0.9) this.mutateWeight(Math.random() * this.genes.length);
        if(Math.random() < 0.2) this.mutateNode();
        if(Math.random() < 0.2) this.toggleConnection();
        if(Math.random() < 0.35) this.mutateActivation();
        if(Math.random() < 0.35) this.randomiseWeight();
        if(Math.random() < 0.15) this.addConnection();
    }

    mutateWeight(){
        let x = Math.floor(Math.random() * this.genes.length);
        this.genes[x][2] += Math.random() + 0.1 - 0.05;
    }

    randomiseWeight(){
        let x = Math.floor(Math.random() * this.genes.length);
        this.genes[x][2] = Math.random() * 2 - 1;
    }

    toggleConnection(){
        let x = Math.floor(Math.random() * this.genes.length);
        this.genes[x][3] = !this.genes[x][3];
    }

    mutateActivation(){
        let x = Math.floor(Math.random() * this.as.length);
        this.as[x] = activationFunctions[Math.floor(Math.random() * activationFunctions.length)];
    }

    mutateNode(){
        let x = Math.floor(Math.random() * this.genes.length);
        const store = this.genes[x][1];
        this.genes[x][1] = this.nodeCount+1;
        this.nodeCount++;
        this.genes.splice(x, 0, [this.nodeCount, store, 1, true, activationFunctions[Math.floor(Math.random() * activationFunctions.length)], gM.getGeneNumber([this.nodeCount, store])]);
    }

    addConnection(){
        let x = Math.floor(Math.random() * (this.nodeCount - this.outs));
    }
}