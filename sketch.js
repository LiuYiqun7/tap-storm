/* Tap Storm
   Input: tap the A key repeatedly (or click).
   Response: the tap rate drives how many particles burst out, how fast, and what colour.
   Feedback: a live rate bar, a number, a combo counter, and the particles themselves.
   Ordinary mistakes handled: holding the key, pressing another key, never pressing,
   and mashing fast enough to drop the frame rate. */

const MAX_PARTICLES = 800;
const TRAIL_ALPHA = 55;
const BG = [9, 13, 28];

let particles = [];
let tapTimes = [];
let rate = 0;
let combo = 0;
let lastTap = 0;
let flash = 0;
let wrongKeyAt = 0;
let holdAt = 0;
let quality = 1;
let slowFrames = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(BG[0], BG[1], BG[2]);
}

function draw() {
  background(BG[0], BG[1], BG[2], TRAIL_ALPHA);
  const now = millis();

  if (now - lastTap > 1500) {
    rate = max(0, rate - (deltaTime / 1000) * 6);
    combo = 0;
  }

  if (frameRate() < 30 && frameCount > 30) {
    if (++slowFrames > 60) quality = 0.5;
  } else if (frameRate() > 45) {
    slowFrames = 0;
    quality = 1;
  }

  updateParticles();
  drawParticles(now);
  drawHud(now);
}

function registerTap(x, y) {
  const now = millis();
  const gap = tapTimes.length ? now - tapTimes[tapTimes.length - 1] : 0;

  if (tapTimes.length && gap > 1200) combo = 0;
  tapTimes.push(now);
  if (tapTimes.length > 4) tapTimes.shift();

  const instant = averageGap() > 0 ? 1000 / averageGap() : 0;
  rate = rate === 0 ? instant : rate * 0.7 + instant * 0.3;
  rate = constrain(rate, 0, 20);

  if (gap > 0 && gap < 500) combo++;
  if (rate > 8) flash = 1;

  burst(x, y);
  lastTap = now;
}

function averageGap() {
  if (tapTimes.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < tapTimes.length; i++) total += tapTimes[i] - tapTimes[i - 1];
  return total / (tapTimes.length - 1);
}

function burstTier(r) {
  if (r < 2) return { count: 3, speed: 1.5, lift: 0.4, size: 4, col: [120, 190, 255] };
  if (r < 5) return { count: 10, speed: 3.2, lift: 0.8, size: 6, col: [110, 240, 220] };
  if (r < 8) return { count: 25, speed: 5.5, lift: 1.2, size: 9, col: [255, 210, 90] };
  return { count: 40, speed: 8.5, lift: 1.8, size: 13, col: [255, 130, 80] };
}

function burst(x, y) {
  const tier = burstTier(rate);
  const n = max(3, round(tier.count * quality));
  for (let i = 0; i < n; i++) {
    const a = random(TWO_PI);
    const sp = random(tier.speed * 0.5, tier.speed);
    particles.push({
      x: x === undefined ? width / 2 : x,
      y: y === undefined ? height / 2 : y,
      vx: cos(a) * sp,
      vy: sin(a) * sp - tier.lift,
      life: 1,
      decay: random(0.006, 0.016),
      size: random(2, tier.size),
      col: tier.col
    });
  }
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
}

function updateParticles() {
  const scaled = (deltaTime / 16.67);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += 0.06 * scaled;
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.x += p.vx * scaled;
    p.y += p.vy * scaled;
    p.life -= p.decay * scaled;
    if (p.life <= 0 || p.y > height + 200) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (const p of particles) {
    fill(p.col[0], p.col[1], p.col[2], p.life * 255);
    circle(p.x, p.y, p.size * (0.4 + p.life * 0.6));
  }
  if (flash > 0) {
    fill(255, 255, 255, flash * 22);
    rect(0, 0, width, height);
    flash = max(0, flash - 0.08);
  }
}

function drawHud(now) {
  const barW = 220;
  const barX = width - barW - 28;
  const barY = 26;
  const shown = constrain(map(rate, 0, 12, 0, barW), 0, barW);
  const tier = burstTier(rate);

  noStroke();
  fill(255, 255, 255, 40);
  rect(barX, barY, barW, 14, 7);
  fill(tier.col[0], tier.col[1], tier.col[2], 230);
  rect(barX, barY, shown, 14, 7);

  textAlign(RIGHT, TOP);
  textSize(28);
  fill(255);
  text(nf(rate, 1, 1) + ' taps/s', width - 28, barY + 24);

  if (combo > 1) {
    textSize(16);
    fill(tier.col[0], tier.col[1], tier.col[2]);
    text('COMBO x' + combo, width - 28, barY + 60);
  }

  textAlign(LEFT, TOP);
  textSize(15);
  fill(255, 255, 255, 150);
  text('连按 A 键（或点击鼠标）  ·  R 键重置', 28, 28);

  let hint = '';
  if (now - holdAt < 1200) hint = '按住不算 — 要连点';
  else if (now - wrongKeyAt < 1200) hint = '只认 A 键（或点一下鼠标）';
  else if (lastTap === 0 && frameCount > 150) hint = '按 A 键开始';
  else if (now - lastTap > 1500) hint = '停手了 — 按 A 重新开始';

  if (hint) {
    const pulse = 140 + 90 * sin(frameCount * 0.06);
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(255, 255, 255, pulse);
    text(hint, width / 2, height / 2 - 120);
  }

  textAlign(LEFT, BOTTOM);
  textSize(13);
  fill(255, 255, 255, 110);
  text('粒子数 ' + particles.length + ' / ' + MAX_PARTICLES, 28, height - 24);
}

function keyPressed(e) {
  if (key === 'r' || key === 'R') {
    particles = [];
    tapTimes = [];
    rate = 0;
    combo = 0;
    return false;
  }
  if (key === 'a' || key === 'A') {
    if (e && e.repeat) {
      holdAt = millis();
      return false;
    }
    registerTap();
    return false;
  }
  wrongKeyAt = millis();
  return false;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    registerTap(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
