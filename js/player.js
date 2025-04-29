import { _front } from "./front.js";
const _Player = {
    datas:{
        image: { src: "assets/Player.png", imgwidth: 192, imgheight: 320, width: 32, height: 32, frameRate: 8 },
        SPRITE_SIZE: 32,
        Animations:[
            { name: "idle_down", row: 0, frames: 6},
            { name: "idle_right", row: 1, frames: 6 },
            { name: "idle_up", row: 2, frames: 6 },
            { name: "walk_down", row: 3, frames: 6, idleIndex: 0},
            { name: "walk_right", row: 4, frames: 6, idleIndex: 1},
            { name: "walk_up", row: 5, frames: 6, idleIndex: 2},
            { name: "attack_down", row: 6, frames: 4, idleIndex: 0},
            { name: "attack_right", row: 7, frames: 4, idleIndex: 1},
            { name: "attack_up", row: 8, frames: 4, idleIndex: 2},
            { name: "death", row: 9, frames: 4},
            { name: "idle_left", row: 1, frames: 6, flip:true},
            { name: "walk_left", row: 4, frames: 6, flip:true, idleIndex: 10},
            { name: "attack_left", row: 7, frames: 4, flip:true, idleIndex: 10},
        ]
    },
    init:function(canvas){
        this.canvas = canvas;
        this.PlayerSpriteSheet = new Image();
        this.PlayerSpriteSheet.src = this.datas.image.src

        this.PlayerSpriteSheet.onload = () => {
            console.log("Image du joueur chargée !", this.PlayerSpriteSheet.src);
        };
        this.player = {
            // x: this.canvas.width / 2 - this.datas.image.src.SPRITE_SIZE / 2,
            // y: this.canvas.height / 2 - this.datas.image.src.SPRITE_SIZE / 2,
            animationIndex: 0,
            frameIndex: 0,
            moving: false,
            lastWalkAnimation: 0
        }
    },
    drawPlayer() {
        let centerX = this.canvas.canvas.width / 2;
        let centerY = this.canvas.canvas.height / 2;
        const ctx = this.canvas.canvas.getContext("2d");
    
        let anim = this.datas.Animations[this.player.animationIndex] 
        ?? this.datas.Animations[0];
    
        let frameWidth = this.datas.image.imgwidth / 6;  // Découpage en 6 colonnes
        let frameHeight = this.datas.image.imgheight / 10; // Découpage en 10 lignes
    
        // 🔥 Ajout de l'animation en continu
        if (this.player.moving) {
            let now = performance.now();
            if (now - this.player.lastWalkAnimation > 100) { // Change de frame toutes les 100ms
                this.player.frameIndex = (this.player.frameIndex + 1) % anim.frames;
                this.player.lastWalkAnimation = now;
            }
        } else {
            // this.player.frameIndex = 0; // Revenir à la frame idle si immobile
            let idleAnim = this.datas.Animations[anim.idleIndex]; // Récupérer l'animation idle associée
            if (idleAnim) {
                anim = idleAnim; // Changer l'animation actuelle vers Idle
            }
            let now = performance.now();
            if (now - this.player.lastWalkAnimation > 150) { // Un peu plus lent que la marche
                this.player.frameIndex = (this.player.frameIndex + 1) % anim.frames;
                this.player.lastWalkAnimation = now;
            }
        }
    
        if (anim.flip) {
            ctx.save();
            ctx.scale(-1, 1);
            let flippedX = -centerX - frameWidth / 2;
    
            ctx.drawImage(
                this.PlayerSpriteSheet,
                this.player.frameIndex * frameWidth, // Découpe horizontale
                anim.row * frameHeight,  // Découpe verticale
                frameWidth,
                frameHeight,
                flippedX,
                centerY - frameHeight / 2,
                frameWidth,
                frameHeight
            );
    
            ctx.restore();
        } else {
            ctx.drawImage(
                this.PlayerSpriteSheet,
                this.player.frameIndex * frameWidth, // Découpe horizontale
                anim.row * frameHeight,  // Découpe verticale
                frameWidth,
                frameHeight,
                centerX - frameWidth / 2, // x
                centerY - frameHeight / 2, // y
                frameWidth, frameHeight
            );
        }
        console.log(this.x,this.y)
    }
}
export class Player {
    constructor() {
        this.localData = localStorage.getItem('player');
        this.ico = {
            stats: { hp: '❤️',endurance: '⚡',moral: '😀',moveSpeed: '🏃‍♂️',force: '💪', intelligence: '🧠', dexterite: '🎯', charisme: '🗣️', constitution: '🏋️', sagesse: '📜' },
            inventaire: '🎒',
            gender: {male:'🚹',female:'🚺',idk:'❓'},
            job: {physique:'🛡️',agile:'🤸',magique:'🪄',distance:'🏹'}
        }
        this.classes = {
            physique: { ico:'🛡️', stats: { hp: 110,endurance: 100,moral: 100,moveSpeed: 18,force: 15, intelligence: 5, dexterite: 8, charisme: 10, constitution: 12, sagesse: 6 }},
            agile: { ico:'🤸', stats: { hp: 100,endurance: 100,moral: 100,moveSpeed: 103,force: 8, intelligence: 10, dexterite: 15, charisme: 10, constitution: 8, sagesse: 7 }},
            magique: { ico:'🪄', stats: { hp: 90,endurance: 100,moral: 120,moveSpeed: 20,force: 5, intelligence: 15, dexterite: 8, charisme: 12, constitution: 7, sagesse: 15 }},
            distance: { ico:'🏹', stats: { hp: 100,endurance: 100,moral: 100,moveSpeed: 22,force: 10, intelligence: 8, dexterite: 14, charisme: 9, constitution: 8, sagesse: 10 }}
        };
    }
    init(callbackPlayer) {
        this._Player = _Player;
        this.callbackPlayer = callbackPlayer;
        if (this.localData) {
            let parsedData = JSON.parse(this.localData);
            Object.assign(this, parsedData);
            this.discoveredTiles = new Map(parsedData.discoveredTiles ? parsedData.discoveredTiles : []);

            console.log('loading last local save....')
            this.callbackPlayer()

        } else {
            this.name = ''
            this.x = 0
            this.y = 0
            this.stats = {};
            this.inventory = [];
            this.discoveredTiles = new Map();

            this.createNameSelectionModal();
        }
        this._Player.x = this.x
        this._Player.y = this.y
    }
    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }
    createClassSelectionModal() {
        this.modal = _front.createElement({
            tag: "div",
            attributes: {id:"classModal"},
            style: {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(0, 0, 0, 0.9)",
                padding: "20px",
                borderRadius: "10px",
                color: "white",
                fontSize: "16px",
                zIndex: "2000",
                textAlign: "center"
            }
        });

        let title = _front.createElement({tag: "h2", attributes: {textContent: "Choisissez votre classe"}});
        this.modal.appendChild(title);


        Object.keys(this.classes).forEach(jobName => {
            let button = _front.createElement({
                tag: "button",
                style: { margin: "5px", padding: "10px", fontSize: "14px", cursor: "pointer" },
                attributes: { textContent: jobName }
            });
            button.addEventListener("click", () => this.selectClass(jobName, this.classes[jobName].stats));
            this.modal.appendChild(button);
        });

        document.body.appendChild(this.modal);
    }
    createNameSelectionModal() {
        this.nameModal = _front.createElement({tag: "div",attributes: {id:"nameModal"},style: {position: "fixed",top: "50%",left: "50%",transform: "translate(-50%, -50%)",background: "rgba(0, 0, 0, 0.9)",padding: "20px",borderRadius: "10px",color: "white",fontSize: "16px",zIndex: "2000",textAlign: "center"}});
        let title = _front.createElement({tag: "h2", attributes: {textContent: "Choisissez votre Nom"}});
        this.nameInput = _front.createElement({tag: "input",attributes: { placeholder: 'non' },style: { margin: "5px", padding: "10px", fontSize: "14px", cursor: "pointer" }});
        this.nameButton = _front.createElement({tag: "button",attributes: { textContent: 'Valider' },style: { margin: "5px", padding: "10px", fontSize: "14px", cursor: "pointer" , display: "none" }});
        
        this.nameModal.appendChild(title);
        this.nameModal.appendChild(this.nameInput);
        this.nameModal.appendChild(this.nameButton);

        this.nameInput.addEventListener("input", (event) => {
            if (event.target.value.length >0) {
                this.nameInput.value = _front.sanitizeName(event.target.value)
            }
            if (event.target.value.length >= 5 && event.target.value.length < 12 ) {
                this.nameButton.style.display = 'initial'
            }
            else {
                this.nameButton.style.display = 'none'
            }
        });
        this.nameButton.addEventListener("click", (event) => {
            if (this.nameInput.value.length >= 5 && this.nameInput.value.length < 12 ) {
                this.name = _front.sanitizeName(this.nameInput.value)
                this.nameModal.remove()
                this.createClassSelectionModal()
            }
        });

        document.body.appendChild(this.nameModal);
    }
    selectClass(jobName, stats) {
        console.log("Sélection de la classe :", jobName);
        this.jobName = jobName;
        this.stats = stats;
        this.savePlayerDatas();
            this.modal.remove();
            this.modal = null;
        this.callbackPlayer()
    }
    savePlayerDatas() {
        // Convertir `discoveredTiles` en tableau
        let saveData = {
            name: this.name,
            x: this.x,
            y: this.y,
            stats: this.stats,
            inventory: this.inventory,
            jobName: this.jobName,
            discoveredTiles: Array.from(this.discoveredTiles.entries())
        };
        localStorage.setItem('player', JSON.stringify(saveData));
    }
}

