const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
  canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
  canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
}
setCanvasSize();

let canvasWidth = canvas.clientWidth;
let canvasHeight = canvas.clientHeight;
let rotationAngle = 0;
let dotsArray = [];

const TOTAL_DOTS = 1000;
const DOT_SIZE = 4;
let globeRadius = canvasWidth * 0.7;
let globeCenterZ = -globeRadius;
let canvasCenterX = canvasWidth / 2;
let canvasCenterY = canvasHeight / 2;
let perspectiveDepth = canvasWidth * 0.8;

function createDots(x, y, z) {
  const dot = {
    x: x,
    y: y,
    z: z,
    xProjected: 0,
    yProjected: 0,
    sizeProjected: 0,
  };

  dot.project = function(sinAngle, cosAngle) {
    const rotatedX = cosAngle * dot.x + sinAngle * (dot.z - globeCenterZ);
    const rotatedZ = -sinAngle * dot.x + cosAngle * (dot.z - globeCenterZ) + globeCenterZ;
    const scaleFactor = perspectiveDepth / (perspectiveDepth + rotatedZ);

    dot.xProjected = canvasCenterX + rotatedX * scaleFactor;
    dot.yProjected = canvasCenterY + dot.y * scaleFactor;
    dot.sizeProjected = DOT_SIZE * scaleFactor;
  };

  dot.draw = function(sinAngle, cosAngle) {
    dot.project(sinAngle, cosAngle);
    ctx.beginPath();
    ctx.arc(dot.xProjected, dot.yProjected, dot.sizeProjected, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };

  return dot;
}

function initializeDots() {
  dotsArray = [];

  for (let i = 0; i < TOTAL_DOTS; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const x = globeRadius * Math.sin(phi) * Math.cos(theta);
    const y = globeRadius * Math.sin(phi) * Math.sin(theta);
    const z = globeRadius * Math.cos(phi) + globeCenterZ;

    dotsArray.push(createDots(x, y, z));
  }
}

function renderScene(timestamp) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  rotationAngle = timestamp * 0.0004;
  const sinAngle = Math.sin(rotationAngle);
  const cosAngle = Math.cos(rotationAngle);

  dotsArray.forEach(dot => dot.draw(sinAngle, cosAngle));

  window.requestAnimationFrame(renderScene);
}

function onResize() {
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;
  globeRadius = canvasWidth * 0.7;
  globeCenterZ = -globeRadius;
  canvasCenterX = canvasWidth / 2;
  canvasCenterY = canvasHeight / 2;
  perspectiveDepth = canvasWidth * 0.8;
  setCanvasSize();
  initializeDots();
}

window.addEventListener('resize', onResize);
initializeDots();
window.requestAnimationFrame(renderScene);