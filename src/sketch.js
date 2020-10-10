let clRow = -1;
let clCol = -1;
let s = 55;
let mode = 'init';

function setup() {
  createCanvas(1000, 1000);
  background(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  start = createButton('Ready to solve');
  start.position(600, 100);
  start.mousePressed(toSolve);
  reset = createButton('Create new puzzle')
  reset.position(600, 200);
  reset.mousePressed(toInit);
  solve = createButton('Computer Solve');
  solve.position(600, 300);
  solve.mousePressed(compSolve);

  boxes = new Array(9);
  var i = 0;
  var j = 0;
  var x = 0;
  var y = 0;


  while (i < 9) {
    boxes[i] = new Array(9);
    i++;
  }

  i = 0;

  while (i < 9) {
    j = 0;
    x = 0;
    while (j < 9) {
      boxes[i][j] = new Box(x, y, s);
      x += s;
      j++;
    }
    i++;
    y += s;
  }
}

function draw() {
  drawGrid(55);
  
  if (clRow != -1 && clCol != -1) {
    noStroke();
    fill('rgba(0, 255, 0, 0.5)');
    square(boxes[clRow][clCol].x, boxes[clRow][clCol].y, boxes[clRow][clCol].s);
  }


  var row = 0;
  var col = 0;

  if (mouseX < s * 9 && mouseX > 0 && mouseY > 0 && mouseY < s * 9) {
    row = floor(mouseY / s);
    col = floor(mouseX / s);
    if (mode == 'solve') {
      if (boxes[row][col].canChange) {
        boxes[row][col].color();
      }
    }
    else {
      boxes[row][col].color();
    }
  }
}

function toSolve() {
  mode = 'solve';
  if (clRow !=-1 && clCol != -1) {
    boxes[clRow][clCol].clicked = false;
  }
  clRow = -1;
  clCol = -1;
}

function toInit() {
  mode = 'init';
  if (clRow !=-1 && clCol != -1) {
    boxes[clRow][clCol].clicked = false;
  }
  clRow = -1;
  clCol = -1;
  var j = 0;
  var i = 0;
  
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      boxes[i][j].value = -1;
    }
  }
}

function compSolve() {
  mode = 'comp';
  console.log('starting the solver');
  solver(0, 0);
}

function mousePressed() {
  if (mouseX < s * 9 && mouseX > 0 && mouseY > 0 && mouseY < s * 9) {
    r = floor(mouseY / s);
    c = floor(mouseX / s);
    if (mode == 'init') {
      if (boxes[r][c].clicked) {
        boxes[clRow][clCol].clicked = false;
        clRow = -1;
        clCol = -1;
      } else {
        boxes[r][c].clicked = true;
        if (clRow != -1)
          boxes[clRow][clCol].clicked = false;
        clRow = r;
        clCol = c;
      }
    }
    if (mode == 'solve' && boxes[r][c].canChange) {
      if (boxes[r][c].clicked) {
        boxes[clRow][clCol].clicked = false;
        clRow = -1;
        clCol = -1;
      } else {
        boxes[r][c].clicked = true;
        if (clRow != -1)
          boxes[clRow][clCol].clicked = false;
        clRow = r;
        clCol = c;
      }
    }
  }
}

function keyPressed() {
  if (clRow == -1 || clCol == -1) {
    return;
  }
  
  if (mode == 'solve') {
    if (boxes[clRow][clCol].value == -1 && !isNaN(key) && key != 0) {
      boxes[clRow][clCol].value = key;
    } else if (boxes[clRow][clCol].value != -1 && boxes[clRow][clCol].canChange && (keyCode == BACKSPACE || keyCode == DELETE)) {
      boxes[clRow][clCol].value = -1;
    }
  }
  if (mode == 'init') {
    if (!isNaN(key) && key != 0) {
      boxes[clRow][clCol].value = key;
      boxes[clRow][clCol].canChange = false; 
    } else if (boxes[clRow][clCol].value != -1 && boxes[clRow][clCol].canChange && (keyCode == BACKSPACE || keyCode == DELETE)) {
      boxes[clRow][clCol].value = -1;
      boxes[clRow][clCol].canChange = true;
    }
  
  }
}

function drawGrid(s) {
  var i = 0;
  var j = 0;
  var x = 0;
  var y = 0;
  stroke(0);
  strokeWeight(1);

  while (j < 9) {
    i = 0;
    x = 0;
    while (i < 9) {
      fill(255);
      square(x, y, s);
      if (boxes[j][i].value != -1) {
        fill(0);
        text(boxes[j][i].value, boxes[j][i].x + s / 2, boxes[j][i].y + s / 2);
      }
      i++;
      x += s;
    }
    j++;
    y += s
  }

  x = 0;
  y = 0;
  i = 0;
  j = 0;

  while (i < 10) {
    strokeWeight(3);
    line(0, y, 9 * s, y);
    i += 3;
    y += 3 * s;

  }

  x = 0;
  i = 0;

  while (i < 10) {
    strokeWeight(3);
    line(x, 0, x, 9 * s);
    i += 3;
    x += 3 * s;
  }
}

//TODO: Something here down crashes
function solver(row, col) {
  if (col > 8) {
    col = 0;
    row = row + 1;
  }
  if (row > 8) {
    return true;
  }
  if (!boxes[row][col].canChange) {
    return solver(row , col + 1);
  }

  var num = 1;
  for (num = 1; num <= 9; num++) {
    boxes[row][col].value = num;
    if (isValid(row, col)) {
      if (solver(row, col + 1)) {
        return true;
      }
    }
  }
  boxes[row][col].value = -1;
  return false;
}

function isValid(row, col) {
  var i = 0;
  var num = boxes[row][col].value;

  for (i = 0; i < 9; i++) {
    if (i != row) {
      if (boxes[i][col].value == num) {
        return false;
      }
    }
    if (i != col) {
      if (boxes[row][i].value == num) {
        return false;
      }
    }
  }
  var j = 0;
  if (row < 3) {
    if (col < 3) {
      for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    } else if (col < 6) {
      for (i = 0; i < 3; i++) {
        for (j = 3; j < 6; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    } else {
      for (i = 0; i < 3; i++) {
        for (j = 6; j < 9; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    }
  } else if (row < 6) {
    if (col < 3) {
      for (i = 3; i < 6; i++) {
        for (j = 0; j < 3; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    } else if (col < 6) {
      for (i = 3; i < 6; i++) {
        for (j = 3; j < 6; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    } else {
      for (i = 3; i < 6; i++) {
        for (j = 6; j < 9; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    }
  } else {
    if (col < 3) {
      for (i = 6; i < 9; i++) {
        for (j = 0; j < 3; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    } else if (col < 6) {
      for (i = 6; i < 9; i++) {
        for (j = 3; j < 6; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    } else {
      for (i = 6; i < 9; i++) {
        for (j = 6; j < 9; j++) {
          if (i != row && j != col) {
            if (boxes[i][j].value == num) {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
}
