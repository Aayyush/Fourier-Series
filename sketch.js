let time = 0;
let wave = [];
let NUM_MARKERS = 20;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);
  translate(200, 200);

  let x = 0;
  let y = 0; 

  for (let i = 0; i < NUM_MARKERS; i++) {
    let prev_x = x; 
    let prev_y = y; 
    
    // Calculate the next number in the series. 
    // 1, 3, 5, 7, 9 .. 
    let n = i*2 + 1;

    // Using fourier series formula. 
    let radius = 50 * (4 / (n * PI))
    x += radius * cos(n * time);
    y += radius * sin(n * time);

    // Draw the circle centered at prev_x and prev_y. 
    stroke(255, 100);
    noFill();
    ellipse(prev_x, prev_y, radius*2);

    // Draw the line from the center to x. 
    stroke(255);
    line(prev_x, prev_y, x, y);
  }

  // Move the graph to the right. 
  translate(200, 0);
  line(x-200, y, 0, wave[0]);
  wave.unshift(y);

  // Draw the graph using the final values of y. 
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++){
    vertex(i, wave[i]);
  }
  endShape();

  // Increment time. 
  time += 0.05; 

  // Ensure the array does not go out of bounds. 
  if (wave.length > 250){
    wave.pop();
  }
}