'use strict';

class Cell {
  constructor(aliveCellColor,
              deadCellColor,
              isAlive = false, numberOfNeighbours = 0) {
    this._isAlive = isAlive;
    this._numberOfNeighbours = numberOfNeighbours;
    this._color = deadCellColor;
    this._aliveCellColor = aliveCellColor;
    this._deadCellColor = deadCellColor;
  }

  get isAlive() {
    return this._isAlive;
  }

  set isAlive(value) {
    this._isAlive = value;

    if(value) {
      this.color = this._aliveCellColor;
    }
    else {
      this.color = this._deadCellColor;
    }
  }

  get color() {
    return this._color;
  }

  set color(colorValue) {
    this._color = colorValue;
  }

  get numberOfNeighbours() {
    return this._numberOfNeighbours;
  }

  set numberOfNeighbours(numberOfNeighbours) {
    this._numberOfNeighbours = numberOfNeighbours;
  }

  get aliveCellColor() { return this._aliveCellColor; }

  get deadCellColor() { return this._deadCellColor; }
}

class CellGrid {
  constructor(canvas, gridWidth, livingCellProb = 0) {
    this._gridWidth = gridWidth;
    this._livingCellProb = livingCellProb;
    this._ctx = canvas.getContext('2d');
    this._canvas = canvas;
    this._cellWidth = canvas.width / gridWidth;
    this.create();
  }

  create() {
    this._cells = new Array(this._gridWidth);

    for(let y = 0; y < this._gridWidth; y++) {
      this._cells[y] = new Array(this._gridWidth);

      for(let x = 0; x < this._gridWidth; x++) {
        this._cells[y][x] = new Cell('#2ef930', '#e6e6e6');
      }
    }
  }

  initRandomCells() {
    for(let y = 0; y < this._gridWidth; y++) {
      for(let x = 0; x < this._gridWidth; x++) {
        Math.random() < this._livingCellProb / 100 ?
          (this._cells[y][x].isAlive = true) :
          (this._cells[y][x].isAlive = false);
      }
    }
  }

  draw() {
    for(let y = 0; y < this._gridWidth; y++) {
      for(let x = 0; x < this._gridWidth; x++) {
        this._ctx.fillStyle = this._cells[y][x].color;
        this._ctx.fillRect(x * this._cellWidth, y * this._cellWidth,
                     this._cellWidth, this._cellWidth);
        this._ctx.strokeRect(x * this._cellWidth, y * this._cellWidth,
                       this._cellWidth, this._cellWidth);
      }
    }
  }

  countCellNeighbours(x, y) {
    let counter = 0;

    if(y - 1 >= 0 && x - 1 >= 0)
      if(this._cells[y - 1][x - 1].isAlive)
        counter++;

    if(y - 1 >= 0)
      if(this._cells[y - 1][x].isAlive)
        counter++;

    if(y - 1 >= 0 && x + 1 <= this._gridWidth - 1)
      if(this._cells[y - 1][x + 1].isAlive)
        counter++;

    if(x - 1 >= 0)
      if(this._cells[y][x - 1].isAlive)
        counter++;

    if(x + 1 <= this._gridWidth - 1)
      if(this._cells[y][x + 1].isAlive)
        counter++;

    if(y + 1 <= this._gridWidth - 1 && x - 1 >= 0)
      if(this._cells[y + 1][x - 1].isAlive)
        counter++;

    if(y + 1 <= this._gridWidth - 1)
      if(this._cells[y + 1][x].isAlive)
        counter++;

    if(y + 1 <= this._gridWidth - 1 && x + 1 <= this._gridWidth - 1)
      if(this._cells[y + 1][x + 1].isAlive)
        counter++;

    return counter;
  }

  updateNeighbours(cells) {
    for(let y = 0; y < this._gridWidth; y++) {
      for(let x = 0; x < this._gridWidth; x++) {
        cells[y][x].numberOfNeighbours
           = this.countCellNeighbours(x, y);
      }
    }
  }

  update() {
    this.updateNeighbours(this._cells);
    const nextCells = new Array(this._gridWidth);

    for(let y = 0; y < this._gridWidth; y++) {
      nextCells[y] = new Array(this._gridWidth);

      for(let x = 0; x < this._gridWidth; x++) {
        nextCells[y][x] = new Cell(this._cells[y][x].aliveCellColor,
                                   this._cells[y][x].deadCellColor);
        const numberOfNeighbours = this._cells[y][x].numberOfNeighbours;

        if(this._cells[y][x].isAlive) {
          if(numberOfNeighbours < 2 || numberOfNeighbours > 3)
            nextCells[y][x].isAlive = false;
          else if(numberOfNeighbours === 2 || numberOfNeighbours === 3)
            nextCells[y][x].isAlive = true;
        }
        else {
          if(numberOfNeighbours === 3)
            nextCells[y][x].isAlive = true;
        }

        nextCells[y][x].numberOfNeighbours = numberOfNeighbours;
      }
    }

    this.updateNeighbours(nextCells);
    this._cells = nextCells;
  }

  get gridWidth() {
    return this._gridWidth;
  }

  get livingCellProb() {
    return this._livingCellProb;
  }
}

class ConwaysGame {
  constructor(canvas, gridWidth, livingCellProb, gameSpeed) {
    this._canvas = canvas;
    this._cellGrid = new CellGrid(canvas, gridWidth, livingCellProb);
    this._gameSpeed = gameSpeed;
    this._cellGrid.draw();
  }

  start() {
    this._timerId = setInterval(() => {
      this._cellGrid.update();
      this._cellGrid.draw();
    }, this._gameSpeed);
  }

  reset(gridWidth, livingCellProb, gameSpeed) {
    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._cellGrid = new CellGrid(this._canvas, gridWidth, livingCellProb);
    this._gameSpeed = gameSpeed;
    this._cellGrid.initRandomCells();
    this._cellGrid.draw();
    clearInterval(this._timerId);
  }
}

const canvas = document.getElementById('gameOfLife');
const sliders = document.querySelectorAll('input');
const sliderTitles = document.querySelectorAll('p');
const applyButton = document.getElementById('bt-apply');

for(let i = 0; i < sliders.length; i++) {
  sliders[i].oninput = function() {
    for(let i = 0; i < sliders.length; i++) {
      const titleText = sliderTitles[i].textContent.split(':')[0];
      sliderTitles[i].textContent = titleText + ': ' + sliders[i].value;
    }
  }
}

const game = new ConwaysGame(canvas, +sliders[0].value,
                                    +sliders[2].value, +sliders[1].value);

applyButton.onclick = function() {
  game.reset(+sliders[0].value, +sliders[2].value, +sliders[1].value);
  game.start();
}
