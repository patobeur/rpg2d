class Keyboard {
    constructor() {
        this.authkeys = ['q','d','z','s','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',]
        this.keys = {};
    }
    init(WorldConf,Player) {
        this.WorldConf = WorldConf;
        this.Player = Player;
        this.initControls();
    }    
    // Initialisation des contrôles au keybaord
    initControls() {
        document.addEventListener('keydown', (event) => {
            if (this.authkeys.includes(event.key)) {
                this.keys[event.key] = true; // Marque la touche comme pressée
            }
        });
        document.addEventListener('keyup', (event) => {
            if (this.authkeys.includes(event.key)) {
                this.keys[event.key] = false; // Marque la touche comme relâchée
            }
        });
    }
    // check des touches de déplacement
    getMoves(deltaTime) {
        this.Player._Player.player.moving = false;
    
        // ---------------------------
        // let deltaX = (this.keys["d"] || this.keys["ArrowRight"]) - (this.keys["q"] || this.keys["ArrowLeft"]);
        // let deltaY = (this.keys["s"] || this.keys["ArrowDown"]) - (this.keys["z"] || this.keys["ArrowUp"]);

        // if (deltaX || deltaY) {
        //     let speed = this.Player.stats.moveSpeed * deltaTime;
        //     this.WorldConf.offsetX -= deltaX * speed;
        //     this.WorldConf.offsetY -= deltaY * speed;
        //     this.Player.x += deltaX * speed;
        //     this.Player.y += deltaY * speed;
        // }
        // -------------------------------

        let moveX = 0;
        let moveY = 0;
        
        if (this.keys["q"] || this.keys["ArrowLeft"]) moveX -= 1;
        if (this.keys["d"] || this.keys["ArrowRight"]) moveX += 1;
        if (this.keys["z"] || this.keys["ArrowUp"]) moveY -= 1;
        if (this.keys["s"] || this.keys["ArrowDown"]) moveY += 1;
    
        // Vérifier si déplacement en diagonale et ajuster la vitesse
        let isDiagonal = Math.abs(moveX) + Math.abs(moveY) === 2;
        let speed = isDiagonal ? this.Player.stats.moveSpeed * deltaTime / Math.sqrt(2) : this.Player.stats.moveSpeed * deltaTime;
    
        // Appliquer le déplacement
        this.WorldConf.offsetX -= moveX * speed;
        this.WorldConf.offsetY -= moveY * speed;
        this.Player._Player.player.x += moveX * speed;
        this.Player._Player.player.y += moveY * speed;
        this.Player.x += moveX * speed;
        this.Player.y += moveY * speed;
    
        // Définir l'animation en fonction de la direction
        if (moveX !== 0 || moveY !== 0) {
            this.Player._Player.player.moving = true;
            if (moveY < 0) this.Player._Player.player.animationIndex = 5; // Haut
            if (moveY > 0) this.Player._Player.player.animationIndex = 3; // Bas
            if (moveX < 0) this.Player._Player.player.animationIndex = 11; // Gauche
            if (moveX > 0) this.Player._Player.player.animationIndex = 4; // Droite
        }
    }
    
}
class Canvas {
     constructor(WorldConf) {
        this.WorldConf = WorldConf
        this.canvas = document.createElement('canvas');
        this.canvas.id = "gameCanvas"
        this.offscreenCtx = this.canvas.getContext("2d");
        this.needsRedraw = true;
    }
    init() {

        document.body.prepend(this.canvas)
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    render(dt) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let centerX = this.canvas.width / 2;
        let centerY = this.canvas.height / 2;
        let tileSize = this.WorldConf.tileSize;
        
        this.WorldConf.discoveredTiles.forEach((color, key) => {
            let [worldX, worldY] = key.split(',').map(Number);
            let screenX = centerX + worldX * tileSize + this.WorldConf.offsetX;
            let screenY = centerY + worldY * tileSize + this.WorldConf.offsetY;

            this.ctx.fillStyle = color;
            this.ctx.fillRect(screenX, screenY, tileSize, tileSize);
        });
        // this.drawPlayer()
    }
}

