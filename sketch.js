let time = 0;
let wave = [];
let y = [];
let fourierY;

let NUM_MARKERS = 10;

function setup() {
  createCanvas(600, 400);

  let angle = 0;
  for (let i = 0; i < 100; i++){
    y[i] = 100*noise(angle);
    angle += TWO_PI/100;
  }
  fourierY = dft(y);
}

function draw() {
  background(0);
  translate(200, 200);

  let x = 0;
  let y = 0; 

  for (let i = 0; i < fourierY.length; i++) {
    let prev_x = x; 
    let prev_y = y; 

    // Calculate the params. 
    let freq = fourierY[i].freq;
    let radius = fourierY[i].amp;
    let phase = fourierY[i].phase;

    // Using fourier series formula. 
    x += radius * cos(freq * time + phase + HALF_PI);
    y += radius * sin(freq * time + phase + HALF_PI);

    // Draw the circle centered at prev_x and prev_y. 
    stroke(255, 100);
    noFill();
    ellipse(prev_x, prev_y, radius*2);

    // Draw the line from the center to x. 
    stroke(255);
    line(prev_x, prev_y, x, y);
  }

  // Prepend the new y value to the wave array. 
  wave.unshift(y);

  // Move the graph to the right. 
  translate(200, 0);
  line(x-200, y, 0, wave[0]);

  // Draw the graph using the final values of y. 
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++){
    vertex(i, wave[i]);
  }
  endShape();

  // Increment time. 
  const dt = TWO_PI/fourierY.length;
  time += dt; 

  // Ensure the array does not go out of bounds. 
  if (wave.length > 250){
    wave.pop();
  }
}