
const Game = {
    xp:new Number(0),
    stageLv:0,
    animeOn:false,
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
    refreshXpPoint: function (){
        this.xpDiv.textContent=this.xp;
    },
    refreshstageLv: function (){
        this.stageLv++
        this.stageLvDiv.textContent=this.stageLv;
    },
    extraRewards: function (value){
        console.log('extraRewards')
    },
    rewards: function (type=false,value,m){
        if(type==='missile'){
            let timeNow = new Date();
            m.conf.age = Math.abs(timeNow.getTime() - m.conf.birthDate.getTime());
            console.log(m.conf.age)
            console.log(m.conf.autonomie.cur)
            
            let multiplicateur = _mobs.datas.missile.counter
            let newvalue = Math.floor(value/multiplicateur)
            let expected = this.xp + newvalue
            let step = value/10;
            if(_mobs.datas.missile.counter<3) {
                // this.extraRewards()
            }
            // pour le fun
            let reward = setInterval(() => {
                this.xp = this.xp + step
                this.refreshXpPoint();
                console.log('current:',this.xp)
                if (this.xp >= expected){
                    clearInterval(reward);
                }
            }, 500);
        }
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
			// reset all
			_planet.resetAll();
			_mobs.resetAll();
			_blackHoles.resetAll();
			// add button restart ?
			this.restart();
		}
	},
	animeStep: function (dt) {
        if(this.animeOn){
            this.checkSuccess()
            _mobs.animeStep(dt)
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
                textContent: '0'
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
        _mobs.datas.missile.maxAtTime+=Math.floor(this.stageLv/3)
        _planet.maxAtTime+=Math.floor(this.stageLv/5)
        this.refreshstageLv()
        this.animeOn=false
        setTimeout(() => {
            this.stageLv++;
            this.isSceneEmpty=true
            console.log('restarting..........')
            _blackHoles.addAbounch(2)
            _planet.addABounch()
            this.animeOn=true
        }, 5000);
    },
	newStage: function () {
        _blackHoles.addAbounch(2)
        _planet.addABounch()
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
		_mobs.addCoupsDiv();
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
