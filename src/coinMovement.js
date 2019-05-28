const Direction = {
    NORTH: 'north',
    EAST: 'east',
    SOUTH: 'south',
    WEST: 'west'
};

class Game {
    constructor(canvasId, width, height, assets) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.frameCount = 0;
        this.assets = assets;

        this.width = 8;
        this.height = 8;

        const gridSize = this.canvas.width / width;
        this.rectangle = new Rectangle(0, 0, Direction.EAST, gridSize, assets, 32);

        this.startAnimating();
    }

    startAnimating() {
        this.frameTime = 1000 / 2;
        this.then = window.performance.now();
        this.animate(this.then);
    }

    animate(currentTime) {
        window.requestAnimationFrame(this.animate.bind(this));

        const now = currentTime;
        const elapsed = now - this.then;

        if (elapsed > this.frameTime) {
            this.then = now;

            this.update();
            this.draw();
        }
    }

    update() {
        this.rectangle.update(this.frameCount);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rectangle.draw(this.context);
        this.frameCount++;
    }
}

class Rectangle {
    constructor(x, y, direction, gridSize, assets, spriteSize) {
        this.x = x;
        this.y = y;
        this.gridSize = gridSize;
        this.assets = assets;
        this.spriteSize = spriteSize;
        this.movementSpeed= 60;
        this.animationSpeed = 60;
        this.currentAnimationState = 0;
        this.animationSheet = [
            {x: 0*this.spriteSize, y: 0*this.spriteSize},
            {x: 1*this.spriteSize, y: 0*this.spriteSize},
            {x: 2*this.spriteSize, y: 0*this.spriteSize},
            {x: 3*this.spriteSize, y: 0*this.spriteSize},
            {x: 4*this.spriteSize, y: 0*this.spriteSize},
            {x: 5*this.spriteSize, y: 0*this.spriteSize}]

        this.spriteSheet = {
            [Direction.NORTH]: {
                x: 1 * this.spriteSize,
                y: 0 * this.spriteSize
            },
            [Direction.EAST]: {
                x: 1 * this.spriteSize,
                y: 1 * this.spriteSize
            },
            [Direction.SOUTH]: {
                x: 0 * this.spriteSize,
                y: 1 * this.spriteSize
            },
            [Direction.WEST]: {
                x: 0 * this.spriteSize,
                y: 0 * this.spriteSize
            }
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

    update(frameCount) {
        if (frameCount % this.animationSpeed === 0) {
            this.currentAnimationState = (this.currentAnimationState + 1) % this.animationSheet.length;
        }
        if (frameCount % this.movementSpeed === 0) {
            switch (this.direction) {
                case Direction.NORTH:
                    return (this.y -= 1);
                case Direction.EAST:
                    return (this.x += 1);
                case Direction.SOUTH:
                    return (this.y += 1);
                case Direction.WEST:
                    return (this.x -= 1);
            }
        }
    }

    draw(context) {
        context.drawImage(
            this.assets.coin,
            this.animationSheet[this.currentAnimationState].x,
            this.animationSheet[this.currentAnimationState].y,
            this.spriteSize,
            this.spriteSize,
            this.x * this.gridSize,
            this.y * this.gridSize,
            this.gridSize,
            this.gridSize
        );
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
        { name: 'coin', url: '/coin.png' },
        { name: 'chicken', url: '/chicken.png'}
    ])
    .then(assets => {
        new Game('myCanvas', 8, 8, assets);
    });