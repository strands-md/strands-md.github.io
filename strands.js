var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();

window.requestAnimationFrame(draw);


var foundPaths = []
var foundPoints = []

var validPaths = [
    ['0.7', '1.7', '0.6', '1.6', '2.6', '3.5', '4.5', '5.5', '5.6', '4.6', '3.6', '2.7', '3.7', '4.7', '5.7'],
    ['6.7', '6.6', '6.5', '6.4', '5.4', '4.4', '3.4', '2.5', '1.5', '1.4', '0.5', '0.4', '0.3'],
    ["0.0", "1.0", "2.0", "2.1", "1.1", "0.1", "0.2", "1.2", "2.2", "3.2"],
    ['5.3', '4.3', '4.2', '3.3', '2.4', '2.3', '1.3'],
    ['6.0', '6.1', '6.2', '6.3', '5.2', '4.1'],
    ['3.0', '3.1', '4.0', '5.0', '5.1'],
]

function isValidPath(path) {
    for (const validPath of validPaths) {
        if (validPath.length === path.length) {
            var allMatch = true
            for (let i = 0; i < path.length; i++) {
                if (validPath[i] !== path[i]) {
                    allMatch = false
                }
            }
            if (allMatch) {
                return true
            }
        }
    }
    return false
}

// Great mom-ents
letters = [
    "BARSEKB",
    "TERNGSA",
    "TCATZNK",
    "SSEZUPI",
    "NILSREV",
    "OTABOBN",
    "COMALUO",
    "RETIONC",
]

var selectedPoints = []


var mouseX = 0
var mouseY = 0

function mousePosition(event) {
    var rect = c.getBoundingClientRect();
    mouseX = event.clientX-rect.left;
    mouseY = event.clientY-rect.top;
}

var mouseDown = 0;
document.body.onmousedown = function() {
    ++mouseDown;
}
document.body.onmouseup = function() {
    --mouseDown;
}

const letterStart = {x: 100, y: 100}
const letterGap = 50

var hasLeftLetter = false;


function drawPath(points, color) {
    var lastSplit = null
    ctx.fillStyle = color;
    for (const point of points) {
        const split = point.split(".")
        ctx.beginPath();
        ctx.arc(split[0]*letterGap+letterStart.x+letterGap/6, split[1]*letterGap+letterStart.y-letterGap/6, letterGap/2.5, 0, 2*Math.PI);
        ctx.fill()

        if (lastSplit !== null) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 13

            ctx.beginPath();
            ctx.moveTo(split[0]*letterGap+letterStart.x+letterGap/6, split[1]*letterGap+letterStart.y-letterGap/6)
            ctx.lineTo(lastSplit[0]*letterGap+letterStart.x+letterGap/6, lastSplit[1]*letterGap+letterStart.y-letterGap/6)
            ctx.stroke()
            ctx.lineWidth = 1

        }
        lastSplit = split
    }
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);


    drawPath(selectedPoints, 'rgb(184 222 236)')
    for (const foundPath of foundPaths) {
        if (foundPath[0] === "6.7") {
            drawPath(foundPath, 'rgb(241 205 81)')
        } else {
            drawPath(foundPath, 'rgb(184 222 236)')
        }
    }


    ctx.fillStyle = '#000'
    ctx.font = "24px Arial";

    x = letterStart.x
    y = letterStart.y
    for (const row of letters) {
        for (const letter of row) {
            ctx.fillText(letter,x,y);
            x += letterGap;
        }
        x = letterStart.x;
        y += letterGap;
    }
    console.log(mouseX-letterStart.x, mouseY-letterStart.y);
    if (mouseDown && mouseX >= letterStart.x && (mouseY >= letterStart.y-20) && mouseX < letterStart.x+6.5*letterGap) {
        const letterX = Math.round((mouseX-letterStart.x) / letterGap)
        const letterY = Math.round((mouseY-letterStart.y) / letterGap)
        const coordinates = letterX+"."+letterY
        console.log([letterX*letterGap+letterStart.x - mouseX + letterGap/3, letterY*letterGap+letterStart.y - mouseY])
        if (Math.pow(letterX*letterGap+letterStart.x - mouseX+letterGap/3, 2) + Math.pow(letterY*letterGap+letterStart.y - mouseY, 2) <= 0.7*Math.pow(letterGap/2, 2)  ) {
            if (selectedPoints.length === 0) {
                if (!foundPoints.includes(selectedPoints)) {
                    selectedPoints = [coordinates]
                }
            } else {
                // console.log(selectedPoints.includes(coordinates))
                if (!selectedPoints.includes(coordinates) && isAdjacent(coordinates, selectedPoints[selectedPoints.length-1])) {
                    if (!foundPoints.includes(selectedPoints)) {
                        selectedPoints.push(coordinates)
                    }
                } else if (selectedPoints.length > 1 && selectedPoints[selectedPoints.length - 2] === coordinates) {
                    selectedPoints.pop()
                }
            }
        }

        console.log([letterX, letterY]);
        console.log(selectedPoints)
    } else {
        if (isValidPath(selectedPoints)) {
            foundPaths.push(selectedPoints)
            foundPoints = foundPoints.concat(selectedPoints)
        }
        selectedPoints = []
    }

    requestAnimationFrame(draw)
}

function isAdjacent(coordinatesA, coordinatesB) {
    const splitA = coordinatesA.split(".");
    const splitB = coordinatesB.split(".");
    return (Math.abs(splitA[0]-splitB[0]) <= 1) && (Math.abs(splitA[1]-splitB[1]) <= 1)

}