const C_HEIGHT = 900, C_WIDTH = 1200;
const DFAULT_RADII = 0.15*C_WIDTH;
const DFAULT_COLOR = '#000';

function Point(y, x) { return {y, x}; };
function rInt(min, max) { return Math.floor(Math.random() * (max-min)); };
function Circle(name, center, rad, color) { return {name, center, rad, color};};

const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

ctx.canvas.height = C_HEIGHT;
ctx.canvas.width = C_WIDTH;

ctx.font = "30px Arial";

let A, B, C;
let angleA, angleB, angleC;

function refreshCirclesProperties() {
    let radii = [], color = [], names = ['A', 'B', 'C'];
    document.querySelectorAll("input[type=number]").forEach(e => radii.push(parseInt(e.value) || DFAULT_RADII));
    document.querySelectorAll("input[type=color]").forEach(c => color.push(c.value || DFAULT_COLOR));
    return radii.map((r, i) => [names[i], r, color[i]]);
}

function drawCircles() {
    let properties = refreshCirclesProperties();
    [A, B, C] = (() => {
        let circles = [];
        properties.forEach(c => circles.push(Circle(c[0], Point(0,0), c[1], c[2])));
        return circles;
    })();

    // Cosine law 
    let AB = A.rad + B.rad;
    let AC = A.rad + C.rad;
    let BC = B.rad + C.rad;

    angleA = Math.acos((AB**2 + AC**2 - BC**2)/(2*AB*AC));
    angleB = Math.acos((AB**2 + BC**2 - AC**2)/(2*AB*BC));
    angleC = 2*Math.PI - angleA - angleB;

    B.center = Point(AB + A.rad, 2*B.rad);
    A.center = Point(B.center.y - AB * Math.sin(angleB), AB * Math.cos(angleB) + B.center.x);
    C.center = Point(B.center.y, BC + B.center.x);

    [A, B, C].forEach(c => {
        ctx.strokeStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.center.x, c.center.y, c.rad, 0, 6.3);
        ctx.fillText(c.name, c.center.x-1, c.center.y+1);
        ctx.stroke();
    });
}

function drawTangentPoints () {
    let AB = A.rad + B.rad;
    let AC = A.rad + C.rad;
    let BC = B.rad + C.rad;

    // Calculate Tangent Points
    let tAB = Point(B.center.y - B.rad * Math.sin(angleB), B.center.x + B.rad * Math.cos(angleB));
    let tAC = Point(C.center.y + C.rad * Math.sin(angleC), C.center.x + C.rad * Math.cos(angleC));
    let tBC = Point(B.center.y, B.center.x + B.rad);

    // Draw
    ctx.beginPath();
    ctx.fillRect(tAB.x, tAB.y, 5, 5);
    ctx.fillRect(tAC.x, tAC.y, 5, 5);
    ctx.fillRect(tBC.x, tBC.y, 5, 5);
    ctx.stroke();
}

function drawTriangle () {
    ctx.beginPath();
    ctx.moveTo(A.center.x, A.center.y);
    ctx.lineTo(C.center.x, C.center.y);
    ctx.lineTo(B.center.x, B.center.y);
    ctx.lineTo(A.center.x, A.center.y);
    ctx.stroke();
}

function drawCenters () {
    ctx.beginPath();
    
    [A, B, C].forEach((circle) => {
        ctx.fillStyle = circle.color;
        ctx.fillRect(circle.center.x, circle.center.y, 5, 5);
    });
}

function refreshScreen() {
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    if (document.querySelector("#show-circles").checked) {
        drawCircles();
    }
    if (document.querySelector("#show-tangent-points").checked) {
        drawTangentPoints();
    }
    if (document.querySelector("#show-centers").checked) {
        drawCenters();
    }
    if(document.querySelector("#show-triangle").checked) {
        drawTriangle();
    }
}

// Default checked options
document.querySelector("#show-circles").checked = true;


// Events
document.querySelector("button").addEventListener("click", refreshScreen);
document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => checkbox.addEventListener("change", refreshScreen));

refreshScreen();
