class tile {
    constructor(value, x, y, lastMerged) {
        this.val = value;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.lastMerged = lastMerged;
    }

    move(dir, grid, turn, g) {
        for (let i = 0; i < grid.length; i++) {
            if (!(grid[i].x == this.x && grid[i].y == this.y) && (grid[i].x == this.x + dir.x && grid[i].y == this.y + dir.y)) {
                if (grid[i].val !== this.val) {
                    if (grid[i].move(dir,grid,turn, g)) {
                        this.x += dir.x;
                        this.y += dir.y;
                        return true;
                    } else {
                        return false;
                    }
                } else if (grid[i].lastMerged < turn && this.lastMerged < turn) {
                    grid[i].val += this.val;
                    g.score+= grid[i].val;
                    grid[i].lastMerged = turn;
                    grid[i].prevX = 0.5 * (grid[i].x - this.prevX) + this.prevX;
                    grid[i].prevY = 0.5 *(grid[i].y - this.prevY) + this.prevY;
                    this.lastMerged = turn;
                    this.val = -1;
                    this.x = -100;
                    this.y = -100;
                    return true;
                } else {
                    if (grid[i].move(dir,grid,turn)) {
                        this.x += dir.x;
                        this.y += dir.y;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            if (i == grid.length - 1) {
                if (this.x + dir.x >= 0 && this.x + dir.x < 4 && this.y + dir.y >= 0 && this.y + dir.y < 4) {
                    this.x += dir.x;
                    this.y += dir.y;
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

class game{
    constructor(){
        this.grid = [];
        this.lastGrid = [];
        this.turn = 0;
        this.score = 0;
        this.framesSince = 0;
    }
    
    generateStart() {
        for (let i = 0; i < 3; i++) {
            this.addRandom();
        }
        this.lastGrid = copy(this.grid);
    }
    
    addRandom() {
        let x = Math.floor(Math.random() * 4);
        let y = Math.floor(Math.random() * 4);
    
        while (true) {
            let problem = false;
            for (let i = 0; i < this.grid.length; i++) {
                if (this.grid[i].x == x && this.grid[i].y == y) {
                    x = Math.floor(Math.random() * 4);
                    y = Math.floor(Math.random() * 4);
                    problem = true;
                }
            }
            if (!problem) {
                break;
            }
        }
        let val = Math.random() < 0.85 ? 2 : 4;
        this.grid.push(new tile(val, x, y, -1));
    }

    move(dir) {
        if (dir.x == -1) {
            this.grid.sort(function(a,b){return a.x-b.x});
        }
        if (dir.x == 1) {
            this.grid.sort(function(a,b){return b.x-a.x});
        }
        if (dir.y == -1) {
            this.grid.sort(function(a,b){return a.y-b.y});
        }
        if (dir.y == 1) {
            this.grid.sort(function(a,b){return b.y-a.y});
        }
        this.lastGrid = copy(this.grid);
        for(let i = 0; i < this.grid.length; i++){
            this.grid[i].prevX = this.grid[i].x;
            this.grid[i].prevY = this.grid[i].y;
        }
        let madeMove = false;
        while (true) {
            let fullMove = true;
            for (let i = 0; i < this.grid.length; i++) {
                if (this.grid[i].move(dir, this.grid, this.turn, this)) {
                    fullMove = false;
                    madeMove = true;
                }
            }
            if (fullMove) break;
        }
        if (madeMove) {
            this.turn++;
            this.addRandom();
            this.framesSince = 0;
        }
    }
}

const cvs = document.getElementById("gameCvs");
const ctx = cvs.getContext("2d");
ctx.textAlign = "center";
const $ = (id) => document.getElementById(id);

function render(g) {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, 800, 800);
    for (let i = 0; i < g.grid.length; i++) {
        ctx.fillStyle = colours[Math.log2(g.grid[i].val) - 1];
        ctx.fillRect((g.grid[i].prevX + ((g.grid[i].x - g.grid[i].prevX) * g.framesSince/20))* 200 + ((i==g.grid.length-1&&g.turn!==0)? 100*(1 - (g.framesSince/20)):0), (g.grid[i].prevY + ((g.grid[i].y - g.grid[i].prevY) * g.framesSince/20)) * 200 + ((i==g.grid.length-1&&g.turn!==0) ? 100*(1 - (g.framesSince/20)) : 0), ((i==g.grid.length-1&&g.turn!==0) ? g.framesSince/20 : 1) * 200, ((i==g.grid.length-1&&g.turn!==0) ? g.framesSince/20 : 1) * 200);
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText(g.grid[i].val, (g.grid[i].prevX + (g.grid[i].x - g.grid[i].prevX) * g.framesSince/20) * 200 + 100, (g.grid[i].prevY + (g.grid[i].y - g.grid[i].prevY) * g.framesSince/20) * 200 + 100);
    }
    for (let i = 0; i < g.grid.length; i++) {
        if (g.grid[i].x == -100) {
            g.grid.splice(i, 1);
        }
    }
    for(let i = 0; i <= 4; i ++){
        ctx.fillStyle = "lightgray";
        ctx.fillRect(200*i - 8, 0, 16, 800);
        ctx.fillRect(0, 200*i - 8, 800, 16);
    }
    g.framesSince++;
    if(g.framesSince >= 20){
        g.framesSince = 20;
    }
    document.getElementById("score").innerText = g.score.toString();
}

let colours = ["#EEE4DA", "#EDE0C8", "#F2B179", "#F59563", "#F67C60", "#F65E3B", "#EDCF73", "#EDCC62", "#EDC850", "#EDC53F", "#EDC22D"];

// document.addEventListener("keydown", (e) => {
//     if (e.keyCode == 87) {
//         move({
//             x: 0,
//             y: -1
//         });
//     }
//     if (e.keyCode == 65) {
//         move({
//             x: -1,
//             y: 0
//         })
//     }
//     if (e.keyCode == 68) {
//         move({
//             x: 1,
//             y: 0
//         })
//     }
//     if (e.keyCode == 83) {
//         move({
//             x: 0,
//             y: 1
//         })
//     }
//     if (e.keyCode == 66){
//         grid = lastGrid;
//     }
// })

function copy (arr){
    let a = [];
    arr.map((x) => a.push(new tile(x.val, x.x, x.y, x.lastMerged)));
    return a;
}