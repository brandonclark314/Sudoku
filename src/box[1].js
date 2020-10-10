function Box (x, y, s) {
  this.x = x;
  this.y = y;
  this.s = s;
  this.clicked = false;
  this.canChange = true;
  this.value = -1;
  this.color = function() {
    strokeWeight(0);
    fill('rgba(0, 255, 0, 0.5)');
    square(this.x, this.y, this.s);
  }
}