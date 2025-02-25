import { Player } from "./player.js"
import { _front } from "./front.js";
import { Keyboard, Canvas, WorldConf, UI } from "./functions.js";

class Game {
    constructor() {
        // limite 
        this.lastFrameTime = 0;
        this.fpsInterval = 1000 / 60; // 60 FPS

        this.lastUpdateTime = performance.now(); // Stocke le temps du dernier rafraîchissement du jeu
        
        this.Player = new Player(); // Création du joueur
        this.Player.init(this.callbackPlayer); // Création du joueur

    }
    callbackPlayer=()=> {
        this.initWorld()
    }
    initWorld() {
        this.lastFrameTime = performance.now();
        this.WorldConf = new WorldConf(); // Configuration du monde
        this.WorldConf.init(); // Configuration du monde

        this.Canvas = new Canvas(this.WorldConf); // Gestion du rendu sur le canvas
        this.Canvas.init(); // Gestion du rendu sur le canvas

        this.Player._Player.init(this.Canvas)


                // Affichage de la fiche de perso
                this.UI = new UI(_front);
                this.UI.init(this.Player);
                this.UI.createUiFiche();
                this.UI.updateUiFiche();
                this.UI.createUiSaveButton(this.sauvegarder('boutton')); // bouton de sauvegarde


        this.Keyboard = new Keyboard(); // Gestion du clavier        
        this.Keyboard.init(this.WorldConf,this.Player)
        // this.setListeners()
        
        // Démarrage de la boucle de jeu
        this.gameLoop()
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {  // Vérifie si le temps écoulé est suffisant pour le prochain frame
            this.lastFrameTime = now - (elapsed % this.fpsInterval); // Corrige l’intervalle pour rester synchrone
            this.update(elapsed / 1000); // Convertit elapsed en secondes pour deltaTime
        }
    }

    update(dt) {
        this.Keyboard.getMoves(dt)
        
        if(this.Player._Player.player.moving) {
            this.Player.savePlayerDatas()
            this.WorldConf.save()
        }

        this.Canvas.render(dt,this.Player);
        
        this.Player._Player.drawPlayer()
        this.WorldConf.discoverVisibleTiles();

    }
    sauvegarder(comment) {
        let comments = {
            blur:'La fenêtre a perdu le focus.',
            mouseout:'La souris sort de la fenêtre.',
            beforeunload:'Avant de quitter.).',
            visibilitychange:"La page est cachée (peut-être par un alt-tab ou un changement d'onglet)."
        }
        console.info(comments[comment])
        this.Player.savePlayerDatas()
        this.WorldConf.save()
        console.info('world & player saved....')
    }
    setListeners(){
        // Détection de la fermeture de la fenêtre
        window.addEventListener("beforeunload",  (e) =>{this.sauvegarder("beforeunload")});

        // Détection de la souris qui sort du jeu
        document.addEventListener('mouseout',(e)=> {
            console.info(window.innerHeight,window.innerWidth-2)
            console.info(e.clientY,e.clientX)
            if (e.clientY <= 0 || e.clientY >= window.innerHeight ||
                e.clientX <= 0 || e.clientX >= window.innerWidth-2
            ) {
                this.sauvegarder('mouseout')
                this.focus = false
            }
        });
        // double emploi avec focus
        // // Détection de la souris qui entre dans le jeu
        // document.body.addEventListener('mouseenter',(e)=> {
        //     console.info('mouseenter')
        //     this.focus = true
        // });

        // Détection de la perte de focus sur la fenêtre
        window.addEventListener("blur", () => {this.sauvegarder("blur")});

        // Détection de la reprise de focus sur la fenêtre
        window.addEventListener("focus", () => {console.info('focus');this.focus = true});

        // Détection opur savoir si la page est visible
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.sauvegarder("visibilitychange")
                this.focus = false
            } else {
                this.focus = true
            }
        });
    }

}
const rpg2d = new Game();