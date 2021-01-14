let time = 0;
let path = [];

let x = [];
let y = [];
let fourierY;
let fourierX;

const USER = 0;
const FOURIER = 1;

let drawing = [];
let state = -1; 

function mousePressed() {
  state = USER; 
  drawing = [];
  x = [];
  y = [];
  time = 0;
  path = [];
}

function mouseReleased() {
  state = FOURIER;

  // Scale down the data set by factor of skip. 
  const skip = 1; 
  for (let i = 0; i < drawing.length; i += skip){
    x.push(drawing[i].x);
    y.push(drawing[i].y);
  }
  fourierX = dft(x);
  fourierY = dft(y);

  // Sort by amplitude for better rendering using epicycles. 
  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
}

function setup() {
  createCanvas(800, 600);
}

function epiCycles(x, y, rotation, fourier){
  for (let i = 0; i < fourier.length; i++) {
    let prev_x = x; 
    let prev_y = y; 

    // Calculate the params. 
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    // Using fourier series formula. 
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    // Draw the circle centered at prev_x and prev_y. 
    stroke(255, 100);
    noFill();
    ellipse(prev_x, prev_y, radius*2);

    // Draw the line from the center to x. 
    stroke(255);
    line(prev_x, prev_y, x, y);
  }

  return createVector(x, y)
}

function draw() {
  background(0);

  if (state == USER) {
    let point = createVector(mouseX - width/2, mouseY-height/2)
    drawing.push(point);

    stroke(255);
    noFill();
    beginShape();
    for (let v of drawing) {
      vertex(v.x + width/2, v.y+height/2);
    }
    endShape()

  } else if (state == FOURIER) {

    // Calculate the next set of points in the path. 
    let vx = epiCycles(width/2, 100, 0, fourierX);
    let vy = epiCycles(100, height/2, HALF_PI, fourierY)
    let v = createVector(vx.x, vy.y) 

    // Prepend the new y value to the wave array. 
    path.unshift(v);

    // Draw line
    line(vx.x, vx.y, v.x, v.y)
    line(vy.x, vy.y, v.x, v.y)

    // Draw the graph using the final values of y. 
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++){
      vertex(path[i].x, path[i].y);
    }
    endShape();

    // Increment time. 
    const dt = TWO_PI/fourierY.length;
    time += dt; 

    // Reset when a full cycle is complete. 
    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }
}