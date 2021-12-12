const C_HEIGHT = 1000, C_WIDTH = 1000;
const DFAULT_RADII = 70;
const DFAULT_COLOR = '#000';

function Point(y, x) { return {y, x}; };
function rInt(min, max) { return Math.floor(Math.random() * (max-min)); };
function Circle(name, center, rad, color) { return {name, center, rad, color};};

const c = document.querySelector("canvas");
let ctx = c.getContext("2d");
ctx.canvas.height = C_HEIGHT;
ctx.canvas.width = C_WIDTH;

function refreshCirclesProperties() {
    let radii = [], color = [], names = ['A', 'B', 'C'];
    document.querySelectorAll("input[type=number]").forEach(e => radii.push(parseInt(e.value) || DFAULT_RADII));
    document.querySelectorAll("input[type=color]").forEach(c => color.push(c.value || DFAULT_COLOR));
    return radii.map((r, i) => [names[i], r, color[i]]);
}

function drawCircles() {
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

    let properties = refreshCirclesProperties();
    let A, B, C;
    [A, B, C] = (() => {
        let circles = [];
        properties.forEach(c => circles.push(Circle(c[0], Point(0,0), c[1], c[2])));
        return circles;
    })();

    // Cosine law 
    let AB = A.rad + B.rad;
    let AC = A.rad + C.rad;
    let BC = B.rad + C.rad;

    let theta = Math.acos((AB**2 + AC**2 - BC**2)/(2*AB*AC)) / 2;

    A.center = Point(2*A.rad, 500);
    B.center = Point(A.center.y + AB*Math.cos(theta), A.center.x - AB*Math.sin(theta));
    C.center = Point(A.center.y + AC*Math.cos(theta), A.center.x + AC*Math.sin(theta));
    
    [A, B, C].forEach(c => {
        console.log(c);
        ctx.strokeStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.center.x, c.center.y, c.rad, 0, 6.3);
        ctx.fillText(c.name, c.center.x-1, c.center.y+1);
        ctx.stroke();
    });
}

document.querySelector("button").addEventListener("click", () => drawCircles());

drawCircles();
