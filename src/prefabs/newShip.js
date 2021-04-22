class newShip extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.point = pointValue;
        this.newShipspeed = game.settings.newShipspeed;
    }

    update() {
        this.x -= this.newShipspeed;
        if(this.x < 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}