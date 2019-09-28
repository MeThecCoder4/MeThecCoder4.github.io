'use strict';

let numberOfRows = 5;
const canvas = document.getElementById('gameOfLife');
let cellWidth = canvas.width / numberOfRows;
const ctx = canvas.getContext('2d');
const sliders = document.querySelectorAll('input');
const sliderTitles = document.querySelectorAll('p');
const applyButton = document.getElementById('bt-apply');
let currentIntervalId;
let lastGridSize = +sliders[0].value;
ctx.font = '20px';

let cells = createCells(numberOfRows);
drawCellGrid(ctx, cells, numberOfRows, cellWidth);

for(let i = 0; i < sliders.length; i++) {
  sliders[i].oninput = function() {
    for(let i = 0; i < sliders.length; i++) {
      const titleText = sliderTitles[i].textContent.split(':')[0];
      sliderTitles[i].textContent = titleText + ': ' + sliders[i].value;
    }
  }
}

applyButton.onclick = function() {
  if(+sliders[0].value !== lastGridSize) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    numberOfRows = +sliders[0].value;
    cells = createCells(numberOfRows);
    lastGridSize = numberOfRows;
    cellWidth = canvas.width / numberOfRows;
  }

  initCells(cells, numberOfRows, +sliders[2].value);
  updateNeighbours(cells, numberOfRows);
  drawCellGrid(ctx, cells, numberOfRows, cellWidth);
  clearInterval(currentIntervalId);
  currentIntervalId = setInterval(() => {
    cells = updateCells(cells, numberOfRows);
    drawCellGrid(ctx, cells, numberOfRows, cellWidth);
  }, +sliders[1].value);
}

// Functions

function Cell(isAlive = false, numberOfNeighbours = 0) {
  this.isAlive = isAlive;
  this.numberOfNeighbours = numberOfNeighbours;
}

function drawCellGrid(ctx, cells, numberOfRows, cellWidth) {
  for(let y = 0; y < numberOfRows; y++) {
    for(let x = 0; x < numberOfRows; x++) {
      if(cells[y][x].isAlive) {
        // Make an alive cell green
        // ctx.fillStyle = '#90fe55';
        ctx.fillStyle = '#2ef930';
        ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
      }
      else {
        // Dead cell color
        ctx.fillStyle = '#e6e6e6';
        ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
      }

      ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    }
  }
}

function createCells(numberOfRows) {
  let cells = new Array(numberOfRows);

  for(let y = 0; y < numberOfRows; y++) {
    cells[y] = new Array(numberOfRows);

    for(let x = 0; x < numberOfRows; x++) {
      cells[y][x] = new Cell;
    }
  }

  return cells;
}

function initCells(cells, numberOfRows, probability) {
  for(let y = 0; y < numberOfRows; y++) {
    for(let x = 0; x < numberOfRows; x++) {
      Math.random() < probability / 100 ?
        (cells[y][x].isAlive = true) :
        (cells[y][x].isAlive = false);
    }
  }
}

function countCellNeighbours(cells, numberOfRows, x, y) {
  let counter = 0;

  if(y - 1 >= 0 && x - 1 >= 0)
    if(cells[y - 1][x - 1].isAlive === true)
      counter++;

  if(y - 1 >= 0)
    if(cells[y - 1][x].isAlive === true)
      counter++;

  if(y - 1 >= 0 && x + 1 <= numberOfRows - 1)
    if(cells[y - 1][x + 1].isAlive === true)
      counter++;

  if(x - 1 >= 0)
    if(cells[y][x - 1].isAlive === true)
      counter++;

  if(x + 1 <= numberOfRows - 1)
    if(cells[y][x + 1].isAlive === true)
      counter++;

  if(y + 1 <= numberOfRows - 1 && x - 1 >= 0)
    if(cells[y + 1][x - 1].isAlive === true)
      counter++;

  if(y + 1 <= numberOfRows - 1)
    if(cells[y + 1][x].isAlive === true)
      counter++;

  if(y + 1 <= numberOfRows - 1 && x + 1 <= numberOfRows - 1)
    if(cells[y + 1][x + 1].isAlive === true)
      counter++;

  return counter;
}

function updateNeighbours(cells, numberOfRows) {
  for(let y = 0; y < numberOfRows; y++) {
    for(let x = 0; x < numberOfRows; x++) {
      cells[y][x].numberOfNeighbours
         = countCellNeighbours(cells, numberOfRows, x, y);
    }
  }
}

function updateCells(cells, numberOfRows) {
  updateNeighbours(cells, numberOfRows);
  let nextCells = new Array(numberOfRows);

  for(let y = 0; y < numberOfRows; y++) {
    nextCells[y] = new Array(numberOfRows);

    for(let x = 0; x < numberOfRows; x++) {
      nextCells[y][x] = new Cell;
      const numberOfNeighbours = cells[y][x].numberOfNeighbours;

      if(cells[y][x].isAlive) {
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

  updateNeighbours(nextCells, numberOfRows);
  return nextCells;
}
