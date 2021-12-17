const C_HEIGHT = 900, C_WIDTH = 1200;
const DFAULT_RADII = 0.15*C_WIDTH;
const DFAULT_COLOR = '#000';

function Point(y, x) { return {y, x}; };
function rInt(min, max) { return Math.floor(Math.random() * (max-min)); };
function Circle(name, center, rad, color) { return {name, center, rad, color};};

const cCircles = document.querySelector("#canvas-circles-abc");
const ctxCircles = cCircles.getContext("2d");

const cTangentPoints = document.querySelector("#canvas-tangent-points-abc");
const ctxTangentPoints = cTangentPoints.getContext("2d");

const cTriangle = document.querySelector("#canvas-triangle-abc");
const ctxTriangle = cTriangle.getContext("2d");

ctxCircles.canvas.height = C_HEIGHT;
ctxTangentPoints.canvas.height = C_HEIGHT;
ctxTriangle.canvas.height = C_HEIGHT;

ctxCircles.canvas.width = C_WIDTH;
ctxTangentPoints.canvas.width = C_WIDTH;
ctxTriangle.canvas.width = C_WIDTH;

ctxCircles.font = "30px Arial";

let A, B, C;
let angleA;

function refreshCirclesProperties() {
    let radii = [], color = [], names = ['A', 'B', 'C'];
    document.querySelectorAll("input[type=number]").forEach(e => radii.push(parseInt(e.value) || DFAULT_RADII));
    document.querySelectorAll("input[type=color]").forEach(c => color.push(c.value || DFAULT_COLOR));
    return radii.map((r, i) => [names[i], r, color[i]]);
}

function drawCircles() {
    ctxCircles.clearRect(0, 0, C_WIDTH, C_HEIGHT);

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

    angleA = Math.acos((AB**2 + AC**2 - BC**2)/(2*AB*AC)) / 2;

    A.center = Point(1.5*A.rad, 0.5*C_WIDTH);
    B.center = Point(A.center.y + AB*Math.cos(angleA), A.center.x - AB*Math.sin(angleA));
    C.center = Point(A.center.y + AC*Math.cos(angleA), A.center.x + AC*Math.sin(angleA));

    [A, B, C].forEach(c => {
        ctxCircles.strokeStyle = c.color;
        ctxCircles.beginPath();
        ctxCircles.arc(c.center.x, c.center.y, c.rad, 0, 6.3);
        ctxCircles.fillText(c.name, c.center.x-1, c.center.y+1);
        ctxCircles.stroke();
    });
}

document.querySelector("#show-tangent-abc").addEventListener("change", (e) => {
    if (!e.target.checked) {
        ctxTangentPoints.clearRect(0, 0, C_WIDTH, C_HEIGHT);
        return;
    }
    // Cosine law
    let AB = A.rad + B.rad;
    let AC = A.rad + C.rad;
    let BC = B.rad + C.rad;
    let angleB = Math.acos((AB**2 + BC**2 - AC**2)/(2*AB*BC)) / 2;
    let angleComplement = Math.PI - angleB;

    // Calculate Tangent Points
    let tAB = Point(A.rad * Math.cos(angleA) + A.center.y, A.center.x - A.rad * Math.sin(angleA));
    let tAC = Point(A.rad * Math.cos(angleA) + A.center.y, A.center.x + A.rad * Math.sin(angleA));
    let tBC = Point(B.rad * Math.cos(angleComplement) + B.center.y, B.center.x + B.rad * Math.sin(angleComplement));

    console.log({angleComplement, tBC});
    // Draw
    ctxTangentPoints.beginPath();
    ctxTangentPoints.fillRect(tAB.x, tAB.y, 5, 5);
    ctxTangentPoints.fillRect(tAC.x, tAC.y, 5, 5);
    ctxTangentPoints.fillRect(tBC.x, tBC.y, 5, 5);
    ctxTangentPoints.stroke();
});

document.querySelector("#show-triangle-abc").addEventListener("change", e => {
    if (!e.target.checked) {
        ctxTriangle.clearRect(0, 0, C_WIDTH, C_HEIGHT);
        return;
    }

    ctxTriangle.beginPath();
    ctxTriangle.moveTo(A.center.x, A.center.y);
    ctxTriangle.lineTo(C.center.x, C.center.y);
    ctxTriangle.lineTo(B.center.x, B.center.y);
    ctxTriangle.lineTo(A.center.x, A.center.y);
    ctxTriangle.stroke();
});

document.querySelector("button").addEventListener("click", () => drawCircles());

drawCircles();
