var points = [
    { x: 500, y: 100 },
    { x: 400, y: 150 },
    // { x: 450, y: 200 },
    { x: 500, y: 300 },
    { x: 600, y: 350 },
    { x: 700, y: 400 },
    { x: 1000, y: 450 },
    { x: 1100, y: 200 },
    { x: 900, y: 50 },
];

// var p = {
//     x: 850,
//     y: 650
// }

const butt = document.querySelector("#reload");
butt.addEventListener('click', click);
function click(e){
    e.preventDefault();
    document.location.reload(true);
}

let img;
function preload() {
    img = loadImage('background.jpg');
}
function setup() {
    image(img, 0, 0);
    createCanvas(1400, 700);
    background(img);
}

function getClockwiseAngle(p) {

    var angle = 0.0;
    let xx = p.x;
    let yy = p.y;
    if (xx == 700) {
        xx = 0;
    }
    else {
        xx = (xx - 700) / 100;
    }

    if (yy == 350) {
        yy = 0;
    }
    else {
        yy = -1 * (yy - 350) / 50;
    }

    angle = -1 * Math.atan2(-1 * yy, xx);
    return angle;
}

function orientation(a, b, c) {
    let x1 = a.x; let x2 = b.x; let x3 = c.x;
    let y1 = a.y; let y2 = b.y; let y3 = c.y;
    if (x1 == 700) {
        x1 = 0;
    }
    else {
        x1 = (x1 - 700) / 100;
    }

    if (y1 == 350) {
        y1 = 0;
    }
    else {
        y1 = -1 * (y1 - 350) / 50;
    }

    if (x2 == 700) {
        x2 = 0;
    }
    else {
        x2 = (x2 - 700) / 100;
    }

    if (y2 == 350) {
        y2 = 0;
    }
    else {
        y2 = -1 * (y2 - 350) / 50;
    }
    if (x3 == 700) {
        x3 = 0;
    }
    else {
        x3 = (x3 - 700) / 100;
    }

    if (y3 == 350) {
        y3 = 0;
    }
    else {
        y3 = -1 * (y3 - 350) / 50;
    }

    // console.log(x1, y1, x2, y2, x3, y3);

    let res = (y2 - y1) * (x3 - x2) - (y3 - y2) * (x2 - x1);
    if (res == 0)
        return 0;
    if (res > 0)
        return 1;
    return -1;
}

function sqDist(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

points.sort(function (p1, p2) {
    return getClockwiseAngle(p1) > getClockwiseAngle(p2);
});

const myForm = document.querySelector('#myForm');
const X = document.querySelector('#X');
const Y = document.querySelector('#Y');
const msg = document.querySelector('.msg');


myForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    if (X.value === '' || Y.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'Introduceti coordonatele!';
        msg.style.display = "block";
        setTimeout(() => msg.style.display = 'none', 3000);
    }
    else {
        const xx = parseInt(X.value);
        const yy = parseInt(Y.value);
        var p = {
            x: xx,
            y: yy
        }

        stroke(0, 0, 255);
        fill(0, 0, 255, 50);
        beginShape();
        for (let p of points) {
            vertex(p.x, p.y);
        }
        endShape(CLOSE);

        stroke(0, 255, 0);
        strokeWeight(8);
        for (let pp of points) {
            point(pp.x, pp.y);
        }

        stroke(0, 255, 0);
        strokeWeight(25);
        point(p.x, p.y);



        let ind = 0;
        let n = points.length;

        for (let i = 1; i < n; i++) {
            if (sqDist(p, points[i]) < sqDist(p, points[ind]))
                ind = i;
        }

        setTimeout(() => {
            stroke(200, 0, 255);
            strokeWeight(25);
            point(points[ind].x, points[ind].y);
        }, 500);


        setTimeout(function () {
            stroke(0, 255, 0);
            strokeWeight(2);
            line(points[ind].x, points[ind].y, p.x, p.y);
        }, 1000)



        let up = ind;

        setTimeout(function () {
            while (orientation(p, points[up], points[(up + 1) % n]) >= 0) {
                stroke(0, 255, 0);
                strokeWeight(2);
                up = (up + 1) % n;
                line(p.x, p.y, points[up].x, points[up].y);

            }
        }, 2000);

        let low = ind;

        setTimeout(function () {
            while (orientation(p, points[low], points[(n + low - 1) % n]) <= 0) {
                stroke(0, 255, 0);
                strokeWeight(2);
                low = (n + low - 1) % n;
                line(p.x, p.y, points[low].x, points[low].y);
            }
        }, 3000);


        setTimeout(() => {

            let ret = [];
            let curr = up;

            ret.push(createVector(points[curr].x, points[curr].y));

            while (curr != low) {

                curr = (curr + 1) % n;

                ret.push(createVector(points[curr].x, points[curr].y));
            }

            ret.push(createVector(p.x, p.y));
            points = [];

            for (let i = 0; i < ret.length; i++) {
                points.push(createVector(ret[i].x, ret[i].y));
            }


            strokeWeight(3);
            stroke(237, 34, 93);
            beginShape();
            for (let p of points) {
                vertex(p.x, p.y);
            }
            endShape(CLOSE);
        }, 4000);
        //noLoop();
    }
}