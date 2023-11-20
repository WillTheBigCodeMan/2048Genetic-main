// One gene = [fromNode (int), toNode(int), weight(float), enabled(bool), activation(function), geneNumber(int)]

class topology{
    constructor(genes, inputs, outputs){
        this.genes = genes;
        this.ins = inputs;
        this.outs = outputs;
        this.nodeCount = 0;
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
        for(let i = 0; i < this.genes.length; i++){
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
    }
}