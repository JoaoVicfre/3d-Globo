const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

let rotationAngle = 0;
const TOTAL_DOTS = 1000;
const DOT_SIZE = 2;
const globeRadius = 200;
const perspectiveDepth = 400;
let dotsArray = [];

function createDot(x, y, z) {
    return { x, y, z, xProjected: 0, yProjected: 0, sizeProjected: 0 };
}

function initializeDots() {
    dotsArray = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const x = globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = globeRadius * Math.sin(phi) * Math.sin(theta);
        const z = globeRadius * Math.cos(phi);

        dotsArray.push(createDot(x, y, z));
    }
}

function project(dot, sinAngle, cosAngle) {
    const rotatedX = cosAngle * dot.x + sinAngle * dot.z;
    const rotatedZ = -sinAngle * dot.x + cosAngle * dot.z;
    const scaleFactor = perspectiveDepth / (perspectiveDepth + rotatedZ);
    
    dot.xProjected = canvas.width / 2 + rotatedX * scaleFactor;
    dot.yProjected = canvas.height / 2 + dot.y * scaleFactor;
    dot.sizeProjected = DOT_SIZE * scaleFactor;
}

function renderScene(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    rotationAngle = timestamp * 0.0004;
    const sinAngle = Math.sin(rotationAngle);
    const cosAngle = Math.cos(rotationAngle);

    dotsArray.forEach(dot => {
        project(dot, sinAngle, cosAngle);
        ctx.beginPath();
        ctx.arc(dot.xProjected, dot.yProjected, dot.sizeProjected, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });

    window.requestAnimationFrame(renderScene);
}

window.addEventListener("resize", setCanvasSize);
initializeDots();
window.requestAnimationFrame(renderScene);
