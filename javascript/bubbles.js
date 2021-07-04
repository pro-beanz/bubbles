const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cursorRadius;
let bubbles = [];
let rainbow = false;
let hueShiftSpeed = 1;
let rainbow2 = false;
let colors = [
    [255, 255, 255],
    [19, 19, 19],
    [127, 71, 255]
]
let speedFactor = 1;
let cursorInteraction = true;

class Bubble {
    constructor() {
        // color updates
        document.addEventListener("color", (v) => {
            colors[2] = v.detail.value.split(' ').map(function (c) { return Math.ceil(c * 255) });
            this.updateColor();
        });

        // respawn and randomize starting locations
        this.respawn();
        this.xPos = randRange(0, canvas.width);
        this.yPos = randRange(0, canvas.height);
    }

    respawn() {
        this.radius = randRange(0.00694 * canvas.height, 0.02431 * canvas.height);

        // reset position
        if (oneOrZero() > canvas.height / canvas.width) {
            this.xPos = -this.radius;
            this.yPos = randRange(0, canvas.height);
        } else {
            this.xPos = randRange(0, canvas.width);
            this.yPos = canvas.height + this.radius;
        }

        this.xVelocity = randRange(0.25, 1);
        this.yVelocity = randRange(0.25, 1);

        // this.opacity = randRange(0.05, 0.5);
        this.opacity = remap(0.25, 1, 0.05, 0.5, Math.max(this.xVelocity, this.yVelocity));
        
        // new color
        this.colored = oneOrZero() > 0.5;
        if (this.colored) {
            this.updateColor();
        } else {
            // grey
            this.color = this.formatColor(colors[oneOrZero()]);
        }
    }

    updateColor() {
        if (this.colored) {
            if (rainbow) {
                // rainbow
                this.color = this.getRainbowColor();
            } else {
                // variable color
                this.color = this.formatColor(colors[2]);
            }
        }
    }

    getRainbowColor() {
        let angle;
        if (rainbow2) {
            // 0.00019634954084936208 = w * Math.PI / 1000
            // used to time angular speed (w) to 0.0625(2^-4) rev/s
            angle = (Date.now() * hueShiftSpeed - this.xPos + 2 * this.yPos) * 0.00019634954084936208 % (Math.PI / 2);
        } else {
            angle = ((new Date().getTime() / 8 * hueShiftSpeed - this.xPos + this.yPos) / 4096) % (Math.PI / 2);
        }

        let color = [360 + Math.sin(angle) * -360, 65, 50];
        return "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + this.opacity + ")";
    }

    formatColor(arr) { return "rgba(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + this.opacity + ")"; }

    draw() {
        if (rainbow && rainbow2 && this.colored) this.color = this.getRainbowColor();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

function init() {
    render();
    for (let i = 0; i < 150; i++) { bubbles.push(new Bubble()) }
    update();
}

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cursorRadius = 0.25 * canvas.height;
    borderWidth = 0.01 * canvas.width;
    window.addEventListener('resize', render, true);
}

function update() {
    requestAnimationFrame(update);

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(bubble => {
        // update position
        bubble.xPos += bubble.xVelocity * speedFactor;
        bubble.yPos -= bubble.yVelocity * speedFactor;

        // set displacement variables to make some sense given the direction of the coordinates
        let dX = bubble.xPos - mouseX;
        let dY = bubble.yPos - mouseY;

        // check if the bubble is within the cursor radius
        let d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (cursorInteraction && d <= cursorRadius + bubble.radius) {
            // 0.70712 is sqrt(2) / 2
            const constraint = 0.70712 * d;
            const factor = 2.5;

            let moveX = bubble.xVelocity * speedFactor * dY / d * factor;
            let moveY = bubble.yVelocity * speedFactor * dX / d * factor;

            // push the bubble out of the cursor region
            if (dY <= constraint && dX <= 0) {
                moveX *= -1;
            } else if (dX >= -constraint && dY >= 0) {
                moveY *= -1;
            } else {
                moveX *= -1;
                moveY *= -1;
            }

            // execute move
            bubble.xPos += moveX;
            bubble.yPos += moveY;
        }

        // create new bubble if offscreen
        if (bubble.xPos > canvas.width + bubble.radius || bubble.yPos < -bubble.radius) {
            bubble.respawn();
        }

        bubble.draw();
    })
}

function remap(ol, oh, nl, nh, v) { return (v - ol) / (oh - ol) * (nh - nl) + nl; }
function randRange(low, high) { return remap(0, 1, low, high, Math.random()); }
function oneOrZero() { return Math.random() > 0.5 ? 1 : 0 }

document.onmousemove = updateMousePos;
function updateMousePos(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (mouseX <= borderWidth || mouseX >= canvas.width - borderWidth || mouseY <= borderWidth || mouseY >= canvas.height - borderWidth) {
        mouseX = -cursorRadius;
        mouseY = -cursorRadius;
    }
}

let mouseX = -cursorRadius,
    mouseY = -cursorRadius;
    borderWidth = 0.025 * canvas.width;

canvas.addEventListener("mouseleave", function (event) {
    if (event.clientY <= 0 || event.clientX <= 0 ||
        (event.clientX >= canvas.width || event.clientY >= canvas.height)) {
        mouseX = -cursorRadius;
        mouseY = -cursorRadius;
    }
})

// send events on property updates (Wallpaper Engine)
window.wallpaperPropertyListener = {
    applyUserProperties: (properties) => {
        for (let name in properties) {
            document.dispatchEvent(new CustomEvent(name, { detail: properties[name] }));
        }
    }
};

// property updates

document.addEventListener("rainbow", (v) => {
    rainbow = v.detail.value;
    bubbles.forEach(bubble => { bubble.updateColor(); });
});

document.addEventListener("hueShiftSpeed", (v) => { hueShiftSpeed = v.detail.value });

document.addEventListener("rainbow2", (v) => {
    rainbow2 = v.detail.value;
    bubbles.forEach(bubble => { bubble.updateColor(); });
});

document.addEventListener("speed", (v) => { speedFactor = v.detail.value });

document.addEventListener("bubbleCount", (v) => {
    if (v.detail.value < bubbles.length) {
        for (let i = bubbles.length; i >= v.detail.value; i--) { bubbles.pop() }
    } else {
        for (let i = bubbles.length; i < v.detail.value; i++) {
            bubbles.push(new Bubble());
            bubbles[i].respawn();
        }
    }
});

document.addEventListener("cursor", (v) => {
    cursorInteraction = v.detail.value;
});

// start!
init();