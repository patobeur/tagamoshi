
const Game = {
    xp:new Number(0),
    stageLv:0,
    animeOn:false,
    _Mobs:_mobs,
    minfast:new Number(0),
    maxfast:new Number(0),
    lifes:{cur:new Number(3),done:false},
    isSceneEmpty:true,
    wordlDivConf: {
        tag:'div',
        attributes:{
            id:'World',
        },
        style:{
            width:(window.innerWidth-50)+'px',
            height:(window.innerHeight-50)+'px'
        }
    },
	addWorld: function () {
        this.world = tools.createDiv(this.wordlDivConf)
        document.body.prepend(this.world)
        this.worldpos = this.world.getBoundingClientRect();
	},
    refreshPoint: function (pts){
        this.xp+=pts
        this.xpDiv.textContent=this.xp+' pts';
    },
    refreshstageLv: function (){
        this.stageLv++
        this.stageLvDiv.textContent=this.stageLv+'';
    },
	checkSuccess: function () {
		if(_planet.success.cur >= _planet.success.need && _planet.success.done === false) {
			_planet.success.done = true;
		}
		if(_planet.success.done === true && _planet.success.cur >=1){
            this.animeOn=false
			console.log('success done')
			console.log('success done')
			console.log('success done')

			// reset all planetes 
			_planet.resetAll();
			_mobs.resetAll();
			_blackHoles.resetAll();

			// add button restart

			// add a bunch of planete
			// and black holes 
			this.restart();
		}
	},
	animeStep: function (dt) {
        if(this.animeOn){
            this.checkSuccess()
            this._Mobs.animeStep(dt)
            _mouse.active = false;
        }
	},
    animate: function () {
        let lastTimestamp = 0;
        const animateStep = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const dt = (timestamp - lastTimestamp) / 30; //ms
            this.animeStep(dt);
            lastTimestamp = timestamp;
            requestAnimationFrame(animateStep);
        };
        requestAnimationFrame(animateStep);
    },
	// setMoveCss: function () {
	// 	document.body.classList.add("up");
	// 	setTimeout(() => {
	// 		document.body.classList.remove("up");
	// 	}, 100);
	// },
	resize() {
        this.worldpos = this.world.getBoundingClientRect();
    },
	addXpDiv: function (p) {
		this.xpDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "xp",
                textContent: '0 Pts'
				// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
			},
		});
		document.body.appendChild(this.xpDiv)
		this.stageLvDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "lv",
                textContent: '0'
				// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
			},
		});
		document.body.appendChild(this.stageLvDiv)

	},
	restart: function () {
        this.refreshstageLv()
        this.animeOn=false
        setTimeout(() => {
            this.stageLv++;
            this.isSceneEmpty=true
            console.log('restarting..........')
            _blackHoles.addAbounch(2)
            _planet.addABounch(2)
            this.animeOn=true
        }, 5000);
    },
	newStage: function () {
        _blackHoles.addAbounch(2)
        _planet.addABounch(2)
    },
	go: function () {
        tools.addCss(_css());
        this.addWorld()
        
        this.Bases = _base()
        this.Bases.init(this.world)

		_mouse.init();
		_mouse.addMouseMove();
		_mouse.addMouseClick();
		_mouse.addMouseRightClick();
		this.animate();
        
		_planet.addNeedsDiv();
        this.newStage()
        this.animeOn=true
        this.addXpDiv()        

	},
};
document.addEventListener("DOMContentLoaded", function () {
	Game.go();
});
window.addEventListener("resize", function () {
    Game.resize();
});
