// One gene = [fromNode (int), toNode(int), weight(float), enabled(bool), geneNumber(int)]

class topology {
    constructor(genes, inputs, outputs, activations) {
        this.genes = genes;
        this.ins = inputs;
        this.outs = outputs;
        this.nodeCount = 0;
        this.as = activations;
        for (let i = 0; i < this.genes.length; i++) {
            if (this.genes[i][1]> this.nodeCount - 1) {
                this.nodeCount = this.genes[i][1] + 1;
            }
        }
    }

    processOutput(inputs) {
        this.sortGenes();
        let nodeValues = new Array(this.nodeCount);
        for (let i = 0; i < this.ins; i++) {
            nodeValues[i] = inputs[i];
        }
        for (let i = this.ins; i < nodeValues.length; i++) {
            nodeValues[i] = 0;
        }

        let lastTo = this.genes[0][1];
        for (let i = 0; i < this.genes.length; i++) {
            if (this.genes[i][1] !== lastTo) {
                try{
                    nodeValues[lastTo] = this.as[lastTo](nodeValues[lastTo]);
                } catch{
                    console.log(this);
                }
                lastTo = this.genes[i][1];
            }
            if (this.genes[i][3]) nodeValues[this.genes[i][1]] += nodeValues[this.genes[i][0]] * this.genes[i][2];
        }
        let output = new Array(this.outs);
        for(let i = 0; i < output.length; i++){
            output[i] = 0;
        }
        for (let i = 0; i < output.length; i++) {
            if(this.ins + i < nodeValues.length) output[i] = nodeValues[this.ins + i];
        }
        if(output.indexOf(Math.max(...output))==-1){console.log(nodeValues)}
        return output.indexOf(Math.max(...output));
    }

    mutate() {
        if (Math.random() < 0.9) this.mutateWeight(Math.random() * this.genes.length);
        if (Math.random() < 0.2) this.mutateNode();
        if (Math.random() < 0.2) this.toggleConnection();
        if (Math.random() < 0.35) this.mutateActivation();
        if (Math.random() < 0.35) this.randomiseWeight();
        if (Math.random() < 0.15) this.addConnection();
        //this.sortGenes();
    }

    mutateWeight(n) {
        for (let i = 0; i < n; i++) {
            let x = Math.floor(Math.random() * this.genes.length);
            this.genes[x][2] += Math.random() + 0.1 - 0.05;
        }
    }

    randomiseWeight() {
        let x = Math.floor(Math.random() * this.genes.length);
        this.genes[x][2] = Math.random() * 2 - 1;
    }

    toggleConnection() {
        let x = Math.floor(Math.random() * this.genes.length);
        this.genes[x][3] = !this.genes[x][3];
    }

    mutateActivation() {
        let x = Math.floor(Math.random() * this.as.length);
        this.as[x] = activationFunctions[Math.floor(Math.random() * activationFunctions.length)];
    }

    mutateNode() {
        let x = Math.floor(Math.random() * this.genes.length);
        const store = this.genes[x][1];
        this.genes[x][1] = this.nodeCount;
        this.nodeCount++;
        this.as.push(activationFunctions[Math.floor(Math.random() * activationFunctions.length)])
        this.genes.splice(x, 0, [this.nodeCount - 1, store, 1, true, gM.getGeneNumber([this.nodeCount - 1, store])]);
    }

    addConnection() {
        let x;
        let y;
        while (true) {
            x = Math.floor(Math.random() * (this.nodeCount - this.outs));
            if (x > this.ins && x < this.ins + this.outs) x += this.outs;
            y = Math.floor(Math.random() * (this.nodeCount - (x - this.outs))) + x;
            if (y >= this.nodeCount) y = this.ins + (y - this.nodeCount);
            let valid = true;
            for (let i = 0; i < this.genes.length; i++) {
                if (this.genes[i][0] == x && this.genes[i][1] == y) valid = false;
            }
            if (valid) break;
        }
        if(y >= this.nodeCount){
            console.log(x, y);
        }
        this.genes.push([x, y, Math.random() * 2 - 1, true, gM.getGeneNumber([x, y])]);
        this.sortGenes();
    }

    sortGenes() {
        this.genes.sort((a, b) => a[1] - b[1]);
        let x = [];
        let delCount = 0;
        for (let i = 0; i < this.genes.length; i++) {
            if (this.genes[i][1] < this.ins + this.outs) {
                x.push(this.genes[i]);
                delCount++;
            } else {
                break;
            }
        }
        let newGenes = this.genes;
        newGenes.splice(0, delCount);
        x.map((g) => newGenes.push(g));
        this.genes = newGenes;
    }
}