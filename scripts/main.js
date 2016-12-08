var myCanvas = document.getElementById("canvas");
var ctx = myCanvas.getContext("2d");
var allCells = [];
var nInterval;
var boardSize = 40;
var cellSize = myCanvas.width / boardSize;
var activeCell;
var stack = [];
ctx.lineWidth = 2;
ctx.strokeStyle = "#EFF1F3";

function Cell(x, y, size){
  this.x = x;
  this.y = y;
  this.canShow = false;
  this.xpos = x/cellSize;
  this.ypos = y/cellSize;
  this.size = size
  this.visited = false;
  this.topWall = true;
  this.rightWall = true;
  this.bottomWall = true;
  this.leftWall = true;
  this.drawWall = function(type){
    if (type == "top") {
      ctx.beginPath();
      ctx.moveTo(this.x             , this.y);
      ctx.lineTo(this.x + this.size , this.y);
      ctx.stroke();
    }
    else if (type == "right") {
      ctx.beginPath();
      ctx.moveTo(this.x + this.size , this.y);
      ctx.lineTo(this.x + this.size , this.y + this.size);
      ctx.stroke();
    }
    else if (type == "bottom") {
      ctx.beginPath();
      ctx.moveTo(this.x             , this.y + this.size);
      ctx.lineTo(this.x + this.size , this.y + this.size);
      ctx.stroke();
    }
    else if (type == "left") {
      ctx.beginPath();
      ctx.moveTo(this.x , this.y + this.size);
      ctx.lineTo(this.x , this.y);
      ctx.stroke();
    }
  }
  this.show = function(){
    if (this.canShow == true){
      if (this.visited == true) {
        ctx.globalAlpha = .6;
        ctx.fillStyle = "#FE5F55"
        ctx.fillRect(this.x, this.y,cellSize, cellSize);
        ctx.globalAlpha = 1;
      }
      if (this.topWall === true) {this.drawWall("top")};
      if (this.rightWall === true) {this.drawWall("right")};
      if (this.bottomWall === true) {this.drawWall("bottom")};
      if (this.leftWall  === true)  {this.drawWall("left")};
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function checkNeighbors(cell){
  if (cell.ypos != 0){
    cell.topNeighbor = allCells[cell.ypos - 1][cell.xpos];
  }
  else{cell.topNeighbor = undefined;}

  if (cell.xpos != (boardSize - 1)){
    cell.rightNeighbor = allCells[cell.ypos][cell.xpos + 1]
  }
  else{this.rightNeighbor = undefined;}

  if (cell.ypos != (boardSize - 1)){
    cell.bottomNeighbor = allCells[cell.ypos + 1][cell.xpos]
  }
  else {cell.bottomNeighbor = undefined;}

  if (cell.xpos != 0){
    cell.leftNeighbor = allCells[cell.ypos][cell.xpos - 1];
  }
  else{cell.leftNeighbor = undefined;}
}

function pickNeighbor(acell){
  var aNeighbors = [];
  var dumbN = [];
  if (acell.topNeighbor != undefined) {aNeighbors.push(acell.topNeighbor)};
  if (acell.rightNeighbor != undefined) {aNeighbors.push(acell.rightNeighbor)};
  if (acell.bottomNeighbor != undefined) {aNeighbors.push(acell.bottomNeighbor)};
  if (acell.leftNeighbor != undefined) {aNeighbors.push(acell.leftNeighbor)};
  for (var i = 0; i < aNeighbors.length; i++){
    if (aNeighbors[i].visited == false){
      dumbN.push(aNeighbors[i]);
    }
  }
  if(dumbN.length != 0){
    var rando = getRandomInt(0, dumbN.length);
    removeWalls(acell, dumbN[rando]);
    activeCell = dumbN[rando];
    stack.push(activeCell);
  }
  else if (stack.length != 0){
    activeCell = stack.pop();
  }
  else {
    complete();
  }
}

function removeWalls(aCell, nCell){
    if (aCell.ypos - nCell.ypos == 1) {
      //top
      aCell.topWall = false;
      nCell.bottomWall = false;
    }
    else if(aCell.ypos - nCell.ypos == -1){
      //bottom
      aCell.bottomWall = false;
      nCell.topWall = false;
    }
    else if (aCell.xpos - nCell.xpos == -1){
      //right
      aCell.rightWall = false;
      nCell.leftWall = false;
    }
    else if (aCell.xpos - nCell.xpos == 1){
      //left
      aCell.leftWall = false;
      nCell.rightWall = false;
    }
}

function update(){
  nInterval = setInterval(draw, 130);
}

function init(){
  for (var y = 0; y < boardSize; y++){
    var yArray = []
    allCells.push(yArray);
    for (var x = 0; x < boardSize; x++){
      var newCell = new Cell(cellSize* x , cellSize * y, cellSize);
      yArray.push(newCell);
    }
  }
  for (var i = 0; i < allCells.length; i++){
    for (j = 0; j < allCells[i].length; j++){
      checkNeighbors(allCells[i][j]);
    }
  }
  console.log(allCells);
  activeCell = allCells[0][0];
  activeCell.visited = true;
}

function draw() {
  ctx.clearRect(0,0,800,800)
  activeCell.visited = true;
  activeCell.canShow = true;
  pickNeighbor(activeCell);
  for (var i = 0; i < allCells.length; i++){
    for (j = 0; j < allCells[i].length; j++)
      allCells[i][j].show();
  }
  ctx.fillStyle = "#92DCE5";
  ctx.fillRect(activeCell.x, activeCell.y, cellSize,cellSize);
}

function complete() {
  clearInterval(nInterval);
}


init();
update();