class UI {
    constructor(_front) {
        this._front = _front;
    }
    init(player) {
        this.player = player;
    }
    createUiSaveButton(sauvegarder) {
        this.uiSaveButtonDiv = this._front.createElement({tag:'div',attributes: {id:"uiSaveButtonDiv"}, style: {cursor:'pointer',zIndex:'1000',position:'absolute', bottom:'10px', right:'10px',borderRadius: '9px' }});
        this.uiSaveButton = this._front.createElement({tag:'button',attributes: {textContent:'SAVE',id:"uiSaveButton"}, style: {padding:'2px 5px'}});
        this.uiSaveButtonDiv.appendChild(this.uiSaveButton);
        document.body.appendChild(this.uiSaveButtonDiv);
        this.uiSaveButton.addEventListener('click',sauvegarder)

    }
    createUiFiche() {
        this.cssString = "#uiContainer {position: absolute; top: 10px; left: 10px; background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; color: white; font-size: 14px;}";
        this._front.addCss(this.cssString, 'uiContainer');
        
        this.uiContainer = this._front.createElement({tag:'div',attributes: {id:"uiContainer"}});
        document.body.appendChild(this.uiContainer);

        // Élément name
        this.nameElement = this._front.createElement({} );
        this.nameLabel = this._front.createElement({tag:"span",attributes: {textContent:"🦲 "}});
        this.nameValue = this._front.createElement({tag:"span"});
        this.nameElement.appendChild(this.nameLabel);
        this.nameElement.appendChild(this.nameValue);
        this.uiContainer.appendChild(this.nameElement);

        // Élément Job
        this.jobElement = this._front.createElement({} );
        this.jobLabel = this._front.createElement({tag:"span",attributes: {textContent:this.player.classes[this.player.jobName].ico+" Job: "}});
        this.jobValue = this._front.createElement({tag:"span"});
        this.jobElement.appendChild(this.jobLabel);
        this.jobElement.appendChild(this.jobValue);
        this.uiContainer.appendChild(this.jobElement);

        // Élément inventaire
        this.inventoryElement = this._front.createElement({} );
        this.inventoryLabel = this._front.createElement({tag:"span",attributes: {textContent:"🎒 Inventaire: "}} );
        this.inventoryValue = this._front.createElement({tag:"span"});
        this.inventoryElement.appendChild(this.inventoryLabel);
        this.inventoryElement.appendChild(this.inventoryValue);
        this.uiContainer.appendChild(this.inventoryElement);


        this.statsgroupe = this._front.createElement({style: {cursor:'pointer',display: 'flex',justifyContent: 'space-between',flexDirection: 'row'}});
        let statsvalue = this._front.createElement({tag:"span",attributes: {textContent:'Stats '}});
        this.statslabel = this._front.createElement({tag:"span",attributes: {textContent:"▶️"}} );

        this.statsgroupe.appendChild(statsvalue);
        this.statsgroupe.appendChild(this.statslabel);
        this.uiContainer.appendChild(this.statsgroupe);


        this.stats = this._front.createElement({attributes: {className:"statsgroupe"},style: {display:'none'}});
        for (const key in this.player.stats) {
            if (Object.prototype.hasOwnProperty.call(this.player.stats, key)) {
                const element = this.player.stats[key];
                
                let ico = this.player.ico.stats[key];
                let groupe = this._front.createElement({});
                let label = this._front.createElement({tag:"span",attributes: {textContent:ico+" "+key+":"}});
                let value = this._front.createElement({tag:"span",attributes: {textContent:element}});

                groupe.appendChild(label);
                groupe.appendChild(value);
                this.stats.appendChild(groupe);
                
            }
        }
        this.uiContainer.appendChild(this.stats);
        this.statsgroupe.addEventListener('click', ()=>{
            console.log('click')
            if(this.stats.style.display == 'none') {
                this.stats.style.display = 'initial';
                this.statslabel.textContent = '🔽'
            }
            else {
                this.stats.style.display = 'none';
                this.statslabel.textContent = '▶️'
            }
        })
    }

    updateUiFiche() {
        this.nameValue.textContent = this.player.name.toUpperCase();
        this.jobValue.textContent = this.player.jobName;
        this.inventoryValue.textContent = this.player.inventory.length > 0 ? this.player.inventory.join(', ') : 'Vide';
    }
}
class WorldConf {
    constructor() {
    }
    init() {
        this.savedWorld = localStorage.getItem('world');
        if (this.savedWorld) {
            let parsedWorld = JSON.parse(this.savedWorld);
            Object.assign(this, parsedWorld);
            this.discoveredTiles = new Map(parsedWorld.discoveredTiles);
            console.log('Loading last local world:')
        } else {
            this.tileSize = 16;
            this.viewRadius = 5;
            this.offsetX = 0;
            this.offsetY = 0;
            this.discoveredTiles = new Map();
            this.time = new Date()
            this.save();
        }
    }
    save() {
        this.time = new Date()
        let datas = {
            ...this,
            discoveredTiles: Array.from(this.discoveredTiles.entries())
        }
        localStorage.setItem('world', JSON.stringify(datas));
        // console.log('Saving world to local:',datas)
    }
    discoverTile(x, y) {
        const key = `${x},${y}`;
        if (!this.discoveredTiles.has(key)) {
            // nouvelle case découverte
            this.discoveredTiles.set(key, 'gray');
            this.save();
        }
    }
    discoverVisibleTiles() {
        let centerX = Math.floor(-this.offsetX / this.tileSize);
        let centerY = Math.floor(-this.offsetY / this.tileSize);
        for (let i = -this.viewRadius; i <= this.viewRadius; i++) {
            for (let j = -this.viewRadius; j <= this.viewRadius; j++) {
                if (Math.sqrt(i * i + j * j) <= this.viewRadius) {
                    this.discoverTile(centerX + i, centerY + j);
                }
            }
        }
    }
}
export { Keyboard, Canvas, UI, WorldConf}