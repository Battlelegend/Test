const Direction = {
    NORTH: 'north',
    EAST: 'east',
    SOUTH: 'south',
    WEST: 'west'
};

const canvas = document.getElementById("myCanvas");
let gameOver = false;

class Game {
    constructor(width, height, assets) {
        this.context = canvas.getContext('2d');

        this.width = width;
        this.height = height;
        this.gridSize = canvas.width / width;
        this.apple = new Apple(this.gridSize, assets);
        this.parts = [{x:0,y:0}];
        this.snake = new Snake(Direction.EAST, this.parts, this.gridSize, assets);

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

    updateApple() {
        let x = Math.round((Math.random()*7.49));
        let y = Math.round((Math.random()*7.49));
        let doubled = false;
        if ( this.snake.head.x === x && this.snake.head.y === y) {
            doubled = true;
        }
        for (let i = 0; i < this.snake.body.length; i++) {
            if (this.snake.body[i].x === x && this.snake.body[i].y === y) {
                doubled = true;
            }
        }
        if (doubled) {
            this.updateApple();
        } else {
            this.apple.update(x,y)
        }
    }

    update() {
        this.snake.update();
        if (this.snake.head.x >= this.width || this.snake.head.y >= this.height || this.snake.head.x < 0 || this.snake.head.y < 0){
            gameOver = true;
        }
        if(this.snake.head.x === this.apple.body.x && this.snake.head.y === this.apple.body.y) {
            this.snake.body.push(this.snake.poped);

            this.updateApple();
        }
    }

    drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    draw() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);

        for(let i=0; i<=this.height; i++) {
            this.drawLine(0, i*canvas.height/this.height, canvas.width, i*canvas.height/this.height);
        }
        for(let i=0; i<=this.width; i++) {
            this.drawLine(i*canvas.width/this.width, 0, i*canvas.width/this.width, canvas.height);
        }
        this.apple.draw(this.context);
        this.snake.draw(this.context);
    }
}

class Rectangle {
    constructor(x, y, spriteClass, currentSprite, gridSize, assets, spriteSize) {
        this.x = x;
        this.y = y;
        this.spriteClass = spriteClass;
        this.currentSprite = currentSprite;
        this.assets = assets;
        this.spriteSize = spriteSize;
        this.gridSize = gridSize;
        this.
    }

    draw(context, color) {
        context.fillStyle = color;
        context.fillRect(
            this.x * this.gridSize,
            this.y * this.gridSize,
            this.gridSize,
            this.gridSize
        );
    }
}

class Snake {
    constructor(direction, parts, gridSize, spriteClass, assets) {
        this.gridSize = gridSize;
        this.head = new Rectangle(parts[0].x , parts[0].y, spriteClass, 0, this.gridSize, this.assets, this.spriteSize);
        this.body = [];
        this.poped = Rectangle;
        this.assets = assets;
        this.spriteSize = 48;

        for (let i = 1; i < parts.length; i++) {
            this.body.push(new Rectangle(parts[i].x, parts[i].y, this.gridSize, this.assets, this.spriteSize));
        }

        this.direction = direction;

        document.addEventListener('keyup', this.changeDirection.bind(this));
    }

    changeDirection(e) {
        switch (e.key) {
            case 'ArrowLeft':
                return (this.direction = Direction.WEST);
            case 'ArrowRight':
                return (this.direction = Direction.EAST);
            case 'ArrowUp':
                return (this.direction = Direction.NORTH);
            case 'ArrowDown':
                return (this.direction = Direction.SOUTH);
        }
    }

    update() {
        this.body.unshift(new Rectangle(this.head.x,this.head.y, this.gridSize));
        this.poped = this.body.pop();

        if (this.direction === Direction.NORTH) {
            this.head.y -= 1;
        }
        if (this.direction === Direction.EAST) {
            this.head.x += 1;
        }
        if (this.direction === Direction.SOUTH) {
            this.head.y += 1;
        }
        if (this.direction === Direction.WEST) {
            this.head.x -= 1
        }

        for (let i = 0; i < this.body.length; i++) {
            if (this.head.x === this.body[i].x && this.head.y === this.body[i].y) {
                gameOver = true;
            }
        }
    }

    draw(context) {
        this.head.draw(context, "yellow");
        if (this.body.length > 0){
            for (let i = 0; i < this.body.length; i++) {
                this.body[i].draw(context, "black");
            }
        }
    }
}

class Apple {
    constructor(gridSize, assets, spriteSize) {
        this.gridSize = gridSize;
        this.assets = assets;
            this.spriteSize = spriteSize;
        this.body = new Rectangle( Math.round((Math.random()*7.49)),  Math.round((Math.random()*7.49)), gridSize, this.assets, this.spriteSize);
    }

    update(x,y){
        this.body = new Rectangle(x,y, this.gridSize, this.assets, this.spriteSize);
    }

    draw(context) {
        this.body.draw(context, "red");
    }
}

class AssetLoader {
    loadAsset(name, url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function() {
                return resolve({ name, image: this });
            });
        });
    }

    loadAssets(assetsToLoad) {
        return Promise.all(
            assetsToLoad.map(asset => this.loadAsset(asset.name, asset.url))
        ).then(assets =>
            assets.reduceRight(
                (acc, elem) => ({ ...acc, [elem.name]: elem.image }),
                {}
            )
        );
    }
}

new AssetLoader()
    .loadAssets([
        { name: 'snake', url: '/snake.png' },
        { name: 'apple', url: '/apple.png'}
    ])
    .then(assets => {
        new Game(8, 8, assets);
    });
