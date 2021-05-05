class Rocket2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.movementSpeed = 3;
        this.firingSpeed = 4;
        this.isFiring = false;
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        if(this.isFiring) {
            this.y -= this.movementSpeed;
            if(keyA.isDown) {
                this.x -= this.movementSpeed;
            }
            if(keyD.isDown) {
                this.x += this.movementSpeed;
            }
            if(this.y < borderUISize*3) {
                this.reset();
            }
        }   
            if(keyA.isDown) {
                this.x -= this.movementSpeed;
            }
            if(keyD.isDown) {
                this.x += this.movementSpeed;
            }

            if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.isFiring = true;
            }
    
            this.x = Phaser.Math.Clamp(
                this.x,
                borderUISize + borderPadding,
                game.config.width - borderUISize - borderPadding);       
        
    }

    reset() {
        this.y = game.config.height-borderUISize-borderPadding;
        this.isFiring = false;
    }
}
