export class Skeleton {
    constructor(x, y, image) {
        this.datas={
            image: { src: "assets/Skeleton.png", imgwidth: 192, imgheight: 320, width: 64, height: 64, frameRate: 8 },
            SPRITE_SIZE: 32,
            Animations:[
                { name: "idle_down", row: 0, frames: 6},//0
                { name: "idle_right", row: 1, frames: 6 },//1
                { name: "idle_up", row: 2, frames: 6 },//2
                { name: "walk_down", row: 3, frames: 6, idleIndex: 0},//3
                { name: "walk_right", row: 4, frames: 6, idleIndex: 1},//4
                { name: "walk_up", row: 5, frames: 6, idleIndex: 2},//5
                { name: "death", row: 6, frames: 4},//6
                { name: "attack_down", row: 6, frames: 4, idleIndex: 0},//7
                { name: "attack_right", row: 7, frames: 4, idleIndex: 1},//8
                { name: "attack_up", row: 8, frames: 4, idleIndex: 2},//9
                { name: "death", row: 9, frames: 4},//10
                { name: "idle_left", row: 1, frames: 6, flip:true},//11
                { name: "walk_left", row: 4, frames: 6, flip:true, idleIndex: 10},//12
                { name: "attack_left", row: 7, frames: 4, flip:true, idleIndex: 10},//13
            ],
            stats:{ 
                ico:'🛡️', 
                stats: {
                    hp: 150,endurance: 100,moral: 0,moveSpeed: 9,force: 12,
                    intelligence: 5, dexterite: 6, charisme: 6, constitution: 15,
                    sagesse: 3
                }
            }
        }
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.width = 32;
        this.height = 32;
        this.health = 50;
        this.state = 'patrolling'; // 'patrolling', 'chasing', 'attacking'
        this.direction = 1; // 1 = right, -1 = left
        this.patrolDistance = 100;
        this.startX = x;
        this.image = new Image();
        this.image.src = 'assets/Skeleton.png';
        
    }

    update(player) {
        if (this.health <= 0) return;

        let distanceToPlayer = Math.abs(player.x - this.x);
        
        if (distanceToPlayer < 150) {
            this.state = 'chasing';
        } else {
            this.state = 'patrolling';
        }

        if (this.state === 'patrolling') {
            this.patrol();
        } else if (this.state === 'chasing') {
            this.chase(player);
        }
    }

    patrol() {
        this.x += this.speed * this.direction;
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
    }

    chase(player) {
        if (player.x > this.x) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log("Skeleton defeated!");
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }

    attack(player) {
        if (this.checkCollision(player)) {
            player.takeDamage(10);
        }
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
