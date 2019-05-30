const canvas = document.getElementById("myCanvas");
let gameOver = false;



class Rectangle {
    constructor() {
        this.height = 32;
        this.jumping = true;
        this.width = 32;
        this.x = 144;
        this.x_velocity = 0;
        this.y = 100;
        this.y_velocity = 0;
    }
}

class controller {
    constructor() {
        this.context = canvas.getContext('2d');
        this.left = false;
        this.right = false;
        this.up = false;
        this.rectangle = new Rectangle();

        document.addEventListener('keydown', this.keyListener.bind(this));
        document.addEventListener('keyup', this.keyListener.bind(this));

        this.startAnimating();
    }

    startAnimating() {
        this.frameTime = 1000 / 2;
        this.then = window.performance.now();
        this.animate(this.then);
    }

    animate(currentTime) {
        if(!gameOver) {
            window.requestAnimationFrame(this.animate.bind(this));
            const now = currentTime;
            const elapsed = now - this.then;

            if (elapsed > this.frameTime) {
                this.then = now;

                this.update();
                this.draw();
            }
        } else {
            alert("GameOver");
        }
    }

    keyListener(e) {

        let key_state = (e.type === "keydown");

        switch(e.key) {
            case "ArrowLeft"||"a":
                this.left = key_state;
                break;
            case "ArrowUp"||"w":
                this.up = key_state;
                break;
            case "ArrowRight"||"d":
                this.right = key_state;
                break;
            /*case "ArrowDown"||"s":
                this.down = key_state;
                break;
             */
        }

    }

    update() {

        if (this.up && this.rectangle.jumping === false) {
            this.rectangle.y_velocity -= 20;
            this.rectangle.jumping = true;
        }

        if (this.left) {

            this.rectangle.x_velocity -= 0.5;

        }

        if (this.right) {

            this.rectangle.x_velocity += 0.5;

        }


        this.rectangle.y_velocity += 1.5; // gravity
        this.rectangle.x = this.rectangle.x_velocity;
        this.rectangle.y = this.rectangle.y_velocity;
        this.rectangle.x_velocity *= 0.9; // friction
        this.rectangle.y_velocity *= 0.9; // friction

        // Stop falling lower than the ground ( 16p floor , 32p rectangle height)
        if (this.rectangle.y > (180 - 16 - 32)) {

            this.rectangle.jumping = false;
            this.rectangle.y = 180 - 16 - 32;
            this.rectangle.y_velocity = 0;

        }

        // if rectangle is going off the left of the screen
        if (this.rectangle.x < -32) {

            this.rectangle.x = 320;

        } else if (this.rectangle.x > 320) { // if rectangle is going off the right of the screen

            this.rectangle.x = -32;

        }

    }

    draw () {
        this.context.fillStyle = "#F1F1F1";
        this.context.fillRect(0,0,320,180);
        this.context.fillStyle = "#ff0000";
        this.context.beginPath();
        console.log(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        this.context.rect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        this.context.fill();
        this.context.strokeStyle = "#202830";
        this.context.lineWidth = 4;
        this.context.beginPath();
        this.context.moveTo(0,164);
        this.context.lineTo(320,164);
        this.context.stroke();

    }
}

new controller();